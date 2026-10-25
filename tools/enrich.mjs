// Adds label anchors (pole of inaccessibility in Mercator radians space) to each geometry.
import fs from 'node:fs';
import * as topojson from 'topojson-client';
import polylabel from 'polylabel';
const [,, inPath, outPath] = process.argv;
const topo = JSON.parse(fs.readFileSync(inPath,'utf8'));
const R = Math.PI/180;
const fwd = ([lon,lat]) => [lon*R, Math.log(Math.tan(Math.PI/4 + lat*R/2))];
const inv = ([x,y]) => [x/R, (2*Math.atan(Math.exp(y)) - Math.PI/2)/R];
function anchorFor(feature){
  const g = feature.geometry; if(!g) return null;
  const polys = g.type==='Polygon' ? [g.coordinates] : g.coordinates;
  let best=null;
  for(const poly of polys){
    const p = poly.map(ring=>ring.map(fwd));
    const a = polylabel(p, 1e-5);
    if(!best || a.distance>best.distance) best=a;
  }
  const ll = inv(best); return {lon:+ll[0].toFixed(4), lat:+ll[1].toFixed(4), r:+best.distance.toFixed(5)};
}
for(const key of Object.keys(topo.objects)){
  const fc = topojson.feature(topo, topo.objects[key]);
  fc.features.forEach((f,i)=>{
    const a = anchorFor(f);
    const geom = topo.objects[key].geometries[i];
    const props = Object.assign({}, geom.properties, a ? {lx:a.lon, ly:a.lat, lr:a.r} : {}); if (props.name) { props.name = props.name.replace(/ And /g, " and "); if (props.name === "Andaman and Nicobar") props.name = "Andaman and Nicobar Islands"; } geom.properties = props;
  });
}
fs.writeFileSync(outPath, JSON.stringify(topo));
console.log('wrote', outPath, fs.statSync(outPath).size, 'bytes');
const st = topo.objects.states.geometries.map(g=>g.properties).sort((a,b)=>b.lr-a.lr);
console.log(st.map(p=>`${p.name}: r=${p.lr} @ ${p.lx},${p.ly}`).join('\n'));
