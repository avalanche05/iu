import { useAuth } from '@/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderButton } from '@/components/ui/loader-button';
import { useToast } from '@/components/ui/use-toast';
import { Terminal } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);

    const from = location.state?.from?.pathname || '/';

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const login = formData.get('login') as string;
        const password = formData.get('password') as string;

        auth.login({ username: login, password }, () => {
            navigate(from, { replace: true });
        })
            .catch(() => {
                toast({
                    title: 'Ошибка',
                    description: 'Ошибка аутентификации. Попробуйте еще раз.',
                    variant: 'destructive',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className='flex items-center h-screen'>
            <Card className='mx-auto max-w-sm min-w-96'>
                <CardHeader>
                    <CardTitle className='text-2xl'>Вход</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='grid gap-4'>
                        <div className='grid gap-2'>
                            <Label htmlFor='login'>Логин</Label>
                            <Input defaultValue={'1'} id='login' name='login' required />
                        </div>
                        <div className='grid gap-2'>
                            <div className='flex items-center'>
                                <Label htmlFor='password'>Пароль</Label>
                            </div>
                            <Input
                                defaultValue={'1'}
                                id='password'
                                name='password'
                                type='password'
                                required
                            />
                        </div>

                        <LoaderButton isLoading={loading} type='submit' className='w-full'>
                            Войти
                        </LoaderButton>
                    </form>

                    <Alert className='mt-4'>
                        <Terminal className='h-4 w-4' />
                        <AlertTitle>Учетные данные для доступа в приложение:</AlertTitle>
                        <AlertDescription>
                            <div className='text-sm'>
                                <div>Логин: 1</div>
                                <div>Пароль: 1</div>
                            </div>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
