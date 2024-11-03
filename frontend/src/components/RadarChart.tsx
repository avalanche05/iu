// RadarChart.tsx
import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Badge } from './ui/badge';

// Регистрация модулей, необходимых для радарного графика
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Типы для данных и опций графика
interface RadarChartProps {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
        borderColor?: string;
    }[];
}

// Компонент для радарного графика
const RadarChart: React.FC<RadarChartProps> = ({ labels, datasets }) => {
    const data = {
        labels,
        datasets: datasets.map((dataset) => ({
            ...dataset,
            backgroundColor: dataset.backgroundColor || 'rgba(54, 162, 235, 0.2)',
            borderColor: dataset.borderColor || 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
        })),
    };

    const options = {
        responsive: true,
        scales: {
            r: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 1,
            },
        },
    };

    return (
        <>
            {labels.length > 2 ? (
                <Radar data={data} options={options} />
            ) : (
                <>
                    <div className='flex flex-col'>
                        <div>
                            {labels.map((label) => (
                                <Badge key={label} variant={'outline'}>
                                    {label}
                                </Badge>
                            ))}
                        </div>

                        <div className='mt-2 text-xs text-slate-700'>
                            Недостаточно компетенций для построения диаграммы
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default RadarChart;
