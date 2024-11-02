import { API_URL } from '@/config';
import {
    Application,
    ChangeApplicationStatusParams,
    CreateApplicationParams,
    FetchApplicationsParams,
} from './models';
import { get, post } from './http';

class ApplicationsApiService {
    public async fetchApplications(params: FetchApplicationsParams) {
        const response = await get<Application[]>(`${API_URL}/api/v1/applications`, {
            params,
        });

        return response;
    }

    public async changeApplicationStatus({
        applicationId,
        ...params
    }: ChangeApplicationStatusParams) {
        await post(`${API_URL}/api/v1/applications/applications/${applicationId}/status`, params);
    }

    public async createApplicatioin(params: CreateApplicationParams) {
        const response = await post(`${API_URL}/api/v1/applications`, params);

        return response;
    }
}

export default new ApplicationsApiService();
