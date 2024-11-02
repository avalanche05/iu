import { BrainCircuit, Building, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Vacancy } from '@/api/models';
import { GradeLabels, WorkScheduleLabels } from '@/models/IApplicationsFilter';
import { Badge } from './ui/badge';

type Props = {
    vacancy: Vacancy | null;
};

const VacancyCard = ({ vacancy }: Props) => {
    return (
        vacancy && (
            <Card className='mb-8 bg-slate-200'>
                <CardHeader>
                    <CardTitle className='text-sm font-normal text-gray-600'>Вакансия</CardTitle>
                    <h2 className='text-2xl font-bold'>
                        {vacancy.position}: {vacancy.speciality}
                    </h2>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col md:flex-row gap-8'>
                        <div className='flex flex-col gap-4'>
                            <div className='flex items-center'>
                                <BrainCircuit className='text-purple-600 mr-2' />
                                <span>
                                    {GradeLabels[vacancy.grade as keyof typeof GradeLabels]}
                                </span>
                            </div>

                            <div className='flex items-center'>
                                <Building className='text-purple-600 mr-2' />
                                <span>{vacancy.city}</span>
                            </div>

                            <div className='flex items-center'>
                                <Calendar className='text-purple-600 mr-2' />
                                <span>{WorkScheduleLabels[vacancy.work_format]}</span>
                            </div>
                        </div>

                        <div>
                            <div>
                                <p className='text-sm font-medium'>Навыки:</p>
                                <div className='flex flex-wrap gap-2 mt-1'>
                                    {vacancy.skills.map((skill, index) => (
                                        <Badge key={index} variant='secondary'>
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <h3 className='font-bold mb-2 mt-4'>Описание:</h3>
                            <p>{vacancy.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    );
};

export default VacancyCard;
