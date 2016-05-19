#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

from flask import Flask, abort, json, send_file, render_template
from .config import config_loader
from app.models import init as models_init
from flask.ext.cdn import CDN
from app.exceptions import JsonLoadException


def create_app(env='prod'):
    app = Flask(
        'zne_insee_code',
        template_folder="app/tpl",
        static_folder="app/lib"
    )
    app.jinja_env.variable_start_string = '[['
    app.jinja_env.variable_end_string = ']]'
    config_loader(app.config, env)
    cdn = CDN(app)
    cdn.init_app(app)
    models_init(app)

    from app.models.template import Template

    @app.route('/', methods=['GET'])
    @app.route('/index.html', methods=['GET'])
    def index():
        return render_template('index.html')

    @app.route('/api/templates', methods=['GET'])
    @app.route('/api/templates/', methods=['GET'])
    @app.route('/api/templates/<path:path>', methods=['GET'])
    def api_list_template(path=''):
        try:
            if path and path[0] == '/':
                path = path[1:]
            return json.jsonify({
                'templates': Template.list_templates(path),
                'directories': Template.list_directories(path)
            }), 200
        except IOError:
            abort(404)

    @app.route('/api/template/<template_name>', methods=['GET'])
    @app.route('/api/template/<path:path>/<template_name>', methods=['GET'])
    def api_template(template_name, path=""):
        if template_name and template_name[-1]:
            pass
        template_name = '{0}/{1}'.format(path, template_name)
        if not Template.is_valid_template_name(template_name):
            abort(404)
        try:
            tpl = Template(template_name)
        except JsonLoadException as e:
            return json.jsonify({
                'error_message': "Invalid configuration",
                'error_detail': e.line_error
            })

        return json.jsonify({
            'data': tpl.to_dict(),
            'atts': tpl.conf._attrs
        }), 200

    @app.route('/api/template/<template_name>.html', methods=['GET'])
    @app.route('/api/template/<path:path>/<template_name>.html', methods=['GET'])
    def api_template_render(template_name, path=""):
        template_name = '{0}/{1}'.format(path, template_name)
        if not Template.is_valid_template_name(template_name):
            abort(404)

        try:
            tpl = Template(template_name)
        except JsonLoadException as e:
            return json.jsonify({
                'Error_message': "Invalid configuration",
                'Error_détail': e.split('delimiter: ')[1]
            })

        return send_file(tpl.get_full_path())

    return app
