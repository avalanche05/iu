import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import { Skeleton } from './ui/skeleton';
import { toast } from './ui/use-toast';

const Folders = observer(() => {
    const [newFolderOpen, setNewFolderOpen] = useState(false);
    const [isNewFolderCreating, setIsNewFolderCreating] = useState(false);
    const [folderName, setFolderName] = useState('');

    const { rootStore } = useStores();

    const handleAddFolder = () => {
        setIsNewFolderCreating(true);

        rootStore
            .createFolder(folderName)
            .then(() => {
                setNewFolderOpen(false);
                setFolderName('');
            })
            .catch(() => {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось добавить папку',
                    variant: 'destructive',
                });
            })
            .finally(() => {
                setIsNewFolderCreating(false);
            });
    };

    return (
        <>
            {rootStore.isFoldersLoading ? (
                <Skeleton className='h-12 w-full mb-2' />
            ) : (
                <div className='flex items-center space-x-2 mb-4'>
                    <ChevronLeft className='w-6 h-6 text-gray-400' />
                    <div className='flex-1 overflow-x-auto'>
                        <div className='flex space-x-2'>
                            <Button
                                variant={!rootStore.activeFolderId ? 'default' : 'outline'}
                                className='whitespace-nowrap'
                                onClick={() => rootStore.setActiveFolderId(null)}
                            >
                                Все
                                <span className='ml-2 text-xs'>
                                    {rootStore.applications?.length}
                                </span>
                            </Button>

                            {rootStore.folders.map((folder, index) => (
                                <Button
                                    key={`${folder.name}${index}`}
                                    variant={
                                        rootStore.activeFolderId === folder.id
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className='whitespace-nowrap'
                                    onClick={() => rootStore.setActiveFolderId(folder.id)}
                                >
                                    {folder.name}{' '}
                                    <span className='ml-2 text-xs'>{folder.candidates_count}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                    <ChevronRight className='w-6 h-6 text-gray-400' />
                    <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
                        <DialogTrigger asChild>
                            <Button variant='outline' size='icon'>
                                <Plus className='h-4 w-4' />
                            </Button>
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
                                    <Input
                                        value={folderName}
                                        onChange={(e) => setFolderName(e.target.value)}
                                        id='name'
                                        className='col-span-3'
                                    />
                                </div>
                            </div>
                            <Button disabled={isNewFolderCreating} onClick={handleAddFolder}>
                                {isNewFolderCreating && (
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                )}
                                Добавить
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </>
    );
});

export default Folders;
