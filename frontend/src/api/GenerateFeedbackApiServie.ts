import { get } from './http';
import { Feedback, GenerateFeedbackParams } from './models/generateFeedback';

class GenerateFeedbackApiService {
    public async fetchApproveFeedback({ candidateId, vacancyId }: GenerateFeedbackParams) {
        const response = await get<Feedback>(
            `/api/v1/generate/feedback/approve/vacancies/${vacancyId}/candidates/${candidateId}`
        );

        return response;
    }

    public async fetchRejectFeedback({ candidateId, vacancyId }: GenerateFeedbackParams) {
        const response = await get<Feedback>(
            `/api/v1/generate/feedback/reject/vacancies/${vacancyId}/candidates/${candidateId}`
        );

        return response;
    }

    public async fetchInviteFeedback({ candidateId, vacancyId }: GenerateFeedbackParams) {
        const response = await get<Feedback>(
            `/api/v1/generate/feedback/invite/vacancies/${vacancyId}/candidates/${candidateId}`
        );

        return response;
    }
}

export default new GenerateFeedbackApiService();
