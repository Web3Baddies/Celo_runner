// Contract addresses by network
const CONTRACTS_BY_NETWORK = {
  // Celo Mainnet (Chain ID: 42220)
  MAINNET: {
    QUEST_TOKEN: '0x7B61f8EadD960a2e676f26E6968F5f65FebE1341' as `0x${string}`,
    RUNNER_BADGE: '0xe0Aad78b3615ce64469518f4E406B580de5cABaA' as `0x${string}`,
    CELO_RUNNER: '0x553efD80A0ADEd286Ed49F78Ba5051846db91B37' as `0x${string}`,
    MARKETPLACE: '0x387998f2eA7f6f4F81cc583ba2bDB841d2bB77C6' as `0x${string}`, // Platform fee: 2.5%
    CUSD_TOKEN: '0x765DE816845861e75A25fCA122bb6898B8B1282a' as `0x${string}`, // Celo Mainnet cUSD
  },
  // Celo Sepolia Testnet (Chain ID: 11142220)
  TESTNET: {
    QUEST_TOKEN: '0x48e2e16a5cfe127fbfc76f3fd85163bbae64a861' as `0x${string}`,
    RUNNER_BADGE: '0x7b72c0e84012f868fe9a4164a8122593d0f38b84' as `0x${string}`,
    CELO_RUNNER: '0x4588b0ff4016952e4391dea6dcc7f9a1484ac7b6' as `0x${string}`,
    MARKETPLACE: '0x2d133d0E526193C17AA0Cb0ceD0D9081fbc6Ad73' as `0x${string}`, // Updated with platform fees (2.5%)
    CUSD_TOKEN: '0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b' as `0x${string}`, // Celo Sepolia cUSD
  },
} as const;

// Helper function to get contract addresses for a specific network
export function getContractAddresses(chainId?: number) {
  // Default to mainnet (42220)
  const isMainnet = chainId === undefined || chainId === 42220;
  return isMainnet ? CONTRACTS_BY_NETWORK.MAINNET : CONTRACTS_BY_NETWORK.TESTNET;
}

// Legacy export for backward compatibility - defaults to mainnet
export const CONTRACTS = CONTRACTS_BY_NETWORK.MAINNET;

// Helper function to get contract addresses
export function getContractAddresses() {
  return CONTRACTS;
}

// Network configuration
export const Celo_Mainnet = {
  id: 42220,
  name: 'Celo Mainnet',
  network: 'celo-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo.org/'],
    },
    public: {
      http: ['https://forno.celo.org/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Celo Explorer',
      url: 'https://explorer.celo.org',
    },
  },
  testnet: false,
} as const;

// Game constants
export const GAME_CONSTANTS = {
  REGISTRATION_BONUS: 100,
  COMPLETION_MULTIPLIER: 2,
  TOTAL_STAGES: 3,
  STAGE_REWARDS: {
    1: 20,
    2: 50,
    3: 100,
  },
  STAGE_BADGES: {
    1: 'Explorer Badge',
    2: 'Adventurer Badge',
    3: 'Master Badge',
  },
} as const;
