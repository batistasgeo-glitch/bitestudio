import type { Metadata } from 'next';
import '@fontsource/unbounded/latin-700.css';
import '@fontsource/unbounded/latin-900.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import './globals.css';
export const metadata: Metadata = {title: {default:'Bite Studio — Marcas que deixam marca.',template:'%s · Bite Studio'},description:'Estratégia, comunicação e identidade para marcas com personalidade e intenção. Conheça três direções criativas da Bite Studio.'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="pt-BR"><body>{children}</body></html>}
