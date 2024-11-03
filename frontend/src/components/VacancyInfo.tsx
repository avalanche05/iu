import { Vacancy } from '@/api/models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { vacancyBorderColor, vacancyColor } from '@/constants/colors';
import { RadarDataset } from '@/models/RadarDataset';
import { Badge } from './ui/badge';
import RadarChart from './RadarChart';

type Props = {
    vacancy: Vacancy;
    candidateDatasets?: {
        dataset: RadarDataset;
        labels: string[];
    }[];
    candidateDataset?: RadarDataset;
    candidateLabels?: string[];
};

const VacancyInfo = ({ vacancy, candidateDataset, candidateLabels }: Props) => {
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
};

export default VacancyInfo;
