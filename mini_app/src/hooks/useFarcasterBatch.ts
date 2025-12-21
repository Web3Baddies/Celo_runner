'use client';

import { useSendCalls, useWaitForCallsStatus } from 'wagmi';
import { useState } from 'react';

export function useFarcasterBatch() {
  const [callsId, setCallsId] = useState<string | undefined>();
  
  const {
    sendCalls,
    isPending: isSending,
    error: sendError,
  } = useSendCalls();

  const {
    data: callsStatus,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForCallsStatus({
    id: callsId,
  });

  const executeBatch = async (calls: Array<{ to: `0x${string}`; value?: bigint; data?: `0x${string}` }>) => {
    try {
      const id = await sendCalls({ calls });
      setCallsId(id);
      return id;
    } catch (error) {
      console.error('Batch transaction failed:', error);
      throw error;
    }
  };

  return {
    executeBatch,
    callsId,
    isPending: isSending || isConfirming,
    isSuccess: isConfirmed,
    callsStatus,
    error: sendError || confirmError,
  };
}


