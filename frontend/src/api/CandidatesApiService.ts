import { API_URL } from '@/config';
import { Candidate, FetchCandidatesParams } from './models';
import { get } from './http';

class CandidatesApiService {
    public async fetchCandidate(params: FetchCandidatesParams) {
        return [
            {
                id: 1,
                nickname: 'John Doe',
                email: 'test@test.ru',
                github_url: 'https://github.com',
                grade: 'junior',
                experience_years: 1,
                summary: 'test',
                code_quality: 1,
                competencies: [
                    {
                        name: 'test',
                        proficiency: 0.5,
                    },
                    {
                        name: 'test 2',
                        proficiency: 0.7,
                    },
                    {
                        name: 'test 3',
                        proficiency: 0.9,
                    },
                ],
                technical_interview_result: {
                    id: 1,
                    summary: 'test',
                    competencies: [
                        {
                            name: 'test',
                            proficiency: 0.5,
                        },
                        {
                            name: 'test 2',
                            proficiency: 0.7,
                        },
                    ],
                },
                folders: [],
            },
        ] as Candidate[];

        const response = await get<Candidate[]>(`${API_URL}/api/v1/candidates`, {
            params,
        });

        return response;
    }
}

export default new CandidatesApiService();
