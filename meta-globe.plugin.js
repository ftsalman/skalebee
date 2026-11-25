import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import atlas from "world-atlas/land-50m.json" with { type: "json" };
import { META_SPECIALIST } from "./src/features/home/constants/homeData.js";

const fileName = "imgs/home/meta-globe.svg";

function renderGlobe({ center, pin }) {
  const size = 800;
  const projection = geoOrthographic()
    .rotate([-center[0], -center[1]])
    .translate([size / 2, size / 2])
    .scale(size / 2 - 1);
  const path = geoPath(projection).digits(1);
  const coast = path(feature(atlas, atlas.objects.land));

  // Project evenly spaced dots on the visible hemisphere, then clip them to land.
  const dots = [];
  const dotStep = 1.4;
  for (let lat = -80; lat <= 84; lat += dotStep) {
    const longitudeStep = dotStep / Math.max(Math.cos(lat * Math.PI / 180), 0.2);
    for (let lon = -180; lon < 180; lon += longitudeStep) {
      const point = [lon, lat];
      if (geoDistance(point, center) > 1.52) continue;
      const [x, y] = projection(point);
      dots.push(`M${(x - 0.6).toFixed(1)} ${y.toFixed(1)}h1.2`);
    }
  }

  const [pinX, pinY] = projection(pin);
  const marker = geoDistance(pin, center) < Math.PI / 2
    ? `<circle cx="${pinX.toFixed(1)}" cy="${pinY.toFixed(1)}" r="7" fill="#ff4b1f"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <path id="coast" d="${coast}"/>
    <clipPath id="land"><use href="#coast"/></clipPath>
  </defs>
  <circle cx="400" cy="400" r="399" fill="#000" stroke="#fff" stroke-opacity=".5"/>
  <path d="${path(geoGraticule10())}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/>
  <path d="${dots.join("")}" clip-path="url(#land)" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>
  <use href="#coast" fill="none" stroke="#fff"/>
  ${marker}
</svg>`;
}

export default function metaGlobePlugin() {
  let svg;
  const getSvg = () => (svg ??= renderGlobe(META_SPECIALIST.location));
  return {
    name: "skalebee-meta-globe",
    configureServer(server) {
      server.middlewares.use(`/${fileName}`, (_request, response) => {
        response.setHeader("Content-Type", "image/svg+xml");
        response.end(getSvg());
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName, source: getSvg() });
    },
  };
}
