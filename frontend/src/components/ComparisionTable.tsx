import { useStores } from '@/hooks/useStores';
import { mapFloatYearToReadableText } from '@/utils/mapFloatYearToReadableText';
import { Check, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';

const ComparisionTable = observer(() => {
    const { rootStore } = useStores();

    return (
        <>
            {rootStore.candidatesToCompare.length ? (
                <>
                    <h2 className='font-semibold text-lg md:text-xl mb-2'>Сравнение кандидатов</h2>
                    <div className='overflow-x-auto'>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className='p-2 text-left'></th>
                                    {rootStore.candidatesToCompare
                                        .map(({ candidate }) => candidate.name)
                                        .map((name, index) => (
                                            <th key={index} className='p-2'>
                                                <div className='flex flex-col items-center mb-2'>
                                                    <span className='text-purple-600'>{name}</span>
                                                </div>
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        label: 'Специальность',
                                        values: rootStore.candidatesToCompare.map(
                                            ({ candidate }) => candidate.speciality
                                        ),
                                    },
                                    {
                                        label: 'Стаж работы',
                                        values: rootStore.candidatesToCompare.map(({ candidate }) =>
                                            mapFloatYearToReadableText(candidate.experience)
                                        ),
                                    },
                                    {
                                        label: 'Наличие отклика',
                                        values: rootStore.candidatesToCompare.map(
                                            ({ hasApplication }) =>
                                                hasApplication ? (
                                                    <Check className='text-green-500 mx-auto' />
                                                ) : (
                                                    <X className='text-red-500 mx-auto' />
                                                )
                                        ),
                                    },
                                    {
                                        label: 'Ключевые навыки',
                                        values: rootStore.candidatesToCompare.map(({ candidate }) =>
                                            candidate.skills.join(', ')
                                        ),
                                    },
                                    {
                                        label: 'Краткая информация',
                                        values: rootStore.candidatesToCompare.map(
                                            ({ candidate }) => candidate.summary
                                        ),
                                    },
                                    {
                                        label: 'Образование',
                                        values: rootStore.candidatesToCompare.map(
                                            ({ candidate }) => candidate.education
                                        ),
                                    },
                                    {
                                        label: 'График',
                                        values: rootStore.candidatesToCompare.map(
                                            ({ candidate }) => candidate.work_schedule
                                        ),
                                    },
                                    {
                                        label: 'Резюме',
                                        values: rootStore.candidatesToCompare.map(
                                            ({ candidate }) => (
                                                <a
                                                    href={candidate.resume_link}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-blue-500 hover:underline'
                                                >
                                                    Просмотреть резюме
                                                </a>
                                            )
                                        ),
                                    },
                                ].map((row, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                    >
                                        <td className='p-2 font-bold'>{row.label}</td>
                                        {row.values.map((value, i) => (
                                            <td key={i} className='p-2 text-center'>
                                                {value}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p>
                    Добавьте кандидатов для сравнения на странице откликов или на странице с
                    кандидатами
                </p>
            )}
        </>
    );
});

export default ComparisionTable;
