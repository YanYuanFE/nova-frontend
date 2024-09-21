import {ReactNode} from "react";
import {Loader2} from "lucide-react";
import {cn} from "@/lib/utils.ts";

export const Loading = ({ children, loading, className }: { children: ReactNode; loading: boolean; className?: string }) => {
    return (
        <div className={cn('relative w-full h-full min-h-[30vh]', className)}>
            {loading ? (
                <div
                    className={
                        'absolute top-0 left-0 w-full h-full flex justify-center items-center bg-background/80 background-blur-sm z-[9999]'
                    }
                >
                    <Loader2 className="animate-spin" size={32} />
                </div>
            ) : children}
        </div>
    );
};