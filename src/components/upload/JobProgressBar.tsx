import React from 'react';
import { ProcessingJob } from '../../types/job';
import { StatusBadge } from '../common/StatusBadge';
import { Check, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobProgressBarProps {
  job: ProcessingJob;
  onReset?: () => void;
}

export const JobProgressBar: React.FC<JobProgressBarProps> = ({ job, onReset }) => {
  const steps = [
    { key: 'VALIDATING', label: 'Schema Validation' },
    { key: 'NORMALIZING', label: 'Text Normalization' },
    { key: 'EXTRACTING_ATTRIBUTES', label: 'NER Extraction' },
    { key: 'SEMANTIC_MATCHING', label: 'Vector Matching' },
    { key: 'DONE', label: 'Completed' },
  ];

  const getStepStatus = (stepKey: string) => {
    const order = ['UPLOADING', 'VALIDATING', 'NORMALIZING', 'EXTRACTING_ATTRIBUTES', 'SEMANTIC_MATCHING', 'DONE'];
    const currentIndex = order.indexOf(job.currentStep);
    const stepIndex = order.indexOf(stepKey);

    if (job.status === 'COMPLETED') return 'completed';
    if (job.status === 'FAILED') return 'failed';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              {job.jobId}
            </span>
            <h3 className="text-base font-bold text-slate-900">{job.fileName}</h3>
            <StatusBadge status={job.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Assigned CPSE: <span className="font-semibold text-slate-700">{job.cpse}</span> &bull;
            Started: {new Date(job.startedAt).toLocaleTimeString()}
          </p>
        </div>

        {job.status === 'COMPLETED' && (
          <div className="flex items-center gap-2">
            <Link to="/user/materials" className="btn-primary text-xs">
              <span>View Ingested Materials</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
            {onReset && (
              <button onClick={onReset} className="btn-secondary text-xs">
                Upload Another File
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-slate-50 rounded border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Total Records</div>
          <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
            {job.totalRecords.toLocaleString()}
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Processed</div>
          <div className="text-lg font-bold text-blue-700 font-mono mt-0.5">
            {job.processedRecords.toLocaleString()}
          </div>
        </div>
        <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
          <div className="text-xs text-emerald-800 font-medium">Auto-Harmonized</div>
          <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">
            {job.harmonizedRecords.toLocaleString()}
          </div>
        </div>
        <div className="p-3 bg-red-50 rounded border border-red-200">
          <div className="text-xs text-red-800 font-medium">Errors / Failed</div>
          <div className="text-lg font-bold text-red-700 font-mono mt-0.5">{job.failedRecords}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
          <span>Overall Ingestion &amp; NLP Pipeline Progress</span>
          <span className="font-mono">{job.progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
          <div
            className={`h-full transition-all duration-500 ${
              job.status === 'COMPLETED'
                ? 'bg-emerald-600'
                : job.status === 'FAILED'
                ? 'bg-red-600'
                : 'bg-gov-navy'
            }`}
            style={{ width: `${job.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
        {steps.map((step) => {
          const st = getStepStatus(step.key);
          return (
            <div
              key={step.key}
              className={`p-2.5 rounded border text-xs flex items-center gap-2 ${
                st === 'completed'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : st === 'current'
                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              {st === 'completed' && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
              {st === 'current' && <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />}
              {st === 'pending' && <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0" />}
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
