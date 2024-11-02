import { Grade } from '@/models/ICandidatesFilter';
import { Competency } from './competency';

export interface Vacancy {
    id: number;
    title: string;
    description: string;
    grade: Grade;
    competencies: Competency[];
}

export interface CreateVacancyParams {
    title: string;
    description: string;
    grade: Grade;
    competencies: Competency[];
}

export interface FetchVacancyParams {
    title?: string | null;
    grade?: Grade | null;
    competencies?: string | null;
}
