/**
 * @moorhouse/paint-calculators
 * Professional painting calculation tools
 */
export { calculatePaintCoverage } from "./calculators/coverage";
export { calculateMultiCoatSystem } from "./calculators/coverage";
export { calculatePrimerNeeded } from "./calculators/coverage";
export { calculateDewPoint } from "./calculators/environmental";
export { calculateVOC } from "./calculators/environmental";
export { calculateWeatherWindow } from "./calculators/environmental";
export { estimateProjectCost } from "./calculators/cost";
export { calculateROI } from "./calculators/cost";
export { calculateLaborCost } from "./calculators/cost";
export { calculateWFT } from "./calculators/technical";
export { calculateSurfaceArea } from "./calculators/technical";
export { calculateMixRatio } from "./calculators/technical";
export { calculateSpreadingRate } from "./calculators/technical";
export { calculateFilmBuild } from "./calculators/technical";
export { calculatePracticalCoverage } from "./calculators/technical";
export { calculateSolventReduction } from "./calculators/technical";
export { calculateProfileDepth } from "./calculators/technical";
export * from "./types";
export * from "./constants";
import * as coverage from "./calculators/coverage";
import * as environmental from "./calculators/environmental";
import * as cost from "./calculators/cost";
import * as technical from "./calculators/technical";
declare const _default: {
    coverage: typeof coverage;
    environmental: typeof environmental;
    cost: typeof cost;
    technical: typeof technical;
};
export default _default;
//# sourceMappingURL=index.d.ts.map