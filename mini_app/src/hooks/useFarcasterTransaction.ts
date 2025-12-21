'use client';

import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';

export function useFarcasterTransaction() {
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  
  const {
    sendTransaction,
    isPending: isSending,
    error: sendError,
  } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const executeTransaction = async (to: `0x${string}`, value: bigint, data?: `0x${string}`) => {
    try {
      const hash = await sendTransaction({
        to,
        value,
        data,
      });
      setTxHash(hash);
      return hash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return {
    executeTransaction,
    txHash,
    isPending: isSending || isConfirming,
    isSuccess: isConfirmed,
    error: sendError || confirmError,
  };
}


