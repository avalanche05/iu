import { Grade, WorkSchedule } from '@/models/IApplicationsFilter';
import { Folder } from './folders';

export interface Candidate {
    id: number;
    name: string;
    city: string;
    phone: string;
    email: string;
    contacts: string;
    skills: string[];
    experience: number;
    position: string;
    grade: Grade;
    speciality: string;
    education: string;
    summary: string;
    resume_link: string;
    work_schedule: WorkSchedule;
    is_cold: boolean;
    folders: Folder[];
}
