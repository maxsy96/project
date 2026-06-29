@echo off
setlocal

cd /d "%~dp0"
set "PATH=C:\Users\MPC\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\MPC\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;%PATH%"

echo.
echo CAVM Opportunity Hub - Email Notifications
echo =========================================
echo.
echo Paste the Resend API key below. It will be saved to Netlify for this site.
echo The forms will send notifications to Clubcavm@gmail.com after the next deploy.
echo.

set /p "RESEND_KEY=Resend API key: "
if "%RESEND_KEY%"=="" goto missing

call pnpm --package=netlify-cli dlx netlify env:set RESEND_API_KEY "%RESEND_KEY%"
if errorlevel 1 goto failed

call pnpm --package=netlify-cli dlx netlify env:set CLUB_NOTIFICATION_EMAIL "Clubcavm@gmail.com"
if errorlevel 1 goto failed

call pnpm --package=netlify-cli dlx netlify env:set NOTIFICATION_FROM_EMAIL "CAVM Club <onboarding@resend.dev>"
if errorlevel 1 goto failed

echo.
echo Done. Now redeploy the site so Netlify uses the new email key.
echo Open OPEN_THIS_DEPLOY_TO_NETLIFY.bat, or ask Codex to redeploy it.
echo.
pause
exit /b 0

:missing
echo.
echo No API key was entered.
echo.
pause
exit /b 1

:failed
echo.
echo Setup failed. Keep this window open and send Codex the text shown here.
echo.
pause
exit /b 1
