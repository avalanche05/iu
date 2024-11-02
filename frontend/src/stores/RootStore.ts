import ApplicationsApiService from '@/api/ApplicationsApiService';
import FoldersApiService from '@/api/FoldersApiService';
import {
    Application,
    ApplicationStatus,
    Candidate,
    CreateVacancyParams,
    FetchVacancyParams,
    Folder,
    Vacancy,
} from '@/api/models';
import VacanciesApiService from '@/api/VacanciesApiService';
import { CandidateToCompare } from '@/models/CandidateToCompare';
import { defaultApplicationsFilter, IApplicationsFilter } from '@/models/IApplicationsFilter';
import { defauldVacanciesFilter, IVacanciesFilter } from '@/models/IVacanciesFilter';
import { makeAutoObservable } from 'mobx';

export class RootStore {
    applications: Application[] = [];
    isApplicationsLoading = false;
    applicationsFilter: IApplicationsFilter = defaultApplicationsFilter;
    filteredApplications: Application[] = [];
    useRanking: boolean = false;

    vacancyColdCandidates: Candidate[] = [];
    isVacancyColdCandidatesLoading = false;
    filteredVacancyColdCandidates: Candidate[] = [];

    folders: Folder[] = [];
    isFoldersLoading = false;
    activeFolderId: number | null = null;

    vacancies: Vacancy[] = [];
    isVacanciesLoading = false;
    vacanciesFilter: IVacanciesFilter = defauldVacanciesFilter;

    candidatesToCompare: CandidateToCompare[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setApplicationFilter(filter: IApplicationsFilter) {
        this.applicationsFilter = filter;

        this.filterApplications();

        this.filterColdCandidates();
    }

    setVacanciesFilter(filter: IVacanciesFilter) {
        this.vacanciesFilter = filter;

        this.fetchVacancies(filter);
    }

    setUseRanking(value: boolean) {
        this.useRanking = value;
    }

    async filterApplications() {
        this.filteredApplications = this.applications;

        if (this.applicationsFilter.vacancyId && this.useRanking) {
            await this.fetchApplications(this.applicationsFilter.vacancyId, this.useRanking);
        } else {
            await this.fetchApplications();
        }

        if (this.applicationsFilter.name) {
            this.filterApplicationsByCandidateProperty('name', 'name');
        }

        if (this.applicationsFilter.city) {
            this.filterApplicationsByCandidateProperty('city', 'city');
        }

        if (this.applicationsFilter.position) {
            this.filterApplicationsByCandidateProperty('position', 'position');
        }

        if (this.applicationsFilter.speciality) {
            this.filterApplicationsByCandidateProperty('speciality', 'speciality');
        }

        if (this.applicationsFilter.grade) {
            this.filterApplicationsByCandidateProperty('grade', 'grade');
        }

        if (this.applicationsFilter.experience) {
            this.filterApplicationsByCandidateProperty('experience', 'experience');
        }

        if (this.applicationsFilter.workSchedule) {
            this.filterApplicationsByCandidateProperty('work_schedule', 'workSchedule');
        }

        if (this.applicationsFilter.applicationStatus) {
            this.filterApplicationsByApplicationProperty('status', 'applicationStatus');
        }

        if (this.applicationsFilter.vacancyId) {
            this.filterApplicationsByVacancy(this.applicationsFilter.vacancyId);
        }

        if (this.activeFolderId) {
            this.filterApplicationsByFolder(this.activeFolderId);
        }
    }

    filterColdCandidates() {
        this.filteredVacancyColdCandidates = this.vacancyColdCandidates;

        if (this.applicationsFilter.name) {
            this.filterCandidatesByProperty('name', 'name');
        }

        if (this.applicationsFilter.city) {
            this.filterCandidatesByProperty('city', 'city');
        }

        if (this.applicationsFilter.position) {
            this.filterCandidatesByProperty('position', 'position');
        }

        if (this.applicationsFilter.speciality) {
            this.filterCandidatesByProperty('speciality', 'speciality');
        }

        if (this.applicationsFilter.grade) {
            this.filterCandidatesByProperty('grade', 'grade');
        }

        if (this.applicationsFilter.experience) {
            this.filterCandidatesByProperty('experience', 'experience');
        }

        if (this.applicationsFilter.workSchedule) {
            this.filterCandidatesByProperty('work_schedule', 'workSchedule');
        }
    }

    filterApplicationsByCandidateProperty(
        propertyName: keyof Candidate,
        filterName: keyof IApplicationsFilter
    ) {
        this.filteredApplications = this.filteredApplications.filter((application) => {
            if (application.candidate[propertyName] === null) {
                return false;
            }

            return application.candidate[propertyName]
                .toString()
                .toLowerCase()
                .includes(this.applicationsFilter[filterName]!.toString().toLowerCase());
        });
    }

    filterApplicationsByApplicationProperty(
        propertyName: keyof Application,
        filterName: keyof IApplicationsFilter
    ) {
        this.filteredApplications = this.filteredApplications.filter((application) => {
            return application[propertyName]
                .toString()
                .toLowerCase()
                .includes(this.applicationsFilter[filterName]!.toString().toLowerCase());
        });
    }

    filterApplicationsByFolder(folderId: number) {
        this.filteredApplications = this.filteredApplications.filter((application) => {
            return application.candidate.folders.some((folder) => folder.id === folderId);
        });
    }

    filterApplicationsByVacancy(vacancyId: number) {
        this.filteredApplications = this.filteredApplications.filter(
            (application) => application.vacancy.id === vacancyId
        );
    }

    filterCandidatesByProperty(
        propertyName: keyof Candidate,
        filterName: keyof IApplicationsFilter
    ) {
        this.filteredVacancyColdCandidates = this.filteredVacancyColdCandidates.filter(
            (candidate) => {
                if (candidate[propertyName] === null) {
                    return false;
                }

                return candidate[propertyName]
                    .toString()
                    .toLowerCase()
                    .includes(this.applicationsFilter[filterName]!.toString().toLowerCase());
            }
        );
    }

    setActiveFolderId(folderId: number | null) {
        this.activeFolderId = folderId;

        this.filterApplications();
    }

    addCandidateToCompare(candidate: Candidate, hasApplication: boolean) {
        if (this.candidatesToCompare.length >= 3) {
            this.candidatesToCompare.shift();
        }

        this.candidatesToCompare.push({ id: candidate.id, candidate, hasApplication });
    }

    removeCandidateToCompare(candidateId: number) {
        this.candidatesToCompare = this.candidatesToCompare.filter(
            (candidate) => candidate.id !== candidateId
        );
    }

    async fetchApplications(vacancyId?: number, is_ranked?: boolean) {
        this.isApplicationsLoading = true;

        return ApplicationsApiService.fetchApplications({ vacancyId, is_ranked })
            .then((applications) => {
                this.applications = applications;
                this.filteredApplications = applications;

                return applications;
            })
            .finally(() => {
                this.isApplicationsLoading = false;
            });
    }

    async fetchVacancyColdCandidates(vacancyId: number) {
        this.isVacancyColdCandidatesLoading = true;

        return VacanciesApiService.fetchVacancyColdCandidates({ vacancyId })
            .then((candidates) => {
                this.vacancyColdCandidates = candidates;

                this.filterColdCandidates();

                return candidates;
            })
            .finally(() => {
                this.isVacancyColdCandidatesLoading = false;
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

    async changeApplicationStatus(applicationId: number, status: ApplicationStatus) {
        return ApplicationsApiService.changeApplicationStatus({ applicationId, status }).then(
            () => {
                this.fetchApplications();
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

    async createApplication(candidateId: number, vacancyId: number) {
        return ApplicationsApiService.createApplicatioin({
            candidate_id: candidateId,
            vacancy_id: vacancyId,
        }).then(() => {
            this.fetchApplications();
        });
    }
}
