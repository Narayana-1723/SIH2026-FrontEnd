import { Material } from './material';
import { CanonicalMaterial } from './canonical';

export interface ScoreBreakdown {
  semanticScore: number; // 0 - 100
  attributeScore: number; // 0 - 100
  lexicalScore: number;   // 0 - 100
  finalConfidence: number;// 0 - 100
}

export interface MatchExplanation {
  matchedAttributes: Array<{
    key: string;
    sourceValue: string;
    targetValue: string;
  }>;
  unmatchedAttributes: Array<{
    key: string;
    sourceValue?: string;
    targetValue?: string;
  }>;
  appliedRules: string[];
  notes?: string;
}

export interface HarmonizationMatchCandidate {
  canonicalMaterial: CanonicalMaterial;
  scores: ScoreBreakdown;
  explanation: MatchExplanation;
  recommendationLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';
}

export interface HarmonizationResult {
  material: Material;
  candidates: HarmonizationMatchCandidate[];
  topMatch?: HarmonizationMatchCandidate;
}

export interface DuplicateGroup {
  id: string;
  canonicalCandidateCode?: string;
  canonicalCandidateName?: string;
  confidence: number;
  itemType: string;
  materials: Array<{
    cpse: string;
    materialCode: string;
    description: string;
    attributes: Record<string, string>;
  }>;
}
