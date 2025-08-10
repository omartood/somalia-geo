#!/usr/bin/env node
const { 
  listRegions, 
  listChildren, 
  getByCode, 
  search, 
  fuzzySearch,
  filter,
  getStats,
  getLargestByPopulation,
  getLargestByArea,
  nearest 
} = require("./index");

const [, , cmd, ...args] = process.argv;

function help() {
  console.log(`
somali-geo CLI - Enhanced Edition

Basic Commands:
  somaligeo regions                    List all regions
  somaligeo children <PARENT_CODE>     List children of a region
  somaligeo code <CODE>                Get place by code
  somaligeo search <query>             Search places (exact match)
  somaligeo near <lat> <lon> [options] Find nearest places

Enhanced Commands:
  somaligeo fuzzy <query> [limit]      Fuzzy search with typo tolerance
  somaligeo filter [options]           Advanced filtering
  somaligeo stats                      Get data statistics
  somaligeo largest [type] [limit]     Get largest places by population/area

Examples:
  somaligeo regions
  somaligeo children SO-BN
  somaligeo code SO-AW
  somaligeo search Mogadishu
  somaligeo fuzzy "Mogadisho" 5        # Finds "Mogadishu" despite typo
  somaligeo filter --type=district --region=SO-BN
  somaligeo largest population 10     # Top 10 by population
  somaligeo largest area 5            # Top 5 by area
  somaligeo stats                     # Data overview
  somaligeo near 2.05 45.32 city 3 50

Filter Options:
  --type=<type>           Filter by type (region,district,city)
  --region=<code>         Filter by parent region
  --has-coords            Only places with coordinates
  --limit=<number>        Limit results
  --sort=<field>          Sort by field (name,population,area_km2)
  --order=<asc|desc>      Sort order
`.trim());
}

// Parse command line arguments for filter options
function parseFilterArgs(args) {
  const criteria = {};
  const nonFlagArgs = [];
  
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      switch (key) {
        case 'type':
          criteria.type = value.split(',');
          break;
        case 'region':
          criteria.region = value;
          break;
        case 'has-coords':
          criteria.hasCoordinates = true;
          break;
        case 'limit':
          criteria.limit = Number(value);
          break;
        case 'sort':
          criteria.sortBy = value;
          break;
        case 'order':
          criteria.sortOrder = value;
          break;
        default:
          console.warn(`Unknown filter option: --${key}`);
      }
    } else {
      nonFlagArgs.push(arg);
    }
  });
  
  return { criteria, nonFlagArgs };
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
      
    case "fuzzy": {
      const query = args[0];
      const limit = args[1] ? Number(args[1]) : 10;
      if (!query) {
        console.error("Usage: somaligeo fuzzy <query> [limit]");
        process.exit(1);
      }
      return console.log(JSON.stringify(fuzzySearch(query, limit), null, 2));
    }
    
    case "filter": {
      const { criteria } = parseFilterArgs(args);
      return console.log(JSON.stringify(filter(criteria), null, 2));
    }
    
    case "stats":
      return console.log(JSON.stringify(getStats(), null, 2));
      
    case "largest": {
      const type = args[0] || 'population'; // 'population' or 'area'
      const limit = args[1] ? Number(args[1]) : 10;
      
      if (type === 'population') {
        return console.log(JSON.stringify(getLargestByPopulation(limit), null, 2));
      } else if (type === 'area') {
        return console.log(JSON.stringify(getLargestByArea(limit), null, 2));
      } else {
        console.error("Usage: somaligeo largest [population|area] [limit]");
        process.exit(1);
      }
    }
    
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
      console.error("Unknown command.\n"); 
      help(); 
      process.exit(1);
  }
}
main();
