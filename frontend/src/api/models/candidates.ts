import { Grade } from '@/models/ICandidatesFilter';
import { Folder } from './folders';
import { Competency } from './competency';
import { Interview } from './interview';

export interface Candidate {
    id: number;
    nickname: string;
    email: string;
    github_url: string;
    grade: Grade;
    experience_years: number;
    summary: string;
    code_quality: number;
    competencies: Competency[];
    technical_interview_result: Interview;
    folders: Folder[];
}
