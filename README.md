# Bharat Atlas

An interactive map of India in a single HTML file: 28 states and 8 union territories with
borders following the Survey of India's 2019 depiction, every name set at the visual centre
of its shape, and a district layer that appears when you open a state.

**Open `index.html` in any browser.** Nothing to install. It loads D3 and TopoJSON from cdnjs
and Google Fonts; everything else, including the map data, is inside the file.

## What it does

- Hover or tap a state for a quick card; click to open it. The view zooms in, the state's
  districts appear with their names, and the panel shows capital, population, area, density,
  literacy, statehood date and official languages, each ranked among the 36.
- Colour the map by zonal council (default), population, density, literacy or area.
  The legend tick follows whatever you hover.
- Search any state or district. Picking a district zooms straight to it.
- Quiz: names are hidden and you are asked to find each state or territory. Score, streak
  and best streak are tracked.
- The Tropic of Cancer and the Indian Standard Time meridian (82°30′E) are drawn and can be
  toggled from the toolbar.
- Numbers use Indian grouping (lakh, crore). Light and dark themes follow the system.
- Deep links: `index.html#kerala`, `#tamil-nadu`, `#jammu-and-kashmir` open that state.

## Data

| Layer | Source | Notes |
|---|---|---|
| State borders | [datta07/INDIAN-SHAPEFILES](https://github.com/datta07/INDIAN-SHAPEFILES) | Survey of India 2019; Dadra & Nagar Haveli and Daman & Diu merged (2020) |
| Districts | [udit-001/india-maps-data](https://github.com/udit-001/india-maps-data) | 2011 census district frame; 726 districts |
| Figures | Census of India 2011 | Population, literacy, area; J&K and Ladakh show administered area |

Label anchors are the pole of inaccessibility of each shape (computed in Mercator space with
`polylabel`), which keeps names inside awkward shapes like Kerala, West Bengal and Manipur.

## Rebuilding the data

```sh
npm --prefix tools install
# download the two GeoJSON files named in tools/build-data.sh into some directory, then:
tools/build-data.sh <that-directory>
node tools/build.mjs          # writes index.html from src/index.template.html + data/india.topojson
```

## Layout

```
index.html               the finished page (generated)
src/index.template.html  page source with a __TOPO_JSON__ placeholder
data/india.topojson      states + districts, simplified, with label anchors
tools/build-data.sh      GeoJSON -> TopoJSON pipeline (mapshaper)
tools/enrich.mjs         adds label anchors and tidies names
tools/build.mjs          injects the data into the template
```
