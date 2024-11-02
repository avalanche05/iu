import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Grade, GradeLabels } from '@/models/ICandidatesFilter';
import { useStores } from '@/hooks/useStores';
import { observer } from 'mobx-react-lite';
import { Tag, TagInput } from 'emblor';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const VacanciesFilter = observer(() => {
    const { rootStore } = useStores();

    const [tags, setTags] = useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        grade: '',
    });

    // Обработчик выбора для select полей
    const handleSelectChange = (name: string) => (value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    // Обработчик отправки формы
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        rootStore.setVacanciesFilter({
            title: formData.title || null,
            competencies: tags.map((tag) => tag.text).join(','),
            grade: (formData.grade as Grade) || null,
        });
    };

    return (
        <div className='w-full mx-auto'>
            <div className='flex flex-col space-y-4 mb-4'>
                <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col space-y-4 mb-4'>
                    <div className='flex space-x-2'>
                        <Input
                            placeholder='Название'
                            className='flex-1'
                            name='title'
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    </div>

                    <div className='flex space-x-2'>
                        <div className='w-full'>
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
                    </div>

                    <div className='flex space-x-2'>
                        <Button
                            className='w-1/3'
                            type='button'
                            variant={'outline'}
                            onClick={() => {
                                setFormData({
                                    grade: '',
                                    title: '',
                                });

                                setTags([]);
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

export default VacanciesFilter;
