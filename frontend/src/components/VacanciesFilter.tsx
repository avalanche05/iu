'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Grade, GradeLabels, WorkSchedule, WorkScheduleLabels } from '@/models/IApplicationsFilter';
import { useStores } from '@/hooks/useStores';
import { observer } from 'mobx-react-lite';

const VacanciesFilter = observer(() => {
    const { rootStore } = useStores();

    const [formData, setFormData] = useState({
        position: '',
        grade: '',
        speciality: '',
        city: '',
        work_format: '',
        skills: '',
    });

    // Обработчик выбора для select полей
    const handleSelectChange = (name: string) => (value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    // Обработчик отправки формы
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        rootStore.setVacanciesFilter({
            position: formData.position || null,
            grade: (formData.grade as Grade) || null,
            speciality: formData.speciality || null,
            city: formData.city || null,
            work_format: (formData.work_format as WorkSchedule) || null,
            skills: formData.skills || null,
        });
    };

    return (
        <div className='w-full mx-auto'>
            <div className='flex flex-col space-y-4 mb-4'>
                <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col space-y-4 mb-4'>
                    <div className='flex space-x-2'>
                        <Input
                            placeholder='Позиция'
                            className='flex-1'
                            name='position'
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        />

                        <Input
                            placeholder='Специальность'
                            className='flex-1'
                            name='speciality'
                            value={formData.speciality}
                            onChange={(e) =>
                                setFormData({ ...formData, speciality: e.target.value })
                            }
                        />

                        <Input
                            placeholder='Город'
                            className='flex-1'
                            name='city'
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                    </div>

                    <div className='flex space-x-2'>
                        <Input
                            placeholder='Навыки'
                            className='flex-1'
                            name='city'
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
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

                        <Select
                            value={formData.work_format}
                            onValueChange={handleSelectChange('work_format')}
                        >
                            <SelectTrigger className='flex-1'>
                                <SelectValue placeholder='График работы' />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(WorkScheduleLabels).map((key) => (
                                    <SelectItem key={key} value={key}>
                                        {WorkScheduleLabels[key as keyof typeof WorkScheduleLabels]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex space-x-2'>
                        <Button
                            className='w-1/3'
                            type='button'
                            variant={'outline'}
                            onClick={() =>
                                setFormData({
                                    city: '',
                                    grade: '',
                                    position: '',
                                    speciality: '',
                                    work_format: '',
                                    skills: '',
                                })
                            }
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

export default VacanciesFilter;
