/**
 * Constants used in painting calculations
 */

export const CONSTANTS = {
  // Coverage calculation constant
  COVERAGE_CONSTANT: 1604, // sq ft per gallon at 1 mil DFT at 100% solids

  // Environmental limits
  MIN_TEMP: 50,           // Minimum painting temperature (°F)
  MAX_TEMP: 100,          // Maximum painting temperature (°F)
  MAX_HUMIDITY: 85,       // Maximum relative humidity (%)
  DEW_POINT_MARGIN: 5,    // Required margin above dew point (°F)
  MAX_WIND_SPEED: 15,     // Maximum wind speed (mph)

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
    RESIDENTIAL: 0.10,    // 10%
    COMMERCIAL: 0.15,     // 15%
    INDUSTRIAL: 0.20,     // 20%
    PRECISION: 0.05      // 5%
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
export const MAGNUS = {
  A: 17.27,
  B: 237.7
};

// Conversion factors
export const CONVERSIONS = {
  SQ_FT_TO_SQ_M: 0.092903,
  SQ_FT_TO_SQ_YD: 0.111111,
  GALLON_TO_LITER: 3.78541,
  MIL_TO_MICRON: 25.4,
  PSI_TO_BAR: 0.0689476
};