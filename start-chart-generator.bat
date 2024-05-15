@echo off
call docker run -p 80:5000 --rm -v %cd%:/data mdembree/ccpdfgenerator