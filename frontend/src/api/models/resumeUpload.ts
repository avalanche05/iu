import { Candidate } from './candidates';

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

export interface InterviewUploadResponse {
    session_id: string;
    is_finished: boolean;
    message: string;
}
