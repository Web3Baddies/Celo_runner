'use client';

import { ConnectButton } from 'thirdweb/react';
import { client } from '@/client';
import { celoSepolia, useWallet } from '@/context/WalletContext';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { isMiniPayAvailable, openMiniPayAddCash, checkCUSDBalance } from '@/utils/minipay';
import { checkIsMiniApp } from '@/utils/farcaster';
import { useAccount as useWagmiAccount, useConnect as useWagmiConnect } from 'wagmi';
import { FarcasterWallet } from './FarcasterWallet';

export function NewWalletConnection() {
  const { account, isConnected } = useWallet();
  const wagmiAccount = useWagmiAccount();
  const { connect: wagmiConnect, connectors: wagmiConnectors, isPending: isWagmiConnecting } = useWagmiConnect();
  const isMiniApp = checkIsMiniApp();
  // Use Farcaster wallet if in MiniApp, otherwise use Thirdweb wallet
  const activeAccount = isMiniApp ? wagmiAccount : { address: account?.address, isConnected };
  const [showRegistration, setShowRegistration] = useState(false);
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'pending' | 'waiting' | 'success'>('idle');
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [cUSDBalance, setCUSDBalance] = useState<string>("0");

  const {
    setConnected,
    setWalletAddress,
    setPlayer,
    registerPlayer,
    loadPlayerData,
    contractCallbacks,
    player
  } = useGameStore();

  // Check for MiniPay on mount and load cUSD balance
  useEffect(() => {
    setIsMiniPay(isMiniPayAvailable());
  }, []);

  useEffect(() => {
    if (isMiniPay && account?.address) {
      checkCUSDBalance(account.address, true).then(setCUSDBalance);
    }
  }, [isMiniPay, account?.address]);

  // Handle wallet connection state changes
  useEffect(() => {
    const connected = isMiniApp ? activeAccount.isConnected : isConnected;
    const address = isMiniApp ? activeAccount.address : account?.address;
    
    if (connected && address) {
      setConnected(true);
      setWalletAddress(address);

      // Load player data when wallet connects - with a small delay to ensure contract callbacks are ready
      // Also retry a few times in case the first load fails
      const loadData = async () => {
        const walletAddress = isMiniApp ? activeAccount.address : account?.address;
        if (!walletAddress) return;
        
        try {
          await loadPlayerData(walletAddress);
        } catch (error) {
          console.log('⚠️ First load attempt failed, retrying...', error);
          // Retry after a longer delay
          setTimeout(async () => {
            try {
              await loadPlayerData(walletAddress);
            } catch (retryError) {
              console.error('❌ Failed to load player data after retry:', retryError);
            }
          }, 2000);
        }
      };
      
      setTimeout(loadData, 1000);
    } else {
      setConnected(false);
      setWalletAddress(null);
      setPlayer(null);
      setShowRegistration(false);
    }
  }, [isConnected, account?.address, activeAccount.isConnected, activeAccount.address, isMiniApp, setConnected, setWalletAddress, setPlayer, loadPlayerData]);

  // Check registration status when player data changes
  useEffect(() => {
    const connected = isMiniApp ? activeAccount.isConnected : isConnected;
    const address = isMiniApp ? activeAccount.address : account?.address;
    
    console.log('🔍 Registration check:', {
      isConnected: connected,
      address: address,
      isMiniApp,
      player,
      playerIsRegistered: player?.isRegistered,
      playerUsername: player?.username,
      hasUsername: !!player?.username
    });
    
    if (!connected || !address) {
      setShowRegistration(false);
      return;
    }

    // If player data is still loading, wait a bit, then show registration modal as fallback
    if (player === null || player === undefined) {
      console.log('⏳ Player data still loading - will show registration modal if data fails to load');
      // Set a timeout to show registration modal if player data doesn't load within 5 seconds
      const timeout = setTimeout(() => {
        console.log('⏰ Player data load timeout - showing registration modal as fallback');
        setShowRegistration(true);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }

    // Player data loaded - check if registration needed
    // Check both isRegistered flag AND if username exists (more reliable)
    const isActuallyRegistered = player.isRegistered || (player.username && player.username.trim().length > 0);
    
    if (!isActuallyRegistered) {
      console.log('❌ Player not registered - showing modal');
      setShowRegistration(true);
    } else {
      console.log('✅ Player already registered - hiding modal');
      setShowRegistration(false);
    }
  }, [isConnected, account?.address, activeAccount.isConnected, activeAccount.address, isMiniApp, player]);

  const handleRegister = async () => {
    if (!username.trim()) return;

    // Get the correct address based on mode
    const address = isMiniApp ? activeAccount.address : account?.address;
    
    if (!address) {
      console.error('❌ No address available for registration');
      setRegistrationStatus('idle');
      setIsRegistering(false);
      return;
    }

    // First, check if player is already registered by loading their data
    if (contractCallbacks.loadPlayerData) {
      console.log('🔍 Checking if player is already registered...', { address });
      try {
        const existingPlayer = await contractCallbacks.loadPlayerData(address);
        if (existingPlayer && (existingPlayer.isRegistered || (existingPlayer.username && existingPlayer.username.trim().length > 0))) {
          console.log('✅ Player is already registered, skipping registration');
          setRegistrationStatus('success');
          setUsername('');
          setIsRegistering(false);
          // Also load the player data into the store
          if (address) {
            await loadPlayerData(address);
          }
          return;
        }
      } catch (error) {
        console.log('Could not check existing registration, proceeding with new registration');
      }
    }

    setIsRegistering(true);
    setRegistrationStatus('pending');

    try {
      console.log('🔄 Starting registration for:', username.trim());
      const result = await registerPlayer(username.trim());
      console.log('📝 Registration result:', result);

      if (result) {
        console.log('✅ Registration successful! Waiting for blockchain confirmation...');
        setRegistrationStatus('waiting');
        setUsername('');

        // Wait a bit longer for blockchain confirmation, then reload player data
        setTimeout(async () => {
        console.log('🔄 Reloading player data after registration...');
        setRegistrationStatus('success');
        const address = isMiniApp ? activeAccount.address : account?.address;
        if (address) {
          await loadPlayerData(address);
        }
        }, 4000);
      } else {
        setRegistrationStatus('idle');
      }
    } catch (error: unknown) {
      // Check if error is "Already registered" - treat as success
      const errorMessage = (error instanceof Error ? error.message : String(error)) || '';
      if (errorMessage.includes('Already registered') || 
          errorMessage.includes('already registered') ||
          errorMessage.includes('Player already registered')) {
        console.log('✅ Player already registered (from error), loading data...');
        setRegistrationStatus('waiting');
        setUsername('');
        setTimeout(async () => {
          setRegistrationStatus('success');
          const address = isMiniApp ? activeAccount.address : account?.address;
          if (address) {
            await loadPlayerData(address);
          }
        }, 2000);
      } else {
      console.error('Registration failed:', error);
      setRegistrationStatus('idle');
      }
    }
    setIsRegistering(false);
  };


  return (
    <>

      {/* Wallet Connection UI - changes based on connection status and environment */}
      {isMiniApp ? (
        // Farcaster MiniApp mode - show Farcaster wallet component
        <div className="relative z-20 mb-4 flex flex-col items-center gap-2">
          <FarcasterWallet />
          {!wagmiAccount.isConnected && (
            <button
              onClick={() => {
                if (wagmiConnectors && wagmiConnectors[0]) {
                  wagmiConnect({ connector: wagmiConnectors[0] });
                }
              }}
              disabled={isWagmiConnecting || !wagmiConnectors?.length}
              className={`nes-btn ${isWagmiConnecting ? 'is-disabled' : 'is-primary'} pixel-font text-xs`}
            >
              {isWagmiConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
            </button>
          )}
        </div>
      ) : (
        // Regular browser mode - show Thirdweb ConnectButton
        activeAccount.address ? (
          <div className="flex items-center space-x-3 relative z-20">
            <div className="nes-container is-dark pixel-font text-sm">
              💰 {activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)}
            </div>
            <button
              onClick={() => {
                // Disconnect handled by wallet context
                window.location.reload();
              }}
              className="nes-btn is-error pixel-font text-xs"
              title="Disconnect Wallet"
            >
              EXIT
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 relative z-20">
            {isMiniPay && (
              <div className="nes-container is-success pixel-font text-xs px-3 py-2 mb-2">
                <div className="mb-1">🎉 MiniPay Detected!</div>
                <div className="text-[10px]">Enjoy seamless, low-cost transactions!</div>
                {parseFloat(cUSDBalance) > 0 && (
                  <div className="mt-1 text-[10px] font-bold">
                    💵 {parseFloat(cUSDBalance).toFixed(2)} cUSD
                  </div>
                )}
              </div>
            )}
            <ConnectButton
              client={client}
              chain={celoSepolia}
              theme="light"
              connectButton={{
                label: "💼 CONNECT WALLET",
              }}
            />
            {isMiniPay && (
              <button
                onClick={openMiniPayAddCash}
                className="nes-btn is-success pixel-font text-xs px-3 py-1"
              >
                💰 Add Cash to MiniPay
              </button>
            )}
          </div>
        )
      )}

      {/* Registration Modal */}
      {showRegistration && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999
          }}
        >
          <div className="nes-container with-title is-centered pixel-art" style={{ backgroundColor: 'white', maxWidth: '400px' }}>
            <p className="title pixel-font text-primary">WELCOME TO CELO RUNNER!</p>
            <p className="text-gray-800 mb-4 pixel-font text-sm">Choose your username to start playing:</p>

            {registrationStatus === 'waiting' && (
              <div className="mb-4 text-center">
                <p className="text-blue-600 pixel-font text-sm">⏳ Waiting for blockchain confirmation...</p>
              </div>
            )}

            {registrationStatus === 'success' && (
              <div className="mb-4 text-center">
                <p className="text-green-600 pixel-font text-sm">✅ Registration confirmed! Loading game...</p>
              </div>
            )}

            <div className="nes-field mb-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="nes-input pixel-font"
                style={{ color: 'black', backgroundColor: 'white' }}
                maxLength={20}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleRegister}
                disabled={!username.trim() || isRegistering}
                className={`nes-btn ${!username.trim() || isRegistering ? 'is-disabled' : 'is-success'} pixel-font w-full`}
              >
{
                  registrationStatus === 'pending' ? 'PROCESSING...' :
                  registrationStatus === 'waiting' ? 'CONFIRMING...' :
                  registrationStatus === 'success' ? 'SUCCESS!' :
                  'REGISTER & START PLAYING'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}