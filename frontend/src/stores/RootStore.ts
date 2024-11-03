import CandidatesApiService from '@/api/CandidatesApiService';
import CompenenciesApiService from '@/api/CompenenciesApiService';
import FoldersApiService from '@/api/FoldersApiService';
import {
    Candidate,
    CreateVacancyParams,
    FetchVacancyDetailsParams,
    FetchVacancyParams,
    Folder,
    Vacancy,
} from '@/api/models';
import VacanciesApiService from '@/api/VacanciesApiService';
import { CandidateToCompare } from '@/models/CandidateToCompare';
import { defaultCandidatesFilter, ICandidatesFilter } from '@/models/ICandidatesFilter';
import { defauldVacanciesFilter, IVacanciesFilter } from '@/models/IVacanciesFilter';
import { makeAutoObservable } from 'mobx';

export class RootStore {
    candidates: Candidate[] = [];
    isCandidatesLoading = false;
    candidatesFilter: ICandidatesFilter = defaultCandidatesFilter;

    folders: Folder[] = [];
    isFoldersLoading = false;
    activeFolderId: number | null = null;

    vacancies: Vacancy[] = [];
    isVacanciesLoading = false;
    vacanciesFilter: IVacanciesFilter = defauldVacanciesFilter;

    candidatesToCompare: CandidateToCompare[] = [];

    competencies: string[] = [];
    isCompetenciesLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setCandidatesFilter(filter: ICandidatesFilter) {
        this.candidatesFilter = filter;

        this.fetchCandidates();
    }

    setVacanciesFilter(filter: IVacanciesFilter) {
        this.vacanciesFilter = filter;

        this.fetchVacancies(filter);
    }

    setActiveFolderId(folderId: number | null) {
        this.activeFolderId = folderId;

        this.fetchCandidates();
    }

    addCandidateToCompare(candidate: Candidate) {
        if (this.candidatesToCompare.length >= 3) {
            this.candidatesToCompare.shift();
        }

        this.candidatesToCompare.push({ id: candidate.id, candidate });
    }

    removeCandidateToCompare(candidateId: number) {
        this.candidatesToCompare = this.candidatesToCompare.filter(
            (candidate) => candidate.id !== candidateId
        );
    }

    async fetchCandidates() {
        this.isCandidatesLoading = true;

        return CandidatesApiService.fetchCandidate({
            competencies: this.candidatesFilter.competencies?.join(','),
            folder_id: this.activeFolderId ?? undefined,
            grade: this.candidatesFilter.grade ?? undefined,
            nickname: this.candidatesFilter.nickname ?? undefined,
            experience: this.candidatesFilter.experience ?? undefined,
        })
            .then((candidates) => {
                this.candidates = candidates;

                return candidates;
            })
            .finally(() => {
                this.isCandidatesLoading = false;
            });
    }

    async fetchFolders() {
        this.isFoldersLoading = true;

        return FoldersApiService.fetchFolders()
            .then((folders) => {
                this.folders = folders;

                return folders;
            })
            .finally(() => {
                this.isFoldersLoading = false;
            });
    }

    async createFolder(name: string) {
        return FoldersApiService.createFolder({ name }).then((folder) => {
            this.folders.push(folder);

            return folder;
        });
    }

    async addCandidateToFolder(candidateId: number, folderId: number) {
        return FoldersApiService.addCandidateToFolder({ candidate_id: candidateId, folderId }).then(
            () => {
                const folder = this.folders.find((folder) => folder.id === folderId);

                if (folder) {
                    folder.candidates_count += 1;
                }
            }
        );
    }

    async createVacancy(params: CreateVacancyParams) {
        return VacanciesApiService.createVacancy(params).then(() => {
            this.fetchVacancies({});
        });
    }

    async fetchVacancies(params: FetchVacancyParams) {
        this.isVacanciesLoading = true;

        return VacanciesApiService.fetchVacancies(params)
            .then((vacancies) => {
                this.vacancies = vacancies;

                return vacancies;
            })
            .finally(() => {
                this.isVacanciesLoading = false;
            });
    }

    async fetchVacancyDetails({ vacancyId }: FetchVacancyDetailsParams) {
        return VacanciesApiService.fetchVacancyDetails({ vacancyId });
    }

    async fetchCompetencies() {
        this.isCompetenciesLoading = true;

        return CompenenciesApiService.fetchCompetencies()
            .then((competencies) => {
                this.competencies = competencies;

                return competencies;
            })
            .finally(() => {
                this.isCompetenciesLoading = false;
            });
    }
}
