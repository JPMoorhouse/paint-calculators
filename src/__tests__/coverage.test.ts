import { calculatePaintCoverage, calculateMultiCoatSystem } from '../calculators/coverage';

describe('Coverage Calculators', () => {
  describe('calculatePaintCoverage', () => {
    it('should calculate basic paint coverage correctly', () => {
      const result = calculatePaintCoverage({
        surfaceArea: 1000,
        coats: 2,
        volumeSolids: 65,
        targetDFT: 5,
        transferEfficiency: 65,
        pricePerGallon: 45
      });

      expect(result.theoreticalCoverage).toBeGreaterThan(0);
      expect(result.practicalCoverage).toBeGreaterThan(0);
      expect(result.totalGallons).toBeGreaterThan(0);
      expect(result.estimatedCost).toBeGreaterThan(0);
    });

    it('should throw error for invalid surface area', () => {
      expect(() => {
        calculatePaintCoverage({
          surfaceArea: 0,
          coats: 1,
          volumeSolids: 65,
          targetDFT: 5
        });
      }).toThrow('Surface area must be greater than 0');
    });

    it('should throw error for invalid volume solids', () => {
      expect(() => {
        calculatePaintCoverage({
          surfaceArea: 1000,
          coats: 1,
          volumeSolids: 150,
          targetDFT: 5
        });
      }).toThrow('Volume solids must be between 0 and 100');
    });
  });

  describe('calculateMultiCoatSystem', () => {
    it('should calculate multi-coat system correctly', () => {
      const result = calculateMultiCoatSystem({
        surfaceArea: 1000,
        system: {
          primer: {
            volumeSolids: 75,
            dft: 3,
            coats: 1,
            pricePerGallon: 35
          },
          topcoat: {
            volumeSolids: 65,
            dft: 3,
            coats: 2,
            pricePerGallon: 45
          }
        },
        transferEfficiency: 65
      });

      expect(result.summary.totalDFT).toBe(9); // 3 + 6
      expect(result.summary.totalGallons).toBeGreaterThan(0);
      expect(result.layers.primer).toBeDefined();
      expect(result.layers.topcoat).toBeDefined();
    });

    it('should handle system with only topcoat', () => {
      const result = calculateMultiCoatSystem({
        surfaceArea: 500,
        system: {
          topcoat: {
            volumeSolids: 65,
            dft: 5,
            coats: 2
          }
        }
      });

      expect(result.summary.totalDFT).toBe(10);
      expect(result.layers.topcoat).toBeDefined();
      expect(result.layers.primer).toBeUndefined();
    });
  });
});