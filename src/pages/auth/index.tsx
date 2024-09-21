import { Loading } from "@/components/Loading";
import { authCallBack } from "@/services/user";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";


export default function Auth() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    const isAuthenticatedRef = useRef(false);

    const handleAuth = async () => {
        if (code && !isAuthenticatedRef.current) {
            isAuthenticatedRef.current = true;
            const res = await authCallBack(code);
            console.log(res);
            if (window.opener) {
                window.opener.postMessage('github-auth-success', '*');
                window.close();
            }
        }
    }

    useEffect(() => {
        handleAuth();
    }, [code]);

    return (
        <Loading loading={true}>
            <div>Logging in, please wait</div>
        </Loading>
    )
}