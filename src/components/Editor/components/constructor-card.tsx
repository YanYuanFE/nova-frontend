import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Abi, getConstructor } from '@/utils/contract';
import { useState } from 'react';

export default function ConstructorCard({ abi, onDeploy, status }: { abi: Abi; onDeploy: any; status: string }) {
  const inputs = getConstructor(abi)?.inputs ?? [];
  const [inputValues, setinputValues] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('inputsValue:', inputValues);
    const calldata = inputs.map((input) => inputValues[input.name]);
    console.log('calldata:', calldata);
    onDeploy(calldata);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinputValues((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="p-4 bg-neutral-500  shadow-lg rounded-lg">
      <h1 className="text-base font-semibold mb-4">Constructor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          {inputs?.map((input, index) => {
            return (
              <div key={index} className="mb-3">
                <div className="mb-2">
                  <label className="text-sm font-medium text-white inline-block mr-2">{input.name}</label>
                  <label className="text-sm text-white">{input.type}</label>
                </div>
                <Input
                  required
                  placeholder={input.name}
                  name={input.name}
                  value={inputValues[input.name] || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-10"
                />
              </div>
            );
          })}
        </div>

        <Button type="submit" disabled={status !== 'deploy'} className="w-full rounded-md">
          Deploy
        </Button>
      </form>
    </div>
  );
}
