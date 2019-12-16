# Run flake8
Write-Output "Running flake8...";
flake8 .;

# Run mypy
Write-Output "Running mypy...";
mypy madgab/ game.py app.py;