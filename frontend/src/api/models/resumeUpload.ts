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

export interface Interview {
    summary: string;
    competencies: Competency[];
    id: number;
}

export interface InterviewUploadResponse {
    session_id: string;
    is_finished: boolean;
    interview: Interview;
}
