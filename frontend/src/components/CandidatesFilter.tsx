'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Grade, GradeLabels } from '@/models/ICandidatesFilter';
import { useStores } from '@/hooks/useStores';
import Folders from './Folders';
import { observer } from 'mobx-react-lite';
import { Label } from './ui/label';
import MultipleSelector, { Option } from './ui/multiple-selector';
import { toast } from './ui/use-toast';

const CandidatesFilter = observer(() => {
    const { rootStore } = useStores();
    const [selectedCompetencies, setSelectedCompetencies] = useState<Option[]>([]);

    const [formData, setFormData] = useState({
        nickname: '',
        grade: '',
        experience: '',
    });

    useEffect(() => {
        rootStore.fetchCompetencies().catch(() => {
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить компетенции',
                variant: 'destructive',
            });
        });
    }, [rootStore]);

    // Обработчик выбора для select полей
    const handleSelectChange = (name: string) => (value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    // Обработчик отправки формы
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        rootStore.setCandidatesFilter({
            nickname: formData.nickname || null,
            grade: (formData.grade as Grade) || null,
            experience: +formData.experience || null,
            competencies: selectedCompetencies.length
                ? selectedCompetencies.map((option) => option.value)
                : null,
        });
    };

    return (
        <div className='w-full mx-auto'>
            <Folders />

            <div>
                <h2 className='text-2xl font-bold mb-2'>Поиск по кандидатам</h2>
            </div>

            <div className='flex flex-col space-y-4 mb-4'>
                <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col space-y-4 mb-4'>
                    <div className='flex space-x-2'>
                        <Input
                            placeholder='Ник на GitHub / Имя'
                            className='flex-1'
                            name='nickname'
                            value={formData.nickname}
                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        />

                        <Select value={formData.grade} onValueChange={handleSelectChange('grade')}>
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

                        <Input
                            placeholder='Кол-во лет опыта работы'
                            className='flex-1'
                            name='experience'
                            value={formData.experience}
                            onChange={(e) =>
                                setFormData({ ...formData, experience: e.target.value })
                            }
                        />
                    </div>

                    <div className='flex space-x-2'>
                        <div className='w-full'>
                            <Label htmlFor='team' className='text-right'>
                                Требуемые навыки
                            </Label>

                            <MultipleSelector
                                value={selectedCompetencies}
                                onChange={setSelectedCompetencies}
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
                    </div>

                    <div className='flex space-x-2'>
                        <Button
                            className='w-1/3'
                            type='button'
                            variant={'outline'}
                            onClick={() => {
                                setFormData({
                                    nickname: '',
                                    grade: '',
                                    experience: '',
                                });

                                setSelectedCompetencies([]);
                            }}
                        >
                            Очистить
                        </Button>

                        <Button className='w-1/3' type='submit'>
                            Применить
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default CandidatesFilter;
