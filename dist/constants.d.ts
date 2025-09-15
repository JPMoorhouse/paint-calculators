/**
 * Constants used in painting calculations
 */
export declare const CONSTANTS: {
    COVERAGE_CONSTANT: number;
    MIN_TEMP: number;
    MAX_TEMP: number;
    MAX_HUMIDITY: number;
    DEW_POINT_MARGIN: number;
    MAX_WIND_SPEED: number;
    TRANSFER_EFFICIENCY: {
        AIRLESS: number;
        AIR_SPRAY: number;
        HVLP: number;
        BRUSH_ROLL: number;
        ELECTROSTATIC: number;
    };
    PRODUCTION_RATES: {
        SPRAY: {
            WALLS: number;
            CEILINGS: number;
            TRIM: number;
            DOORS: number;
        };
        BRUSH_ROLL: {
            WALLS: number;
            CEILINGS: number;
            TRIM: number;
            DOORS: number;
        };
    };
    VOC_LIMITS: {
        FLAT: number;
        NON_FLAT: number;
        PRIMER: number;
        FLOOR: number;
        INDUSTRIAL: number;
    };
    SURFACE_PROFILE: {
        THIN_FILM: {
            MIN: number;
            MAX: number;
        };
        MEDIUM_FILM: {
            MIN: number;
            MAX: number;
        };
        THICK_FILM: {
            MIN: number;
            MAX: number;
        };
    };
    WASTE_FACTORS: {
        RESIDENTIAL: number;
        COMMERCIAL: number;
        INDUSTRIAL: number;
        PRECISION: number;
    };
    COATING_LIFESPAN: {
        ACRYLIC: number;
        EPOXY: number;
        POLYURETHANE: number;
        FLUOROPOLYMER: number;
        SILOXANE: number;
    };
};
export declare const MAGNUS: {
    A: number;
    B: number;
};
export declare const CONVERSIONS: {
    SQ_FT_TO_SQ_M: number;
    SQ_FT_TO_SQ_YD: number;
    GALLON_TO_LITER: number;
    MIL_TO_MICRON: number;
    PSI_TO_BAR: number;
};
//# sourceMappingURL=constants.d.ts.map