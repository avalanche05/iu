import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from './ui/use-toast';
import ResumeUploadApiService from '@/api/ResumeUploadApiService';
import { ResumeUploadResponse } from '@/api/models';
import { Input } from './ui/input';
import { Progress } from './ui/progress';

const CreateVacancyFromPdfButton = () => {
    const [open, setOpen] = useState(false);

    const [uploadResponse, setUploadResponse] = useState<ResumeUploadResponse | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;

        if (fileList) {
            setFiles(Array.from(fileList));
        }
    };

    const uploadFiles = () => {
        setIsUploading(true);

        ResumeUploadApiService.uploadFiles(files)
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
                        // setOpen(false);
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='outline'>Загрузить вакансию (.pdf)</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Загрузить вакансию (.pdf)</DialogTitle>
                </DialogHeader>

                <div>
                    <p>
                        Загрузите файлы с вакансиями, чтобы начать их обработку. После обработки
                        вакансии появятся в списке.
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
                                                    <span className='font-semibold'>
                                                        {file.file_name}
                                                    </span>

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
                                        <h2 className='text-lg font-semibold mb-2'>
                                            Успешно загружены
                                        </h2>
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

                                                    <Progress value={100} className='w-full' />
                                                    <p className='text-sm text-gray-500 mt-1'>
                                                        Статус: Успешно загружен
                                                    </p>
                                                </div>
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
                                                    <span className='font-semibold'>
                                                        {file.file_name}
                                                    </span>

                                                    <AlertCircle className='h-4 w-4 text-red-500' />
                                                </div>
                                                <Progress value={100} className='w-full' />
                                                <p className='text-sm text-gray-500 mt-1'>
                                                    Статус: Ошибка
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateVacancyFromPdfButton;
