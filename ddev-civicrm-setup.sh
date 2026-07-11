#!/usr/bin/env bash

set -euo pipefail
#mkdir -p my-civicrm-site && cd my-civicrm-site

ddev config --project-type=php --composer-root=core --upload-dirs=public/media
ddev start -y
ddev exec "curl -LsS https://download.civicrm.org/latest/civicrm-STABLE-standalone.tar.gz -o /tmp/civicrm-standalone.tar.gz"
ddev exec "tar --strip-components=1 -xzf /tmp/civicrm-standalone.tar.gz"

ddev composer require civicrm/cli-tools --no-scripts
ddev exec cv core:install \
    --cms-base-url='$DDEV_PRIMARY_URL' \
    --db=mysql://db:db@db/db \
    -m loadGenerated=0 \
    -m extras.adminUser=admin \
    -m extras.adminPass=admin \
    -m extras.adminEmail=root@localhost

#ddev launch
