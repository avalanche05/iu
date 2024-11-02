import { API_URL } from '@/config';
import { CreateVacancyParams, FetchVacancyParams, Vacancy } from './models';
import { get, post } from './http';

class VacanciesApiService {
    public async createVacancy(params: CreateVacancyParams) {
        const response = await post(`${API_URL}/api/v1/vacancies`, params);

        return response;
    }

    public async fetchVacancies(params: FetchVacancyParams) {
        const response = await get<Vacancy[]>(`${API_URL}/api/v1/vacancies`, { params });

        return response;
    }
}

export default new VacanciesApiService();
