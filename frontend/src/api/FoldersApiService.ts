import { API_URL } from '@/config';
import { AddCandidateToFolderParams, CreateFolderParams, Folder } from './models';
import { get, post } from './http';

class FoldersApiService {
    public async fetchFolders() {
        const response = await get<Folder[]>(`${API_URL}/api/v1/folders`);

        return response;
    }

    public async createFolder({ name }: CreateFolderParams) {
        const response = await post<Folder>(`${API_URL}/api/v1/folders`, { name });

        return response;
    }

    public async addCandidateToFolder({ folderId, ...params }: AddCandidateToFolderParams) {
        await post(`${API_URL}/api/v1/folders/${folderId}`, params);
    }
}

export default new FoldersApiService();
