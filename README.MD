# Templates rendered
---
Simple project, based on Flask Backend and AngularJs frontend. To display your templates according values defined in json configuration. Write your templates with html language and angularJs directive.

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


# Create template hello World

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


# Files archintecture

In your tempates ressources directory, every templates are composed of two files, **template_name**.html and **template_name**.json


## Html file

HTML file contain the template. The syntaxe is the same of Angularjs, you can use ng-directive, *ng-if, ng-switch, ...*. You can use filter [Filter angular](https://docs.angularjs.org/api/ng/filter) and [angular-filter](https://github.com/a8m/angular-filter).

To access value in template use ``{{value.attrName}}``

## Json file

This file containe the configruationtion of the template, content : 

 * **header** : *(str)* the title of the template
 * **attrs** : *(list)* atribute list aivailable in template
 * **order** : *(list)* to order the attr list

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

#### Common key/value

| Attribute option | Type | Description | Exemple | Requiered |
|------------------|------|----------------------------------------------|-------------|:---------:|
| label       | str | label name, replace attribute name | 'ex : Name' |  |
| description | str | helper for user *(displayed in placeholder)* | 'ex : Jhon' |  |
| required | bool | define if attribute is mandatory | True |  |
| ifValueEqual | Object | Requiered value from key | {'hostname' : "Laptop"} | |
| ifValueIn    | Object | Requiered value in list  | {'services': ["DHCP", "DNS"]} | |


#### String (str)

| Attribute option | Type | Description | Exemple | Requiered |
|------------------|------|----------------------------------------------|-------------|:---------:|
| type | str | define type string | 'str' | X |
| default | int | define default value | 'jhon' |  |
| return type      | str  | | |

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
| default          | int | define default value | 1,2 |  |
| return type      | Number  | | |

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
| option           | list | available list | ['Yes', 'No.'] | |
| default          | str | Value in list | 'Yes' |  |
| return type      | str  | | |

```json
{
    ...
    "attrs": {
        "attr_name": {
            "type": "list",
            "default": null,
            "required": false,
            "description": "choos in list",
            "option": ["value 1", "value 2"]
        }
    ...
    }
}
```

#### Multiple list (multiple-list)

| Attribute option | Type | Description | Exemple | Requiered |
|------------------|------|----------------------------------------------|-------------|:---------:|
| type             | str  | define type list like select | 'multiple-list' | X |
| option           | list | available choice | ['Yes', 'No', 'Maybe'] | |
| default          | list | Valid value in list | ['Yes'] |  |
| return type      | list  | | |

```json
{
    ...
    "attrs": {
        "attr_name": {
            "type": "multiple-list",
            "default": null,
            "required": false,
            "description": "choos in list",
            "option": ["value 1", "value 2"]
        }
    ...
    }
}
```

#### Boolean (bool)

| Attribute option | Type | Description | Exemple | Requiered |
|------------------|------|----------------------------------------------|-------------|:---------:|
| type             | str  | define type boolean | 'bool' | X |
| default          | bool | defaul value | False | X |
| return type      | boolean  | | |

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
| return type      | Datetime  | | |

```json
{
    ...
    "attrs": {
        "end": {
            "type": "bool",
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