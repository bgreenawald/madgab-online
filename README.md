# RadGab

This is an online implementation of the game *MadGab*. It can be played on any device which can access a browser.

# Setup - Backend

Before interacting with the backend, make sure to change into the *backend* directory.

This app runs on Python 3 and uses *poetry* to maintain dependencies. Assuming you already have poetry installed, you can simply run

```bash
# 'poetry' must be installed first.

# Install minimal packages needed to run.
poetry install --no-dev

# Install all packages (for testing and development).
poetry install
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
CD into the frontend directory
Run
```npm i
npm run start
```

The UI will start up on port 3000.

