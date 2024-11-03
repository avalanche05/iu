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
import { mapFloatYearToReadableText } from '@/utils/mapFloatYearToReadableText';
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
                <div className='flex flex-col gap-6'>
                    <div className='md:w-full'>
                        <Badge>{vacancy.grade}</Badge>

                        <CardDescription className='mt-2'>{vacancy.description}</CardDescription>
                    </div>

                    <div className='w-full md:w-full space-y-4'>
                        <RadarChart labels={vacancyLabels} datasets={vacancyDatasets} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Candidate Card Component
function VacancyCandidateCard({
    candidate,
}: {
    candidate: Candidate & { compliance_percent: number };
}) {
    return (
        <Card className='mb-4 cursor-pointer hover:bg-slate-100'>
            <CardHeader>
                <CardTitle>{candidate.nickname}</CardTitle>
                <CardDescription>{candidate.email}</CardDescription>
                <CardDescription>
                    Соответствие вакансии {candidate.compliance_percent.toPrecision(3)}%
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid gap-2'>
                    <div>
                        <Badge>{candidate.grade}</Badge>
                        <span className='ml-2'>
                            {mapFloatYearToReadableText(candidate.experience_years)} опыта
                        </span>
                    </div>

                    <p className='text-sm text-gray-600'>{candidate.summary}</p>
                    <div className='flex items-center'>
                        <span className='mr-2'>Качество кода:</span>
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
            {loading || !vacancyDetails ? (
                <>
                    <Skeleton className='h-40' />

                    <div className='flex gap-4 mt-10'>
                        <Skeleton className='h-40 w-full' />
                        <Skeleton className='h-40 w-full' />
                        <Skeleton className='h-40 w-full' />
                    </div>
                </>
            ) : (
                <>
                    <div className='flex gap-4 wrap vacancy-details'>
                        <div className='md:w-2/3 sm:w-full'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-2xl font-semibold mb-1'>Вакансия</h2>
                            </div>

                            <VacancyInfo
                                vacancy={vacancyDetails}
                                candidateDataset={candidateDataset}
                                candidateLabels={candidateLabels}
                            />
                        </div>

                        <div className='md:w-1/3 sm:w-full overflow-y-scroll relative'>
                            <div className='vacancy-candidates'>
                                <div className='mb-2'>
                                    <h2 className='text-2xl font-semibold mb-1'>
                                        Подходящие кандидаты
                                    </h2>

                                    <p>
                                        Кандидаты отранжированы по релевантности вакансии. Выберите
                                        кандидата, чтобы сравнить его навыки с требованиями
                                        вакансии.
                                    </p>
                                </div>

                                <div className='grid gap-4 md:grid-cols-1 lg:grid-cols-1'>
                                    {vacancyDetails.candidates.map((candidate, index) => (
                                        <div
                                            className='w-full'
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
                                                    candidate.competencies.map(
                                                        (skill) => skill.name
                                                    )
                                                );
                                            }}
                                        >
                                            <VacancyCandidateCard candidate={candidate} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
});

export default VacancyDetails;
