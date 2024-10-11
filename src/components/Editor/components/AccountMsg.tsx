import { shortenAddress } from '@/utils';

export default function AccountMsg({ env, account, balance }: { env: string; account: any; balance: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center pl-4 max-w-[300px]">
      <h2 className="self-start">{env}</h2>
      <div>
        <span className=" mr-2">{account?shortenAddress(account?.address):'null'}</span>
        <span>({balance ? balance : '0'})</span>
      </div>
    </div>
  );
}
