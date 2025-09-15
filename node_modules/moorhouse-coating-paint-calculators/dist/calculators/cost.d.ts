/**
 * Cost Estimation Calculators
 */
import { ProjectCostInput, ProjectCostResult, ROIInput, ROIResult } from '../types';
/**
 * Estimate total project cost
 * @param input - Project surfaces and labor parameters
 * @returns Detailed cost breakdown
 */
export declare function estimateProjectCost(input: ProjectCostInput): ProjectCostResult;
/**
 * Calculate ROI for coating system upgrade
 * @param input - Current vs proposed system parameters
 * @returns ROI analysis
 */
export declare function calculateROI(input: ROIInput): ROIResult;
/**
 * Calculate labor cost for a project
 * @param area - Square footage
 * @param laborRate - Hourly rate
 * @param productionRate - Sq ft per hour
 * @returns Labor cost
 */
export declare function calculateLaborCost(area: number, laborRate: number, productionRate?: number): number;
//# sourceMappingURL=cost.d.ts.map