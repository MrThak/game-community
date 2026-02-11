@echo off
echo 🚀 Starting Deployment Process...
echo.

:: Adding all changes
echo [1/3] Adding changes to Git...
git add .

:: Ask for commit message (or use default)
set /p commit_msg="Enter commit message (press Enter for 'Fast Update'): "
if "%commit_msg%"=="" set commit_msg=Fast Update

:: Committing
echo.
echo [2/3] Committing changes...
git commit -m "%commit_msg%"

:: Pushing
echo.
echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo ✅ Done! Your changes are being deployed to Vercel.
echo.
pause
