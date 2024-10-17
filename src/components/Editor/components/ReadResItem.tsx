import { interactSwitchRes } from '@/utils/result';

export default function ReadResItem({ result }: { result: any }) {
  return (
    <div className="bg-card rounded-lg p-4 max-w-[250px]">
      <h2 className="font-bold mb-2">Result:</h2>
      <div className="p-2 rounded overflow-hidden whitespace-normal break-words">
        {interactSwitchRes(result?.type, result?.value)}
      </div>
    </div>
  );
}
