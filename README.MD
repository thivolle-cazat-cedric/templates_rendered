# Templates rendered
---
Simple project, based on Flask Backend and AngularJs frontend. To display your templates according values defined in json configuration. Write your templates  with angularJs syntax *(html)*.

# Requierments
 * Python
 * Virtualenv
 * pip


# Instalation

```bash
git clone https://github.com/thivolle-cazat-cedric/templates_rendered
cd templates_rendered
virtualenv env
source env/bin/activate
pip install -r requirement.txt
mkdir app/config/env app/res-templates
touch app/config/env/__init__.py
touch app/config/env/prod.py
app_key=`./manage.py generate_key`
echo "'ENV_NAME = 'Production'
SECRET_KEY = '''$app_key'''
" > app/config/env/prod.py
./manage.py runserver -p 4000
```

Application is runing on 127.0.0.1:4000


# Create Template Hello World

```bash
echo "Hello <strong>{{value.name}}</strong>" > app/res-templates/hello_world.html
echo '{
    "header" : "Jsut say hello",
    "attrs": {        
        "name": {
            "type": "str",
            "default": null,
            "required": false,
            "description": "name to say hello"
        }
    }
}' > app/res-templates/hello_world.json
```


# files name archintecture

In yout tempates ressource dire, every templates are composed of tow files, **template_name**.html and **template_name**.json

## Html file

HTML file containe the template. The syntaxe is the same of Angularjs

## Json file

This file containe the configruationtion of the template, content : 

 * **header** : the title of the template
 * **attrs** : atribute list aivailable in template
 * **order** : to order the attr list

**exemple**

```json
{
    "header" : "Jsut say hello",
    "attrs": {        
        "name": {
            "type": "str",
            "default": "Jhon",
            "required": false,
            "description": "name to say hello"
        },
        "choice": {
            "type": "list",
            "default": "Mr.",
            "required": false,
            "option": ["Mr.", "Ms."]
        },
        "end": {
            "type": "bool",
            "default": false,
            "description": "helper"
        }
    },
    "order": ["choice", "name", "end"]
}
```

### Supported Attribut Type

#### String (str)

| Attribute option | Type | Description | Exemple | Requiered |
|------------------|------|----------------------------------------------|-------------|:---------:|
| type | str | define type string | 'str' | X |
| default | int | define default value | 'jhon' |  |
| required | bool | define if attribute is mandatory | True |  |
| description | str | helper for user *(displayed in placeholder)* | 'ex : Jhon' |  |

```json
{
    ...
    "attrs": {
        "attr_name": {
            "type": "str",
            "default": null,
            "required": false,
            "description": "name to say hello"
        }
    ...
    }
}
```

#### Interger/Float (int)

| Attribute option | Type | Description | Exemple | Requiered |
|------------------|------|----------------------------------------------|-------------|:---------:|
| type             | str  | define type number | 'int' | X |
| default          | int  | define default value | 48 |  |
| required         | bool | define if attribute is mandatory | True | |
| description      | str  | helper for user *(displayed in placeholder)* | 'hours to define auto close ticket' | |

```json
{
    ...
    "attrs": {
        "attr_name": {
            "type": "int",
            "default": null,
            "required": false,
            "description": "name to say hello"
        }
    ...
    }
}
```

#### List (list)

| Attribute option | Type | Description | Exemple | Requiered |
|------------------|------|----------------------------------------------|-------------|:---------:|
| type             | str  | define type list like select | 'list' | X |
| default          | str  | value in list | 'jhon' |  |
| required         | bool | define if attribute is mandatory | True | |
| description      | str  | helper for user *(displayed when no selected value)* | 'choose entry in list' | |
| option           | list  | available list | ['Mr.', 'Ms.'] | |

```json
{
    ...
    "attrs": {
        "attr_name": {
            "type": "list",
            "default": null,
            "required": false,
            "description": "choos in list",
            "option": ['value 1', 'value 2']
        }
    ...
    }
}
```

#### Boolean (bool)

| Attribute option | Type | Description | Exemple | Requiered |
|------------------|------|----------------------------------------------|-------------|:---------:|
| type             | str  | define type boolean | 'bool' | X |
| default          | bool | default value of attribute | true | X |
| required         | bool | define if attribute is mandatory | True | |
| description      | str  | helper for user *(displayed when no selected value)* | 'choose entry in list' | |

```json
{
    ...
    "attrs": {
        "end": {
            "type": "bool",
            "default": false,
            "description": "helper"
        }
    ...
    }
}
```

#### Date (date)

| Attribute option | Type | Description | Exemple | Requiered |
|------------------|------|----------------------------------------------|-------------|:---------:|
| type             | str  | define type date | 'date' | X |
| default          | bool | default value of attribute | true |  |
| required         | bool | define if attribute is mandatory | True | |

```json
{
    ...
    "attrs": {
        "end": {
            "type": "bool",
            "default": false,
            "description": "helper"
        }
    ...
    }
}
```

*exemple use value in template*
```html
<span ng-if="value.end"> end </span>
```