import { ResumeUploadResponse } from '@/api/models';
import ResumeUploadApiService from '@/api/ResumeUploadApiService';
import CandidateCard from '@/components/candidate/CandidateCard';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/hooks/useStores';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

const Uploader = observer(() => {
    const [uploadResponse, setUploadResponse] = useState<ResumeUploadResponse | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedVacancyId, setSelectedVacancyId] = useState<number | null>(null);

    const { rootStore } = useStores();

    useEffect(() => {
        rootStore.fetchVacancies({}).catch(() => {
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить вакансии',
                variant: 'destructive',
            });
        });
    }, [rootStore]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;

        if (fileList) {
            setFiles(Array.from(fileList));
        }
    };

    const uploadFiles = () => {
        setIsUploading(true);

        ResumeUploadApiService.uploadFiles(files, selectedVacancyId || undefined)
            .then((response) => {
                startPolling(response.session_id);
            })
            .catch(() => {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось загрузить файлы',
                    variant: 'destructive',
                });
            });
    };

    const startPolling = (sessionId: string) => {
        const interval = setInterval(() => {
            ResumeUploadApiService.fetchUploadStatus(sessionId)
                .then((response) => {
                    setUploadResponse(response);

                    if (response.is_finished) {
                        clearInterval(interval);
                        setIsUploading(false);
                    }
                })
                .catch(() => {
                    clearInterval(interval);
                    setIsUploading(false);

                    setUploadResponse((prev) => {
                        if (!prev) {
                            return null;
                        }

                        return {
                            ...prev,
                            error: prev?.error.concat(prev.processing) || [],
                            processing: [],
                        };
                    });

                    toast({
                        title: 'Ошибка',
                        description: 'Не удалось загрузить файлы',
                        variant: 'destructive',
                    });
                });
        }, 5000);
    };

    return (
        <div>
            <h1 className='font-semibold text-lg md:text-2xl mb-4'>Загрузить резюме</h1>

            <p>
                Загрузите файлы с резюме кандидатов, чтобы начать их обработку. Если выбрать
                вакансию, то создастся отклик на эту вакансию.
            </p>

            <div className='mb-4 mt-4'>
                <div className='flex gap-4'>
                    <Input
                        type='file'
                        accept='.pdf'
                        multiple
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className='mb-2 cursor-pointer w-1/2'
                    />

                    <div className='w-1/2'>
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
                </div>

                <Button disabled={isUploading || files.length === 0} onClick={uploadFiles}>
                    {isUploading ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Загрузка...
                        </>
                    ) : (
                        'Загрузить резюме'
                    )}
                </Button>
            </div>
            <div className='space-y-4'>
                {uploadResponse && (
                    <>
                        {uploadResponse.processing.length > 0 && (
                            <div>
                                <h2 className='text-lg font-semibold mb-2'>Обработка</h2>
                                {uploadResponse.processing.map((file) => (
                                    <div
                                        key={file.file_name}
                                        className='border p-4 rounded-md mt-2'
                                    >
                                        <div className='flex items-center justify-between mb-2'>
                                            <span className='font-semibold'>{file.file_name}</span>

                                            <Loader2 className='h-4 w-4 animate-spin' />
                                        </div>
                                        <Progress value={0} className='w-full' />
                                        <p className='text-sm text-gray-500 mt-1'>
                                            Статус: обработка
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {uploadResponse.success.length > 0 && (
                            <div>
                                <h2 className='text-lg font-semibold mb-2'>Успешно загружены</h2>
                                {uploadResponse.success.map((file) => (
                                    <>
                                        <div
                                            key={file.file_name}
                                            className='border p-4 rounded-md mt-2'
                                        >
                                            <div className='flex items-center justify-between mb-2'>
                                                <span className='font-semibold'>
                                                    {file.file_name}
                                                </span>

                                                <CheckCircle className='h-4 w-4 text-green-500' />
                                            </div>

                                            <div>Имя: {file.candidate.name}</div>

                                            <Progress value={100} className='w-full' />
                                            <p className='text-sm text-gray-500 mt-1'>
                                                Статус: Успешно загружен
                                            </p>
                                        </div>
                                        <Accordion type='single' collapsible className='w-full'>
                                            <AccordionItem value='item-1'>
                                                <AccordionTrigger>
                                                    Информация о кандидате
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <CandidateCard candidate={file.candidate} />
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </>
                                ))}
                            </div>
                        )}

                        {uploadResponse.error.length > 0 && (
                            <div>
                                <h2 className='text-lg font-semibold mb-2'>Ошибка</h2>
                                {uploadResponse.error.map((file) => (
                                    <div
                                        key={file.file_name}
                                        className='border p-4 rounded-md mt-2'
                                    >
                                        <div className='flex items-center justify-between mb-2'>
                                            <span className='font-semibold'>{file.file_name}</span>

                                            <AlertCircle className='h-4 w-4 text-red-500' />
                                        </div>
                                        <Progress value={100} className='w-full' />
                                        <p className='text-sm text-gray-500 mt-1'>Статус: Ошибка</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
});

export default Uploader;
