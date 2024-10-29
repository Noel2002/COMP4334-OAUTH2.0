import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react'

const Login = () => {
    const params = useSearchParams();
    const redirectUri = params.get('redirect_uri');
    const clientId = params.get('client_id');
    const scope = params.get('scope');
    const state = params.get('state');
    const router = useRouter();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const handleLogin = async () => {
        try {
            const res = await axios.post('/api/oauth/code', { username, password, client_id: clientId, scope, state, redirect_uri: redirectUri });
            const { authCode } = res.data;
            router.push(`${redirectUri}?code=${authCode}`);
            
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Invalid credentials",
                description: "Incorrect username or password. Please try again",
                // action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }
  return (
    <main className=' min-h-screen flex flex-col justify-center items-center gap-12 bg-[#f7f8fa] font-montserrat'>
        <h1 className=' font-bold text-2xl text-primary'>OAUTH 2.0</h1>
        <div className=' w-[500px] rounded-3xl bg-white p-12 flex flex-col items-center gap-12'>
            <div>
                <h2 className=' text-2xl font-light'>Welcome back</h2>
                <p className=' font-extralight text-center'>Sign in to continue</p>
            </div>
            <div className=' flex flex-col gap-8 w-full'>
                <input 
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    type="text" 
                    name='username' 
                    placeholder='Enter your username'
                    className=' w-full border-b border-primary focus:outline-none py-2'
                    />
                <input 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password" 
                    name='password' 
                    placeholder='Enter your password'
                    className=' w-full border-b border-primary focus:outline-none'
                />
            </div>
            <button
                onClick={handleLogin} 
                className=' uppercase font-medium text-foreground w-full py-3 rounded-full bg-primary'
            >
                sign in
            </button>
        </div>
    </main>
  )
}

export default Login