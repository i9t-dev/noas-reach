
## Install

TBD 

## Use

TBD

## Hack

Set up the base CiviCRM instance using DDEV:

```shell-session
chrp@macbook-pro-de-christophe noas-reach % ./ddev-civicrm-setup.sh
Configuring a 'php' project named 'noas-reach' with docroot '' at '/Users/chrp/Workspaces/noas-reach'.
For full details use 'ddev describe'.
[...]
Found code for civicrm-core in /var/www/html/core
Found code for civicrm-setup in /var/www/html/core/setup
Creating file /var/www/html/private/civicrm.settings.php
Creating civicrm_* database tables in db
```

To ensure the development environment works offline, set up the `/etc/hosts` file:

```shell-session
chrp@macbook-pro-de-christophe noas-reach % ddev hostname
'ddev hostname ' must be run with administrator privileges
chrp@macbook-pro-de-christophe noas-reach % sudo ddev hostname
Invalid arguments supplied. Please use 'ddev hostname [hostname] [ip]'
chrp@macbook-pro-de-christophe noas-reach % sudo ddev hostname noas-reach.ddev.site 127.0.0.1
```
