import { API_URL } from '@/config';
import { get } from './http';

class CompetenciesApiService {
    public async fetchCompetencies() {
        const response = await get<string[]>(`${API_URL}/api/v1/competencies`);

        return response;
    }
}

export default new CompetenciesApiService();
