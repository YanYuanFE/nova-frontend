import { useAccount } from '@starknet-react/core';
import { createContext, useContext, useState } from 'react';
import { AccountInterface } from 'starknet';

interface AccountProviderProps {
  walletAccount: AccountInterface | undefined;
  devAccount: AccountInterface | undefined;
  setDevAccount: any;
}

const AccountContext = createContext<AccountProviderProps | undefined>(undefined);

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const { account: walletAccount } = useAccount();
  const [devAccount, setDevAccount] = useState<AccountInterface | undefined>(undefined);

  return (
    <AccountContext.Provider value={{ walletAccount, devAccount, setDevAccount }}>{children}</AccountContext.Provider>
  );
};

export function useAllAccounts() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccountProvider must be used within an AccountProvider');
  }
  return context;
}
