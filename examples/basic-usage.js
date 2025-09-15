/**
 * Basic Usage Examples for @moorhouse/paint-calculators
 * Run with: node examples/basic-usage.js
 */

const {
  calculatePaintCoverage,
  calculateDewPoint,
  estimateProjectCost,
  calculateWFT
} = require('../dist/index.js');

console.log('=== Moorhouse Paint Calculators - Basic Examples ===\n');

// Example 1: Calculate paint coverage for a warehouse
console.log('1. WAREHOUSE PAINTING PROJECT');
console.log('------------------------------');
const warehouseCoverage = calculatePaintCoverage({
  surfaceArea: 15000,      // 15,000 sq ft warehouse walls
  coats: 2,                // Two coats
  volumeSolids: 65,        // 65% volume solids
  targetDFT: 5,            // 5 mils per coat
  transferEfficiency: 65,  // 65% transfer efficiency (airless spray)
  pricePerGallon: 42       // $42 per gallon
});

console.log(`Surface Area: 15,000 sq ft`);
console.log(`Gallons Needed: ${warehouseCoverage.totalGallons}`);
console.log(`With 10% Waste: ${warehouseCoverage.totalWithWaste} gallons`);
console.log(`5-Gallon Buckets: ${warehouseCoverage.fiveGallonBuckets}`);
console.log(`Estimated Cost: $${warehouseCoverage.estimatedCost.toFixed(2)}`);
console.log(`Coverage Rate: ${warehouseCoverage.coveragePerGallon} sq ft/gallon\n`);

// Example 2: Check dew point conditions
console.log('2. DEW POINT CONDITIONS CHECK');
console.log('------------------------------');
const currentConditions = calculateDewPoint({
  temperature: 72,    // 72°F
  humidity: 68        // 68% relative humidity
});

console.log(`Current Temperature: 72°F`);
console.log(`Relative Humidity: 68%`);
console.log(`Dew Point: ${currentConditions.dewPoint}°F`);
console.log(`Minimum Surface Temp: ${currentConditions.minimumSurfaceTemp}°F`);
console.log(`Safety Margin: ${currentConditions.currentMargin}°F`);
console.log(`${currentConditions.recommendation}\n`);

// Example 3: Estimate project cost
console.log('3. PROJECT COST ESTIMATION');
console.log('---------------------------');
const projectEstimate = estimateProjectCost({
  surfaces: [
    {
      description: "Interior Walls",
      area: 8000,
      type: "walls",
      condition: "good",
      coatingSystem: {
        primer: {
          volumeSolids: 75,
          dft: 3,
          coats: 1,
          pricePerGallon: 35
        },
        topcoat: {
          volumeSolids: 65,
          dft: 3,
          coats: 2,
          pricePerGallon: 45
        }
      },
      transferEfficiency: 65
    },
    {
      description: "Ceiling",
      area: 4000,
      type: "ceilings",
      condition: "fair",
      coatingSystem: {
        topcoat: {
          volumeSolids: 55,
          dft: 4,
          coats: 2,
          pricePerGallon: 38
        }
      },
      transferEfficiency: 65
    }
  ],
  laborRate: 45,          // $45/hour
  crewSize: 3,            // 3 painters
  overheadPercent: 15,    // 15% overhead
  profitMargin: 20        // 20% profit margin
});

console.log('Surface Breakdown:');
projectEstimate.breakdown.forEach(surface => {
  console.log(`  ${surface.description}:`);
  console.log(`    - Area: ${surface.area} sq ft`);
  console.log(`    - Material Cost: $${surface.materialCost.toFixed(2)}`);
  console.log(`    - Labor Hours: ${surface.laborHours}`);
  console.log(`    - Labor Cost: $${surface.laborCost.toFixed(2)}`);
});

console.log('\nProject Summary:');
console.log(`  Total Surface Area: ${projectEstimate.summary.totalSurfaceArea} sq ft`);
console.log(`  Material Cost: $${projectEstimate.summary.materialCost.toFixed(2)}`);
console.log(`  Labor Cost: $${projectEstimate.summary.laborCost.toFixed(2)}`);
console.log(`  Direct Costs: $${projectEstimate.summary.directCosts.toFixed(2)}`);
console.log(`  Overhead (15%): $${projectEstimate.summary.overhead.toFixed(2)}`);
console.log(`  Profit (20%): $${projectEstimate.summary.profit.toFixed(2)}`);
console.log(`  TOTAL PROJECT COST: $${projectEstimate.summary.total.toFixed(2)}`);
console.log(`  Price per Sq Ft: $${projectEstimate.summary.pricePerSqFt.toFixed(2)}\n`);

// Example 4: Calculate wet film thickness
console.log('4. WET FILM THICKNESS CALCULATION');
console.log('----------------------------------');
const wftCalc = calculateWFT({
  targetDFT: 5,         // Target 5 mils dry
  volumeSolids: 65,     // 65% volume solids
  reductionPercent: 10  // 10% thinning
});

console.log(`Target DFT: 5 mils`);
console.log(`Volume Solids: 65%`);
console.log(`Thinning: 10%`);
console.log(`Required WFT: ${wftCalc.wetFilmThickness} mils`);
console.log(`Adjusted Solids: ${wftCalc.adjustedSolids}%`);
console.log(`Recommended Gauge: ${wftCalc.wetFilmGauge}`);
console.log('Application Tips:');
wftCalc.applicationTips.forEach(tip => {
  console.log(`  - ${tip}`);
});

console.log('\n=== End of Examples ===');