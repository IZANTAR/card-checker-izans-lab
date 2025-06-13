@echo off
title IZAN'S CHECKER - Servidor Flask + Frontend
color 0a

echo Iniciando servidor Flask...

:: Opcional: activar entorno virtual si tienes uno
:: call venv\Scripts\activate

:: Ejecutar el backend Flask
start cmd /k python braintree_api_server.py

:: Esperar unos segundos antes de abrir el navegador
timeout /t 2 >nul

echo Abriendo interfaz web...
start http://127.0.0.1:5000

echo.
echo Servidor iniciado correctamente. No cierres esta ventana.
pause
