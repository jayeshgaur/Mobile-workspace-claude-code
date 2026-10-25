#!/usr/bin/env bash
# Rebuilds data/india.topojson from two public GeoJSON sources (both follow the Survey of India 2019 depiction):
#   states    : https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/INDIA/INDIA_STATES.geojson
#   districts : https://raw.githubusercontent.com/udit-001/india-maps-data/main/geojson/india.geojson
# Usage: tools/build-data.sh <dir containing states_datta.geojson and states_udit.geojson> [workdir]
# Needs: node, and `npm install mapshaper topojson-client polylabel` available on PATH / NODE_PATH.
set -euo pipefail
SRC="$1"; WORK="${2:-$(mktemp -d)}"; OUT="$(dirname "$0")/../data/india.topojson"
MS="${MAPSHAPER:-$(dirname "$0")/node_modules/.bin/mapshaper}"

# States: merge the two UTs that became one in 2020, title-case names, keep the census code, simplify, clean.
"$MS" "$SRC/states_datta.geojson" \
  -each 'nm = STNAME.replace(/ & /g," and ").toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()); if (STNAME=="DADRA & NAGAR HAVELI" || STNAME=="DAMAN & DIU") nm="Dadra and Nagar Haveli and Daman and Diu"; code = (STNAME=="DAMAN & DIU") ? "25" : STCODE11' \
  -dissolve fields=nm copy-fields=code -each 'name = nm; delete nm' \
  -simplify 20% keep-shapes weighted -clean \
  -o "$WORK/states.json" format=geojson

# Districts: drop the unnamed whole-state outlines mixed into the source, rename fields, simplify.
"$MS" "$SRC/states_udit.geojson" \
  -filter '!!district' \
  -each 'state = st_nm; name = district; delete st_nm; delete district; delete dt_code; delete year; delete st_code' \
  -simplify 20% keep-shapes weighted \
  -o "$WORK/districts.json" format=geojson

"$MS" -i "$WORK/states.json" "$WORK/districts.json" combine-files \
  -o "$WORK/india_raw.topojson" format=topojson quantization=100000 target='*'

# Label anchors (pole of inaccessibility) and name fixes.
node "$(dirname "$0")/enrich.mjs" "$WORK/india_raw.topojson" "$OUT"
