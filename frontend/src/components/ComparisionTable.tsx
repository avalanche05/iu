import { useStores } from '@/hooks/useStores';
import { mapFloatYearToReadableText } from '@/utils/mapFloatYearToReadableText';
import { observer } from 'mobx-react-lite';
import { Badge } from './ui/badge';
import RadarChart from './RadarChart';

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
                                        .map(({ candidate }) => candidate.nickname)
                                        .map((name, index) => (
                                            <th key={index} className='p-2'>
                                                <div className='flex flex-col items-center mb-2'>
                                                    <span className='text-blue-600'>{name}</span>
                                                </div>
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        label: 'Грейд',
                                        values: rootStore.candidatesToCompare.map(
                                            ({ candidate }) => <Badge>{candidate.grade}</Badge>
                                        ),
                                    },
                                    {
                                        label: 'Стаж работы',
                                        values: rootStore.candidatesToCompare.map(({ candidate }) =>
                                            mapFloatYearToReadableText(candidate.experience_years)
                                        ),
                                    },
                                    {
                                        label: 'Ключевые навыки',
                                        values: rootStore.candidatesToCompare.map(({ candidate }) =>
                                            candidate.competencies.map((competency, index) => (
                                                <Badge key={index} variant='secondary'>
                                                    {competency.name}
                                                </Badge>
                                            ))
                                        ),
                                    },
                                    {
                                        label: 'Краткая информация',
                                        values: rootStore.candidatesToCompare.map(
                                            ({ candidate }) => candidate.summary
                                        ),
                                    },
                                    {
                                        label: 'GitHub',
                                        values: rootStore.candidatesToCompare.map(
                                            ({ candidate }) => (
                                                <a
                                                    href={candidate.github_url}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-blue-500 hover:underline'
                                                >
                                                    Просмотреть резюме
                                                </a>
                                            )
                                        ),
                                    },
                                    {
                                        label: 'Диаграмма компетенций',
                                        values: rootStore.candidatesToCompare.map(
                                            ({ candidate }) => (
                                                <RadarChart
                                                    labels={candidate.competencies.map(
                                                        (competency) => competency.name
                                                    )}
                                                    datasets={[
                                                        {
                                                            label: candidate.nickname,
                                                            data: candidate.competencies.map(
                                                                (competency) =>
                                                                    competency.proficiency
                                                            ),
                                                        },
                                                    ]}
                                                />
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
                <p>Добавьте кандидатов для сравнения на странице с профилями</p>
            )}
        </>
    );
});

export default ComparisionTable;
