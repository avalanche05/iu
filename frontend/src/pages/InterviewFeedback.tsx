import { Candidate, InterviewUploadResponse } from '@/api/models';
import ResumeUploadApiService from '@/api/ResumeUploadApiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ChevronsUpDown, Loader2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStores } from '@/hooks/useStores';
import RadarChart from '@/components/RadarChart';

const InterviewFeedback = observer(() => {
    const [uploadResponse, setUploadResponse] = useState<InterviewUploadResponse | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [comboboxOpen, setComboboxOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

    const { rootStore } = useStores();

    useEffect(() => {
        rootStore.fetchCandidates().catch(() => {
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить кандидатов',
                variant: 'destructive',
            });
        });
    }, [rootStore]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (files) {
            setFile(files[0]);
        }
    };

    const uploadFiles = () => {
        if (file) {
            if (!selectedCandidate) {
                return;
            }

            setIsUploading(true);

            ResumeUploadApiService.uploadInterview(file, selectedCandidate.id)
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
            if (!selectedCandidate) {
                return;
            }

            ResumeUploadApiService.fetchInterviewStatus(sessionId, selectedCandidate.id)
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
                Результат технического интервью появится в карточке кандидата. Его можно будет
                сравнить с оценкой кандидата по профилю в GitHub.
            </p>

            <div className='mb-4 mt-4'>
                <div className='flex gap-4'>
                    <div className='w-1/2'>
                        <Input
                            type='file'
                            accept='.mp3'
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className='mb-2 cursor-pointer w-full'
                        />
                    </div>

                    <div className='w-1/2'>
                        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant='outline'
                                    role='combobox'
                                    aria-expanded={comboboxOpen}
                                    className='w-full justify-between'
                                >
                                    {selectedCandidate
                                        ? rootStore.candidates?.find(
                                              (candidate) => candidate.id === selectedCandidate.id
                                          )?.nickname
                                        : 'Выберите кандидата...'}
                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                                <Command>
                                    <CommandInput placeholder='Поиск кандидата...' />
                                    <CommandList>
                                        <CommandEmpty>Кандидаты не найдены.</CommandEmpty>
                                        <CommandGroup>
                                            {rootStore.candidates?.map((candidate) => (
                                                <CommandItem
                                                    key={candidate.id}
                                                    value={candidate.nickname}
                                                    onSelect={(currentValue) => {
                                                        console.log(currentValue);

                                                        const candidate =
                                                            rootStore.candidates?.find(
                                                                (c) => c.nickname === currentValue
                                                            );

                                                        if (candidate) {
                                                            setSelectedCandidate(candidate);
                                                        }

                                                        setComboboxOpen(false);
                                                    }}
                                                >
                                                    {candidate.nickname}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <Button
                    disabled={isUploading || file == null || selectedCandidate == null}
                    onClick={uploadFiles}
                >
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
                                    <p>{uploadResponse.interview.summary}</p>
                                </div>

                                <div>
                                    <h3 className='font-semibold text-lg md:text-xl mb-2 mt-3'>
                                        Карта компетенций
                                    </h3>

                                    <div className='max-w-lg'>
                                        <RadarChart
                                            datasets={[
                                                {
                                                    label:
                                                        selectedCandidate?.nickname ??
                                                        'Оценка кандидата',
                                                    data: uploadResponse.interview.competencies.map(
                                                        (competency) => competency.proficiency
                                                    ),
                                                },
                                            ]}
                                            labels={uploadResponse.interview.competencies.map(
                                                (competency) => competency.name
                                            )}
                                        />
                                    </div>
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
