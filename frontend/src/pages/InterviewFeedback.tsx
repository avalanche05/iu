import { InterviewUploadResponse } from '@/api/models';
import ResumeUploadApiService from '@/api/ResumeUploadApiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

const InterviewFeedback = observer(() => {
    const [uploadResponse, setUploadResponse] = useState<InterviewUploadResponse | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (files) {
            setFile(files[0]);
        }
    };

    const uploadFiles = () => {
        console.log(file);

        if (file) {
            setIsUploading(true);

            ResumeUploadApiService.uploadInterview(file)
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
        }
    };

    const startPolling = (sessionId: string) => {
        const interval = setInterval(() => {
            ResumeUploadApiService.fetchInterviewStatus(sessionId)
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
            <h1 className='font-semibold text-lg md:text-2xl mb-4'>
                Загрузить запись собеседования
            </h1>

            <p>
                Загрузите .mp3 файл с записью собеседования и нажмите на кнопку "Обработать". После
                обработки вы получите краткие заметки о собеседовании и пример фидбека кандидату.
            </p>

            <div className='mb-4 mt-4'>
                <div className='flex gap-4'>
                    <Input
                        type='file'
                        accept='.mp3'
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className='mb-2 cursor-pointer w-1/2'
                    />
                </div>

                <Button disabled={isUploading || file == null} onClick={uploadFiles}>
                    {isUploading ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Загрузка...
                        </>
                    ) : (
                        'Обработать запись .mp3'
                    )}
                </Button>
            </div>
            <div className='space-y-4'>
                {uploadResponse && uploadResponse.is_finished && (
                    <>
                        <Card>
                            <CardTitle></CardTitle>
                            <CardContent>
                                <h2 className='font-semibold text-lg md:text-2xl mb-4 pt-4'>
                                    Результаты обработки
                                </h2>
                                <div>
                                    <h3 className='font-semibold text-lg md:text-xl mb-2'>
                                        Заметки о собеседовании
                                    </h3>
                                    <p>{uploadResponse.message}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
});

export default InterviewFeedback;
