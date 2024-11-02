export interface Folder {
    id: number;
    name: string;
    candidates_count: number;
}

export interface CreateFolderParams {
    name: string;
}

export interface AddCandidateToFolderParams {
    folderId: number;
    candidate_id: number;
}
