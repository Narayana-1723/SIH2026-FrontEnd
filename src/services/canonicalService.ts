import { apiClient, IS_DEMO_MODE, simulateLatency } from './api';
import { CanonicalMaterial } from '../types/canonical';
import { DEMO_CANONICAL_MATERIALS } from '../data/demoData';

let localCanonicals: CanonicalMaterial[] = [...DEMO_CANONICAL_MATERIALS];

export const canonicalService = {
  getCanonicalMaterials: async (search?: string, category?: string): Promise<CanonicalMaterial[]> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(200);
      let list = [...localCanonicals];
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (c) =>
            c.canonicalCode.toLowerCase().includes(q) ||
            c.standardName.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        );
      }
      if (category && category !== 'ALL') {
        list = list.filter((c) => c.category === category);
      }
      return list;
    }

    // Spring Boot REST endpoint: GET /api/canonical-materials
    const response = await apiClient.get<CanonicalMaterial[]>('/canonical-materials', {
      params: { search, category },
    });
    return response.data;
  },

  getCanonicalById: async (id: string): Promise<CanonicalMaterial> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(150);
      const found = localCanonicals.find((c) => c.id === id || c.canonicalCode === id);
      if (!found) throw new Error(`Canonical material ${id} not found.`);
      return found;
    }

    // Spring Boot REST endpoint: GET /api/canonical-materials/{id}
    const response = await apiClient.get<CanonicalMaterial>(`/canonical-materials/${id}`);
    return response.data;
  },

  createCanonical: async (data: Partial<CanonicalMaterial>): Promise<CanonicalMaterial> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(300);
      const newCm: CanonicalMaterial = {
        id: `cm-${Date.now().toString().slice(-4)}`,
        canonicalCode: `CM-000${Math.floor(Math.random() * 900) + 100}`,
        standardName: data.standardName || 'Standard Material',
        description: data.description || '',
        category: data.category || 'Mechanical',
        categoryPath: data.categoryPath || ['Mechanical'],
        unspscCode: data.unspscCode,
        standardAttributes: data.standardAttributes || {},
        sourceMaterials: [],
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localCanonicals.unshift(newCm);
      return newCm;
    }

    // Spring Boot REST endpoint: POST /api/canonical-materials
    const response = await apiClient.post<CanonicalMaterial>('/canonical-materials', data);
    return response.data;
  },
};
