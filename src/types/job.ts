export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ProcessingJob {
  jobId: string;
  fileName: string;
  cpse: string;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  harmonizedRecords: number;
  status: JobStatus;
  progressPercent: number;
  currentStep: 'UPLOADING' | 'VALIDATING' | 'NORMALIZING' | 'EXTRACTING_ATTRIBUTES' | 'SEMANTIC_MATCHING' | 'STORING' | 'DONE';
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}
