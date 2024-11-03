import { Candidate } from '@/api/models';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronsUpDown, StarIcon } from 'lucide-react';
import AddCandidateToFolderButton from '../AddCandidateToFolderButton';
import AddToComparisionButton from '../AddToComparisionButton';
import GenerateFeedbackBlock from '../GenerateFeedbackBlock';
import RadarChart from '../RadarChart';
import {
    candidateABorderColor,
    candidateAColor,
    vacancyBorderColor,
    vacancyColor,
} from '@/constants/colors';

type Props = {
    candidate: Candidate;
};

const CandidateCard = ({ candidate }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const labels = candidate.competencies.map((skill) => skill.name);

    const datasets = [
        {
            label: candidate.nickname,
            data: candidate.competencies.map((skill) => skill.proficiency),
            backgroundColor: candidateAColor,
            borderColor: candidateABorderColor,
        },
        ...(candidate.technical_interview_result
            ? [
                  {
                      label: 'Оценка по техническому интервью',
                      backgroundColor: vacancyColor,
                      borderColor: vacancyBorderColor,
                      data: labels.map((label) => {
                          const interviewLabels =
                              candidate.technical_interview_result.competencies?.map(
                                  (skill) => skill.name
                              );

                          const interviewData =
                              candidate.technical_interview_result.competencies?.map(
                                  (skill) => skill.proficiency
                              );

                          const skillIndex = interviewLabels?.indexOf(label);

                          return skillIndex !== -1 ? interviewData[skillIndex] : 0.1;
                      }),
                  },
              ]
            : []),
    ];

    return (
        <Card className='w-full mt-6'>
            <CardContent className='p-6'>
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className='space-y-2'>
                    <div className='cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <h2 className='text-2xl font-bold'>{candidate.nickname}</h2>
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
                                        <p>{candidate.experience_years} лет</p>
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium'>Грейд:</p>
                                        <p>{candidate.grade}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className='text-sm font-medium'>Качество кода:</p>
                                    <div className='flex items-center'>
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <StarIcon
                                                key={index}
                                                className={`w-4 h-4 ${
                                                    index < Math.round(candidate.code_quality * 5)
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
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
                                    <AddCandidateToFolderButton candidateId={candidate.id} />

                                    <AddToComparisionButton candidate={candidate} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <CollapsibleContent className='space-y-2'>
                        <div className='flex flex-col md:flex-row gap-6 mt-5'>
                            <div className='w-full md:w-2/3 space-y-4'>
                                <div className='grid md:grid-cols-3 gap-4'>
                                    <div>
                                        <p className='text-sm font-medium'>Электронная почта:</p>
                                        <p>{candidate.email}</p>
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-3 gap-4'>
                                    <div>
                                        <p className='text-sm font-medium'>Проекты:</p>
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

                                <div>
                                    <p className='text-sm font-medium'>Навыки:</p>
                                    <div className='flex flex-wrap gap-2 mt-1'>
                                        <RadarChart labels={labels} datasets={datasets} />
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-3 gap-4'>
                                    <div>
                                        <p className='text-sm font-medium'>
                                            Количество репозиториев:
                                        </p>
                                        <p>{candidate.metrics.repos_count}</p>
                                    </div>

                                    <div>
                                        <p className='text-sm font-medium'>Количество форков:</p>
                                        <p>{candidate.metrics.forks_count}</p>
                                    </div>

                                    <div>
                                        <p className='text-sm font-medium'>
                                            Количество подписчиков:
                                        </p>
                                        <p>{candidate.metrics.followers_count}</p>
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-3 gap-4'>
                                    <div>
                                        <p className='text-sm font-medium'>
                                            Дата создания профиля:
                                        </p>
                                        <p>
                                            {new Date(candidate.metrics.created_at).toUTCString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-sm font-medium'>
                                            Среднее количество комментариев к PR:
                                        </p>
                                        <p>{candidate.metrics.avg_comments_count}</p>
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-3 gap-4'>
                                    <div>
                                        <p className='text-sm font-medium'>
                                            Среднее время закрытия PR:
                                        </p>
                                        <p>{candidate.metrics.avg_prs_close_time}</p>
                                    </div>

                                    <div>
                                        <p className='text-sm font-medium'>
                                            Среднее количество коммитов на PR:
                                        </p>
                                        <p>{candidate.metrics.avg_commits_per_pr_count}</p>
                                    </div>
                                </div>

                                <div className='flex items-center space-x-2'>
                                    <p className='text-sm font-medium'>GitHub:</p>
                                    <a
                                        href={candidate.github_url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-blue-500 hover:underline'
                                    >
                                        Просмотреть Github
                                    </a>
                                </div>
                            </div>

                            <div className='w-full md:w-1/3 space-y-4'>
                                <GenerateFeedbackBlock candidateId={candidate.id} />
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
};

export default CandidateCard;
