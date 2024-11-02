import { ApplicationStatus } from '@/api/models';

export enum Grade {
    Junior = 'junior',
    Middle = 'middle',
    Senior = 'senior',
}

export const GradeLabels: Record<Grade, string> = {
    [Grade.Junior]: 'Джуниор',
    [Grade.Middle]: 'Миддл',
    [Grade.Senior]: 'Синьйор',
};

export enum WorkSchedule {
    FullDay = 'online',
    PartDay = 'offline',
    Remote = 'hybrid',
}

export const WorkScheduleLabels: Record<WorkSchedule, string> = {
    [WorkSchedule.FullDay]: 'Полный день',
    [WorkSchedule.PartDay]: 'Неполный день',
    [WorkSchedule.Remote]: 'Удаленка',
};

export interface IApplicationsFilter {
    name: string | null;
    city: string | null;
    position: string | null;
    speciality: string | null;
    grade: Grade | null;
    experience: string | null;
    workSchedule: WorkSchedule | null;
    applicationStatus: ApplicationStatus | null;
    vacancyId: number | null;
}

export const defaultApplicationsFilter: IApplicationsFilter = {
    name: null,
    city: null,
    position: null,
    speciality: null,
    grade: null,
    experience: null,
    workSchedule: null,
    applicationStatus: null,
    vacancyId: null,
};
