import { apiClient, IS_DEMO_MODE, simulateLatency } from './api';
import { ProcessingJob } from '../types/job';

// In-memory job tracker for demo simulation
const demoJobs: Map<string, ProcessingJob> = new Map();

export const uploadService = {
  uploadFile: async (file: File, cpse: string): Promise<{ jobId: string; message: string }> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(500);
      const jobId = `JOB-${Date.now().toString().slice(-6)}`;
      const totalRecords = Math.floor(Math.random() * 500) + 150;

      const job: ProcessingJob = {
        jobId,
        fileName: file.name,
        cpse,
        totalRecords,
        processedRecords: 0,
        failedRecords: 0,
        harmonizedRecords: 0,
        status: 'QUEUED',
        progressPercent: 5,
        currentStep: 'UPLOADING',
        startedAt: new Date().toISOString(),
      };

      demoJobs.set(jobId, job);
      return { jobId, message: 'File accepted for processing job' };
    }

    // Spring Boot REST endpoint: POST /api/materials/upload (multipart/form-data)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('cpse', cpse);

    const response = await apiClient.post<{ jobId: string; message: string }>(
      '/materials/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getJobStatus: async (jobId: string): Promise<ProcessingJob> => {
    if (IS_DEMO_MODE) {
      await simulateLatency(150);
      let job = demoJobs.get(jobId);
      if (!job) {
        // Create an active job if not found
        job = {
          jobId,
          fileName: 'material_procurement_data.csv',
          cpse: 'ONGC',
          totalRecords: 280,
          processedRecords: 140,
          failedRecords: 2,
          harmonizedRecords: 120,
          status: 'PROCESSING',
          progressPercent: 50,
          currentStep: 'SEMANTIC_MATCHING',
          startedAt: new Date().toISOString(),
        };
        demoJobs.set(jobId, job);
      }

      // Simulate step progression on polling
      if (job.status === 'QUEUED') {
        job.status = 'PROCESSING';
        job.currentStep = 'VALIDATING';
        job.progressPercent = 20;
      } else if (job.status === 'PROCESSING') {
        if (job.progressPercent < 40) {
          job.currentStep = 'NORMALIZING';
          job.progressPercent = 45;
          job.processedRecords = Math.floor(job.totalRecords * 0.45);
        } else if (job.progressPercent < 75) {
          job.currentStep = 'EXTRACTING_ATTRIBUTES';
          job.progressPercent = 75;
          job.processedRecords = Math.floor(job.totalRecords * 0.75);
        } else if (job.progressPercent < 95) {
          job.currentStep = 'SEMANTIC_MATCHING';
          job.progressPercent = 95;
          job.processedRecords = Math.floor(job.totalRecords * 0.95);
        } else {
          job.status = 'COMPLETED';
          job.currentStep = 'DONE';
          job.progressPercent = 100;
          job.processedRecords = job.totalRecords;
          job.harmonizedRecords = Math.floor(job.totalRecords * 0.88);
          job.failedRecords = Math.floor(job.totalRecords * 0.02);
          job.completedAt = new Date().toISOString();
        }
      }

      return { ...job };
    }

    // Spring Boot REST endpoint: GET /api/jobs/{jobId}
    const response = await apiClient.get<ProcessingJob>(`/jobs/${jobId}`);
    return response.data;
  },
};
