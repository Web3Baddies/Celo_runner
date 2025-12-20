# Celo Runner Frontend

Next.js frontend for Celo Runner game. Built with thirdweb, React, and Tailwind CSS.

## Features

- Wallet connection (MetaMask, WalletConnect, MiniPay)
- Player registration and profile management
- Stage-based gameplay with quiz integration
- Token and NFT rewards claiming
- NFT marketplace (CELO and cUSD payments) with 2.5% platform fees
- Leaderboard system
- Mobile-responsive design
- MiniPay integration with cUSD support
- Network support for Mainnet and Testnet

## Prerequisites

- Node.js 18+ and npm
- A Celo wallet (MetaMask, WalletConnect, or MiniPay)

## Installation

```bash
npm install
```

## Configuration

Create a `.env.local` file (or copy from `.env.local.example`):

```env
# Contract Addresses (Celo Mainnet)
NEXT_PUBLIC_QUEST_TOKEN_ADDRESS=0x7B61f8EadD960a2e676f26E6968F5f65FebE1341
NEXT_PUBLIC_RUNNER_BADGE_ADDRESS=0xe0Aad78b3615ce64469518f4E406B580de5cABaA
NEXT_PUBLIC_CELO_RUNNER_ADDRESS=0x553efD80A0ADEd286Ed49F78Ba5051846db91B37
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x387998f2eA7f6f4F81cc583ba2bDB841d2bB77C6
NEXT_PUBLIC_CUSD_TOKEN_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a
NEXT_PUBLIC_CHAIN_ID=42220
NEXT_PUBLIC_RPC_URL=https://forno.celo.org
```

**Note:** The contract addresses are configured in `src/config/contracts.ts` with network-aware support. The app defaults to Mainnet (Chain ID: 42220) but supports both Mainnet and Testnet. Use `getContractAddresses(chainId)` to get addresses for a specific network.

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── page.tsx      # Home page
│   │   ├── play/         # Game page
│   │   ├── rewards/      # Rewards claiming page
│   │   ├── marketplace/  # NFT marketplace page
│   │   └── leaderboard/  # Leaderboard page
│   ├── components/       # React components
│   │   ├── GameUI.tsx    # Main game interface
│   │   ├── NewWalletConnection.tsx  # Wallet connection
│   │   └── marketplace/  # Marketplace components
│   ├── hooks/            # Custom React hooks
│   │   └── useCeloRunner.ts  # Contract interaction hook
│   ├── store/            # Zustand state management
│   │   └── gameStore.ts  # Global game state
│   ├── config/           # Configuration files
│   │   ├── contracts.ts  # Contract addresses
│   │   └── abis/         # Contract ABIs
│   └── utils/            # Utility functions
│       └── minipay.ts    # MiniPay integration
└── public/               # Static assets
```

## Key Features

### Wallet Connection

Supports multiple wallet providers:
- MetaMask
- WalletConnect
- MiniPay (with automatic detection)

### Game Flow

1. Connect wallet
2. Register username
3. Play stages (1-3)
4. Complete quizzes
5. Claim tokens and NFTs
6. Trade badges on marketplace

### MiniPay Integration

- Automatic wallet detection
- cUSD balance display
- cUSD payment option for marketplace
- Add cash deeplink

See `MINIPAY_INTEGRATION.md` for detailed MiniPay documentation.

### Marketplace

- List NFTs for sale
- Buy with CELO or cUSD
- Approve marketplace transactions
- Cancel listings

## Technologies

- **Next.js 16**: React framework
- **thirdweb**: Web3 SDK for contract interactions
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

## Troubleshooting

**Build fails:**
- Run `npm install` to ensure dependencies are installed
- Check Node.js version (18+ required)
- Clear `.next` folder and rebuild

**Wallet connection issues:**
- Ensure wallet is connected to Celo Sepolia network
- Check RPC URL in configuration
- Verify contract addresses are correct

**Transaction failures:**
- Check wallet has enough CELO for gas
- Verify contract addresses match deployed contracts
- Check network connection

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

Or use Vercel CLI:

```bash
vercel
```

## Support

For issues or questions:
- Check smartcontract README for contract details
- Review thirdweb documentation: https://portal.thirdweb.com
- Celo documentation: https://docs.celo.org
