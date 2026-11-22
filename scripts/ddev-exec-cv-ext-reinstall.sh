#!/bin/bash

set -eux

ddev exec cv ext:uninstall noas-reach && ddev exec cv ext:enable noas-reach
