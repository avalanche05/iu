import { Button } from './ui/button';
import { useStores } from '@/hooks/useStores';
import { Candidate } from '@/api/models';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Pages } from '@/router/constants';

type Props = {
    candidate: Candidate;
};

const AddToComparisionButton = observer(({ candidate }: Props) => {
    const { rootStore } = useStores();

    return (
        <>
            {rootStore.candidatesToCompare.find((c) => c.id === candidate.id) ? (
                <>
                    <Link to={`/${Pages.Comparision}`}>
                        <Button>Сравнить</Button>
                    </Link>

                    <Button
                        variant={'destructive'}
                        onClick={() => {
                            rootStore.removeCandidateToCompare(candidate.id);
                        }}
                    >
                        Удалить из сравнения
                    </Button>
                </>
            ) : (
                <Button
                    variant={'outline'}
                    onClick={() => {
                        rootStore.addCandidateToCompare(candidate);
                    }}
                >
                    Добавить в сравнение
                </Button>
            )}
        </>
    );
});

export default AddToComparisionButton;
