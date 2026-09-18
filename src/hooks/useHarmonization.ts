import { useState, useCallback } from 'react';
import { harmonizationService } from '../services/harmonizationService';
import { HarmonizationResult, DuplicateGroup } from '../types/harmonization';

export const useHarmonization = () => {
  const [result, setResult] = useState<HarmonizationResult | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async (materialId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await harmonizationService.getHarmonizationMatches(materialId);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch harmonization matches');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDuplicates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await harmonizationService.getDuplicates();
      setDuplicates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load duplicate groups');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    result,
    duplicates,
    isLoading,
    error,
    fetchMatches,
    fetchDuplicates,
  };
};
