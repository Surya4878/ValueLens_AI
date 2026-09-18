@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
if exist "%~dp0..\.env" (
    for /f "usebackq tokens=1* delims==" %%A in ("%~dp0..\.env") do (
        set "line=%%A"
        if not "!line:~0,1!"=="#" (
            set "%%A=%%B"
        )
    )
)
call "%~dp0mvnw.cmd" spring-boot:run