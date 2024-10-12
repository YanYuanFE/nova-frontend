import { DEV_NODEURL } from '@/constants/config';
import { ec, stark, hash, CallData, Account, AccountInterface } from 'starknet';
import { getDevProvider } from './provider';

async function produceDevAccount(): Promise<AccountInterface | undefined> {
  const provider = getDevProvider();

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

    const balance = await getDevBanlance(OZcontractAddress);
    console.log('mint token success', 'balance=', balance);

    const OZaccount = new Account(provider, OZcontractAddress, privateKey);

    const { transaction_hash, contract_address } = await OZaccount.deployAccount({
      classHash: OZaccountClassHash,
      constructorCalldata: OZaccountConstructorCallData,
      addressSalt: starkKeyPub
    });

    await provider.waitForTransaction(transaction_hash);
    console.log(
      'address =',
      contract_address,
      'singner=',
      OZaccount?.signer,
      'cairoVersion',
      OZaccount?.cairoVersion,
      'balance=',
      balance + ''
    );
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
    const response = await fetch(`${DEV_NODEURL}mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: address,
        amount: 50000000000000,
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

async function getDevBanlance(address: string): Promise<string> {
  if (!address) return 'unknown';

  try {
    const data = await fetch(`${DEV_NODEURL}account_balance?address=${address}&unit=WEI`).then((response) =>
      response.json()
    );
    console.log('余额', data?.amount);
    return data?.amount;
  } catch (error) {
    console.error('get balance failed', error);
    return '';
  }
}

const produceDevAccountList = async () => {
  const localList = localStorage.getItem('accountList');
  if (localList) {
    return JSON.parse(localList);
  } else {
    const accountList: AccountInterface[] = [];
    const promises = [];

    for (let i = 0; i < 10; i++) {
      const accountPromise = produceDevAccount().then((account) => {
        accountList.push(account!);
        return mintDevToken(account!.address);
      });
      promises.push(accountPromise);
    }

    await Promise.all(promises);
    localStorage.setItem('accountList', JSON.stringify(accountList));
    return accountList;
  }
};

export { produceDevAccount, getDevBanlance, produceDevAccountList };
