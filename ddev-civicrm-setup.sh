#!/usr/bin/env bash

set -euo pipefail

# CIVICRM_VERSION=STABLE

# Version 6.17.3 from 2026-08-26
# See https://download.civicrm.org/release/6.17.3
CIVICRM_VERSION=6.17.3

CLI_TOOLS_VERSION=v2026.03.20.1773986462

echo "Setting up DDEV... "
cp .ddev/config-base.yaml .ddev/config.yaml
ddev config --project-type=php --composer-root=core --upload-dirs=public/media
ddev start -y

echo "Downloading package... "
ddev exec "curl -LsS https://download.civicrm.org/civicrm-${CIVICRM_VERSION}-standalone.tar.gz -o /tmp/civicrm-standalone.tar.gz"
echo "Package downloaded"
echo "Extracting package... "
ddev exec "tar --strip-components=1 -xzf /tmp/civicrm-standalone.tar.gz"
echo "Package extracted"

ddev composer require civicrm/cli-tools:$CLI_TOOLS_VERSION --no-scripts

echo "Installing core... "
ddev exec cv core:install \
    --cms-base-url='$DDEV_PRIMARY_URL' \
    --db=mysql://db:db@db/db \
    -m loadGenerated=1 \
    -m extras.adminUser=admin \
    -m extras.adminPass=admin \
    -m extras.adminEmail=root@localhost
echo "Core installed"

#ddev launch
