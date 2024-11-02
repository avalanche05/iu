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
import { Grade, GradeLabels, WorkSchedule, WorkScheduleLabels } from '@/models/IApplicationsFilter';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Tag, TagInput } from 'emblor';

const Vacancies = observer(() => {
    const { rootStore } = useStores();

    const [isCreateVacancyDialogOpen, setIsEditOrganizationDialogOpen] = useState(false);

    const [position, setPosition] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [grade, setGrade] = useState<Grade | null>(null);
    const [description, setDescription] = useState('');
    const [team, setTeam] = useState('');
    const [city, setCity] = useState('');
    const [workFormat, setWorkFormat] = useState<WorkSchedule | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

    useEffect(() => {
        rootStore.fetchVacancies({}).catch(() => {
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить вакансии',
                variant: 'destructive',
            });
        });
    }, [rootStore]);

    const handleEditOrganizationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        rootStore
            .createVacancy({
                position,
                speciality,
                grade: grade ?? Grade.Middle,
                description,
                team,
                city,
                work_format: workFormat ?? WorkSchedule.FullDay,
                skills: tags.map((tag) => tag.text),
            })
            .then(() => {
                setPosition('');
                setSpeciality('');
                setGrade(null);
                setDescription('');
                setTeam('');
                setCity('');
                setWorkFormat(null);
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

                        <form
                            className='create-vacancy overflow-y-scroll'
                            onSubmit={handleEditOrganizationSubmit}
                        >
                            <div className='grid gap-4 py-4'>
                                <div>
                                    <Label htmlFor='city' className='text-right'>
                                        Город
                                    </Label>
                                    <Input
                                        value={city}
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                        }}
                                        required
                                        id='city'
                                        name='city'
                                        placeholder='Город'
                                        className='col-span-3'
                                    />
                                </div>

                                <div>
                                    <Label htmlFor='position' className='text-right'>
                                        Позиция
                                    </Label>
                                    <Input
                                        value={position}
                                        onChange={(e) => {
                                            setPosition(e.target.value);
                                        }}
                                        required
                                        id='position'
                                        name='position'
                                        placeholder='Позиция'
                                        className='col-span-3'
                                    />
                                </div>

                                <div>
                                    <Label htmlFor='speciality' className='text-right'>
                                        Специальность
                                    </Label>
                                    <Input
                                        value={speciality}
                                        onChange={(e) => {
                                            setSpeciality(e.target.value);
                                        }}
                                        required
                                        id='speciality'
                                        name='speciality'
                                        placeholder='Специальность'
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
                                    <Label htmlFor='team' className='text-right'>
                                        Требуемые навыки
                                    </Label>

                                    <div className='tag-input'>
                                        <TagInput
                                            placeholder='Введите навыки'
                                            tags={tags}
                                            setTags={(newTags) => {
                                                setTags(newTags);
                                            }}
                                            activeTagIndex={activeTagIndex}
                                            setActiveTagIndex={setActiveTagIndex}
                                        />
                                    </div>
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

                                <div>
                                    <Label htmlFor='team' className='text-right'>
                                        Команда
                                    </Label>
                                    <Input
                                        value={team}
                                        onChange={(e) => {
                                            setTeam(e.target.value);
                                        }}
                                        required
                                        id='team'
                                        name='team'
                                        placeholder='Команда'
                                        className='col-span-3'
                                    />
                                </div>

                                <div>
                                    <Select
                                        onValueChange={(value) =>
                                            setWorkFormat(value as WorkSchedule)
                                        }
                                    >
                                        <SelectTrigger className='flex-1'>
                                            <SelectValue placeholder='График работы' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(WorkScheduleLabels).map((key) => (
                                                <SelectItem key={key} value={key}>
                                                    {
                                                        WorkScheduleLabels[
                                                            key as keyof typeof WorkScheduleLabels
                                                        ]
                                                    }
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
