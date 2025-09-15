/**
 * Paint Coverage Calculators
 * Calculate paint requirements based on surface area and coating specifications
 */
import { CoverageInput, CoverageResult, MultiCoatInput, MultiCoatResult } from "../types";
/**
 * Calculate paint coverage based on surface area and coating specifications
 * @param input - Coverage calculation parameters
 * @returns Coverage results with material requirements
 */
export declare function calculatePaintCoverage(input: CoverageInput): CoverageResult;
/**
 * Calculate multi-coat system requirements
 * @param input - Multi-coat system parameters
 * @returns Complete system material requirements
 */
export declare function calculateMultiCoatSystem(input: MultiCoatInput): MultiCoatResult;
/**
 * Calculate primer requirements based on substrate
 * @param surfaceArea - Square footage
 * @param substrateType - Type of substrate
 * @param porosity - Substrate porosity level
 * @returns Primer requirements
 */
export declare function calculatePrimerNeeded(surfaceArea: number, _substrateType?: string, _porosity?: "low" | "medium" | "high"): CoverageResult;
//# sourceMappingURL=coverage.d.ts.map