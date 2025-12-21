# Farcaster MiniApp Integration Guide

This guide explains how Celo Runner integrates with Farcaster MiniApp to provide a seamless gaming experience within the Farcaster ecosystem.

## Overview

Celo Runner is now available as a Farcaster MiniApp, allowing users to play the game directly within Farcaster clients. The integration includes:

- Automatic wallet connection via Farcaster Wallet
- Network selection (Mainnet/Testnet) with Mainnet as default
- Batch transaction support (EIP-5792)
- Quick Auth for seamless authentication
- Haptic feedback for better UX
- Back navigation support
- Cast sharing capabilities

## Architecture

### Provider Hierarchy

```
FarcasterErrorBoundary
  └─ QueryClientProvider
      └─ WagmiProvider (Farcaster connector)
          └─ FarcasterProvider (SDK context)
              └─ ThirdwebProvider (fallback)
                  └─ WalletProvider
                      └─ FarcasterSDK (initialization)
                          └─ App Content
```

### Key Components

1. **WagmiProvider**: Wraps the app with Wagmi configuration using Farcaster connector
2. **FarcasterProvider**: Manages SDK state and initialization
3. **FarcasterSDK**: Handles SDK ready() call to hide splash screen
4. **FarcasterWallet**: Wallet connection UI for MiniApp mode
5. **NetworkSelector**: Allows switching between Mainnet and Testnet

## Network Configuration

### Default Network

**Mainnet (Celo)** is set as the default network (Chain ID: 42220). Users can switch to Testnet (Celo Sepolia, Chain ID: 11142220) using the NetworkSelector component.

### Supported Networks

- **Celo Mainnet**: Chain ID `42220`
  - cUSD: `0x765DE816845861e75A25fCA122bb6898B8B1282a`
  - Production environment

- **Celo Sepolia Testnet**: Chain ID `11142220`
  - cUSD: `0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b`
  - Testing environment

## Wallet Integration

### Automatic Connection

In MiniApp mode, the wallet automatically connects when the app loads. No user interaction is required.

```typescript
// Auto-connect logic in WagmiProvider
useEffect(() => {
  if (isMiniApp && !isConnected && connectors.length > 0) {
    connect({ connector: connectors[0] });
  }
}, [isMiniApp, isConnected, connectors, connect]);
```

### Wallet Detection

The app detects if it's running in a MiniApp environment:

```typescript
import { checkIsMiniApp } from '@/utils/farcaster';

const isMiniApp = checkIsMiniApp();
```

### Conditional UI

- **MiniApp Mode**: Shows `FarcasterWallet` component, hides `ConnectButton`
- **Browser Mode**: Shows standard `ConnectButton` from Thirdweb

## Transaction Support

### Single Transactions

Use Wagmi's `useSendTransaction` hook:

```typescript
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

const { sendTransaction } = useSendTransaction();

sendTransaction({
  to: "0x...",
  value: parseEther("0.01"),
});
```

### Batch Transactions (EIP-5792)

Batch multiple transactions into a single confirmation:

```typescript
import { useSendCalls } from 'wagmi';

const { sendCalls } = useSendCalls();

sendCalls({
  calls: [
    { to: "0x...", value: parseEther("0.01") },
    { to: "0x...", value: parseEther("0.02") },
  ],
});
```

### Example: Approve and Swap

```typescript
import { createApproveAndExecuteBatch } from '@/utils/transactions';

const batch = createApproveAndExecuteBatch(
  tokenAddress,
  spenderAddress,
  "100",
  { to: routerAddress, data: swapData }
);

sendCalls({ calls: batch });
```

## Authentication

### Quick Auth (Recommended)

Get a JWT token for authenticated API requests:

```typescript
import { getAuthToken } from '@/utils/farcasterAuth';

const token = await getAuthToken();
// Token is cached and auto-refreshed
```

### Sign In with Farcaster

For server-side verification:

```typescript
import { signInWithFarcaster } from '@/utils/farcasterAuth';

const credential = await signInWithFarcaster();
// Send credential to your server for verification
```

## MiniApp Features

### Haptic Feedback

Provide tactile feedback for user interactions:

```typescript
import { hapticSelection, hapticImpact, hapticNotification } from '@/utils/haptics';

// On button click
hapticSelection();

// On important action
hapticImpact();

// On notification
hapticNotification();
```

### Back Navigation

Navigate back in the MiniApp:

```typescript
import { useFarcasterNavigation } from '@/hooks/useFarcasterNavigation';

const { goBack } = useFarcasterNavigation();
goBack();
```

### Cast Sharing

Handle shared casts from Farcaster:

```typescript
import { useFarcasterShare } from '@/hooks/useFarcasterShare';

const { sharedCast, hasSharedCast } = useFarcasterShare();

if (hasSharedCast) {
  console.log('Received cast:', sharedCast);
}
```

## Manifest Configuration

The `manifest.json` file defines the MiniApp:

```json
{
  "name": "Celo Runner",
  "description": "Play-to-earn runner game on Celo",
  "iconUrl": "https://celo-runner.vercel.app/icon.png",
  "splashImageUrl": "https://celo-runner.vercel.app/splash.png",
  "splashBackgroundColor": "#000000",
  "url": "https://celo-runner.vercel.app",
  "requiredChains": [42220, 11142220],
  "requiredCapabilities": ["wallet", "transactions"]
}
```

## Deployment

### Prerequisites

1. Deploy your app to a public URL (e.g., Vercel, Netlify)
2. Ensure HTTPS is enabled
3. Update `manifest.json` with your production URLs

### Publishing Steps

1. **Prepare Assets**:
   - Icon: 512x512px PNG
   - Splash: 1920x1080px PNG

2. **Update Manifest**:
   - Set correct `url`, `iconUrl`, and `splashImageUrl`
   - Verify `requiredChains` include your supported networks

3. **Publish to Farcaster**:
   - Follow the [Farcaster MiniApp publishing guide](https://miniapps.farcaster.xyz/docs/guides/publishing)
   - Submit your manifest for review

## Testing

### Local Development

1. Run the app locally: `npm run dev`
2. Test in browser (non-MiniApp mode)
3. Use Farcaster dev tools to test MiniApp mode

### Testnet Testing

1. Switch to Testnet using NetworkSelector
2. Use testnet contracts
3. Test all game features

### Mainnet Testing

1. Ensure you're on Mainnet (default)
2. Test with small amounts first
3. Verify all contract interactions

## Troubleshooting

### SDK Not Initializing

- Ensure `sdk.actions.ready()` is called after app loads
- Check browser console for errors
- Verify SDK is imported correctly

### Wallet Not Connecting

- Check if running in MiniApp environment
- Verify WagmiProvider is properly configured
- Ensure Farcaster connector is included

### Network Issues

- Verify chain IDs are correct (42220 for Mainnet, 11142220 for Testnet)
- Check RPC endpoints are accessible
- Ensure contract addresses match the selected network

### Transaction Failures

- Check user has sufficient balance
- Verify contract addresses are correct for selected network
- Review transaction parameters

## Code Examples

### Complete Wallet Integration

```typescript
import { useFarcasterWallet } from '@/hooks/useFarcasterWallet';
import { FarcasterWallet } from '@/components/FarcasterWallet';

function MyComponent() {
  const { address, isConnected, balanceFormatted, network } = useFarcasterWallet();
  
  return (
    <div>
      {isConnected ? (
        <FarcasterWallet />
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
}
```

### Transaction with Haptic Feedback

```typescript
import { useFarcasterTransaction } from '@/hooks/useFarcasterTransaction';
import { hapticSelection } from '@/utils/haptics';

function SendButton() {
  const { executeTransaction, isPending, isSuccess } = useFarcasterTransaction();
  
  const handleSend = async () => {
    hapticSelection();
    await executeTransaction(
      "0x...",
      parseEther("0.01")
    );
  };
  
  return (
    <button onClick={handleSend} disabled={isPending}>
      {isPending ? 'Sending...' : 'Send'}
    </button>
  );
}
```

## Resources

- [Farcaster MiniApp Documentation](https://miniapps.farcaster.xyz/)
- [Farcaster MiniApp SDK Reference](https://miniapps.farcaster.xyz/docs/sdk)
- [Wagmi Documentation](https://wagmi.sh)
- [Celo Documentation](https://docs.celo.org)

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Farcaster MiniApp documentation
- Test in both MiniApp and browser modes
- Verify network configuration matches your contracts


