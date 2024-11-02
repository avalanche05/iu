import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useStores } from '@/hooks/useStores';
import { Loader2 } from 'lucide-react';
import { toast } from './ui/use-toast';
import { ApplicationStatus, ApplicationStatusLabels } from '@/api/models';

type Props = {
    applicationId: number;
    currentStatus: ApplicationStatus;
};

const ChangeApplicationStatusButton = ({ applicationId, currentStatus }: Props) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<ApplicationStatus | null>(null);

    const { rootStore } = useStores();

    const handleChangeApplicationStatus = () => {
        if (status == null) {
            return;
        }

        setLoading(true);

        rootStore
            .changeApplicationStatus(applicationId, status)
            .catch(() => {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось изменить статус отклика',
                    variant: 'destructive',
                });
            })
            .finally(() => {
                setLoading(false);
                setOpen(false);
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='outline'>Изменить статус</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Изменить статус</DialogTitle>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div>
                        <Label htmlFor='name' className='text-right'>
                            Новый статус отклика
                        </Label>
                        <Select
                            onValueChange={(value) =>
                                setStatus(value as keyof typeof ApplicationStatusLabels)
                            }
                            defaultValue={currentStatus}
                        >
                            <SelectTrigger className='flex-1'>
                                <SelectValue placeholder='Статус отклика' />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(ApplicationStatusLabels).map((key) => (
                                    <SelectItem key={key} value={key}>
                                        {
                                            ApplicationStatusLabels[
                                                key as keyof typeof ApplicationStatusLabels
                                            ]
                                        }
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button disabled={loading} onClick={handleChangeApplicationStatus}>
                    {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    Добавить
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeApplicationStatusButton;
