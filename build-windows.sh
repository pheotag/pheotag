#!/bin/bash

. "./build.sh"

DIR_32="${PACKAGE}_${VERSION}_windows-setup_i686"
DIR_32_PORTABLE="${PACKAGE}_${VERSION}_windows-portable_i686"
DIR_64="${PACKAGE}_${VERSION}_windows-setup_amd64"
DIR_64_PORTABLE="${PACKAGE}_${VERSION}_windows-portable_amd64"

function rcedit {
  ./rcedit.exe "build/$1/$BIN_WINDOWS" \
    --set-version-string "ProductName" "$PRODUCT" \
    --set-version-string "CompanyName" "" \
    --set-version-string "LegalCopyright" "$YEAR" \
    --set-version-string "FileDescription" "$DESCRIPTION_SHORT" \
    --set-version-string "InternalName" "" \
    --set-version-string "OriginalFilename" "$BIN_WINDOWS" \
    --set-file-version "$VERSION" \
    --set-product-version "$VERSION" \
    --set-icon "res/icon.ico"
}

# create exe
function setup {
  ISS="build/setup.iss"
  echo "[Setup]" > "$ISS"
  echo "AppName=$PRODUCT" >> "$ISS"
  echo "AppVerName=$PRODUCT" >> "$ISS"
  echo "AppVersion=$VERSION" >> "$ISS"
  echo "VersionInfoVersion=$VERSION" >> "$ISS"
  echo "AppPublisher=$PUBLISHER" >> "$ISS"
  echo "AppPublisherURL=$URL" >> "$ISS"
  if [[ $1 =~ .*amd64 ]]
  then
      echo "ArchitecturesInstallIn64BitMode=x64" >> "$ISS"
  fi
  echo "DisableWelcomePage=yes" >> "$ISS"
  echo "DefaultDirName={pf}\\$PRODUCT" >> "$ISS"
  echo "DisableProgramGroupPage=yes" >> "$ISS"
  #echo "DefaultGroupName=$PRODUCT" >> "$ISS"
  echo "DisableReadyPage=yes" >> "$ISS"
  echo "UninstallDisplayIcon={app}\\$BIN_WINDOWS" >> "$ISS"
  #echo "WizardImageFile=compiler:wizmodernimage.bmp" >> "$ISS"
  #echo "WizardSmallImageFile=compiler:wizmodernsmallimage.bmp" >> "$ISS"
  echo "WizardImageFile=..\\res\\WizModernImage.bmp" >> "$ISS"
  echo "WizardSmallImageFile=..\\res\\WizModernSmallImage.bmp" >> "$ISS"
  echo "OutputDir=." >> "$ISS"
  echo "OutputBaseFilename=$(echo $1 | sed 's/portable/setup/g')" >> "$ISS"
  echo "ChangesEnvironment=yes" >> "$ISS"
  echo "" >> "$ISS"
  echo "[Tasks]" >> "$ISS"
  echo "Name: shortcuts; Description: \"All\"; GroupDescription: \"Create Shortcuts:\";" >> "$ISS"
  echo "Name: shortcuts\\desktop; Description: \"Desktop\"; GroupDescription: \"Create Shortcuts:\";" >> "$ISS"
  echo "Name: shortcuts\\startmenu; Description: \"Startmenu Programs\"; GroupDescription: \"Create Shortcuts:\"; Flags: unchecked" >> "$ISS"
  echo "" >> "$ISS"
  echo "[Files]" >> "$ISS"
  echo "Source: $1\\*; DestDir: {app}; Flags: recursesubdirs" >> "$ISS"
  echo "" >> "$ISS"
  #echo "[UninstallDelete]"" >> "$ISS"
  #echo "Name: {app}; Type: filesandordirs" >> "$ISS"
  echo "" >> "$ISS"
  echo "[Icons]" >> "$ISS"
  echo "Name: \"{commondesktop}\\$PRODUCT\"; Tasks: shortcuts\\desktop; Filename: \"{app}\\$BIN_WINDOWS\";" >> "$ISS"
  echo "Name: \"{commonstartmenu}\\$PRODUCT\"; Tasks: shortcuts\\startmenu; Filename: \"{app}\\$BIN_WINDOWS\";" >> "$ISS"

  ISCC "$ISS"
  rm -f "$ISS"
}

build "win32-x64" "$DIR_64_PORTABLE" true
rcedit "$DIR_64_PORTABLE"
compress "$DIR_64_PORTABLE"

build "win32-ia32" "$DIR_32_PORTABLE" true
rcedit "$DIR_32_PORTABLE"
compress "$DIR_32_PORTABLE"

build "win32-x64" "$DIR_64" false
rcedit "$DIR_64"
setup "$DIR_64"
#installer "$DIR_64"

build "win32-ia32" "$DIR_32" false
rcedit "$DIR_32"
setup "$DIR_32"
#installer "$DIR_32"
