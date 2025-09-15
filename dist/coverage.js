'use strict';

/**
 * Constants used in painting calculations
 */
const CONSTANTS = {
    // Coverage calculation constant
    COVERAGE_CONSTANT: 1604};

/**
 * Paint Coverage Calculators
 * Calculate paint requirements based on surface area and coating specifications
 */
/**
 * Calculate paint coverage based on surface area and coating specifications
 * @param input - Coverage calculation parameters
 * @returns Coverage results with material requirements
 */
function calculatePaintCoverage(input) {
    const { surfaceArea, coats = 1, volumeSolids, targetDFT, transferEfficiency = 65, pricePerGallon = 0 } = input;
    // Validate inputs
    if (surfaceArea <= 0) {
        throw new Error("Surface area must be greater than 0");
    }
    if (volumeSolids <= 0 || volumeSolids > 100) {
        throw new Error("Volume solids must be between 0 and 100");
    }
    if (targetDFT <= 0) {
        throw new Error("Target DFT must be greater than 0");
    }
    // Calculate theoretical coverage (sq ft per gallon)
    const theoreticalCoverage = (CONSTANTS.COVERAGE_CONSTANT * volumeSolids / 100) / targetDFT;
    // Calculate practical coverage accounting for transfer efficiency
    const practicalCoverage = theoreticalCoverage * (transferEfficiency / 100);
    // Calculate gallons needed
    const gallonsPerCoat = surfaceArea / practicalCoverage;
    const totalGallons = gallonsPerCoat * coats;
    // Calculate waste factor (10% standard)
    const wasteFactorGallons = totalGallons * 0.1;
    const totalWithWaste = totalGallons + wasteFactorGallons;
    // Calculate containers needed
    const fiveGallonBuckets = Math.ceil(totalWithWaste / 5);
    const oneGallonCans = Math.ceil(totalWithWaste);
    // Calculate cost if price provided
    const estimatedCost = pricePerGallon > 0 ? totalWithWaste * pricePerGallon : 0;
    return {
        theoreticalCoverage: Math.round(theoreticalCoverage * 10) / 10,
        practicalCoverage: Math.round(practicalCoverage * 10) / 10,
        gallonsPerCoat: Math.ceil(gallonsPerCoat * 10) / 10,
        totalGallons: Math.ceil(totalGallons * 10) / 10,
        totalWithWaste: Math.ceil(totalWithWaste * 10) / 10,
        wasteFactorGallons: Math.ceil(wasteFactorGallons * 10) / 10,
        fiveGallonBuckets,
        oneGallonCans,
        estimatedCost: Math.round(estimatedCost * 100) / 100,
        coveragePerGallon: Math.round(practicalCoverage)
    };
}
/**
 * Calculate multi-coat system requirements
 * @param input - Multi-coat system parameters
 * @returns Complete system material requirements
 */
function calculateMultiCoatSystem(input) {
    const { surfaceArea, system, transferEfficiency = 65 } = input;
    const layers = {};
    let totalCost = 0;
    let totalDFT = 0;
    let totalGallons = 0;
    // Process each layer if it has coats
    ["primer", "intermediate", "topcoat"].forEach(layerType => {
        const layer = system[layerType];
        if (layer && layer.coats > 0) {
            const coverage = calculatePaintCoverage({
                surfaceArea,
                coats: layer.coats,
                volumeSolids: layer.volumeSolids,
                targetDFT: layer.dft,
                transferEfficiency,
                pricePerGallon: layer.pricePerGallon || 0
            });
            const layerDFT = layer.dft * layer.coats;
            const layerCost = coverage.totalGallons * (layer.pricePerGallon || 0);
            layers[layerType] = {
                ...coverage,
                totalDFT: layerDFT,
                cost: Math.round(layerCost * 100) / 100
            };
            totalCost += layerCost;
            totalDFT += layerDFT;
            totalGallons += coverage.totalGallons;
        }
    });
    return {
        layers,
        summary: {
            totalDFT: Math.round(totalDFT * 10) / 10,
            totalCost: Math.round(totalCost * 100) / 100,
            costPerSquareFoot: Math.round((totalCost / surfaceArea) * 100) / 100,
            totalGallons: Math.round(totalGallons * 10) / 10,
            systemDescription: generateSystemDescription(layers)
        }
    };
}
/**
 * Calculate primer requirements based on substrate
 * @param surfaceArea - Square footage
 * @param substrateType - Type of substrate
 * @param porosity - Substrate porosity level
 * @returns Primer requirements
 */
function calculatePrimerNeeded(surfaceArea, _substrateType = "drywall", _porosity = "medium") {
    // Primer coverage rates by substrate type and porosity
    // const primerCoverage: Record<string, Record<string, number>> = {
    //   drywall: { low: 400, medium: 350, high: 300 },
    //   wood: { low: 350, medium: 300, high: 250 },
    //   masonry: { low: 250, medium: 200, high: 150 },
    //   metal: { low: 450, medium: 400, high: 350 }
    // };
    // Coverage rate determined by substrate type and porosity
    // const _coverage = primerCoverage[_substrateType]?.[_porosity] || 350;
    const volumeSolids = 35; // Typical primer solids
    const targetDFT = 1.5; // Typical primer DFT
    return calculatePaintCoverage({
        surfaceArea,
        coats: 1,
        volumeSolids,
        targetDFT,
        transferEfficiency: 75 // Higher for primer
    });
}
/**
 * Generate system description from layers
 */
function generateSystemDescription(layers) {
    const descriptions = [];
    if (layers.primer) {
        descriptions.push(`Primer: ${layers.primer.totalDFT} mils DFT`);
    }
    if (layers.intermediate) {
        descriptions.push(`Intermediate: ${layers.intermediate.totalDFT} mils DFT`);
    }
    if (layers.topcoat) {
        descriptions.push(`Topcoat: ${layers.topcoat.totalDFT} mils DFT`);
    }
    return descriptions.join(" | ");
}

exports.calculateMultiCoatSystem = calculateMultiCoatSystem;
exports.calculatePaintCoverage = calculatePaintCoverage;
exports.calculatePrimerNeeded = calculatePrimerNeeded;
//# sourceMappingURL=coverage.js.map
