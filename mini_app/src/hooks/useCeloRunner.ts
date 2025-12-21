import { useState, useEffect, useMemo } from 'react';
import { createPublicClient, http } from 'viem';
import { celo, celoSepolia } from 'viem/chains';
import { useAccount, useWalletClient } from 'wagmi';
import { getContractAddresses } from '@/config/contracts';
import { CELO_RUNNER_ABI } from '@/config/abis';

// Helper to pick chain/clients per chainId (force Celo mainnet unless explicit Sepolia)
const getClients = (chainId?: number) => {
  const chain = chainId === celoSepolia.id ? celoSepolia : celo; // force mainnet as default
  const contracts = getContractAddresses(chain.id);
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });
  return { chain, contracts, publicClient };
};

// Types based on our contract
export interface Player {
  username: string;
  isRegistered: boolean;
  currentStage: bigint;
  totalScore: bigint;
  inGameCoins: bigint;
  questTokensEarned: bigint;
  totalGamesPlayed: bigint;
  registrationTime: bigint;
}

export interface GameSession {
  player: string;
  stage: bigint;
  score: bigint;
  coinsCollected: bigint;
  stageCompleted: boolean;
  timestamp: bigint;
}

// Main hook for Celo Runner contract interactions
export const useCeloRunner = () => {
  const { address, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { chain: targetChain, contracts, publicClient } = useMemo(
    () => getClients(chainId),
    [chainId]
  );

  // Write Functions
  const requireWallet = async () => {
    if (!walletClient || !address) {
      throw new Error('No account connected. Please connect your wallet first.');
    }
    // If wallet chain mismatches, attempt to switch
    if (walletClient.chain?.id !== targetChain.id && walletClient.switchChain) {
      await walletClient.switchChain({ id: targetChain.id });
    }
    return { walletClient, address };
  };

  const registerPlayer = async (username: string) => {
    const { walletClient } = await requireWallet();
    try {
      setIsPending(true);
      setError(null);
      const txHash = await walletClient.writeContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: 'registerPlayer',
        args: [username],
      });
      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setIsConfirming(false);
      setIsSuccess(true);
      return txHash;
    } catch (err: any) {
      const msg = err?.message || err?.toString() || '';
      if (msg.includes('Already registered') || msg.includes('already registered')) {
        setIsPending(false);
        setIsConfirming(false);
        setIsSuccess(true);
        return 'already_registered';
      }
      setError(err);
      setIsPending(false);
      setIsConfirming(false);
      throw err;
    }
  };

  const saveGameSession = async (
    stage: number,
    finalScore: number,
    coinsCollected: number,
    questionsCorrect: number,
    stageCompleted: boolean
  ) => {
    const { walletClient } = await requireWallet();
    try {
      setIsPending(true);
      setError(null);

      const txHash = await walletClient.writeContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: 'saveGameSession',
        args: [
          BigInt(stage || 1),
          BigInt(finalScore || 0),
          BigInt(coinsCollected || 0),
          BigInt(questionsCorrect || 0),
          stageCompleted
        ],
      });

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setIsConfirming(false);
      setIsSuccess(true);
      return txHash;
    } catch (err: any) {
      setError(err);
      setIsPending(false);
      setIsConfirming(false);
      throw err;
    }
  };

  const purchaseItem = async (itemType: string, cost: number) => {
    const { walletClient } = await requireWallet();
    try {
      setIsPending(true);
      setError(null);
      const txHash = await walletClient.writeContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: 'purchaseItem',
        args: [itemType, BigInt(cost)],
      });
      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setIsConfirming(false);
      setIsSuccess(true);
      return txHash;
    } catch (err: any) {
      setError(err);
      setIsPending(false);
      setIsConfirming(false);
      throw err;
    }
  };

  const claimTokens = async (stage: number) => {
    const { walletClient } = await requireWallet();
    try {
      setIsPending(true);
      setError(null);
      const txHash = await walletClient.writeContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: 'claimTokens',
        args: [BigInt(stage)],
      });
      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setIsConfirming(false);
      setIsSuccess(true);
      return txHash;
    } catch (err: any) {
      setError(err);
      setIsPending(false);
      setIsConfirming(false);
      throw err;
    }
  };

  const claimNFT = async (stage: number) => {
    const { walletClient } = await requireWallet();
    try {
      setIsPending(true);
      setError(null);
      const txHash = await walletClient.writeContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: 'claimNFT',
        args: [BigInt(stage)],
      });
      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setIsConfirming(false);
      setIsSuccess(true);
      return txHash;
    } catch (err: any) {
      setError(err);
      setIsPending(false);
      setIsConfirming(false);
      throw err;
    }
  };

  // Reset success state after a delay
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        setHash(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return {
    registerPlayer,
    saveGameSession,
    purchaseItem,
    claimTokens,
    claimNFT,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
};

// Hook for reading player data
export const usePlayerData = (playerAddress?: string) => {
  const { chainId } = useAccount();
  const { contracts, publicClient } = useMemo(() => getClients(chainId), [chainId]);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    if (!playerAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await publicClient.readContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: "getPlayer",
        args: [playerAddress as `0x${string}`],
      });
      setData(result);
      console.log('🔍 usePlayerData - Raw contract response:', result);
      
      // Helper to safely serialize BigInt values for logging
      const safeStringify = (obj: any): string => {
        return JSON.stringify(obj, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        , 2);
      };
      
      console.log('🔍 usePlayerData - Detailed check:', {
        hasData: !!result,
        username: result?.username,
        usernameType: typeof result?.username,
        usernameLength: result?.username ? String(result.username).length : 0,
        isRegistered: result?.isRegistered,
        isRegisteredType: typeof result?.isRegistered,
        currentStage: result?.currentStage,
        inGameCoins: result?.inGameCoins,
        fullResult: safeStringify(result)
      });
    } catch (err: any) {
      console.error('Error fetching player data:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playerAddress) {
      refetch();
    } else {
      setData(null);
    }
  }, [playerAddress]);

  // Transform the data - handle both array and object formats
  // thirdweb may return structs as arrays [username, isRegistered, currentStage, ...]
  // or as objects {username, isRegistered, currentStage, ...}
  const player = data ? (() => {
    // Check if it's an array format
    if (Array.isArray(data)) {
      return {
        username: (data[0] || '').trim(),
        isRegistered: Boolean(data[1]),
        currentStage: Number(data[2] || 0),
        totalScore: Number(data[3] || 0),
        inGameCoins: Number(data[4] || 0),
        questTokensEarned: Number(data[5] || 0),
        totalGamesPlayed: Number(data[6] || 0),
        registrationTime: Number(data[7] || 0),
      };
    }
    // Object format
    return {
      username: (data.username || '').trim(),
      isRegistered: Boolean(data.isRegistered),
      currentStage: Number(data.currentStage || 0),
      totalScore: Number(data.totalScore || 0),
      inGameCoins: Number(data.inGameCoins || 0),
      questTokensEarned: Number(data.questTokensEarned || 0),
      totalGamesPlayed: Number(data.totalGamesPlayed || 0),
      registrationTime: Number(data.registrationTime || 0),
    };
  })() : null;

  console.log('🔍 usePlayerData - Transformed player:', {
    player,
    rawIsRegistered: data?.isRegistered,
    finalIsRegistered: player?.isRegistered
  });

  return {
    player,
    isLoading,
    error,
    refetch,
    raw: data,
  };
};

// Hook for reading leaderboard data
export const useLeaderboard = (stage: number, limit: number = 10) => {
  const { chainId } = useAccount();
  const { contracts, publicClient } = useMemo(() => getClients(chainId), [chainId]);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await publicClient.readContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: "getStageLeaderboard",
        args: [BigInt(stage), BigInt(limit)],
      });
      
      setData(result as any[]);
      console.log('🔍 useLeaderboard - Raw data:', result);
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [stage, limit]);

  // Handle both array and object formats for structs
  const leaderboard = (data || []).map((session: any, index: number) => {
    // Check if it's an array format [player, stage, score, coinsCollected, stageCompleted, timestamp]
    if (Array.isArray(session)) {
      return {
        rank: index + 1,
        player: session[0] || 'Unknown',
        stage: Number(session[1] || 0),
        score: Number(session[2] || 0),
        coinsCollected: Number(session[3] || 0),
        stageCompleted: Boolean(session[4]),
        timestamp: Number(session[5] || 0),
      };
    }
    // Object format
    return {
      rank: index + 1,
      player: session?.player || 'Unknown',
      stage: Number(session?.stage || 0),
      score: Number(session?.score || 0),
      coinsCollected: Number(session?.coinsCollected || 0),
      stageCompleted: Boolean(session?.stageCompleted),
      timestamp: Number(session?.timestamp || 0),
    };
  });

  return {
    leaderboard,
    isLoading,
    error,
    refetch,
    raw: data,
  };
};

// Hook for checking stage completion
export const useStageCompletion = (playerAddress?: string, stage?: number) => {
  const { chainId } = useAccount();
  const { contracts, publicClient } = useMemo(() => getClients(chainId), [chainId]);
  const [data, setData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!playerAddress || stage === undefined) {
      setData(false);
      return;
    }

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
      const result = await publicClient.readContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: "isStageCompleted",
        args: [playerAddress as `0x${string}`, BigInt(stage)],
      });
        
        setData(result as boolean);
        console.log(`🔍 useStageCompletion - Stage ${stage} for ${playerAddress?.slice(-4)}:`, result);
      } catch (err: any) {
        console.error('Error checking stage completion:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [playerAddress, stage]);

  return {
    isCompleted: data,
    isLoading,
    error,
  };
};

// Hook for checking if tokens are claimed
export const useTokensClaimed = (playerAddress?: string, stage?: number) => {
  const { chainId } = useAccount();
  const { contracts, publicClient } = useMemo(() => getClients(chainId), [chainId]);
  const [data, setData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    if (!playerAddress || stage === undefined) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await publicClient.readContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: "areTokensClaimed",
        args: [playerAddress as `0x${string}`, BigInt(stage)],
      });
      
      setData(result as boolean);
      console.log(`🔍 useTokensClaimed - Stage ${stage} for ${playerAddress?.slice(-4)}:`, result);
    } catch (err: any) {
      console.error('Error checking tokens claimed:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playerAddress && stage !== undefined) {
      refetch();
    } else {
      setData(false);
    }
  }, [playerAddress, stage]);

  return {
    isClaimed: data,
    isLoading,
    error,
    refetch,
  };
};

// Hook for checking if NFT is claimed
export const useNFTClaimed = (playerAddress?: string, stage?: number) => {
  const { chainId } = useAccount();
  const { contracts, publicClient } = useMemo(() => getClients(chainId), [chainId]);
  const [data, setData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    if (!playerAddress || stage === undefined) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await publicClient.readContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: "isNFTClaimed",
        args: [playerAddress as `0x${string}`, BigInt(stage)],
      });
      
      setData(result as boolean);
      console.log(`🔍 useNFTClaimed - Stage ${stage} for ${playerAddress?.slice(-4)}:`, result);
    } catch (err: any) {
      console.error('Error checking NFT claimed:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playerAddress && stage !== undefined) {
      refetch();
    } else {
      setData(false);
    }
  }, [playerAddress, stage]);

  return {
    isClaimed: data,
    isLoading,
    error,
    refetch,
  };
};

// Hook for general leaderboard (all stages combined)
export const useGeneralLeaderboard = (limit: number = 10) => {
  const { chainId } = useAccount();
  const { contracts, publicClient } = useMemo(() => getClients(chainId), [chainId]);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await publicClient.readContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: "getGeneralLeaderboard",
        args: [BigInt(limit)],
      });
      
      setData(result as any[]);
      console.log('🔍 useGeneralLeaderboard - Raw data:', result);
    } catch (err: any) {
      console.error('Error fetching general leaderboard:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [limit]);

  // Handle both array and object formats for structs
  const leaderboard = (data || []).map((session: any, index: number) => {
    // Check if it's an array format [player, stage, score, coinsCollected, stageCompleted, timestamp]
    if (Array.isArray(session)) {
      return {
        rank: index + 1,
        player: session[0] || 'Unknown',
        stage: Number(session[1] || 0),
        score: Number(session[2] || 0),
        coinsCollected: Number(session[3] || 0),
        stageCompleted: Boolean(session[4]),
        timestamp: Number(session[5] || 0),
      };
    }
    // Object format
    return {
      rank: index + 1,
      player: session?.player || 'Unknown',
      stage: Number(session?.stage || 0),
      score: Number(session?.score || 0),
      coinsCollected: Number(session?.coinsCollected || 0),
      stageCompleted: Boolean(session?.stageCompleted),
      timestamp: Number(session?.timestamp || 0),
    };
  });

  return {
    leaderboard,
    isLoading,
    error,
    refetch,
    raw: data,
  };
};

// Hook for game statistics
export const useGameStats = () => {
  const { chainId } = useAccount();
  const { contracts, publicClient } = useMemo(() => getClients(chainId), [chainId]);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await publicClient.readContract({
        address: contracts.CELO_RUNNER,
        abi: CELO_RUNNER_ABI,
        functionName: "getGameStats",
        args: [],
      });
      
      setData(result);
    } catch (err: any) {
      console.error('Error fetching game stats:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  const stats = data ? {
    totalPlayers: Number(data[0] || 0),
    totalGamesPlayed: Number(data[1] || 0),
  } : null;

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};
