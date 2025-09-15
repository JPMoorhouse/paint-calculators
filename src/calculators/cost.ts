/**
 * Cost Estimation Calculators
 */

import { ProjectCostInput, ProjectCostResult, ROIInput, ROIResult } from '../types';
import { calculateMultiCoatSystem } from './coverage';
// import { CONSTANTS } from '../constants';

/**
 * Estimate total project cost
 * @param input - Project surfaces and labor parameters
 * @returns Detailed cost breakdown
 */
export function estimateProjectCost(input: ProjectCostInput): ProjectCostResult {
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
export function calculateROI(input: ROIInput): ROIResult {
  const {
    currentSystem,
    proposedSystem,
    facilitySize,
    energyCosts = 0.12,
    discountRate = 0.05
  } = input;

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
export function calculateLaborCost(
  area: number,
  laborRate: number,
  productionRate: number = 150
): number {
  const hours = area / productionRate;
  return Math.round(hours * laborRate * 100) / 100;
}

// Helper functions

function getProductionRate(surfaceType: string, condition: string): number {
  // Simplified production rates (sq ft per hour)
  const rates: Record<string, Record<string, number>> = {
    walls: { good: 200, fair: 150, poor: 100 },
    ceilings: { good: 150, fair: 120, poor: 80 },
    floors: { good: 250, fair: 200, poor: 150 },
    trim: { good: 50, fair: 40, poor: 30 }
  };

  return rates[surfaceType]?.[condition] || 150;
}

function calculateNPV(
  annualCashFlow: number,
  initialInvestment: number,
  years: number,
  discountRate: number
): number {
  let npv = -initialInvestment;

  for (let year = 1; year <= years; year++) {
    npv += annualCashFlow / Math.pow(1 + discountRate, year);
  }

  return npv;
}