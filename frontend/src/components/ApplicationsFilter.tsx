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
import { ApplicationStatus, ApplicationStatusLabels } from '@/api/models';
import { Grade, GradeLabels, WorkSchedule, WorkScheduleLabels } from '@/models/IApplicationsFilter';
import { useStores } from '@/hooks/useStores';
import Folders from './Folders';
import { observer } from 'mobx-react-lite';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

const ApplicationsFilter = observer(() => {
    const { rootStore } = useStores();

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        position: '',
        speciality: '',
        grade: '',
        experience: '',
        workSchedule: '',
        applicationStatus: '',
        vacancyId: '',
    });

    // Обработчик выбора для select полей
    const handleSelectChange = (name: string) => (value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    // Обработчик отправки формы
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        rootStore.setApplicationFilter({
            name: formData.name || null,
            city: formData.city || null,
            position: formData.position || null,
            speciality: formData.speciality || null,
            grade: (formData.grade as Grade) || null,
            experience: formData.experience || null,
            workSchedule: (formData.workSchedule as WorkSchedule) || null,
            applicationStatus: (formData.applicationStatus as ApplicationStatus) || null,
            vacancyId: formData.vacancyId ? +formData.vacancyId : null,
        });
    };

    return (
        <div className='w-full mx-auto'>
            <Folders />

            <div className='flex flex-col space-y-4 mb-4'>
                <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col space-y-4 mb-4'>
                    <div className='flex space-x-2'>
                        <Select
                            value={formData.vacancyId}
                            onValueChange={handleSelectChange('vacancyId')}
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

                        <Input
                            placeholder='Имя'
                            className='flex-1'
                            name='name'
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <Input
                            placeholder='Позиция'
                            className='flex-1'
                            name='position'
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        />
                    </div>

                    <div className='flex space-x-2'>
                        <Input
                            placeholder='Специальность'
                            className='flex-1'
                            name='speciality'
                            value={formData.speciality}
                            onChange={(e) =>
                                setFormData({ ...formData, speciality: e.target.value })
                            }
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
                        <Select
                            value={formData.workSchedule}
                            onValueChange={handleSelectChange('workSchedule')}
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

                        <Select
                            value={formData.applicationStatus}
                            onValueChange={handleSelectChange('applicationStatus')}
                        >
                            <SelectTrigger className='flex-1'>
                                <SelectValue placeholder='Статус отклика' />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(ApplicationStatusLabels).map((key) => (
                                    <SelectItem key={key} value={key}>
                                        {
                                            ApplicationStatusLabels[
                                                key as keyof typeof ApplicationStatusLabels
                                            ]
                                        }
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder='Город'
                            className='flex-1'
                            name='city'
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                    </div>

                    <div className='flex items-center space-x-2'>
                        <Switch
                            checked={rootStore.useRanking}
                            onCheckedChange={(value) => rootStore.setUseRanking(value)}
                            id='airplane-mode'
                        />
                        <Label htmlFor='airplane-mode'>Отранжировать кандидатов</Label>
                    </div>

                    <div className='flex space-x-2'>
                        <Button
                            className='w-1/3'
                            type='button'
                            variant={'outline'}
                            onClick={() =>
                                setFormData({
                                    name: '',
                                    city: '',
                                    position: '',
                                    speciality: '',
                                    grade: '',
                                    experience: '',
                                    workSchedule: '',
                                    applicationStatus: '',
                                    vacancyId: '',
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

export default ApplicationsFilter;
