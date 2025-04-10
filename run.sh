#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
BACKEND="cd $SCRIPT_DIR/back-end && fastapi run"
FRONTEND="cd $SCRIPT_DIR/front-end && pnpm dev"

parallel -j0 --ungroup ::: "$BACKEND" "$FRONTEND"