#!/bin/sh

set -eu

EXECUTION_DIR="$(cd $(dirname $0) && pwd)"
EXT_DIR="noas-reach"
DIST_DIR="$EXECUTION_DIR/dist"
HEAD_TAG="$(git tag --points-at)"
VERSION=${HEAD_TAG:-dev-$(date -I)}

echo "Determined package version: $VERSION"

test -d "$EXT_DIR" || { echo "Missing extension directory: $EXT_DIR" ; exit 1 ; }

echo "Fixing permissions on extension directory: $EXT_DIR"
chmod 644 $(find "$EXT_DIR" -type f)
chmod 755 $(find "$EXT_DIR" -type d)

ARCHIVE_FILE="$(basename $EXT_DIR)-$VERSION.tar.gz"

echo "Creating distributable archive: $EXT_DIR"
tar zcpf "$ARCHIVE_FILE" "$EXT_DIR"
mv "$ARCHIVE_FILE" "$DIST_DIR"/

echo "Created distributable archive: $DIST_DIR/$ARCHIVE_FILE"