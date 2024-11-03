import { Candidate } from './candidates';
import { Competency } from './competency';

export interface ResumeUploadResponse {
    session_id: string;
    is_finished: boolean;
    processing: UploadFile[];
    success: UploadFile[];
    error: UploadFile[];
}

export interface UploadFile {
    file_name: string;
    message: string;
    candidate: Candidate;
}

interface VoiceInterview {
    summary: string;
    competencies: Competency[];
    id: number;
}

export interface InterviewUploadResponse {
    session_id: string;
    is_finished: boolean;
    interview: VoiceInterview;
}
