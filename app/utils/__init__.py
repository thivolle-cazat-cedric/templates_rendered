# -*- coding: utf-8 -*-
from __future__ import print_function, unicode_literals
from time import mktime
from datetime import datetime
import string
import random as master_random
from math import ceil
from unicodedata import normalize, combining


def datetime_to_timestamp(dt):
    if isinstance(dt, datetime):
        return mktime(dt.timetuple())
    else:
        raise AttributeError("datetime_to_timestamp : args 1 must be a datetime")


def value_or_zero(value):
    '''
    :return: 0 if value like nullabletype or value
    '''
    if not value or (isinstance(value, str) and value.lower() == 'null'):
        return 0
    else:
        return value

def random_string(min_size=10, max_size=None, alpha=True, uppercase=True, lowercase=True, digit=True, punctuation=False, exposant=6):
    char_set = ''
    if alpha:
        if uppercase:
            char_set += string.ascii_uppercase
        if lowercase:
            char_set += string.ascii_lowercase

    if digit:
        char_set += string.digits
    if punctuation:
        char_set += string.punctuation

    rdm_str = ''.join(
        master_random.sample(char_set * int(exposant), int(min_size))
    )

    if max_size is None:
        return rdm_str
    elif min_size < max_size:
        if len(rdm_str) > max_size:
            return rdm_str[:max_size]
        else:
            return rdm_str
    else:
        raise AttributeError('string_func :  min_size can be most important than max_size')


def roundup(x):
    return int(ceil(x))


def remove_accents(input_str):
    nfkd_form = normalize('NFKD', unicode(input_str, 'utf-8'))
    return u"".join([c for c in nfkd_form if not combining(c)])