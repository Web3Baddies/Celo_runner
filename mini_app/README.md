# Celo Runner Frontend

Next.js frontend for Celo Runner game. Built with thirdweb, React, and Tailwind CSS.

## Features

- Wallet connection (MetaMask, WalletConnect, MiniPay, Farcaster)
- **Farcaster MiniApp support** - Play directly in Farcaster clients
- Network selection (Mainnet/Testnet) with Mainnet as default
- Player registration and profile management
- Stage-based gameplay with quiz integration
- Token and NFT rewards claiming
- NFT marketplace (CELO and cUSD payments) with 2.5% platform fees
- Batch transaction support (EIP-5792)
- Leaderboard system
- Mobile-responsive design
- MiniPay integration with cUSD support
- Haptic feedback for MiniApp
- Quick Auth for seamless authentication

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
# Contract Addresses (Celo Sepolia Testnet)
NEXT_PUBLIC_QUEST_TOKEN_ADDRESS=0x48e2e16a5cfe127fbfc76f3fd85163bbae64a861
NEXT_PUBLIC_RUNNER_BADGE_ADDRESS=0x7b72c0e84012f868fe9a4164a8122593d0f38b84
NEXT_PUBLIC_CELO_RUNNER_ADDRESS=0x4588b0ff4016952e4391dea6dcc7f9a1484ac7b6
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x2d133d0E526193C17AA0Cb0ceD0D9081fbc6Ad73
NEXT_PUBLIC_CUSD_TOKEN_ADDRESS=0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=11142220
NEXT_PUBLIC_RPC_URL=https://forno.celo-sepolia.celo-testnet.org/
```

**Note:** The contract addresses are also configured in `src/config/contracts.ts` with network-aware support. The app defaults to **Mainnet** (as required for Farcaster) but supports both Mainnet and Testnet. Use `getContractAddresses(chainId)` to get addresses for a specific network.

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
- **Farcaster Wallet** (MiniApp mode - automatic connection)
- MetaMask
- WalletConnect
- MiniPay (with automatic detection)

**Farcaster MiniApp**: When running in a Farcaster client, the wallet automatically connects. Users can switch between Mainnet (default) and Testnet using the NetworkSelector component.

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

### Farcaster MiniApp Integration

- Automatic wallet connection in MiniApp mode
- Network switching (Mainnet/Testnet)
- Batch transactions for better UX
- Quick Auth for authenticated requests
- Haptic feedback for interactions
- Back navigation support
- Cast sharing capabilities

See `FARCASTER_INTEGRATION.md` for detailed Farcaster documentation.

### Marketplace

- List NFTs for sale
- Buy with CELO or cUSD
- Approve marketplace transactions
- Cancel listings

## Technologies

- **Next.js 16**: React framework
- **Wagmi**: Ethereum React hooks with Farcaster connector
- **Farcaster MiniApp SDK**: MiniApp integration
- **thirdweb**: Web3 SDK for contract interactions (fallback)
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

### Standard Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

Or use Vercel CLI:

```bash
vercel
```

### Farcaster MiniApp Deployment

1. **Update Manifest**: Edit `public/manifest.json` with your production URLs:
   - `url`: Your deployed app URL
   - `iconUrl`: Public URL to your app icon (512x512px)
   - `splashImageUrl`: Public URL to splash screen (1920x1080px)

2. **Deploy Frontend**: Deploy to a public URL (Vercel, Netlify, etc.)

3. **Publish MiniApp**: Follow the [Farcaster MiniApp publishing guide](https://miniapps.farcaster.xyz/docs/guides/publishing)

4. **Test**: Test in both browser and MiniApp environments

## Support

For issues or questions:
- Check smartcontract README for contract details
- Review thirdweb documentation: https://portal.thirdweb.com
- Celo documentation: https://docs.celo.org
