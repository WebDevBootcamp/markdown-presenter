#!/bin/sh

mkdir -p deploy
cp www/*.* deploy/

mkdir -p deploy/css
cp www/css/* deploy/css

mkdir -p deploy/js
cp www/js/* deploy/js

mkdir -p deploy/vendor/bootstrap.css/css
mkdir -p deploy/vendor/bootstrap.css/js
mkdir -p deploy/vendor/bootstrap.css/img
cp www/vendor/bootstrap.css/css/* deploy/vendor/bootstrap.css/css
cp www/vendor/bootstrap.css/js/* deploy/vendor/bootstrap.css/js
cp www/vendor/bootstrap.css/img/* deploy/vendor/bootstrap.css/img

mkdir -p deploy/vendor/ace-builds/src
cp www/vendor/ace-builds/src/* deploy/vendor/ace-builds/src

mkdir -p deploy/vendor/markdown/lib
cp www/vendor/markdown/lib/*  deploy/vendor/markdown/lib

