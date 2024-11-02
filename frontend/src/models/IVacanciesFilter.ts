import { Grade, WorkSchedule } from './IApplicationsFilter';

export interface IVacanciesFilter {
    position?: string | null;
    grade?: Grade | null;
    speciality?: string | null;
    city?: string | null;
    work_format?: WorkSchedule | null;
    skills?: string | null;
}

export const defauldVacanciesFilter = {
    position: null,
    grade: null,
    speciality: null,
    city: null,
    work_format: null,
    skills: null,
};
