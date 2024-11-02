import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const Statistics = () => {
    return (
        <div className='p-4 space-y-4 bg-gray-100 min-h-screen'>
            <div className='flex items-center space-x-4 bg-white p-4 rounded-lg shadow'>
                <span className='text-sm font-medium'>Аналитика за период:</span>
                <Select defaultValue='month'>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Выберите период' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='month'>Месяц</SelectItem>
                        <SelectItem value='quarter'>Квартал</SelectItem>
                        <SelectItem value='year'>Год</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='grid md:grid-cols-2 gap-4'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>
                            Самые популярные специализации по количеству резюме
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className='space-y-2'>
                            {[
                                { title: 'Product-менеджер', count: 98 },
                                { title: 'Разработчик Python', count: 72 },
                                { title: 'Маркетолог', count: 70 },
                                { title: 'Оператор call-центра', count: 67 },
                                { title: 'Продавец-консультант', count: 66 },
                            ].map((item) => (
                                <li key={item.title} className='flex items-center justify-between'>
                                    <span className='text-purple-600'>{item.title}</span>
                                    <span className='bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm'>
                                        {item.count}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>
                            Самые малочисленные специализации по резюме
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className='space-y-2'>
                            {[
                                { title: 'Product-менеджер', count: 15 },
                                { title: 'Разработчик Python', count: 9 },
                                { title: 'Маркетолог', count: 8 },
                                { title: 'Оператор call-центра', count: 7 },
                                { title: 'Продавец-консультант', count: 3 },
                            ].map((item) => (
                                <li key={item.title} className='flex items-center justify-between'>
                                    <span className='text-purple-600'>{item.title}</span>
                                    <span className='bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm'>
                                        {item.count}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Statistics;
