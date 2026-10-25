// Injects data/india.topojson into src/index.template.html.
//   index.html            : complete standalone document (open directly or host anywhere)
//   <optional 2nd arg>    : bare page body, for hosts that wrap it in their own <html>/<head> skeleton
import fs from 'node:fs';
const tpl = fs.readFileSync('src/index.template.html', 'utf8');
const topo = fs.readFileSync('data/india.topojson', 'utf8').trim();
const bare = tpl.split('__TOPO_JSON__').join(topo);
const standalone = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}</style>\n${bare.replace('<div id="app">', '</head>\n<body>\n<div id="app">')}\n</body>\n</html>\n`;
fs.writeFileSync('index.html', standalone);
console.log('index.html', (standalone.length / 1024).toFixed(0) + ' KB');
if (process.argv[2]) { fs.writeFileSync(process.argv[2], bare); console.log('bare page', process.argv[2]); }
