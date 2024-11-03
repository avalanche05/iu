import { Grade } from '@/models/ICandidatesFilter';
import { Competency } from './competency';
import { Candidate } from './candidates';

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

export interface FetchVacancyDetailsParams {
    vacancyId: number;
}

export interface IVacancyDetails extends Vacancy {
    candidates: (Candidate & {
        compliance_percent: number;
    })[];
}
