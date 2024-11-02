import { Application, ApplicationStatus, ApplicationStatusLabels, Candidate } from '@/api/models';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import AddCandidateToFolderButton from '../AddCandidateToFolderButton';
import { WorkScheduleLabels } from '@/models/IApplicationsFilter';
import AddToComparisionButton from '../AddToComparisionButton';
import ChangeApplicationStatusButton from '../ChangeApplicationStatusButton';
import ChangeVacancyButton from '../ChangeVacancyButton';
import GenerateFeedbackBlock from '../GenerateFeedbackBlock';

type Props = {
    candidate: Candidate;
    application?: Application;
};

const CandidateCard = ({ candidate, application }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const statusOrder = [
        ApplicationStatus.Pending,
        ApplicationStatus.HrAccepted,
        ApplicationStatus.InterviewerAccepted,
        ApplicationStatus.Offer,
        ApplicationStatus.CandidateAccepted,
    ];

    return (
        <Card className='w-full mt-6'>
            <CardContent className='p-6'>
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className='space-y-2'>
                    <div className='cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <h2 className='text-2xl font-bold'>{candidate.name}</h2>
                                {application?.status && (
                                    <Badge className='ml-2'>
                                        {ApplicationStatusLabels[application.status]}
                                    </Badge>
                                )}
                            </div>

                            <CollapsibleTrigger asChild>
                                <Button variant='ghost' size='sm' className='w-9 p-0'>
                                    <ChevronsUpDown className='h-4 w-4' />
                                    <span className='sr-only'>Toggle</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>

                        <div className='flex flex-col md:flex-row gap-6'>
                            <div className='w-full md:w-2/3 space-y-4'>
                                <div className='grid md:grid-cols-3 gap-4'>
                                    <div>
                                        <p className='text-sm font-medium'>Опыт:</p>
                                        <p>{candidate.experience} лет</p>
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium'>Грейд:</p>
                                        <p>{candidate.grade}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium'>Специальность:</p>
                                        <p>{candidate.speciality}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className='text-sm font-medium'>Навыки:</p>
                                    <div className='flex flex-wrap gap-2 mt-1'>
                                        {candidate.skills.map((skill, index) => (
                                            <Badge key={index} variant='secondary'>
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='w-full md:w-1/3 space-y-4'>
                                <div
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}
                                    className='flex flex-wrap gap-2'
                                >
                                    {application?.status && (
                                        <ChangeApplicationStatusButton
                                            applicationId={application.id}
                                            currentStatus={application.status}
                                        />
                                    )}

                                    <ChangeVacancyButton
                                        isApplication={!!application}
                                        candidateId={candidate.id}
                                        currentVacancyId={application?.vacancy.id}
                                    />

                                    <AddCandidateToFolderButton candidateId={candidate.id} />

                                    <AddToComparisionButton
                                        candidate={candidate}
                                        application={application}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <CollapsibleContent className='space-y-2'>
                        <div className='flex flex-col md:flex-row gap-6 mt-5'>
                            <div className='w-full md:w-2/3 space-y-4'>
                                <div className='grid md:grid-cols-3 gap-4'>
                                    <div>
                                        <p className='text-sm font-medium'>Телефон:</p>
                                        <p>{candidate.phone}</p>
                                    </div>

                                    <div>
                                        <p className='text-sm font-medium'>Электронная почта:</p>
                                        <p>{candidate.email}</p>
                                    </div>

                                    <div>
                                        <p className='text-sm font-medium'>Образование:</p>
                                        <p>{candidate.education}</p>
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-3 gap-4'>
                                    <div>
                                        <p className='text-sm font-medium'>Город:</p>
                                        <p>{candidate.city}</p>
                                    </div>

                                    <div>
                                        <p className='text-sm font-medium'>График:</p>
                                        <p>
                                            {WorkScheduleLabels[candidate.work_schedule] ||
                                                'Не заполнен'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-sm font-medium'>Папки:</p>
                                        <p>
                                            {candidate.folders
                                                .map((folder) => folder.name)
                                                .join(', ')}
                                        </p>
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 gap-4'>
                                    <div>
                                        <p className='text-sm font-medium'>Краткая информация:</p>
                                        <p>{candidate.summary}</p>
                                    </div>
                                </div>

                                <div className='flex items-center space-x-2'>
                                    <p className='text-sm font-medium'>Резюме:</p>
                                    <a
                                        href={candidate.resume_link}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-blue-500 hover:underline'
                                    >
                                        Просмотреть резюме
                                    </a>
                                </div>

                                {application && application.status && (
                                    <div className='space-y-2'>
                                        <p className='text-sm font-medium'>Хронология заявки:</p>
                                        <div className='relative pt-1'>
                                            <div className='flex mb-2 items-center justify-between'>
                                                {statusOrder.map((step, index) => (
                                                    <div key={step} className='text-xs'>
                                                        <div
                                                            className={`w-4 h-4 rounded-full ${
                                                                statusOrder.indexOf(
                                                                    application?.status
                                                                ) >= index
                                                                    ? 'bg-violet-500'
                                                                    : 'bg-gray-300'
                                                            }`}
                                                        ></div>
                                                        <p className='mt-1'>
                                                            {ApplicationStatusLabels[step]}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200'>
                                                <div
                                                    style={{
                                                        width: `${
                                                            (statusOrder.indexOf(
                                                                application?.status
                                                            ) /
                                                                (statusOrder.length - 1)) *
                                                            100
                                                        }%`,
                                                    }}
                                                    className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-violet-500'
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {application && application.vacancy && application.vacancy.id && (
                                <div className='w-full md:w-1/3 space-y-4'>
                                    <GenerateFeedbackBlock
                                        candidateId={candidate.id}
                                        vacancyId={application.vacancy.id}
                                    />
                                </div>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
};

export default CandidateCard;
