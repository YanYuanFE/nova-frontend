"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [searchParams] = useSearchParams()
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'github-auth-success') {
                const redirectUrl = searchParams.get('redirect');
                window.location.href = redirectUrl ? decodeURIComponent(redirectUrl) :'/'; // 或者其他你想跳转的页面
            }
        };
    
        window.addEventListener('message', handleMessage);
    
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    async function handleSignByGithub(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true);
        // 在当前页面打开 /api/auth/github 窗口
        // window.location.href = '/api/auth/github';

        const authWindow = window.open('/api/auth/github','github',
      'width=500,height=500');
      if (authWindow) {
        const timer = setInterval(() => {
            if (authWindow.closed) {
                clearInterval(timer);
                setIsLoading(false);
            }
        }, 500);
    }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Button variant="outline" type="button" disabled={isLoading} onClick={handleSignByGithub}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.gitHub className="mr-2 h-4 w-4" />
                )}{" "}
                GitHub
            </Button>
        </div>
    )
}