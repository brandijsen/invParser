@echo off
REM Script per eseguire backup giornaliero (Windows)
REM Crea un Task Scheduler che esegue questo file ogni giorno alle 3:00
REM Oppure esegui manualmente: cron-backup.bat

cd /d "%~dp0.."
node scripts/backup-database.js
