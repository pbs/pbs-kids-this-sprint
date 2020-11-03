#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

npm ci

node -r dotenv/config ./src/js/cv/buildReleasesCsv.js;
