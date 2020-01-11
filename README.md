# RadGab

This is an online implementation of the game *MadGab*. It can be played on any device which can access a browser.

# Setup

This app runs on Python 3 and uses *poetry* to maintain dependencies. Assuming you already have poetry installed, you can simply run

```bash
# 'poetry' must be installed first.

# Install minimal packages needed to run.
poetry install --no-dev

# Install all packages (for testing and development).
poetry install
```

Alternatively, you can use *virtualenv* with the included requirements files. After creating a new virtual environment for the project, run

```bash
# Make sure you have created the virtual environment and are currently in it.

# Install minimal packages needed to run.
pip install -r requirements.txt

# Install all packages (for testing and development).
pip install -r dev-requirements.txt
```

After setting up the environment, just run
```python
python app.py
```

## Setup - Frontend
CD into the frontend directory
Run
```npm i
npm run start
```

The UI will start up on port 3000.
