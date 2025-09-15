/**
 * @moorhouse/paint-calculators
 * Professional painting calculation tools
 */

// Coverage Calculators
export { calculatePaintCoverage } from "./calculators/coverage";
export { calculateMultiCoatSystem } from "./calculators/coverage";
export { calculatePrimerNeeded } from "./calculators/coverage";

// Environmental Calculators
export { calculateDewPoint } from "./calculators/environmental";
export { calculateVOC } from "./calculators/environmental";
export { calculateWeatherWindow } from "./calculators/environmental";

// Cost Calculators
export { estimateProjectCost } from "./calculators/cost";
export { calculateROI } from "./calculators/cost";
export { calculateLaborCost } from "./calculators/cost";

// Technical Calculators
export { calculateWFT } from "./calculators/technical";
export { calculateSurfaceArea } from "./calculators/technical";
export { calculateMixRatio } from "./calculators/technical";
export { calculateSpreadingRate } from "./calculators/technical";
export { calculateFilmBuild } from "./calculators/technical";
export { calculatePracticalCoverage } from "./calculators/technical";
export { calculateSolventReduction } from "./calculators/technical";
export { calculateProfileDepth } from "./calculators/technical";

// Types
export * from "./types";

// Constants
export * from "./constants";


// Import all calculators for default export
import * as coverage from "./calculators/coverage";
import * as environmental from "./calculators/environmental";
import * as cost from "./calculators/cost";
import * as technical from "./calculators/technical";

// Default export for convenience
export default {
  coverage,
  environmental,
  cost,
  technical
};