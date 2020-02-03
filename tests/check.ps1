# Run flake8
Write-Output "Running flake8...";
flake8 .;
Write-Output "Completed flake8.`r`n";

# Run mypy
Write-Output "Running mypy...";
mypy madgab/ game.py app.py;
Write-Output "Completed mypy.";
