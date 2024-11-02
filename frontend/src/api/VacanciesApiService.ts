import { API_URL } from '@/config';
import { CreateVacancyParams, FetchVacancyParams, Vacancy } from './models';
import { get, post } from './http';

// interface Vacancy {
//     id: number;
//     title: string;
//     description: string;
//     grade: Grade;
//     competencies: Competency[];
// }

// interface Competency {
//     name: string;
//     proficiency: number;
// }

class VacanciesApiService {
    public async createVacancy(params: CreateVacancyParams) {
        const response = await post(`${API_URL}/api/v1/vacancies`, params);

        return response;
    }

    public async fetchVacancies(params: FetchVacancyParams) {
        return [
            {
                id: 1,
                title: 'title',
                description: 'description',
                grade: 'junior',
                competencies: [
                    {
                        name: 'name',
                        proficiency: 1,
                    },
                ],
            },
        ];

        const response = await get<Vacancy[]>(`${API_URL}/api/v1/vacancies`, { params });

        return response;
    }
}

export default new VacanciesApiService();
