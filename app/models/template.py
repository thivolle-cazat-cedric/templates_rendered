# -*- coding: utf-8 -*-
from __future__ import print_function, unicode_literals
from os import listdir, walk
from os.path import basename, dirname, isfile, isdir, splitext
from json import loads
from . import _TEMPLATE_PATH
from app.exceptions import JsonLoadException

_AIVAILABLE_TYPE = ['int', 'str', 'bool', 'date']


class Attr(object):
    name = ''
    _type = 'str'
    default = None
    required = False
    description = None
    option = None

    def __init__(self,
        name,
        type='str',
        default='None',
        required=False,
        description='',
        option=None,
        label=None,
        ifValueEqual=None,
        ifValueIn=None,
        **kwargs
    ):
        self.name = name
        self._type = type
        self.default = default
        self.required = required
        self.description = description
        self.option = option
        self.label = label
        if isinstance(ifValueEqual, dict):
            self.ifValueEqual = ifValueEqual
        else:
            self.ifValueEqual = None
        if isinstance(ifValueIn, dict):
            self.ifValueIn = ifValueIn
        else:
            self.ifValueIn = None
    @property
    def type(self):
        return self._type.lower()

    @type.setter
    def set_type(self, value):
        value = value.lower()
        if value not in _AIVAILABLE_TYPE:
            raise ValueError('Attr.type : {0} not available type.')
        else:
            self._type = value.lower()

    def to_dict(self):
        """
        :retype: dict
        :return: return dictionnary representation
        """
        return {
            'name': self.name,
            'type': self.type,
            'default': self.default,
            'required': self.required,
            'description': self.description,
            'option': self.option,
            'label': self.label,
            'ifValueEqual': self.ifValueEqual,
            'ifValueIn': self.ifValueIn
        }


class TemplateConfig(object):
    _ROOT_PATH = _TEMPLATE_PATH
    path_file = None

    def _full_path(self):
        return self._ROOT_PATH + self.path_file

    def __init__(self, path_file):
        self.path_file = unicode(path_file)
        if not isinstance(path_file, unicode):
            raise ValueError('TemplateConfig.init : arg1 must be unicode not ' + type(path_file).__name__)

        if not isfile(self._full_path()):
            raise ValueError('TemplateConfig.init : ' + self._full_path() + ' is not file')

        try:
            conf = dict()
            with open(self._full_path()) as f:
                conf = loads(f.read())
        except ValueError as e:
            raise JsonLoadException('TemplateConfig.init : can\'t read conf file - {0} : {1}'.format(
                self._full_path(),
                e.message
            ))

        self.header = conf.get('header', None)
        self._attrs = conf['attrs'].keys()
        self.order = conf.get('order', self._attrs)
        for k in self._attrs:
            setattr(self, k, Attr(k, **conf['attrs'][k]))

    def to_dict(self):
        """
        :retype: dict
        :return: return dictionnary representation
        """
        dico = {
            'header': self.header,
            'attrs': {},
            'order': self.order
        }
        for k in self._attrs:
            dico['attrs'][k] = getattr(self, k).to_dict()
        return dico


class Template(object):
    """docstring for Template"""

    _ROOT_PATH = _TEMPLATE_PATH

    def __init__(self, name):
        super(Template, self).__init__()
        self.name = name

    @staticmethod
    def is_valid_template_name(path_file, root_path=None):
        if root_path is None:
            root_path = _TEMPLATE_PATH
        file = root_path + path_file.split('.')[0]
        return isfile(file + '.json') and isfile(file + '.html')

    @staticmethod
    def list_templates(path, root_path=None):
        if root_path is None:
            root_path = _TEMPLATE_PATH
        path = root_path + path
        if isdir(path):
            files = listdir(path)
            ret = []
            for f in files:
                name = splitext(f)[0]
                try:
                    files.index(name + '.json')
                    files.index(name + '.html')

                    if name not in ret:
                        ret.append(name)

                except Exception:
                    pass

            return ret
        else:
            raise IOError('Directory not found : ' + path)

    @staticmethod
    def list_directories(path, root_path=None):
        if root_path is None:
            root_path = _TEMPLATE_PATH
        path = root_path + path
        dirs = next(walk(path))[1]
        ret = []
        for d in dirs:
            if d and d[0] != '.':
                ret.append(d)

        return ret

    @property
    def name(self):
        return self._path + '/' + self._file_name

    @name.setter
    def name(self, value):
        if not isinstance(value, unicode):
            raise ValueError('Template.name : must be unicode')
        if value and value[0] == '/':
            value = value[1:]

        if not value:
            raise ValueError('Template.name : can\'t be empty')

        self._path = dirname(value)
        self._file_name = splitext(basename(value))[0]

        self.conf_uri = self._path + '.json'
        self.template_uri = self._file_name + '.html'
        self.conf = TemplateConfig('{0}/{1}.json'.format(self._path, self._file_name))

    def get_full_path(self):
        root_path = self._ROOT_PATH
        if root_path[0:2] == './':
            root_path = root_path[2:]
        return root_path + self.name + '.html'

    def to_dict(self):
        return {
            'name': self.name,
            'template_uri': self.template_uri,
            'conf': self.conf.to_dict(),
            'filename': self._file_name
        }
