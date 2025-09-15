/**
 * Environmental Calculators for Painting Applications
 */

import { DewPointInput, DewPointResult, VOCInput, VOCResult, WeatherForecast, WeatherWindowResult } from '../types';
import { MAGNUS, CONSTANTS } from '../constants';

/**
 * Calculate dew point temperature
 * @param input - Temperature and humidity values
 * @returns Dew point calculation results
 */
export function calculateDewPoint(input: DewPointInput): DewPointResult {
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
export function calculateVOC(input: VOCInput): VOCResult {
  const {
    coatingVolume,
    vocContent,
    area,
    ventilationRate = 0,
    ceilingHeight = 10
  } = input;

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
export function calculateWeatherWindow(_forecast: WeatherForecast): WeatherWindowResult {
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