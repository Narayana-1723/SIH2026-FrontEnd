import { apiClient, IS_DEMO_MODE, simulateLatency } from './api';
import { HarmonizationResult, DuplicateGroup, HarmonizationMatchCandidate } from '../types/harmonization';
import { DEMO_MATERIALS, DEMO_CANONICAL_MATERIALS, DEMO_DUPLICATES } from '../data/demoData';

export const harmonizationService = {
  getHarmonizationMatches: async (materialId: string): Promise<HarmonizationResult> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(350);
      const material = DEMO_MATERIALS.find((m) => m.id === materialId) || DEMO_MATERIALS[0];

      // Build realistic candidates
      const candidates: HarmonizationMatchCandidate[] = [
        {
          canonicalMaterial: DEMO_CANONICAL_MATERIALS[0],
          scores: {
            semanticScore: 94,
            attributeScore: 100,
            lexicalScore: 89,
            finalConfidence: 95,
          },
          explanation: {
            matchedAttributes: [
              { key: 'Item Type', sourceValue: 'Hex Bolt', targetValue: 'Hex Bolt' },
              { key: 'Material', sourceValue: 'Stainless Steel', targetValue: 'Stainless Steel' },
              { key: 'Grade', sourceValue: 'SS316', targetValue: 'SS316' },
              { key: 'Diameter', sourceValue: 'M16', targetValue: 'M16' },
              { key: 'Length', sourceValue: '50 mm', targetValue: '50 mm' },
            ],
            unmatchedAttributes: [],
            appliedRules: [
              'Exact match on critical mechanical dimensions (M16 x 50mm)',
              'Material grade SS316 matches austenitic 316 standard',
              'High semantic cosine similarity (>0.92) across embeddings',
            ],
            notes: 'Strong candidate for automated reconciliation.',
          },
          recommendationLevel: 'HIGH_CONFIDENCE',
        },
        {
          canonicalMaterial: {
            ...DEMO_CANONICAL_MATERIALS[0],
            id: 'cm-alt-1',
            canonicalCode: 'CM-000189',
            standardName: 'Stainless Steel 304 Hex Bolt M16 × 50 mm',
          },
          scores: {
            semanticScore: 86,
            attributeScore: 80,
            lexicalScore: 84,
            finalConfidence: 82,
          },
          explanation: {
            matchedAttributes: [
              { key: 'Item Type', sourceValue: 'Hex Bolt', targetValue: 'Hex Bolt' },
              { key: 'Diameter', sourceValue: 'M16', targetValue: 'M16' },
              { key: 'Length', sourceValue: '50 mm', targetValue: '50 mm' },
            ],
            unmatchedAttributes: [
              { key: 'Material Grade', sourceValue: 'SS316', targetValue: 'SS304' },
            ],
            appliedRules: ['Grade mismatch: SS316 vs SS304 requires reviewer consent'],
          },
          recommendationLevel: 'MEDIUM_CONFIDENCE',
        },
      ];

      return {
        material,
        candidates,
        topMatch: candidates[0],
      };
    }

    // Spring Boot REST endpoint: GET /api/harmonization/{id}
    const response = await apiClient.get<HarmonizationResult>(`/harmonization/${materialId}`);
    return response.data;
  },

  getDuplicates: async (): Promise<DuplicateGroup[]> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(250);
      return DEMO_DUPLICATES;
    }

    // Spring Boot REST endpoint: GET /api/harmonization/duplicates
    const response = await apiClient.get<DuplicateGroup[]>('/harmonization/duplicates');
    return response.data;
  },

  triggerMatch: async (materialId: string): Promise<HarmonizationResult> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(500);
      return harmonizationService.getHarmonizationMatches(materialId);
    }

    // Spring Boot REST endpoint: POST /api/harmonization/match
    const response = await apiClient.post<HarmonizationResult>('/harmonization/match', {
      materialId,
    });
    return response.data;
  },
};
