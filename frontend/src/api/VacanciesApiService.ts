import { API_URL } from '@/config';
import {
    CreateVacancyParams,
    FetchVacancyDetailsParams,
    FetchVacancyParams,
    Vacancy,
    IVacancyDetails,
} from './models';
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

    public async fetchVacancyDetails({ vacancyId }: FetchVacancyDetailsParams) {
        const response = await get<IVacancyDetails>(`${API_URL}/api/v1/vacancies/${vacancyId}`);

        return response;
    }
}

export default new VacanciesApiService();
