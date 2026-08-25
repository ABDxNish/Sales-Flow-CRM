import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'SalesFlow CRM', description: 'CRM & Sales Pipeline SaaS' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body>{children}</body></html>;
}
