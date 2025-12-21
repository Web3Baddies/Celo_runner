'use client';

import { useState, useEffect } from 'react';
import { hapticNotification } from '@/utils/haptics';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
  isPending: boolean;
  isSuccess: boolean;
  error?: Error | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  txHash,
  isPending,
  isSuccess,
  error,
}: TransactionModalProps) {
  useEffect(() => {
    if (isSuccess) {
      hapticNotification();
    }
  }, [isSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Transaction Status</h2>
        
        {isPending && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing transaction...</p>
            {txHash && (
              <p className="text-sm text-gray-500 mt-2 break-all">
                Hash: {txHash}
              </p>
            )}
          </div>
        )}
        
        {isSuccess && (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">✓</div>
            <p className="text-green-600 font-semibold">Transaction successful!</p>
            {txHash && (
              <p className="text-sm text-gray-500 mt-2 break-all">
                Hash: {txHash}
              </p>
            )}
          </div>
        )}
        
        {error && (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">✗</div>
            <p className="text-red-600 font-semibold">Transaction failed</p>
            <p className="text-sm text-gray-500 mt-2">{error.message}</p>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}


