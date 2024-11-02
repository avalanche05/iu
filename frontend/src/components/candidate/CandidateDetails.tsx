import { Candidate } from '@/api/models';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge, Briefcase, FileText, GraduationCap, LampDesk, Mail, PhoneCall } from 'lucide-react';

type Props = {
    candidate: Candidate;
};

const CandidateDetails = ({ candidate }: Props) => {
    return (
        <Tabs defaultValue='info' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='info'>Info</TabsTrigger>
                <TabsTrigger value='timeline'>Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value='info'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex items-center space-x-2'>
                            <PhoneCall className='w-5 h-5 text-muted-foreground' />
                            <span>{candidate.phone}</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Mail className='w-5 h-5 text-muted-foreground' />
                            <span>{candidate.email}</span>
                        </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Briefcase className='w-5 h-5 text-muted-foreground' />
                        <span>
                            {candidate.experience} - {candidate.position} - {candidate.speciality} -{' '}
                            {candidate.grade}
                        </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <GraduationCap className='w-5 h-5 text-muted-foreground' />
                        <span>{candidate.education}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <LampDesk className='w-5 h-5 text-muted-foreground' />
                        <span>{candidate.summary}</span>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-2'>Skills</h4>
                        <div className='flex flex-wrap gap-2'>
                            {candidate.skills.map((skill) => (
                                <Badge key={skill} fontVariant='secondary'>
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <FileText className='w-5 h-5 text-muted-foreground' />
                        <a
                            href={candidate.resume_link}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 hover:underline'
                        >
                            Посмотреть резюме
                        </a>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value='timeline'>
                {/* <Timeline>
            {statusOptions.map((status, index) => (
                <TimelineItem key={status}>
                    <TimelineSeparator>
                        <TimelineDot
                            color={candidate.status === status ? 'primary' : 'grey'}
                        />
                        {index < statusOptions.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>{status}</TimelineContent>
                </TimelineItem>
            ))}
        </Timeline> */}
            </TabsContent>
        </Tabs>
    );
};

export default CandidateDetails;
