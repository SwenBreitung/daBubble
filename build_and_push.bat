@echo off
echo Running Git and Angular commands...

REM Git-Befehle
git add .
git commit -m "Auto Commit"
git push

REM Angular-Build
ng build --source-map=true --base-href "/angular-projects/TestProjekt/"

echo Done.