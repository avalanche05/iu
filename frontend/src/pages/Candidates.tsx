import { observer } from 'mobx-react-lite';
import CandidateCard from '@/components/candidate/CandidateCard';
import { useEffect } from 'react';
import { useStores } from '@/hooks/useStores';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import CandidatesFilter from '@/components/CandidatesFilter';

const Candidates = observer(() => {
    const { rootStore } = useStores();

    useEffect(() => {
        rootStore.fetchCandidates().catch(() => {
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить отклики',
                variant: 'destructive',
            });
        });

        rootStore.fetchFolders().catch(() => {
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить папки',
                variant: 'destructive',
            });
        });
    }, [rootStore]);

    return (
        <div className='container mx-auto p-4'>
            <CandidatesFilter />

            {rootStore.isCandidatesLoading ? (
                <>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className='h-40 w-full mt-5' />
                    ))}
                </>
            ) : (
                rootStore.candidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                ))
            )}
        </div>
    );
});

export default Candidates;
