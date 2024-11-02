import ComparisionTable from '@/components/ComparisionTable';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import VacancyCard from '@/components/VacancyCard';
import { useStores } from '@/hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

const Comparision = observer(() => {
    const { rootStore } = useStores();
    const [selectedVacancyId, setSelectedVacancyId] = useState<number | null>(null);

    useEffect(() => {
        rootStore.fetchVacancies({}).catch(() => {
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить вакансии',
                variant: 'destructive',
            });
        });
    }, [rootStore]);

    return (
        <div>
            <h3 className='font-semibold text-lg md:text-2xl'>Вакансия</h3>

            {rootStore.vacancies && (
                <>
                    <div className='mt-5 mb-5'>
                        <Select onValueChange={(value) => setSelectedVacancyId(+value)}>
                            <SelectTrigger className='flex-1'>
                                <SelectValue placeholder='Выберите вакансию для сравнения' />
                            </SelectTrigger>
                            <SelectContent>
                                {rootStore.vacancies.map((vacancy) => (
                                    <SelectItem key={vacancy.id} value={vacancy.id.toString()}>
                                        {vacancy.position}: {vacancy.speciality}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <VacancyCard
                        vacancy={
                            rootStore.vacancies.find(
                                (vacancy) => vacancy.id === selectedVacancyId
                            ) ?? null
                        }
                    />
                </>
            )}

            <ComparisionTable />
        </div>
    );
});

export default Comparision;
