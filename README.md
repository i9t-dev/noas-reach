
## Install, use

See <https://i9t-dev.github.io/noas-reach>.

## Hack

Set up the base [CiviCRM](https://civicrm.org/) instance using [DDEV](https://ddev.com/):

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

Set up the `/etc/hosts` file, to ensure the development environment works offline:

```shell-session
chrp@macbook-pro-de-christophe noas-reach % ddev hostname
'ddev hostname ' must be run with administrator privileges
chrp@macbook-pro-de-christophe noas-reach % sudo ddev hostname
Invalid arguments supplied. Please use 'ddev hostname [hostname] [ip]'
chrp@macbook-pro-de-christophe noas-reach % sudo ddev hostname noas-reach.ddev.site 127.0.0.1
```
