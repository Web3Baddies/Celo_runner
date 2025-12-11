// Contract addresses on Celo Sepolia
export const CONTRACTS = {
  QUEST_TOKEN: '0xC3adf32A0C0a70183eab5D1C33B088fFeEecf396' as `0x${string}`,
  RUNNER_BADGE: '0x6D939Da699D3AbA5A47662242Ec5e1a091Db617D' as `0x${string}`,
  CELO_RUNNER: '0x03c2c7011eE8519D3B0AF49f20D4b6dEF80799A7' as `0x${string}`,
  MARKETPLACE: '0xa3fC9782937F8FFDD9BB59D573b33E9842065013' as `0x${string}`, // Updated with cUSD support
  CUSD_TOKEN: '0x765DE816845861e75A25fCA122bb6898B8B1282a' as `0x${string}`, // Celo mainnet cUSD
} as const;

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
