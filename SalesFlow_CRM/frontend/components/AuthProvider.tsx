'use client';
import { createContext,useContext,useEffect,useState } from 'react';
import { usePathname,useRouter } from 'next/navigation';
import { api } from '@/lib/api';import { User } from '@/lib/types';
interface AuthContextType{user:User|null;loading:boolean;refresh:()=>Promise<void>;logout:()=>Promise<void>}
const AuthContext=createContext<AuthContextType|undefined>(undefined);
export function AuthProvider({children}:{children:React.ReactNode}){const[user,setUser]=useState<User|null>(null);const[loading,setLoading]=useState(true);const router=useRouter();const pathname=usePathname();
 const refresh=async()=>{try{const{data}=await api.get('/auth/me');setUser(data);}catch{setUser(null);}finally{setLoading(false);}};
 useEffect(()=>{refresh();},[]);
 useEffect(()=>{if(!loading&&!user&&!pathname.startsWith('/login')&&!pathname.startsWith('/register'))router.replace('/login');},[loading,user,pathname,router]);
 const logout=async()=>{await api.post('/auth/logout');setUser(null);router.push('/login');};
 return <AuthContext.Provider value={{user,loading,refresh,logout}}>{children}</AuthContext.Provider>}
export function useAuth(){const c=useContext(AuthContext);if(!c)throw new Error('useAuth must be inside AuthProvider');return c;}
