import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import VacanciesFilter from '@/components/VacanciesFilter';
import VacancyCard from '@/components/VacancyCard';
import { useStores } from '@/hooks/useStores';
import { Grade, GradeLabels } from '@/models/ICandidatesFilter';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Slider } from '@/components/ui/slider';

const Vacancies = observer(() => {
    const { rootStore } = useStores();

    const [isCreateVacancyDialogOpen, setIsEditOrganizationDialogOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState<Grade | null>(null);
    const [description, setDescription] = useState('');
    const [selectedCompetencies, setSelectedCompetencies] = useState<Option[]>([]);
    const [proficiency, setProficiency] = useState<Map<string, number>>(new Map());

    const handleCompetencyChange = (competencies: Option[]) => {
        setSelectedCompetencies(competencies);

        const proficiencyMap = new Map<string, number>();

        competencies.forEach((competency) => {
            proficiencyMap.set(
                competency.value,
                proficiency.has(competency.value)
                    ? proficiency.get(competency.value) || 0
                    : grade === Grade.Junior
                    ? 0.33
                    : grade === Grade.Senior
                    ? 1
                    : 0.66
            );
        });

        setProficiency(proficiencyMap);
    };

    useEffect(() => {
        rootStore.fetchVacancies({}).catch(() => {
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить вакансии',
                variant: 'destructive',
            });
        });

        rootStore.fetchCompetencies().catch(() => {
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить компетенции',
                variant: 'destructive',
            });
        });
    }, [rootStore]);

    const handleEditOrganizationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        rootStore
            .createVacancy({
                title,
                grade: grade ?? Grade.Middle,
                description,
                competencies: selectedCompetencies.map((competency) => ({
                    name: competency.value,
                    proficiency: proficiency.get(competency.value) || 0.66,
                })),
            })
            .then(() => {
                setTitle('');
                setGrade(null);
                setDescription('');
                setSelectedCompetencies([]);
                setProficiency(new Map());
            })
            .finally(() => {
                setIsEditOrganizationDialogOpen(false);
            });
    };

    return (
        <>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-lg md:text-2xl'>Вакансии</h1>

                <Dialog
                    open={isCreateVacancyDialogOpen}
                    onOpenChange={setIsEditOrganizationDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                            variant='default'
                        >
                            Создать вакансию
                        </Button>
                    </DialogTrigger>

                    <DialogContent className='sm:max-w-[425px]'>
                        <DialogHeader>
                            <DialogTitle>Создание вакансии</DialogTitle>
                        </DialogHeader>

                        <form className='create-vacancy' onSubmit={handleEditOrganizationSubmit}>
                            <div className='grid gap-4 py-4'>
                                <div>
                                    <Label htmlFor='title' className='text-right'>
                                        Название
                                    </Label>
                                    <Input
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                        }}
                                        required
                                        id='title'
                                        name='title'
                                        placeholder='Название'
                                        className='col-span-3'
                                    />
                                </div>

                                <div>
                                    <Select onValueChange={(value) => setGrade(value as Grade)}>
                                        <SelectTrigger className='flex-1'>
                                            <SelectValue placeholder='Грейд' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(GradeLabels).map((key) => (
                                                <SelectItem key={key} value={key}>
                                                    {GradeLabels[key as keyof typeof GradeLabels]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor='competencies' className='text-right'>
                                        Требуемые навыки
                                    </Label>

                                    <MultipleSelector
                                        value={selectedCompetencies}
                                        onChange={handleCompetencyChange}
                                        defaultOptions={[...new Set(rootStore.competencies)]?.map(
                                            (competency) => ({
                                                label: competency,
                                                value: competency,
                                            })
                                        )}
                                        placeholder='Выберите компетенции...'
                                        emptyIndicator={
                                            <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                                                Нет подходящих компетенций
                                            </p>
                                        }
                                    />
                                </div>

                                <div className='flex space-x-2 flex-col'>
                                    <h3 className='text-base'>Уровень владения компетенциями</h3>

                                    {Array.from(proficiency).map(([competency]) => (
                                        <div key={competency} className='flex space-x-2'>
                                            <div className='w-full'>
                                                <Label className='text-right'>{competency}</Label>

                                                <Slider
                                                    className='w-full mt-2'
                                                    onChange={(e) => {
                                                        // eslint-disable-next-line
                                                        // @ts-ignore
                                                        proficiency.set(competency, e.target.value);
                                                    }}
                                                    defaultValue={[
                                                        proficiency.get(competency) || 0.66,
                                                    ]}
                                                    max={1}
                                                    step={0.1}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <Label htmlFor='description' className='text-right'>
                                        Описание
                                    </Label>

                                    <Textarea
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }}
                                        required
                                        id='description'
                                        name='description'
                                        placeholder='Описание'
                                        className='col-span-3'
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type='submit'>Создать</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <VacanciesFilter />

            <div className='mt-8'>
                {rootStore.isVacanciesLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                          <Skeleton key={index} className='h-52 w-full mb-8' />
                      ))
                    : rootStore.vacancies.map((vacancy) => (
                          <VacancyCard key={vacancy.id} vacancy={vacancy} />
                      ))}
            </div>
        </>
    );
});

export default Vacancies;
