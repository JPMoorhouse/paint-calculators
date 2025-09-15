'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Constants used in painting calculations
 */
const CONSTANTS = {
    // Coverage calculation constant
    COVERAGE_CONSTANT: 1604, // sq ft per gallon at 1 mil DFT at 100% solids
    // Environmental limits
    MIN_TEMP: 50, // Minimum painting temperature (°F)
    MAX_TEMP: 100, // Maximum painting temperature (°F)
    MAX_HUMIDITY: 85, // Maximum relative humidity (%)
    DEW_POINT_MARGIN: 5, // Required margin above dew point (°F)
    MAX_WIND_SPEED: 15, // Maximum wind speed (mph)
    // Transfer efficiency defaults by method
    TRANSFER_EFFICIENCY: {
        AIRLESS: 65,
        AIR_SPRAY: 35,
        HVLP: 75,
        BRUSH_ROLL: 85,
        ELECTROSTATIC: 90
    },
    // Production rates (sq ft per hour)
    PRODUCTION_RATES: {
        SPRAY: {
            WALLS: 1500,
            CEILINGS: 1200,
            TRIM: 300,
            DOORS: 150
        },
        BRUSH_ROLL: {
            WALLS: 350,
            CEILINGS: 300,
            TRIM: 100,
            DOORS: 50
        }
    },
    // VOC regulatory limits (g/L)
    VOC_LIMITS: {
        FLAT: 50,
        NON_FLAT: 150,
        PRIMER: 200,
        FLOOR: 400,
        INDUSTRIAL: 450
    },
    // Surface profile requirements (mils)
    SURFACE_PROFILE: {
        THIN_FILM: { MIN: 0.5, MAX: 1.5 },
        MEDIUM_FILM: { MIN: 1.5, MAX: 2.5 },
        THICK_FILM: { MIN: 2.5, MAX: 4.0 }
    },
    // Waste factors by project type
    WASTE_FACTORS: {
        RESIDENTIAL: 0.10, // 10%
        COMMERCIAL: 0.15, // 15%
        INDUSTRIAL: 0.20, // 20%
        PRECISION: 0.05 // 5%
    },
    // Coating lifespan estimates (years)
    COATING_LIFESPAN: {
        ACRYLIC: 7,
        EPOXY: 10,
        POLYURETHANE: 12,
        FLUOROPOLYMER: 20,
        SILOXANE: 15
    }
};
// Magnus formula constants for dew point calculation
const MAGNUS = {
    A: 17.27,
    B: 237.7
};
// Conversion factors
const CONVERSIONS = {
    SQ_FT_TO_SQ_M: 0.092903,
    SQ_FT_TO_SQ_YD: 0.111111,
    GALLON_TO_LITER: 3.78541,
    MIL_TO_MICRON: 25.4,
    PSI_TO_BAR: 0.0689476
};

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

var coverage = /*#__PURE__*/Object.freeze({
    __proto__: null,
    calculateMultiCoatSystem: calculateMultiCoatSystem,
    calculatePaintCoverage: calculatePaintCoverage,
    calculatePrimerNeeded: calculatePrimerNeeded
});

/**
 * Environmental Calculators for Painting Applications
 */
/**
 * Calculate dew point temperature
 * @param input - Temperature and humidity values
 * @returns Dew point calculation results
 */
function calculateDewPoint(input) {
    const { temperature, humidity } = input;
    // Magnus formula for dew point calculation
    const alpha = ((MAGNUS.A * temperature) / (MAGNUS.B + temperature)) + Math.log(humidity / 100);
    const dewPoint = (MAGNUS.B * alpha) / (MAGNUS.A - alpha);
    // Typical surface temperature is 5°F below air temp
    const surfaceTemp = temperature - 5;
    const currentMargin = surfaceTemp - dewPoint;
    const isSafe = currentMargin >= CONSTANTS.DEW_POINT_MARGIN;
    return {
        dewPoint: Math.round(dewPoint * 10) / 10,
        minimumSurfaceTemp: Math.round((dewPoint + CONSTANTS.DEW_POINT_MARGIN) * 10) / 10,
        currentMargin: Math.round(currentMargin * 10) / 10,
        isSafe,
        recommendation: isSafe
            ? "✅ Conditions are acceptable for painting"
            : `⚠️ Warning: Risk of condensation. Wait until surface temp is above ${Math.round(dewPoint + 5)}°F`
    };
}
/**
 * Calculate VOC emissions and compliance
 * @param input - Coating volume and VOC content
 * @returns VOC calculation results
 */
function calculateVOC(input) {
    const { coatingVolume, vocContent, area, ventilationRate = 0, ceilingHeight = 10 } = input;
    // Calculate total VOC emissions
    const totalVOC = coatingVolume * vocContent;
    const vocPerSqFt = totalVOC / area;
    // Determine regulatory limit based on coating type (simplified)
    const regulatoryLimit = CONSTANTS.VOC_LIMITS.NON_FLAT; // 150 g/L for non-flat
    const isCompliant = vocContent <= regulatoryLimit;
    // Calculate air changes if ventilation provided
    let airChangesPerHour = 0;
    let estimatedClearTime = 0;
    if (ventilationRate > 0) {
        const roomVolume = area * ceilingHeight;
        airChangesPerHour = (ventilationRate * 60) / roomVolume;
        // Simplified clear time calculation
        estimatedClearTime = totalVOC / (ventilationRate * 0.075);
    }
    const recommendations = [];
    if (!isCompliant) {
        recommendations.push("⚠️ VOC content exceeds regulatory limits");
    }
    if (airChangesPerHour < 4) {
        recommendations.push("Increase ventilation to minimum 4 air changes per hour");
    }
    if (vocContent > 50) {
        recommendations.push("Consider using low-VOC alternatives (<50 g/L)");
    }
    return {
        totalVOC: Math.round(totalVOC * 100) / 100,
        vocPerSqFt: Math.round(vocPerSqFt * 100) / 100,
        regulatoryLimit,
        isCompliant,
        airChangesPerHour: Math.round(airChangesPerHour * 10) / 10,
        estimatedClearTime: Math.round(estimatedClearTime * 10) / 10,
        recommendations
    };
}
/**
 * Determine optimal weather window for painting
 * @param forecast - Weather forecast data
 * @returns Recommended painting window
 */
function calculateWeatherWindow(_forecast) {
    // Simplified weather window calculation
    // In production, this would process actual weather API data
    const optimalConditions = {
        temperature: { min: 50, max: 90 },
        humidity: { max: 85 },
        windSpeed: { max: 15 },
        precipitation: 0
    };
    return {
        isOptimal: true,
        recommendation: "Weather conditions are suitable for painting",
        optimalConditions
    };
}

var environmental = /*#__PURE__*/Object.freeze({
    __proto__: null,
    calculateDewPoint: calculateDewPoint,
    calculateVOC: calculateVOC,
    calculateWeatherWindow: calculateWeatherWindow
});

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

var cost = /*#__PURE__*/Object.freeze({
    __proto__: null,
    calculateLaborCost: calculateLaborCost,
    calculateROI: calculateROI,
    estimateProjectCost: estimateProjectCost
});

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

var technical = /*#__PURE__*/Object.freeze({
    __proto__: null,
    calculateFilmBuild: calculateFilmBuild,
    calculateMixRatio: calculateMixRatio,
    calculatePracticalCoverage: calculatePracticalCoverage,
    calculateProfileDepth: calculateProfileDepth,
    calculateSolventReduction: calculateSolventReduction,
    calculateSpreadingRate: calculateSpreadingRate,
    calculateSurfaceArea: calculateSurfaceArea,
    calculateWFT: calculateWFT
});

/**
 * @moorhouse/paint-calculators
 * Professional painting calculation tools
 */
// Coverage Calculators
// Default export for convenience
var index = {
    coverage,
    environmental,
    cost,
    technical
};

exports.CONSTANTS = CONSTANTS;
exports.CONVERSIONS = CONVERSIONS;
exports.MAGNUS = MAGNUS;
exports.calculateDewPoint = calculateDewPoint;
exports.calculateFilmBuild = calculateFilmBuild;
exports.calculateLaborCost = calculateLaborCost;
exports.calculateMixRatio = calculateMixRatio;
exports.calculateMultiCoatSystem = calculateMultiCoatSystem;
exports.calculatePaintCoverage = calculatePaintCoverage;
exports.calculatePracticalCoverage = calculatePracticalCoverage;
exports.calculatePrimerNeeded = calculatePrimerNeeded;
exports.calculateProfileDepth = calculateProfileDepth;
exports.calculateROI = calculateROI;
exports.calculateSolventReduction = calculateSolventReduction;
exports.calculateSpreadingRate = calculateSpreadingRate;
exports.calculateSurfaceArea = calculateSurfaceArea;
exports.calculateVOC = calculateVOC;
exports.calculateWFT = calculateWFT;
exports.calculateWeatherWindow = calculateWeatherWindow;
exports.default = index;
exports.estimateProjectCost = estimateProjectCost;
//# sourceMappingURL=index.js.map
