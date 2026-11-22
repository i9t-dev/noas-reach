#!/bin/sh

set -eux

EXT_DIR="noas-reach"

test -d "$EXT_DIR" || { echo "Missing extension directory: $EXT_DIR" ; exit 1 ; }

chmod 644 $(find "$EXT_DIR" -type f)
chmod 755 $(find "$EXT_DIR" -type d)

tar zcpf "$(basename $EXT_DIR).tar.gz" "$EXT_DIR"
