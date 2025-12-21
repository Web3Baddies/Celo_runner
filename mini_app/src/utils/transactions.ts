/**
 * Transaction utilities for Farcaster MiniApp
 * Includes batch transaction helpers and common patterns
 */

import { encodeFunctionData, parseUnits } from 'viem';
import { erc20Abi } from 'viem';

/**
 * Create an ERC20 approve call
 */
export function createApproveCall(
  tokenAddress: `0x${string}`,
  spender: `0x${string}`,
  amount: string,
  decimals: number = 18
) {
  return {
    to: tokenAddress,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, parseUnits(amount, decimals)],
    }),
  };
}

/**
 * Create a batch transaction for approve and execute pattern
 * Common in DeFi: approve token, then execute swap/transfer
 */
export function createApproveAndExecuteBatch(
  tokenAddress: `0x${string}`,
  spender: `0x${string}`,
  amount: string,
  executeCall: { to: `0x${string}`; data: `0x${string}` },
  decimals: number = 18
) {
  return [
    createApproveCall(tokenAddress, spender, amount, decimals),
    executeCall,
  ];
}

/**
 * Format transaction error message
 */
export function formatTransactionError(error: unknown): string {
  if (error instanceof Error) {
    // Handle common error messages
    if (error.message.includes('user rejected')) {
      return 'Transaction was cancelled';
    }
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient balance';
    }
    if (error.message.includes('network')) {
      return 'Network error. Please try again.';
    }
    return error.message;
  }
  return 'An unknown error occurred';
}


