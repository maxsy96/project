@echo off
setlocal

cd /d "%~dp0"

net session >nul 2>&1
if not "%errorlevel%"=="0" (
  echo Asking Windows for Administrator permission...
  echo Please click Yes in the Windows permission popup.
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%ComSpec%' -ArgumentList '/k ""%~f0""' -Verb RunAs"
  exit /b
)

set "PATH=C:\Users\MPC\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\MPC\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;%PATH%"

echo.
echo CAVM Opportunity Hub - Netlify Deploy
echo ====================================
echo.
echo This window will stay open.
echo If anything fails, send Codex the text shown here.
echo.
echo Website folder:
echo %CD%
echo.

echo Cleaning previous local build output...
if exist ".next" rmdir /s /q ".next"
if exist ".netlify\.next" rmdir /s /q ".netlify\.next"
if exist ".netlify\functions" rmdir /s /q ".netlify\functions"
if exist ".netlify\functions-internal" rmdir /s /q ".netlify\functions-internal"
if exist ".netlify\static" rmdir /s /q ".netlify\static"
if exist ".netlify\deploy\v1\blobs\deploy" rmdir /s /q ".netlify\deploy\v1\blobs\deploy"
if exist ".netlify\blobs\deploy" rmdir /s /q ".netlify\blobs\deploy"

echo.
echo Installing dependencies...
call pnpm install --force
if errorlevel 1 goto failed

echo.
echo Preparing Netlify Next plugin for Windows deploy...
call node scripts\patch-netlify-nextjs.js
if errorlevel 1 goto failed

echo.
echo Deploying to Netlify...
call pnpm --package=netlify-cli dlx netlify deploy --build --prod
if not errorlevel 1 goto done

echo.
echo The full Next deploy failed during Netlify's static publish step.
echo Trying direct deploy from the generated Netlify output...
echo.

if not exist ".netlify\static" goto failed
if not exist ".netlify\functions\manifest.json" goto failed

echo Preparing static files for direct deploy...
if exist ".netlify\static" rmdir /s /q ".netlify\static"
powershell -NoProfile -ExecutionPolicy Bypass -Command "New-Item -ItemType Directory -Force -Path '.netlify/static' | Out-Null; if (Test-Path -LiteralPath 'public') { Copy-Item -Path 'public/*' -Destination '.netlify/static' -Recurse -Force }; New-Item -ItemType Directory -Force -Path '.netlify/static/_next' | Out-Null; if (Test-Path -LiteralPath '.next/static') { Copy-Item -LiteralPath '.next/static' -Destination '.netlify/static/_next/static' -Recurse -Force }"
if errorlevel 1 goto failed

echo Trimming and repackaging the generated Netlify function...
call node -e "require('./netlify-plugins/skip-deploy-blobs').onPostBuild().catch((error)=>{console.error(error);process.exit(1);})"
if errorlevel 1 goto failed

if not exist ".netlify\functions-internal\___netlify-server-handler" goto failed
if not exist ".netlify\functions" mkdir ".netlify\functions"
if exist ".netlify\functions\___netlify-server-handler.zip" del /f /q ".netlify\functions\___netlify-server-handler.zip"
tar.exe -a -c -f ".netlify\functions\___netlify-server-handler.zip" -C ".netlify\functions-internal\___netlify-server-handler" .
if errorlevel 1 goto failed

if exist ".netlify\deploy\v1\blobs\deploy" rmdir /s /q ".netlify\deploy\v1\blobs\deploy"
if exist ".netlify\blobs\deploy" rmdir /s /q ".netlify\blobs\deploy"

call pnpm --package=netlify-cli dlx netlify deploy --no-build --dir ".netlify\static" --functions ".netlify\functions" --prod --message "CAVM Opportunity Hub direct deploy"
if errorlevel 1 goto failed

:done
echo.
echo Done. Copy the Production URL shown above.
echo.
pause
exit /b 0

:failed
echo.
echo Deploy failed. Keep this window open and send Codex the error text above.
echo.
pause
exit /b 1
