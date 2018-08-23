#!/bin/bash

PUBLISHER="Ronny Wegener <wegener.ronny@gmail.com>"
PACKAGE="pheotag"
PRODUCT="Photo GeoTag"
VERSION="0.0.3"
DESCRIPTION_SHORT="Photo Geo Tagger"
DESCRIPTION_LONG="Simple application for graphical geo tagging of multiple photos."
YEAR="$(date +%Y)"
URL="https://git.io/pheotag"
BIN_WINDOWS="pheotag.exe"
BIN_DARWIN="pheotag"
BIN_LINUX="pheotag"

function build {
    rm -r -f "build/$2"
    mkdir -p "build/$2"
    unzip "redist/electron-v*.*-$1.zip" -d "build/$2"
    rm -f "build/$2/version"
    rm -f "build/$2/LICENSE"*
    if [[ $2 =~ linux.* ]]
    then
        rm -r -f "build/$2/locales"
        rm -r -f "build/$2/resources/default_app.asar"
        asar pack "src" "build/$2/resources/app.asar"
        # or without asar: cp -r "src" "build/$2/resources/app"
        mv "build/$2/electron" "build/$2/$BIN_LINUX"
    fi
    if [[ $2 =~ windows.* ]]
    then
        rm -r -f "build/$2/locales"
        rm -r -f "build/$2/resources/default_app.asar"
        if [[ "$3" = true ]]
        then
            pwd
            echo "Portable Mode: TRUE"
            #sed 's/^var portable =.*$/var portable = true;/g' -i "src/config.js"
        else
            echo "Portable Mode: FALSE"
            #sed 's/^var portable =.*$/var portable = false;/g' -i "src/config.js"
        fi
        asar pack "src" "build/$2/resources/app.asar"
        # or without asar: cp -r "src" "build/$2/resources/app"
        mv "build/$2/electron.exe" "build/$2/$BIN_WINDOWS"
    fi
    if [[ $2 =~ macosx.* ]]
    then
        rm -r -f "build/$2/Electron.app/Contents/Resources/"*.lproj
        rm -r -f "build/$2/Electron.app/Contents/Resources/default_app.asar"
        asar pack "src" "build/$2/Electron.app/Contents/Resources/app.asar"
        # or without asar: cp -r "src" "build/$2/Electron.app/Contents/Resources/app"
        mv "build/$2/Electron.app/Contents/MacOS/Electron" "build/$2/Electron.app/Contents/MacOS/$BIN_DARWIN"
    fi
}

function compress {
    cd "build"
    rm -f "$1.zip"
    zip -r "$1.zip" "$1"
    cd ..
}

set -e

cd "$(dirname $0)"
rm -r -f "build"
mkdir -p "build"
