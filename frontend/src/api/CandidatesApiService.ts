import { API_URL } from '@/config';
import { Candidate, FetchCandidatesParams } from './models';
import { get } from './http';

class CandidatesApiService {
    public async fetchCandidate(params: FetchCandidatesParams) {
        const response = await get<Candidate[]>(`${API_URL}/api/v1/candidates`, {
            params,
        });

        return response;
    }
}

export default new CandidatesApiService();
