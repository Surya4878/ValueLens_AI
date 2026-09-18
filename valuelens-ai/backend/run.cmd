@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
if exist "%~dp0..\.env" (
    for /f "tokens=1* delims==" %%A in ('type "%~dp0..\.env" ^| findstr /v "^#" ^| findstr /r "="') do set "%%A=%%B"
)
if exist "%~dp0target\valuelens-backend-1.0.0-SNAPSHOT.jar" (
    "%JAVA_HOME%\bin\java.exe" -jar "%~dp0target\valuelens-backend-1.0.0-SNAPSHOT.jar"
) else (
    call "%~dp0mvnw.cmd" spring-boot:run
)
