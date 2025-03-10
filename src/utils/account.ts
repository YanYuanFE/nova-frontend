import { ec, stark, hash, CallData, Account, AccountInterface } from 'starknet';
import { getRpcProvider } from './provider';
import { chainMap } from '@/constants/config';

async function produceDevAccount(): Promise<AccountInterface | undefined> {
  const provider = getRpcProvider('devnet');

  const privateKey = stark.randomAddress();
  console.log('New OZ account:\nprivateKey=', privateKey);
  const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);
  console.log('publicKey=', starkKeyPub);

  const OZaccountClassHash = '0x061dac032f228abef9c6626f995015233097ae253a7f72d68552db02f2971b8f';
  const OZaccountConstructorCallData = CallData.compile({
    publicKey: starkKeyPub
  });
  const OZcontractAddress = hash.calculateContractAddressFromHash(
    starkKeyPub,
    OZaccountClassHash,
    OZaccountConstructorCallData,
    0
  );
  console.log('Precalculated account address=', OZcontractAddress);

  try {
    await mintDevToken(OZcontractAddress);

    // const balance = await getDevBalance(OZcontractAddress);
    // console.log('mint token success', 'balance=', balance);

    const OZaccount = new Account(provider, OZcontractAddress, privateKey);

    const { transaction_hash, contract_address } = await OZaccount.deployAccount({
      classHash: OZaccountClassHash,
      constructorCalldata: OZaccountConstructorCallData,
      addressSalt: starkKeyPub
    });

    await provider.waitForTransaction(transaction_hash);
    console.log('address =', contract_address, 'singner=', OZaccount?.signer, 'cairoVersion', OZaccount?.cairoVersion);
    // localStorage.setItem('devAccount', JSON.stringify(OZaccount));

    return OZaccount;
  } catch (error) {
    console.error('deploy account failed', error);
    return undefined;
  }
}

async function mintDevToken(address: string) {
  if (!address) return;

  try {
    const response = await fetch(`${chainMap['devnet'].rpcUrl}mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: address,
        amount: 100_000_000_000_000_000_000,
        unit: 'WEI'
      })
    });
    const data = await response.json();
    console.log('Mint response:', data);
  } catch (error) {
    console.error('mint token failed', error);
    throw error;
  }
}

async function getDevBalance(address: string): Promise<string> {
  if (!address) return 'unknown';

  try {
    const data = await fetch(`${chainMap['devnet'].rpcUrl}account_balance?address=${address}&unit=WEI`).then(
      (response) => response.json()
    );
    console.log('余额', data?.amount);
    const amountInEth = (parseFloat(data?.amount) / 1e18).toFixed(2);
    return amountInEth;
  } catch (error) {
    console.error('get balance failed', error);
    return '';
  }
}

const produceDevAccountList = async () => {
  const accountList: { account: AccountInterface; balance: string }[] = [];
  const promises = [];

  for (let i = 0; i < 10; i++) {
    const accountPromise = produceDevAccount().then(async (account) => {
      const balance = await getDevBalance(account!.address);
      accountList.push({ account: account!, balance });
    });
    promises.push(accountPromise);
  }

  await Promise.all(promises);
  return accountList;
};

export { produceDevAccount, getDevBalance, produceDevAccountList };
