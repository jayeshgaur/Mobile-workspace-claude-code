// Injects data/india.topojson and the vendored libraries into src/index.template.html.
//   index.html            : complete standalone document (open directly or host anywhere; no network needed)
//   <optional 2nd arg>    : bare page body, for hosts that wrap it in their own <html>/<head> skeleton
import fs from 'node:fs';
const tpl = fs.readFileSync('src/index.template.html', 'utf8');
const topo = fs.readFileSync('data/india.topojson', 'utf8').trim();
const d3js = fs.readFileSync('src/vendor/d3-7.9.0.min.js', 'utf8').replace(/<\/script/gi, '<\\/script');
const tjs = fs.readFileSync('src/vendor/topojson-client-3.1.0.min.js', 'utf8').replace(/<\/script/gi, '<\\/script');
const bare = tpl.split('__TOPO_JSON__').join(topo).split('__D3_JS__').join(d3js).split('__TOPOJSON_JS__').join(tjs);
const standalone = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}</style>\n${bare.replace('<div id="app">', '</head>\n<body>\n<div id="app">')}\n</body>\n</html>\n`;
fs.writeFileSync('index.html', standalone);
console.log('index.html', (standalone.length / 1024).toFixed(0) + ' KB');
if (process.argv[2]) { fs.writeFileSync(process.argv[2], bare); console.log('bare page', process.argv[2]); }
