import { get, post } from './http';
import { InterviewUploadResponse, ResumeUploadResponse } from './models';

class ResumeUploadApiService {
    public async uploadFiles(files: File[]): Promise<ResumeUploadResponse> {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await post<ResumeUploadResponse>(`/api/v1/resumes`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 510000,
        });

        return response;
    }

    public async fetchUploadStatus(sessionId: string): Promise<ResumeUploadResponse> {
        const response = await get<ResumeUploadResponse>(`/api/v1/resumes/${sessionId}`);

        return response;
    }

    public async uploadInterview(
        file: File,
        candidateId: number
    ): Promise<InterviewUploadResponse> {
        const formData = new FormData();

        formData.append('file', file);

        const response = await post<InterviewUploadResponse>(`/api/v1/resumes/voice`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 510000,
            params: {
                candidate_id: candidateId,
            },
        });

        return response;
    }

    public async fetchInterviewStatus(
        sessionId: string,
        candidateId: number
    ): Promise<InterviewUploadResponse> {
        const response = await get<InterviewUploadResponse>(`/api/v1/resumes/voice/${sessionId}`, {
            params: {
                candidate_id: candidateId,
            },
        });

        return response;
    }
}

export default new ResumeUploadApiService();
