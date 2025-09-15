'use strict';

/**
 * Constants used in painting calculations
 */
const CONSTANTS = {
    // Coverage calculation constant
    COVERAGE_CONSTANT: 1604};

/**
 * Technical Calculators for Painting Applications
 */
/**
 * Calculate Wet Film Thickness from Dry Film Thickness
 * @param input - DFT and volume solids parameters
 * @returns WFT calculation results
 */
function calculateWFT(input) {
    const { targetDFT, volumeSolids, reductionPercent = 0 } = input;
    // Adjust volume solids for reduction (thinning)
    const adjustedSolids = volumeSolids * (1 - reductionPercent / 100);
    // Calculate wet film thickness
    const wetFilmThickness = (targetDFT / adjustedSolids) * 100;
    // Determine appropriate wet film gauge
    let wetFilmGauge = '';
    if (wetFilmThickness <= 25) {
        wetFilmGauge = '0-25 mil gauge';
    }
    else if (wetFilmThickness <= 50) {
        wetFilmGauge = '0-50 mil gauge';
    }
    else if (wetFilmThickness <= 100) {
        wetFilmGauge = '0-100 mil gauge';
    }
    else {
        wetFilmGauge = 'Use multiple passes or special gauge';
    }
    // Generate application tips
    const applicationTips = [];
    if (wetFilmThickness > 20) {
        applicationTips.push('Apply in multiple passes to avoid sagging');
    }
    if (reductionPercent > 10) {
        applicationTips.push(`Thinning by ${reductionPercent}% may affect coating properties`);
    }
    if (adjustedSolids < 50) {
        applicationTips.push('Multiple coats may be required for proper build');
    }
    applicationTips.push(`Check WFT immediately after application using ${wetFilmGauge}`);
    return {
        wetFilmThickness: Math.round(wetFilmThickness * 10) / 10,
        adjustedSolids: Math.round(adjustedSolids * 10) / 10,
        wetFilmGauge,
        applicationTips
    };
}
/**
 * Calculate surface area for various shapes
 * @param input - Shape type and dimensions
 * @returns Surface area calculations
 */
function calculateSurfaceArea(input) {
    const { shape, dimensions, deductions = [] } = input;
    let grossArea = 0;
    // Calculate gross area based on shape
    switch (shape) {
        case 'rectangular':
            if (dimensions.length && dimensions.width) {
                grossArea = dimensions.length * dimensions.width;
            }
            if (dimensions.height) {
                // Calculate wall area (perimeter × height)
                const perimeter = 2 * ((dimensions.length || 0) + (dimensions.width || 0));
                grossArea = perimeter * dimensions.height;
            }
            break;
        case 'cylindrical':
            if (dimensions.radius && dimensions.height) {
                // Lateral surface area: 2πrh
                grossArea = 2 * Math.PI * dimensions.radius * dimensions.height;
                // Add top/bottom if needed: 2πr²
                if (dimensions.includeEnds) {
                    grossArea += 2 * Math.PI * Math.pow(dimensions.radius, 2);
                }
            }
            else if (dimensions.diameter && dimensions.height) {
                const radius = dimensions.diameter / 2;
                grossArea = 2 * Math.PI * radius * dimensions.height;
                if (dimensions.includeEnds) {
                    grossArea += 2 * Math.PI * Math.pow(radius, 2);
                }
            }
            break;
        case 'spherical':
            if (dimensions.radius) {
                // Surface area: 4πr²
                grossArea = 4 * Math.PI * Math.pow(dimensions.radius, 2);
            }
            else if (dimensions.diameter) {
                const radius = dimensions.diameter / 2;
                grossArea = 4 * Math.PI * Math.pow(radius, 2);
            }
            break;
        case 'complex':
            // For complex shapes, use provided total area
            grossArea = dimensions.totalArea || 0;
            break;
    }
    // Calculate deductions (windows, doors, etc.)
    const deductionArea = deductions.reduce((total, deduction) => {
        return total + (deduction.width * deduction.height * deduction.quantity);
    }, 0);
    // Calculate net area
    const netArea = grossArea - deductionArea;
    // Add waste factor (typically 10%)
    const addWasteFactor = netArea * 0.10;
    return {
        grossArea: Math.round(grossArea * 10) / 10,
        deductionArea: Math.round(deductionArea * 10) / 10,
        netArea: Math.round(netArea * 10) / 10,
        addWasteFactor: Math.round(addWasteFactor * 10) / 10,
        measurement: {
            squareFeet: Math.round(netArea * 10) / 10,
            squareMeters: Math.round(netArea * 0.092903 * 100) / 100,
            squareYards: Math.round(netArea / 9 * 100) / 100
        }
    };
}
/**
 * Calculate spreading rate (coverage) from WFT and volume solids
 * @param wft - Wet film thickness in mils
 * @param volumeSolids - Volume solids percentage
 * @returns Coverage in sq ft per gallon
 */
function calculateSpreadingRate(wft, volumeSolids) {
    const dft = (wft * volumeSolids) / 100;
    const coverage = (CONSTANTS.COVERAGE_CONSTANT * volumeSolids) / dft;
    return Math.round(coverage * 10) / 10;
}
/**
 * Calculate film build from multiple coats
 * @param coats - Array of coat specifications
 * @returns Total DFT and individual coat builds
 */
function calculateFilmBuild(coats) {
    const coatBuilds = coats.map(coat => (coat.wft * coat.volumeSolids) / 100);
    const totalDFT = coatBuilds.reduce((sum, build) => sum + build, 0);
    return {
        totalDFT: Math.round(totalDFT * 10) / 10,
        coatBuilds: coatBuilds.map(build => Math.round(build * 10) / 10)
    };
}
/**
 * Calculate theoretical vs practical coverage
 * @param theoreticalCoverage - Theoretical coverage rate
 * @param applicationMethod - Method of application
 * @returns Practical coverage rate
 */
function calculatePracticalCoverage(theoreticalCoverage, applicationMethod) {
    const efficiencies = {
        spray: 0.65,
        roller: 0.85,
        brush: 0.90
    };
    const efficiency = efficiencies[applicationMethod] || 0.65;
    return Math.round(theoreticalCoverage * efficiency * 10) / 10;
}
/**
 * Calculate mixing ratio volumes
 * @param totalVolume - Total mixed volume needed (gallons)
 * @param ratio - Mix ratio (e.g., "4:1" for 4 parts A to 1 part B)
 * @returns Component volumes
 */
function calculateMixRatio(totalVolume, ratio) {
    const parts = ratio.split(':').map(Number);
    const totalParts = parts.reduce((sum, part) => sum + part, 0);
    const result = {
        partA: Math.round((totalVolume * parts[0] / totalParts) * 100) / 100,
        partB: Math.round((totalVolume * parts[1] / totalParts) * 100) / 100
    };
    if (parts[2]) {
        result.partC = Math.round((totalVolume * parts[2] / totalParts) * 100) / 100;
    }
    return result;
}
/**
 * Calculate solvent reduction volume
 * @param paintVolume - Volume of paint (gallons)
 * @param reductionPercent - Reduction percentage
 * @returns Solvent volume needed
 */
function calculateSolventReduction(paintVolume, reductionPercent) {
    const solventVolume = paintVolume * (reductionPercent / 100);
    const totalVolume = paintVolume + solventVolume;
    return {
        solventVolume: Math.round(solventVolume * 100) / 100,
        totalVolume: Math.round(totalVolume * 100) / 100
    };
}
/**
 * Calculate anchor profile depth from blast media
 * @param mediaType - Type of blast media
 * @param pressure - Blast pressure (PSI)
 * @returns Estimated profile depth in mils
 */
function calculateProfileDepth(mediaType, pressure) {
    const profiles = {
        'steel-grit': { base: 2.0, factor: 0.015 },
        'steel-shot': { base: 1.0, factor: 0.010 },
        'garnet': { base: 1.5, factor: 0.012 },
        'aluminum-oxide': { base: 2.5, factor: 0.018 }
    };
    const profile = profiles[mediaType] || profiles['steel-shot'];
    const typical = profile.base + (pressure - 80) * profile.factor;
    return {
        minProfile: Math.round((typical * 0.8) * 10) / 10,
        maxProfile: Math.round((typical * 1.2) * 10) / 10,
        typical: Math.round(typical * 10) / 10
    };
}

exports.calculateFilmBuild = calculateFilmBuild;
exports.calculateMixRatio = calculateMixRatio;
exports.calculatePracticalCoverage = calculatePracticalCoverage;
exports.calculateProfileDepth = calculateProfileDepth;
exports.calculateSolventReduction = calculateSolventReduction;
exports.calculateSpreadingRate = calculateSpreadingRate;
exports.calculateSurfaceArea = calculateSurfaceArea;
exports.calculateWFT = calculateWFT;
//# sourceMappingURL=technical.js.map
