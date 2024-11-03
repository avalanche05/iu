import { Candidate, Vacancy, IVacancyDetails } from '@/api/models';
import RadarChart from '@/components/RadarChart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import {
    candidateABorderColor,
    candidateAColor,
    vacancyBorderColor,
    vacancyColor,
} from '@/constants/colors';
import { useStores } from '@/hooks/useStores';
import { RadarDataset } from '@/models/RadarDataset';
import { StarIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function VacancyInfo({
    vacancy,
    candidateDataset,
    candidateLabels,
}: {
    vacancy: Vacancy;
    candidateDataset?: RadarDataset;
    candidateLabels?: string[];
}) {
    const vacancyLabels = vacancy.competencies.map((skill) => skill.name);

    const vacancyDatasets: RadarDataset[] = [
        {
            label: vacancy.title,
            data: vacancy.competencies.map((skill) => skill.proficiency),
            backgroundColor: vacancyColor,
            borderColor: vacancyBorderColor,
        },
        ...(candidateDataset
            ? [
                  {
                      ...candidateDataset,
                      data: vacancyLabels.map((label) => {
                          if (!candidateLabels || !candidateDataset) {
                              return 0;
                          }

                          const skillIndex = candidateLabels?.indexOf(label);

                          return skillIndex !== -1 ? candidateDataset.data[skillIndex] : 0;
                      }),
                  },
              ]
            : []),
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{vacancy.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col md:flex-row gap-6'>
                    <div className='md:w-2/3'>
                        <Badge>{vacancy.grade}</Badge>

                        <CardDescription className='mt-2'>{vacancy.description}</CardDescription>
                    </div>

                    <div className='w-full md:w-1/3 space-y-4'>
                        <RadarChart labels={vacancyLabels} datasets={vacancyDatasets} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Candidate Card Component
function VacancyCandidateCard({ candidate }: { candidate: Candidate }) {
    return (
        <Card className='mb-4 cursor-pointer hover:bg-slate-100'>
            <CardHeader>
                <CardTitle>{candidate.nickname}</CardTitle>
                <CardDescription>{candidate.email}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid gap-2'>
                    <div>
                        <Badge>{candidate.grade}</Badge>
                        <span className='ml-2'>{candidate.experience_years} лет опыта</span>
                    </div>

                    <p className='text-sm text-gray-600'>{candidate.summary}</p>
                    <div className='flex items-center'>
                        <span className='mr-2'>Качество кода:</span>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <StarIcon
                                key={index}
                                className={`w-4 h-4 ${
                                    index < Math.round(candidate.code_quality / 2)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const VacancyDetails = observer(() => {
    const { rootStore } = useStores();
    const [vacancyDetails, setVacancyDetails] = useState<IVacancyDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [candidateDataset, setCandidateDataset] = useState<RadarDataset | undefined>(undefined);
    const [candidateLabels, setCandidateLabels] = useState<string[] | undefined>(undefined);

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            setLoading(true);

            rootStore
                .fetchVacancyDetails({ vacancyId: +id })
                .then((vacancyDetails) => setVacancyDetails(vacancyDetails))
                .catch(() => {
                    toast({
                        title: 'Ошибка',
                        description: 'Не удалось загрузить вакансию',
                        variant: 'destructive',
                    });
                })
                .finally(() => setLoading(false));
        }
    }, [rootStore, id]);

    return (
        <>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-lg md:text-2xl'>Вакансия</h1>
            </div>

            {loading || !vacancyDetails ? (
                Array.from({ length: 5 }).map((_, index) => (
                    <Card key={index} className='mb-4'>
                        <CardContent>
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-4'>
                                    <Skeleton className='h-6 w-1/2' />
                                    <Skeleton className='h-6 w-1/4' />
                                </div>
                                <div className='flex gap-4'>
                                    <Skeleton className='h-6 w-1/4' />
                                    <Skeleton className='h-6 w-1/4' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <>
                    <VacancyInfo
                        vacancy={vacancyDetails}
                        candidateDataset={candidateDataset}
                        candidateLabels={candidateLabels}
                    />

                    <h2 className='text-2xl font-semibold mb-4'>Подходящие кандидаты</h2>
                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        {vacancyDetails.candidates.map((candidate, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setCandidateDataset({
                                        label: candidate.nickname,
                                        data: candidate.competencies.map(
                                            (skill) => skill.proficiency
                                        ),
                                        backgroundColor: candidateAColor,
                                        borderColor: candidateABorderColor,
                                    });
                                    setCandidateLabels(
                                        candidate.competencies.map((skill) => skill.name)
                                    );
                                }}
                            >
                                <VacancyCandidateCard candidate={candidate} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
});

export default VacancyDetails;
