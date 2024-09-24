import { useAccount } from "@starknet-react/core";
import ConnectModal from "../ConnectModal"
import { Button } from "../ui/button";
import { hash } from "starknet";

export const DeployCard = ({ compileData }:{compileData: {
    casmData: any;
    sierraData: any;
}}) => {
    const { account } = useAccount();

    console.log(compileData, 'cc')

    const handleDeclare = async () => {
        const { sierraData, casmData } = compileData;
      const classHash = hash.computeContractClassHash(sierraData)
      const compiledClassHash = hash.computeCompiledClassHash(casmData)
      const res = await account?.declare({
        contract: sierraData,
        classHash: classHash,
        casm: casmData,
        compiledClassHash: compiledClassHash,
      });
      console.log(res, 'res');
      const txReceipt = await account?.waitForTransaction(res!.transaction_hash)
      console.log(txReceipt, 'txReceipt')
    }

    const handleDeploy = async () => {
        const { sierraData, casmData } = compileData;
        const classHash = hash.computeContractClassHash(sierraData)
        const res = await account?.deploy({
            classHash,
            constructorCalldata: []
        });
        console.log(res, 'res')
        const txReceipt = await account?.waitForTransaction(res!.transaction_hash)
        console.log(txReceipt, 'txReceipt')
    }
    return (
        <div className="p-4">
            <div>Deployment</div>
            <div className="p-6 space-y-6">
                <ConnectModal/>
                <div>
                    <Button onClick={handleDeclare}>Declare</Button>
                </div>
                <div>
                    <Button onClick={handleDeploy}>Deploy</Button>
                </div>
            </div>
        </div>
    )
}