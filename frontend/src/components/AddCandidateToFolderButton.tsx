import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useStores } from '@/hooks/useStores';
import { Loader2 } from 'lucide-react';
import { toast } from './ui/use-toast';

type Props = {
    candidateId: number;
};

const AddCandidateToFolderButton = ({ candidateId }: Props) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [folderId, setFolderId] = useState('');

    const { rootStore } = useStores();

    const handleAddCandidateToFolder = () => {
        setLoading(true);

        rootStore
            .addCandidateToFolder(candidateId, +folderId)
            .then(() => {
                setOpen(false);
            })
            .catch(() => {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось добавить кандидата в папку',
                    variant: 'destructive',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='outline'>Добавить в папку</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить папку</DialogTitle>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div>
                        <Label htmlFor='name' className='text-right'>
                            Название
                        </Label>
                        <Select
                            onValueChange={(value) => setFolderId(value)}
                            defaultValue={folderId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Выберите папку' />
                            </SelectTrigger>
                            <SelectContent>
                                {rootStore.folders.map((folder) => (
                                    <SelectItem key={folder.id} value={folder.id.toString()}>
                                        {folder.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button disabled={loading} onClick={handleAddCandidateToFolder}>
                    {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    Добавить
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AddCandidateToFolderButton;
