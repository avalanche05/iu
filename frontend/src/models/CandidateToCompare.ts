import { Candidate } from '@/api/models';

export interface CandidateToCompare {
    id: number;
    candidate: Candidate;
    hasApplication: boolean;
}
