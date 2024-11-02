import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import GenerateFeedbackApiServie from '@/api/GenerateFeedbackApiServie';
import { Loader2 } from 'lucide-react';

type Props = {
    vacancyId: number;
    candidateId: number;
};

const GenerateFeedbackBlock = ({ vacancyId, candidateId }: Props) => {
    const [generatedText, setGeneratedText] = useState('');
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const [isRejectLoading, setIsRejectLoading] = useState(false);

    return (
        <>
            <p className='text-sm'>
                Составить текст сообщения кандидату на основе его профиля и вакансии, на которую он
                подался.
            </p>

            <div className='space-y-2'>
                <Button
                    disabled={isApproveLoading || isRejectLoading}
                    onClick={() => {
                        setIsApproveLoading(true);

                        GenerateFeedbackApiServie.fetchApproveFeedback({
                            candidateId,
                            vacancyId,
                        })
                            .then(({ message }) => {
                                setGeneratedText(message);
                            })
                            .catch(() => {})
                            .finally(() => {
                                setIsApproveLoading(false);
                            });
                    }}
                    variant='default'
                    className='w-full'
                >
                    {isApproveLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    Составить положительный фидбек
                </Button>

                <Button
                    disabled={isApproveLoading || isRejectLoading}
                    onClick={() => {
                        setIsRejectLoading(true);

                        GenerateFeedbackApiServie.fetchRejectFeedback({
                            candidateId,
                            vacancyId,
                        })
                            .then(({ message }) => {
                                setGeneratedText(message);
                            })
                            .catch(() => {})
                            .finally(() => {
                                setIsRejectLoading(false);
                            });
                    }}
                    variant='secondary'
                    className='w-full'
                >
                    {isRejectLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    Составить отрицательный фидбек
                </Button>
            </div>

            <Textarea
                placeholder='Сгенерированный текст появится здесь'
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                rows={4}
            />
        </>
    );
};

export default GenerateFeedbackBlock;
