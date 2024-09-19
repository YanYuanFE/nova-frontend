import { useEffect, useContext, useRef } from 'react'

export enum LogType {
    Error,
    Warn,
    Info,
}

export interface ILog {
    type: LogType;
    message: string;
}

export const Console = ({logs}:{logs: Array<ILog>}) => {
    const container = useRef<HTMLDivElement>(null)
    const endDiv = useRef<HTMLDivElement>(null)

    useEffect(() => {
        container.current?.parentElement?.scrollTo({
            top: endDiv.current?.offsetTop,
            behavior: 'smooth',
        })
    }, [logs])

    return (
        <div ref={container} className="p-4">
            <p className="text-gray-500 dark:text-[#BDBDBD] font-medium uppercase text-[13px] leading-6">
                Console
            </p>
            <div className="leading-6 text-tiny text-gray-400 dark:text-darkMode-text">
                {logs.map((log, index) => (
                    <pre key={index} className="whitespace-pre-wrap break-words">
            {log.type === LogType.Error && (
                <span className="text-red-500">[Error] </span>
            )}
                        {log.type === LogType.Warn && (
                            <span className="text-yellow-500">[Warn] </span>
                        )}
                        {log.message}
          </pre>
                ))}
                <div ref={endDiv}></div>
            </div>
        </div>
    )
}