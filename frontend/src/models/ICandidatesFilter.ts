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

export interface ICandidatesFilter {
    nickname: string | null;
    grade: Grade | null;
    experience: number | null;
    competencies: string[] | null;
}

export const defaultCandidatesFilter: ICandidatesFilter = {
    nickname: null,
    grade: null,
    experience: null,
    competencies: null,
};
