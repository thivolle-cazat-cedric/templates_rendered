
_TEMPLATE_PATH = None


def init(flask_app):
    global _TEMPLATE_PATH
    _TEMPLATE_PATH = flask_app.config['TEMPLATE_RES_DIR']
    if _TEMPLATE_PATH[-1] != '/':
        _TEMPLATE_PATH += '/'

