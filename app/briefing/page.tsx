import {Suspense} from 'react';
import Briefing from '@/components/Briefing';
export const metadata={title:'Comece seu projeto'};
export default function Page(){return <Suspense fallback={<p>Preparando seu briefing…</p>}><Briefing/></Suspense>}
