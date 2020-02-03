# Run flake8
echo "Running flake8...";
flake8 .;
echo "Completed flake8.";

# Run mypy
echo "Running mypy...";
mypy madgab/ game.py app.py;
echo "Completed mypy.";
