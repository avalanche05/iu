import { CircleUser, Menu, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth';
import { LoaderButton } from './ui/loader-button';
import { Pages } from '@/router/constants';

type DashboardProps = {
    children: React.ReactNode;
};

export function Dashboard({ children }: DashboardProps) {
    const navigate = useNavigate();
    const auth = useAuth();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    return (
        <>
            <div className='flex min-h-screen w-full flex-col'>
                <header className='sticky top-0 flex justify-between h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
                    <div>
                        <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
                            <Link to='/' className='flex items-center gap-2 font-semibold'>
                                <Package2 className='h-6 w-6' />
                                <span className=''>HR Monitor</span>
                            </Link>

                            <Navigation />
                        </nav>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='shrink-0 md:hidden'
                                >
                                    <Menu className='h-5 w-5' />
                                    <span className='sr-only'>Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side='left'>
                                <nav className='grid gap-6 text-lg font-medium'>
                                    <Link
                                        to='/'
                                        className='flex items-center gap-2 text-lg font-semibold'
                                    >
                                        <Package2 className='h-6 w-6' />
                                        HR Monitor
                                    </Link>

                                    <Navigation />
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className='flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='secondary' size='icon' className='rounded-full'>
                                    <CircleUser className='h-5 w-5' />
                                    <span className='sr-only'>Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() =>
                                        auth.logout(() => {
                                            navigate(from, { replace: true });
                                        })
                                    }
                                >
                                    Выйти
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10'>
                    {children}
                </main>
            </div>
        </>
    );
}

const Navigation = () => {
    return (
        <>
            <Link to={`/${Pages.Applications}`} className='flex items-center gap-2'>
                <LoaderButton className='flex w-full items-center gap-3 rounded-lg px-3 py-2 my-2 text-muted-foreground transition-all hover:bg-slate-100 bg-slate-50'>
                    Отклики
                </LoaderButton>
            </Link>

            <Link to={`/${Pages.Vacancies}`} className='flex items-center gap-2'>
                <LoaderButton className='flex w-full items-center gap-3 rounded-lg px-3 py-2 my-2 text-muted-foreground transition-all hover:bg-slate-100 bg-slate-50'>
                    Вакансии
                </LoaderButton>
            </Link>

            <Link to={`/${Pages.Comparision}`} className='flex items-center gap-2'>
                <LoaderButton className='flex w-full items-center gap-3 rounded-lg px-3 py-2 my-2 text-muted-foreground transition-all hover:bg-slate-100 bg-slate-50'>
                    Сравнение
                </LoaderButton>
            </Link>

            <Link to={`/${Pages.Uploader}`} className='flex items-center gap-2'>
                <LoaderButton className='flex w-full items-center gap-3 rounded-lg px-3 py-2 my-2 text-muted-foreground transition-all hover:bg-slate-100 bg-slate-50'>
                    Загрузка резюме
                </LoaderButton>
            </Link>

            <Link to={`/${Pages.InterviewFeedback}`} className='flex items-center gap-2'>
                <LoaderButton className='flex w-full items-center gap-3 rounded-lg px-3 py-2 my-2 text-muted-foreground transition-all hover:bg-slate-100 bg-slate-50'>
                    Анализ собеседования
                </LoaderButton>
            </Link>

            <a
                href='http://misis.tech:3001/d/de025514pmfb4f/statistika-rekrutjorov?orgId=1'
                target='_blank'
                className='flex items-center gap-2'
            >
                <LoaderButton className='flex w-full items-center gap-3 rounded-lg px-3 py-2 my-2 text-muted-foreground transition-all hover:bg-slate-100 bg-slate-50'>
                    Статистика
                </LoaderButton>
            </a>
        </>
    );
};
