import { apiClient, IS_DEMO_MODE, simulateLatency } from './api';
import { ReviewItem, ReviewActionPayload, ReviewStatus } from '../types/review';
import { DEMO_REVIEW_ITEMS } from '../data/demoData';

let localReviews: ReviewItem[] = [...DEMO_REVIEW_ITEMS];

export const reviewService = {
  getPendingReviews: async (status?: ReviewStatus): Promise<ReviewItem[]> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(250);
      if (status) {
        return localReviews.filter((r) => r.status === status);
      }
      return localReviews;
    }

    // Spring Boot REST endpoint: GET /api/reviews
    const response = await apiClient.get<ReviewItem[]>('/reviews', {
      params: { status },
    });
    return response.data;
  },

  getReviewById: async (id: string): Promise<ReviewItem> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(150);
      const item = localReviews.find((r) => r.id === id);
      if (!item) throw new Error('Review item not found');
      return item;
    }

    // Spring Boot REST endpoint: GET /api/reviews/{id}
    const response = await apiClient.get<ReviewItem>(`/reviews/${id}`);
    return response.data;
  },

  approveMatch: async (id: string, comments: string): Promise<{ success: boolean; message: string }> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(300);
      const idx = localReviews.findIndex((r) => r.id === id);
      if (idx !== -1) {
        localReviews[idx] = {
          ...localReviews[idx],
          status: 'APPROVED',
          reviewerComments: comments,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Authorized Reviewer',
        };
      }
      return { success: true, message: 'Material match successfully approved and harmonized' };
    }

    // Spring Boot REST endpoint: POST /api/reviews/{id}/approve
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `/reviews/${id}/approve`,
      { comments }
    );
    return response.data;
  },

  rejectMatch: async (id: string, comments: string): Promise<{ success: boolean; message: string }> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(300);
      const idx = localReviews.findIndex((r) => r.id === id);
      if (idx !== -1) {
        localReviews[idx] = {
          ...localReviews[idx],
          status: 'REJECTED',
          reviewerComments: comments,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Authorized Reviewer',
        };
      }
      return { success: true, message: 'Match candidate rejected and returned to unmapped pool' };
    }

    // Spring Boot REST endpoint: POST /api/reviews/{id}/reject
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `/reviews/${id}/reject`,
      { comments }
    );
    return response.data;
  },

  modifyMatch: async (
    id: string,
    payload: ReviewActionPayload
  ): Promise<{ success: boolean; message: string }> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(350);
      const idx = localReviews.findIndex((r) => r.id === id);
      if (idx !== -1) {
        localReviews[idx] = {
          ...localReviews[idx],
          status: 'MODIFIED',
          reviewerComments: payload.comments,
          modifiedAttributes: payload.modifiedAttributes,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Authorized Reviewer',
        };
      }
      return { success: true, message: 'Material match attributes updated and approved' };
    }

    // Spring Boot REST endpoint: POST /api/reviews/{id}/modify
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `/reviews/${id}/modify`,
      payload
    );
    return response.data;
  },
};
