#!/usr/bin/env node
const { listRegions, listChildren, getByCode, search, nearest } = require("./index");

const [, , cmd, ...args] = process.argv;

function help() {
  console.log(`
somali-geo CLI

Usage:
  somaligeo regions
  somaligeo children <PARENT_CODE>
  somaligeo code <CODE>
  somaligeo search <query>
  somaligeo near <lat> <lon> [type] [limit] [radiusKm]
Examples:
  somaligeo regions
  somaligeo children SO-BN
  somaligeo code SO-MG
  somaligeo search Mogadishu
  somaligeo near 2.05 45.32 city 3 50
`.trim());
}

async function main() {
  switch (cmd) {
    case "regions":
      return console.log(JSON.stringify(listRegions(), null, 2));
    case "children":
      return console.log(JSON.stringify(listChildren(args[0]), null, 2));
    case "code":
      return console.log(JSON.stringify(getByCode(args[0]), null, 2));
    case "search":
      return console.log(JSON.stringify(search(args.join(" ")), null, 2));
    case "near": {
      const [lat, lon, type=null, limitStr, radiusStr] = args;
      const limit = limitStr ? Number(limitStr) : 5;
      const radiusKm = radiusStr ? Number(radiusStr) : null;
      return console.log(JSON.stringify(nearest(Number(lat), Number(lon), { type, limit, radiusKm }), null, 2));
    }
    case "help":
    case undefined:
      return help();
    default:
      console.error("Unknown command.\n"); help(); process.exit(1);
  }
}
main();
