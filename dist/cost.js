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

/**
 * Cost Estimation Calculators
 */
// import { CONSTANTS } from '../constants';
/**
 * Estimate total project cost
 * @param input - Project surfaces and labor parameters
 * @returns Detailed cost breakdown
 */
function estimateProjectCost(input) {
    const { surfaces, laborRate, crewSize, overheadPercent, profitMargin } = input;
    let totalMaterialCost = 0;
    let totalLaborHours = 0;
    let totalSurfaceArea = 0;
    const breakdown = surfaces.map(surface => {
        // Calculate materials needed
        const materials = calculateMultiCoatSystem({
            surfaceArea: surface.area,
            system: surface.coatingSystem,
            transferEfficiency: surface.transferEfficiency || 65
        });
        // Estimate labor hours based on production rates
        const productionRate = getProductionRate(surface.type, surface.condition);
        const laborHours = surface.area / productionRate;
        totalMaterialCost += materials.summary.totalCost;
        totalLaborHours += laborHours;
        totalSurfaceArea += surface.area;
        return {
            description: surface.description,
            area: surface.area,
            materialCost: materials.summary.totalCost,
            laborHours: Math.round(laborHours * 10) / 10,
            laborCost: Math.round(laborHours * laborRate * crewSize)
        };
    });
    const laborCost = totalLaborHours * laborRate * crewSize;
    const directCosts = totalMaterialCost + laborCost;
    const overhead = directCosts * (overheadPercent / 100);
    const subtotal = directCosts + overhead;
    const profit = subtotal * (profitMargin / 100);
    const total = subtotal + profit;
    return {
        breakdown,
        summary: {
            totalSurfaceArea: Math.round(totalSurfaceArea),
            materialCost: Math.round(totalMaterialCost * 100) / 100,
            laborCost: Math.round(laborCost * 100) / 100,
            laborHours: Math.round(totalLaborHours * 10) / 10,
            directCosts: Math.round(directCosts * 100) / 100,
            overhead: Math.round(overhead * 100) / 100,
            profit: Math.round(profit * 100) / 100,
            total: Math.round(total * 100) / 100,
            pricePerSqFt: Math.round((total / totalSurfaceArea) * 100) / 100
        }
    };
}
/**
 * Calculate ROI for coating system upgrade
 * @param input - Current vs proposed system parameters
 * @returns ROI analysis
 */
function calculateROI(input) {
    const { currentSystem, proposedSystem, facilitySize, energyCosts = 0.12, discountRate = 0.05 } = input;
    // Calculate annual costs for current system
    const currentAnnualMaintenance = currentSystem.maintenanceCost / currentSystem.lifespan;
    const currentEnergyLoss = (currentSystem.heatTransfer || 0) * facilitySize * energyCosts * 0.01;
    const currentTotalAnnual = currentAnnualMaintenance + currentEnergyLoss;
    // Calculate annual savings with proposed system
    const proposedAnnualMaintenance = proposedSystem.maintenanceCost / proposedSystem.lifespan;
    const proposedEnergySavings = (proposedSystem.reflectivity || 0) * facilitySize * energyCosts * 0.0015;
    const proposedTotalAnnual = proposedAnnualMaintenance - proposedEnergySavings;
    // Calculate ROI metrics
    const annualSavings = currentTotalAnnual - proposedTotalAnnual;
    const paybackPeriod = proposedSystem.initialCost / annualSavings;
    const tenYearSavings = annualSavings * 10;
    const tenYearROI = ((tenYearSavings - proposedSystem.initialCost) / proposedSystem.initialCost) * 100;
    // Calculate NPV
    const netPresentValue = calculateNPV(annualSavings, proposedSystem.initialCost, 10, discountRate);
    return {
        currentSystem: {
            annualCost: Math.round(currentTotalAnnual * 100) / 100,
            tenYearCost: Math.round(currentTotalAnnual * 10 * 100) / 100
        },
        proposedSystem: {
            initialCost: proposedSystem.initialCost,
            annualSavings: Math.round(annualSavings * 100) / 100,
            tenYearSavings: Math.round(tenYearSavings * 100) / 100
        },
        roi: {
            paybackPeriod: Math.round(paybackPeriod * 10) / 10,
            tenYearROI: Math.round(tenYearROI * 10) / 10,
            netPresentValue: Math.round(netPresentValue * 100) / 100
        }
    };
}
/**
 * Calculate labor cost for a project
 * @param area - Square footage
 * @param laborRate - Hourly rate
 * @param productionRate - Sq ft per hour
 * @returns Labor cost
 */
function calculateLaborCost(area, laborRate, productionRate = 150) {
    const hours = area / productionRate;
    return Math.round(hours * laborRate * 100) / 100;
}
// Helper functions
function getProductionRate(surfaceType, condition) {
    // Simplified production rates (sq ft per hour)
    const rates = {
        walls: { good: 200, fair: 150, poor: 100 },
        ceilings: { good: 150, fair: 120, poor: 80 },
        floors: { good: 250, fair: 200, poor: 150 },
        trim: { good: 50, fair: 40, poor: 30 }
    };
    return rates[surfaceType]?.[condition] || 150;
}
function calculateNPV(annualCashFlow, initialInvestment, years, discountRate) {
    let npv = -initialInvestment;
    for (let year = 1; year <= years; year++) {
        npv += annualCashFlow / Math.pow(1 + discountRate, year);
    }
    return npv;
}

exports.calculateLaborCost = calculateLaborCost;
exports.calculateROI = calculateROI;
exports.estimateProjectCost = estimateProjectCost;
//# sourceMappingURL=cost.js.map
