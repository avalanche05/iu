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
    metrics: {
        repos_count: number;
        created_at: string;
        followers_count: number;
        forks_count: number;
        avg_comments_count: number;
        avg_prs_close_time: number;
        avg_commits_per_pr_count: number;
    };
}

export interface FetchCandidatesParams {
    nickname?: string | null;
    grade?: Grade | null;
    experience?: number | null;
    competencies?: string | null;
    folder_id?: number | null;
}

export enum ApplicationStatus {
    Pending = 'pending',
    HrAccepted = 'hrAccepted',
    HrDeclined = 'hrDeclined',
    InterviewerAccepted = 'interviewerAccepted',
    InterviewerDeclined = 'interviewerDeclined',
    Offer = 'offer',
    CandidateAccepted = 'candidateAccepted',
    CandidateDeclined = 'candidateDeclined',
}

export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
    [ApplicationStatus.Pending]: 'Ожидает обработки',
    [ApplicationStatus.HrAccepted]: 'Принята рекрутером',
    [ApplicationStatus.HrDeclined]: 'Отклонена рекрутером',
    [ApplicationStatus.InterviewerAccepted]: 'Интервью пройдено успешно',
    [ApplicationStatus.InterviewerDeclined]: 'Интервью не пройдено',
    [ApplicationStatus.Offer]: 'Отправлен оффер',
    [ApplicationStatus.CandidateAccepted]: 'Принято кандидатом',
    [ApplicationStatus.CandidateDeclined]: 'Отклонено кандидатом',
};
