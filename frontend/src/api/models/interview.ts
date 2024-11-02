import { Competency } from './competency';

export interface Interview {
    id: number;
    summary: string;
    competencies: Competency[];
}
