import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccountCard } from './AccountCard';
import AccountMsg from './AccountMsg';

export default function Enviroment({
  account,
  balance,
  env,
  setEnv,
  setStatus
}: {
  account: any;
  balance: any;
  env: string;
  setEnv: any;
  setStatus: any;
}) {
  const handleNetwork = (value: string) => {
    setEnv(value);
  };
  return (
    <div>
      <Accordion type="single" collapsible className="w-full relative">
        <AccordionItem value="item-1">
          <AccordionTrigger className="bg-neutral-500 hover:no-underline rounded-lg p-4">
            <AccountMsg env={env} account={account} balance={balance!} />
          </AccordionTrigger>
          <AccordionContent className="bg-slate-800 text-white absolute z-10 mt-1 w-full">
            <div className="p-4 bg-neutral-500 shadow-lg rounded-lg w-full">
              <Select value={env} onValueChange={handleNetwork}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Select Environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="devnet">Devnet</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-4">
                <AccountCard env={env} account={account!} onStatus={setStatus} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
