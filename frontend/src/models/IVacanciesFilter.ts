import { Grade } from './ICandidatesFilter';

export interface IVacanciesFilter {
    title?: string | null;
    grade?: Grade | null;
    competencies?: string | null;
}

export const defauldVacanciesFilter = {
    title: null,
    grade: null,
    competencies: null,
};
