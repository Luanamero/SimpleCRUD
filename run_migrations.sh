#!/bin/bash

# Run the stored procedures to update the database
echo "Applying database migrations..."
psql "postgresql://postgres:OPMuEZPtCOBSIxbSGdbYDYgjcGlwQebr@caboose.proxy.rlwy.net:56510/railway" -f mods.sql

echo "Migration completed successfully." 