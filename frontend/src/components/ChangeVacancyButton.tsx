import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useStores } from '@/hooks/useStores';
import { Loader2 } from 'lucide-react';
import { toast } from './ui/use-toast';

type Props = {
    candidateId: number;
    isApplication: boolean;
    currentVacancyId?: number;
};

const ChangeVacancyButton = ({ candidateId, isApplication, currentVacancyId }: Props) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedVacancyId, setSelectedVacancyId] = useState<number | null>(null);

    const { rootStore } = useStores();

    const handleChangeApplicationStatus = () => {
        if (selectedVacancyId == null) {
            return;
        }

        setLoading(true);

        rootStore
            .createApplication(candidateId, selectedVacancyId)
            .catch(() => {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось заменить вакансию',
                    variant: 'destructive',
                });
            })
            .finally(() => {
                setLoading(false);
                setOpen(false);
            });
    };

    return (
        rootStore.vacancies && (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant='outline'>
                        {isApplication ? 'Заменить вакансию' : 'Предложить вакансию'}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Предложить вакансию кандидату</DialogTitle>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div>
                            <Label htmlFor='name' className='text-right'>
                                Выбор вакансии
                            </Label>
                            <Select
                                defaultValue={currentVacancyId?.toString()}
                                onValueChange={(value) => setSelectedVacancyId(+value)}
                            >
                                <SelectTrigger className='flex-1'>
                                    <SelectValue placeholder='Выберите вакансию' />
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
                    </div>
                    <Button disabled={loading} onClick={handleChangeApplicationStatus}>
                        {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}

                        {isApplication ? 'Заменить вакансию' : 'Предложить вакансию'}
                    </Button>
                </DialogContent>
            </Dialog>
        )
    );
};

export default ChangeVacancyButton;
