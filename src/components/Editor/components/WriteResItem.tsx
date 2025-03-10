export default function WriteResItem({ result }: { result: any }) {
  return (
    <div className="bg-card rounded-lg p-4 max-w-[250px]">
      {result?.block_hash && (
        <p>
          <strong>blockHash: </strong>
          {result?.block_hash}
        </p>
      )}
      {result?.block_number && (
        <p>
          <strong>blocckNumber: </strong>
          {result?.block_number}
        </p>
      )}
      <p>
        <strong>gasUsed: </strong>
        {BigInt(result?.actual_fee?.amount).toString()}
      </p>
      <p>
        <strong>status: </strong>
        {result?.execution_status?.toLowerCase()}
      </p>
      <p>
        <strong>transactionHash: </strong>
        {result?.transaction_hash}
      </p>
    </div>
  );
}
