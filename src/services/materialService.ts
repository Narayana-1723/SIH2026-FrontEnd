import { apiClient, IS_DEMO_MODE, simulateLatency } from './api';
import { Material, MaterialFilterParams, PaginatedResponse } from '../types/material';
import { DEMO_MATERIALS } from '../data/demoData';

export const materialService = {
  getMaterials: async (params?: MaterialFilterParams): Promise<PaginatedResponse<Material>> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(300);
      let list = [...DEMO_MATERIALS];

      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (m) =>
            m.materialCode.toLowerCase().includes(q) ||
            m.originalDescription.toLowerCase().includes(q) ||
            m.normalizedDescription.toLowerCase().includes(q)
        );
      }

      if (params?.cpse && params.cpse !== 'ALL') {
        list = list.filter((m) => m.cpse === params.cpse);
      }

      if (params?.category && params.category !== 'ALL') {
        list = list.filter((m) => m.category === params.category);
      }

      if (params?.status && params.status !== 'ALL') {
        list = list.filter((m) => m.status === params.status);
      }

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / pageSize);
      const data = list.slice((page - 1) * pageSize, page * pageSize);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages,
      };
    }

    // Spring Boot REST endpoint: GET /api/materials
    const response = await apiClient.get<PaginatedResponse<Material>>('/materials', {
      params,
    });
    return response.data;
  },

  getMaterialById: async (id: string): Promise<Material> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(200);
      const found = DEMO_MATERIALS.find((m) => m.id === id || m.materialCode === id);
      if (!found) {
        throw new Error(`Material with ID ${id} not found.`);
      }
      return found;
    }

    // Spring Boot REST endpoint: GET /api/materials/{id}
    const response = await apiClient.get<Material>(`/materials/${id}`);
    return response.data;
  },

  searchMaterials: async (query: string): Promise<Material[]> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(200);
      const q = query.toLowerCase();
      return DEMO_MATERIALS.filter(
        (m) =>
          m.materialCode.toLowerCase().includes(q) ||
          m.originalDescription.toLowerCase().includes(q) ||
          m.normalizedDescription.toLowerCase().includes(q)
      );
    }

    // Spring Boot REST endpoint: GET /api/materials/search?q={query}
    const response = await apiClient.get<Material[]>('/materials/search', {
      params: { q: query },
    });
    return response.data;
  },
};
