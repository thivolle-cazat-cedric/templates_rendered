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
pip install -r requirment.txt
mkdir app/config/env app/res-templates
touch app/config/env/prod.py
app_key=`./manage.py generate_key`
echo 'ENV_NAME = 'Production'
SECRET_KEY = '''$app_key'''
" > app/config/env/prod.py
./manage.py runserver -p 4000
```

Application is runing on 127.0.0.1:4000

---

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

---

# Supported Attribut Type

### String (str)

| Attribute option | Type | Description | Exemple | Requiered |
|------------------|------|----------------------------------------------|-------------|:---------:|
| type | str | define type string | 'str' | X |
| default | int | define default value | 'jhon' |  |
| required | bool | define if attribute is mandatory | True |  |
| description | str | helper for user *(displayed in placeholder)* | 'ex : Jhon' |  |

```json
{
	//...
	"attrs": {
		"attr_name": {
		    "type": "str",
		    "default": null,
		    "required": false,
		    "description": "name to say hello"
		}
	//...
	}
}
```

### Interger/Float (int)

| attribute option | type | description | exemple | requiered |
|:--- |:--- |:--- | --- |:---: |
| type             | str  | define type number | 'int' | X |
| default          | int  | define default value | 48 |  |
| required         | bool | define if attribute is mandatory | True | |
| description      | str  | helper for user *(displayed in placeholder)* | 'hours to define auto close ticket' | |

```json
{
	//...
	"attrs": {
		"attr_name": {
		    "type": "int",
		    "default": null,
		    "required": false,
		    "description": "name to say hello"
		}
	//...
	}
}
```

### List (list)

| attribute option | type | description | exemple | requiered |
|:--- |:--- |:--- | --- |:---: |
| type             | str  | define type string | 'list' | X |
| default          | str  | value in list | 'jhon' |  |
| required         | bool | define if attribute is mandatory | True | |
| description      | str  | helper for user *(displayed when no selected value)* | 'choose entry in list' | |
| option           | list  | helper for user *(displayed when no selected value)* | 'choose entry in list' | |

```json
{
	//...
	"attrs": {
		"attr_name": {
		    "type": "list",
		    "default": null,
		    "required": false,
		    "description": "choos in list"
		}
	//...
	}
}
```