import { BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Vacancy } from '@/api/models';
import { GradeLabels } from '@/models/ICandidatesFilter';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';

type Props = {
    vacancy: Vacancy | null;
};

const VacancyCard = ({ vacancy }: Props) => {
    return (
        vacancy && (
            <Link to={`/vacancies/${vacancy.id}`}>
                <Card className='mb-8 bg-slate-200 pointer hover:bg-slate-300 ease-in duration-100'>
                    <CardHeader>
                        <CardTitle className='text-sm font-normal text-gray-600'>
                            Вакансия
                        </CardTitle>
                        <h2 className='text-2xl font-bold'>{vacancy.title}</h2>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-col md:flex-row gap-8'>
                            <div className='flex flex-col gap-4'>
                                <div className='flex items-center'>
                                    <BrainCircuit className='text-blue-600 mr-2' />
                                    <span>
                                        {GradeLabels[vacancy.grade as keyof typeof GradeLabels] ??
                                            vacancy.grade}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <p className='text-sm font-medium'>Навыки:</p>
                                    <div className='flex flex-wrap gap-2 mt-1'>
                                        {vacancy.competencies.map((skill, index) => (
                                            <Badge key={index} variant='secondary'>
                                                {skill.name}
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
            </Link>
        )
    );
};

export default VacancyCard;
