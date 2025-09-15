/**
 * Technical Calculators for Painting Applications
 */
import { WFTInput, WFTResult, SurfaceAreaInput, SurfaceAreaResult } from '../types';
/**
 * Calculate Wet Film Thickness from Dry Film Thickness
 * @param input - DFT and volume solids parameters
 * @returns WFT calculation results
 */
export declare function calculateWFT(input: WFTInput): WFTResult;
/**
 * Calculate surface area for various shapes
 * @param input - Shape type and dimensions
 * @returns Surface area calculations
 */
export declare function calculateSurfaceArea(input: SurfaceAreaInput): SurfaceAreaResult;
/**
 * Calculate spreading rate (coverage) from WFT and volume solids
 * @param wft - Wet film thickness in mils
 * @param volumeSolids - Volume solids percentage
 * @returns Coverage in sq ft per gallon
 */
export declare function calculateSpreadingRate(wft: number, volumeSolids: number): number;
/**
 * Calculate film build from multiple coats
 * @param coats - Array of coat specifications
 * @returns Total DFT and individual coat builds
 */
export declare function calculateFilmBuild(coats: Array<{
    wft: number;
    volumeSolids: number;
}>): {
    totalDFT: number;
    coatBuilds: number[];
};
/**
 * Calculate theoretical vs practical coverage
 * @param theoreticalCoverage - Theoretical coverage rate
 * @param applicationMethod - Method of application
 * @returns Practical coverage rate
 */
export declare function calculatePracticalCoverage(theoreticalCoverage: number, applicationMethod: 'spray' | 'roller' | 'brush'): number;
/**
 * Calculate mixing ratio volumes
 * @param totalVolume - Total mixed volume needed (gallons)
 * @param ratio - Mix ratio (e.g., "4:1" for 4 parts A to 1 part B)
 * @returns Component volumes
 */
export declare function calculateMixRatio(totalVolume: number, ratio: string): {
    partA: number;
    partB: number;
    partC?: number;
};
/**
 * Calculate solvent reduction volume
 * @param paintVolume - Volume of paint (gallons)
 * @param reductionPercent - Reduction percentage
 * @returns Solvent volume needed
 */
export declare function calculateSolventReduction(paintVolume: number, reductionPercent: number): {
    solventVolume: number;
    totalVolume: number;
};
/**
 * Calculate anchor profile depth from blast media
 * @param mediaType - Type of blast media
 * @param pressure - Blast pressure (PSI)
 * @returns Estimated profile depth in mils
 */
export declare function calculateProfileDepth(mediaType: 'steel-grit' | 'steel-shot' | 'garnet' | 'aluminum-oxide', pressure: number): {
    minProfile: number;
    maxProfile: number;
    typical: number;
};
//# sourceMappingURL=technical.d.ts.map