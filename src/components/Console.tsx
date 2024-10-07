import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';

export enum LogType {
  Error,
  Warn,
  Info
}

export interface ILog {
  type: LogType;
  message: string;
}

export const Console = ({ logs }: { logs: Array<ILog> }) => {
  const container = useRef<HTMLDivElement>(null);
  const endDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    container.current?.parentElement?.scrollTo({
      top: endDiv.current?.offsetTop,
      behavior: 'smooth'
    });
  }, [logs]);
  console.log(logs);

  return (
    <div ref={container} className="p-4 bg-background rounded-sm">
      <p className="text-gray-500 dark:text-[#BDBDBD] font-medium uppercase text-[13px] leading-6">Console</p>
      <ScrollArea className="h-[200px]">
        <div className="leading-6 text-tiny text-gray-400 dark:text-darkMode-text">
            {logs.map((log, index) => (
            <pre key={index} className="whitespace-pre-wrap break-words text-sm">
                {log.type === LogType.Error && <span className="text-red-500">[Error] </span>}
                {log.type === LogType.Warn && <span className="text-yellow-500">[Warn] </span>}
                {log.type === LogType.Info && <span className="text-green-500">[Info] </span>}
                {log.message}
            </pre>
            ))}
            <div ref={endDiv}></div>
        </div>
      </ScrollArea>
    </div>
  );
};
