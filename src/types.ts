/**
 * TypeScript type definitions for paint calculators
 */

// Coverage Calculator Types
export interface CoverageInput {
  surfaceArea: number;        // Square feet
  coats: number;              // Number of coats
  volumeSolids: number;       // Percentage (0-100)
  targetDFT: number;          // Mils per coat
  transferEfficiency?: number; // Percentage (0-100), default 65
  pricePerGallon?: number;    // Optional price for cost calculation
}

export interface CoverageResult {
  theoreticalCoverage: number;  // sq ft/gallon theoretical
  practicalCoverage: number;     // sq ft/gallon practical
  gallonsPerCoat: number;        // Gallons needed per coat
  totalGallons: number;          // Total gallons for all coats
  totalWithWaste: number;        // Total including waste factor
  wasteFactorGallons: number;    // Waste amount
  fiveGallonBuckets: number;     // Number of 5-gallon buckets
  oneGallonCans: number;         // Number of 1-gallon cans
  estimatedCost: number;         // Total cost estimate
  coveragePerGallon: number;     // Coverage rate
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
  layers: Record<string, CoverageResult & { totalDFT: number; cost: number }>;
  summary: {
    totalDFT: number;
    totalCost: number;
    costPerSquareFoot: number;
    totalGallons: number;
    systemDescription: string;
  };
}

// Environmental Calculator Types
export interface DewPointInput {
  temperature: number;    // Fahrenheit
  humidity: number;       // Percentage (0-100)
}

export interface DewPointResult {
  dewPoint: number;
  minimumSurfaceTemp: number;
  currentMargin: number;
  isSafe: boolean;
  recommendation: string;
}

export interface VOCInput {
  coatingVolume: number;    // Gallons
  vocContent: number;        // lbs/gallon
  area: number;             // Square feet
  ventilationRate?: number; // CFM
  ceilingHeight?: number;   // Feet
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

// Weather Calculator Types
export interface WeatherForecast {
  temperature?: { min: number; max: number };
  humidity?: number;
  windSpeed?: number;
  precipitation?: number;
  conditions?: string;
}

export interface WeatherWindowResult {
  isOptimal: boolean;
  recommendation: string;
  optimalConditions: {
    temperature: { min: number; max: number };
    humidity: { max: number };
    windSpeed: { max: number };
    precipitation: number;
  };
}

// Cost Calculator Types
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
  laborRate: number;         // $/hour
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

// Technical Calculator Types
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