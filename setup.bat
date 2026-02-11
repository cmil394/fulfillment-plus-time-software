@echo off
echo ========================================
echo Setting up Fulfillment Plus Time Software
echo ========================================
echo.

echo [1/4] Installing root dependencies...
call npm install
echo.

echo [2/4] Installing backend dependencies...
cd backend
call npm install
cd ..
echo.

echo [3/4] Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo.

echo [4/4] Setup complete!
echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the application, run: run.bat
echo.
pause