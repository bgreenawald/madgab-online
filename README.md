# RadGab

This is an online implementation of the game *MadGab*. It can be played on any device which can access a browser.

# Setup - Backend

Before interacting with the backend, make sure to change into the *backend* directory.

This app runs on Python 3 and uses *poetry* to maintain dependencies. Assuming you already have poetry installed, you can simply run

```bash
# 'poetry' must be installed first.

# Install minimal packages needed to run.
poetry install --no-dev

# Install all packages (for testing and development) and create virtual environment.
poetry install

# Start the poetry virtual environment
poetry shell

# To exit poetry shell
exit (NOT deactivate! deactive will break the shell)
```

Alternatively, you can use *virtualenv* with the included requirements files. This is is recommended as this may be deprecated in the future. After creating a new virtual environment for the project, run

```bash
# Make sure you have created the virtual environment and are currently in it.

# Install minimal packages needed to run.
pip install -r requirements.txt

# Install all packages (for testing and development).
pip install -r requirements-dev.txt
```

After setting up the environment, just run
```python
python app.py
```

## Troubleshooting:
My environment is using the wrong version of python! 
You may want to install and [use pyenv](https://python-poetry.org/docs/managing-environments/) to change the version of python being used, or you may need to reinstall poetry from the recommended method on it's [official documentation (curl request)](https://python-poetry.org/docs/#installation).


## Test - Backend
To test the backend, make sure you have the correct virtual environment setup and run
```python
pytest tests/
```

Or to run coverage, run
```python
coverage run -m pytest tests/
coverage report
```


## Setup - Frontend
CD into the frontend directory.

The frontend runs on node version 6.9.0.  We'll be using a node version management package (nvm) to maintain the right version and environment.

If not already installed, follow instructions to setup nvm: 
```
https://github.com/nvm-sh/nvm
```

Then, install the nvm version we need (11.0.0):
```
nvm install 11.0.0
```

Finally, activate the right version: 
```
nvm use 11.0.0
```

To install all node modules necessary for the frontend (one time setup, or on node module update), run: 
```
npm i
```

Additionally, you must unzip and npm install the an animations package: gsap bonus file:
```
# unzip ./gsap-bonus.tgz

# Then to install the package:
npm install .gsap-bonus.tgz
``` 


To start the UI on port 3000:
```
npm run start
```





