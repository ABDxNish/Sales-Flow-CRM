import { AuthProvider } from '@/components/AuthProvider';import Sidebar from '@/components/Sidebar';import RealtimeNotifications from '@/components/RealtimeNotifications';
export default function DashboardLayout({children}:{children:React.ReactNode}){return <AuthProvider><Sidebar/><RealtimeNotifications/><main className="min-h-screen p-5 lg:ml-64 lg:p-8">{children}</main></AuthProvider>}
