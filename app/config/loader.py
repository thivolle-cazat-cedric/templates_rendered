# -*- coding: utf-8 -*-

from __future__ import print_function
from __future__ import unicode_literals

def config_loader(config, environment):
    """
    Charge la configuration de l'application.

    :param flask.Config config: généralement app.config
    :param str environement: le nom de l'environement (prod, dev, test, ...)

    :raises Exception: en cas d'erreur...
    :return: None

    L'ordre de chargement est le suivant :

      * la configuration par defaut (ami.config.default)
      * la configuration en fonction de l'environment (prod, dev, test, ...)
      * la configuration de l'utilisateur depuis le fichier definit dans la
        variable d'environement RT_CONF.

    Il permet de surcharger la configuration.
    """

    config.from_object('app.config.default')
    config.from_object('app.config.env.%s' % (environment))
    config.from_envvar('RT_CONF', silent=True)
