/**
 * TypeScript type definitions for paint calculators
 */
export interface CoverageInput {
    surfaceArea: number;
    coats: number;
    volumeSolids: number;
    targetDFT: number;
    transferEfficiency?: number;
    pricePerGallon?: number;
}
export interface CoverageResult {
    theoreticalCoverage: number;
    practicalCoverage: number;
    gallonsPerCoat: number;
    totalGallons: number;
    totalWithWaste: number;
    wasteFactorGallons: number;
    fiveGallonBuckets: number;
    oneGallonCans: number;
    estimatedCost: number;
    coveragePerGallon: number;
}
export interface CoatingLayer {
    volumeSolids: number;
    dft: number;
    coats: number;
    pricePerGallon?: number;
    productName?: string;
}
export interface MultiCoatInput {
    surfaceArea: number;
    system: {
        primer?: CoatingLayer;
        intermediate?: CoatingLayer;
        topcoat?: CoatingLayer;
    };
    transferEfficiency?: number;
}
export interface MultiCoatResult {
    layers: Record<string, CoverageResult & {
        totalDFT: number;
        cost: number;
    }>;
    summary: {
        totalDFT: number;
        totalCost: number;
        costPerSquareFoot: number;
        totalGallons: number;
        systemDescription: string;
    };
}
export interface DewPointInput {
    temperature: number;
    humidity: number;
}
export interface DewPointResult {
    dewPoint: number;
    minimumSurfaceTemp: number;
    currentMargin: number;
    isSafe: boolean;
    recommendation: string;
}
export interface VOCInput {
    coatingVolume: number;
    vocContent: number;
    area: number;
    ventilationRate?: number;
    ceilingHeight?: number;
}
export interface VOCResult {
    totalVOC: number;
    vocPerSqFt: number;
    regulatoryLimit: number;
    isCompliant: boolean;
    airChangesPerHour?: number;
    estimatedClearTime?: number;
    recommendations: string[];
}
export interface ProjectSurface {
    description: string;
    area: number;
    type: string;
    condition: string;
    height?: number;
    coatingSystem: MultiCoatInput["system"];
    transferEfficiency?: number;
}
export interface ProjectCostInput {
    surfaces: ProjectSurface[];
    laborRate: number;
    crewSize: number;
    overheadPercent: number;
    profitMargin: number;
}
export interface ProjectCostResult {
    breakdown: Array<{
        description: string;
        area: number;
        materialCost: number;
        laborHours: number;
        laborCost: number;
    }>;
    summary: {
        totalSurfaceArea: number;
        materialCost: number;
        laborCost: number;
        laborHours: number;
        directCosts: number;
        overhead: number;
        profit: number;
        total: number;
        pricePerSqFt: number;
    };
}
export interface ROIInput {
    currentSystem: {
        maintenanceCost: number;
        lifespan: number;
        heatTransfer?: number;
    };
    proposedSystem: {
        initialCost: number;
        maintenanceCost: number;
        lifespan: number;
        reflectivity?: number;
    };
    facilitySize: number;
    energyCosts?: number;
    discountRate?: number;
}
export interface ROIResult {
    currentSystem: {
        annualCost: number;
        tenYearCost: number;
    };
    proposedSystem: {
        initialCost: number;
        annualSavings: number;
        tenYearSavings: number;
    };
    roi: {
        paybackPeriod: number;
        tenYearROI: number;
        netPresentValue: number;
    };
}
export interface WFTInput {
    targetDFT: number;
    volumeSolids: number;
    reductionPercent?: number;
}
export interface WFTResult {
    wetFilmThickness: number;
    adjustedSolids: number;
    wetFilmGauge: string;
    applicationTips: string[];
}
export interface SurfaceAreaInput {
    shape: "rectangular" | "cylindrical" | "spherical" | "complex";
    dimensions: {
        length?: number;
        width?: number;
        height?: number;
        radius?: number;
        diameter?: number;
        [key: string]: number | undefined;
    };
    deductions?: Array<{
        width: number;
        height: number;
        quantity: number;
    }>;
}
export interface SurfaceAreaResult {
    grossArea: number;
    deductionArea: number;
    netArea: number;
    addWasteFactor: number;
    measurement: {
        squareFeet: number;
        squareMeters: number;
        squareYards: number;
    };
}
//# sourceMappingURL=types.d.ts.map