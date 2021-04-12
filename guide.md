# Local Installation
## Node
Firstly update **node dependencies** and **build** the project to compile the static HTML webpage:
* `cd client`
* `npm install`
* `npm run build`

## Django
### First time set up
The django is run through a python `virtual environment`.

* Firstly install `virtualenv`: (`pip install virtualenv`)
* Create your virtualenv called "venv" from the base directory: `virtualenv venv`

### Running the server
To run server first enter the virtualenv: `source venv/bin/activate`

If you have just pulled a new version of the project, there might be new python dependencies to install: `pip install -r requirements.txt`

After you've built the node static, the local server can be ran:
* `cd bbDjango`
* `python manage.py runserver`

**TODO: database migration steps??**

