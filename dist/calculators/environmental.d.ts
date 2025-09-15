/**
 * Environmental Calculators for Painting Applications
 */
import { DewPointInput, DewPointResult, VOCInput, VOCResult } from '../types';
/**
 * Calculate dew point temperature
 * @param input - Temperature and humidity values
 * @returns Dew point calculation results
 */
export declare function calculateDewPoint(input: DewPointInput): DewPointResult;
/**
 * Calculate VOC emissions and compliance
 * @param input - Coating volume and VOC content
 * @returns VOC calculation results
 */
export declare function calculateVOC(input: VOCInput): VOCResult;
/**
 * Determine optimal weather window for painting
 * @param forecast - Weather forecast data
 * @returns Recommended painting window
 */
export declare function calculateWeatherWindow(_forecast: any): any;
//# sourceMappingURL=environmental.d.ts.map