# @moorhouse/paint-calculators

Professional-grade painting calculation tools for commercial and industrial applications. Built with TypeScript for type safety and accuracy.

## Installation

```bash
npm install @moorhouse/paint-calculators
```

## Features

- **Coverage Calculators** - Calculate paint requirements based on surface area and coating specifications
- **Environmental Calculators** - Dew point, VOC emissions, and weather window calculations
- **Cost Estimators** - Project cost estimation and ROI analysis
- **Technical Tools** - WFT/DFT calculations, surface area, mixing ratios, and more

## Quick Start

```typescript
import { calculatePaintCoverage, calculateDewPoint } from '@moorhouse/paint-calculators';

// Calculate paint coverage
const coverage = calculatePaintCoverage({
  surfaceArea: 1000,        // sq ft
  coats: 2,
  volumeSolids: 65,         // percentage
  targetDFT: 5,             // mils per coat
  transferEfficiency: 65,   // percentage
  pricePerGallon: 45
});

console.log(`Gallons needed: ${coverage.totalGallons}`);
console.log(`Estimated cost: $${coverage.estimatedCost}`);

// Check dew point conditions
const dewPoint = calculateDewPoint({
  temperature: 75,          // °F
  humidity: 65              // percentage
});

console.log(`Dew point: ${dewPoint.dewPoint}°F`);
console.log(`Safe to paint: ${dewPoint.isSafe}`);
```

## API Reference

### Coverage Calculators

#### `calculatePaintCoverage(input: CoverageInput): CoverageResult`

Calculate paint requirements for a given surface area.

```typescript
const result = calculatePaintCoverage({
  surfaceArea: 1000,        // Required: Square feet
  coats: 2,                 // Default: 1
  volumeSolids: 65,         // Required: Percentage (0-100)
  targetDFT: 5,             // Required: Mils per coat
  transferEfficiency: 65,   // Default: 65%
  pricePerGallon: 45        // Optional: For cost calculation
});
```

#### `calculateMultiCoatSystem(input: MultiCoatInput): MultiCoatResult`

Calculate requirements for multi-layer coating systems.

```typescript
const system = calculateMultiCoatSystem({
  surfaceArea: 1000,
  system: {
    primer: {
      volumeSolids: 75,
      dft: 3,
      coats: 1,
      pricePerGallon: 35
    },
    intermediate: {
      volumeSolids: 80,
      dft: 5,
      coats: 2,
      pricePerGallon: 40
    },
    topcoat: {
      volumeSolids: 65,
      dft: 2,
      coats: 2,
      pricePerGallon: 50
    }
  },
  transferEfficiency: 65
});
```

### Environmental Calculators

#### `calculateDewPoint(input: DewPointInput): DewPointResult`

Calculate dew point temperature and surface temperature requirements.

```typescript
const dewPoint = calculateDewPoint({
  temperature: 75,    // °F
  humidity: 65        // Percentage
});
```

#### `calculateVOC(input: VOCInput): VOCResult`

Calculate VOC emissions and regulatory compliance.

```typescript
const voc = calculateVOC({
  coatingVolume: 10,       // Gallons
  vocContent: 3.5,         // lbs/gallon
  area: 1000,              // Square feet
  ventilationRate: 1000,   // CFM (optional)
  ceilingHeight: 10        // Feet (optional)
});
```

### Cost Calculators

#### `estimateProjectCost(input: ProjectCostInput): ProjectCostResult`

Estimate total project costs including materials and labor.

```typescript
const estimate = estimateProjectCost({
  surfaces: [
    {
      description: "Warehouse Walls",
      area: 5000,
      type: "walls",
      condition: "fair",
      coatingSystem: {
        primer: { volumeSolids: 75, dft: 3, coats: 1 },
        topcoat: { volumeSolids: 65, dft: 3, coats: 2 }
      }
    }
  ],
  laborRate: 45,           // $/hour
  crewSize: 3,
  overheadPercent: 15,
  profitMargin: 20
});
```

#### `calculateROI(input: ROIInput): ROIResult`

Calculate return on investment for coating system upgrades.

```typescript
const roi = calculateROI({
  currentSystem: {
    maintenanceCost: 5000,
    lifespan: 5
  },
  proposedSystem: {
    initialCost: 15000,
    maintenanceCost: 2000,
    lifespan: 15,
    reflectivity: 85
  },
  facilitySize: 50000,
  energyCosts: 0.12
});
```

### Technical Calculators

#### `calculateWFT(input: WFTInput): WFTResult`

Calculate wet film thickness from dry film thickness.

```typescript
const wft = calculateWFT({
  targetDFT: 5,           // Mils
  volumeSolids: 65,       // Percentage
  reductionPercent: 10    // Optional: Thinning percentage
});
```

#### `calculateSurfaceArea(input: SurfaceAreaInput): SurfaceAreaResult`

Calculate surface area for various shapes.

```typescript
const area = calculateSurfaceArea({
  shape: "cylindrical",
  dimensions: {
    radius: 10,
    height: 20
  },
  deductions: [
    { width: 3, height: 7, quantity: 4 }  // Windows, doors, etc.
  ]
});
```

## Type Definitions

All functions are fully typed with TypeScript. Import types for better IDE support:

```typescript
import type {
  CoverageInput,
  CoverageResult,
  DewPointInput,
  DewPointResult,
  ProjectCostInput,
  ProjectCostResult
} from '@moorhouse/paint-calculators';
```

## Constants

Industry-standard constants are available for reference:

```typescript
import { CONSTANTS } from '@moorhouse/paint-calculators';

console.log(CONSTANTS.COVERAGE_CONSTANT);     // 1604
console.log(CONSTANTS.DEW_POINT_MARGIN);      // 5°F
console.log(CONSTANTS.TRANSFER_EFFICIENCY);   // Various application methods
```

## Use Cases

### Commercial Painting Contractors
- Accurate material estimation
- Multi-coat system planning
- Cost proposal generation
- ROI analysis for clients

### Facility Managers
- Maintenance planning
- Budget forecasting
- Coating system comparison
- Environmental compliance

### Paint Manufacturers
- Coverage rate calculations
- Technical data sheet generation
- Application recommendations

### Specification Writers
- System design
- Material quantification
- Performance calculations

## Contributing

We welcome contributions! Please see our [GitHub repository](https://github.com/moorhouse-coating/paint-calculators) for guidelines.

## Support

For technical support or questions:
- Email: tech@moorhousecoating.com
- Documentation: [docs.moorhousecoating.com](https://docs.moorhousecoating.com)
- Issues: [GitHub Issues](https://github.com/moorhouse-coating/paint-calculators/issues)

## License

MIT License - See LICENSE file for details

## Changelog

### 1.0.0 (January 2024)
- Initial release
- Coverage calculators
- Environmental calculators
- Cost estimators
- Technical calculators

---

Built with ❤️ by [Moorhouse Coating](https://moorhousecoating.com) - Professional Commercial Painting Since 1985