import { get } from './http';
import { Feedback, GenerateFeedbackParams } from './models/generateFeedback';

class GenerateFeedbackApiService {
    public async fetchApproveFeedback({ candidateId }: GenerateFeedbackParams) {
        const response = await get<Feedback>(
            `/api/v1/generate/feedback/approve/candidates/${candidateId}`
        );

        return response;
    }

    public async fetchRejectFeedback({ candidateId }: GenerateFeedbackParams) {
        const response = await get<Feedback>(
            `/api/v1/generate/feedback/reject/candidates/${candidateId}`
        );

        return response;
    }
}

export default new GenerateFeedbackApiService();
