import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import bs58 from 'bs58';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// SNS Program IDs
const SNS_PROGRAM_ID = new PublicKey('namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX');
const SNS_ROOT_DOMAIN = new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx');

// Get RPC URL based on network
function getRpcUrl() {
  const network = process.env.NETWORK || 'testnet';
  if (network === 'mainnet') {
    return process.env.MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com';
  } else {
    return process.env.TESTNET_RPC_URL || 'https://api.testnet.solana.com';
  }
}

// Derive name account PDA
function deriveNameAccount(name) {
  const nameBuffer = Buffer.from(name.toLowerCase());
  const seeds = [
    Buffer.from('name'),
    SNS_ROOT_DOMAIN.toBuffer(),
    nameBuffer,
  ];
  
  const [nameAccount] = PublicKey.findProgramAddressSync(
    seeds,
    SNS_PROGRAM_ID
  );
  
  return nameAccount;
}

// API endpoint to buy SNS name
app.post('/api/buy-sns-name', async (req, res) => {
  try {
    const { name, privateKey } = req.body;

    // Validation
    if (!name || !privateKey) {
      return res.status(400).json({
        success: false,
        error: 'Name and privateKey are required'
      });
    }

    // Validate name format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(name.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid name format. Only lowercase letters, numbers, and hyphens allowed'
      });
    }

    // Parse private key - supports multiple formats
    let keypair;
    try {
      // Check if it's a base58 string (Solana wallet format)
      if (typeof privateKey === 'string' && privateKey.length > 40 && !privateKey.includes(',')) {
        // Base58 encoded string
        const decoded = bs58.decode(privateKey);
        keypair = Keypair.fromSecretKey(decoded);
      } 
      // Check if it's a comma-separated string
      else if (typeof privateKey === 'string' && privateKey.includes(',')) {
        const privateKeyArray = privateKey.split(',').map(Number);
        keypair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
      }
      // Check if it's an array
      else if (Array.isArray(privateKey)) {
        keypair = Keypair.fromSecretKey(new Uint8Array(privateKey));
      }
      // Try to parse as JSON array string
      else if (typeof privateKey === 'string') {
        const parsed = JSON.parse(privateKey);
        if (Array.isArray(parsed)) {
          keypair = Keypair.fromSecretKey(new Uint8Array(parsed));
        } else {
          throw new Error('Invalid format');
        }
      } else {
        throw new Error('Invalid format');
      }
    } catch (error) {
      console.error('Private key parsing error:', error);
      return res.status(400).json({
        success: false,
        error: 'Invalid private key format. Supported formats: base58 string, array, or comma-separated string'
      });
    }

    // Connect to Solana network
    const connection = new Connection(getRpcUrl(), 'confirmed');
    const network = process.env.NETWORK || 'testnet';

    // Check if name is already taken
    const nameAccount = deriveNameAccount(name);
    const nameAccountInfo = await connection.getAccountInfo(nameAccount);
    
    if (nameAccountInfo) {
      return res.status(400).json({
        success: false,
        error: 'Name is already taken'
      });
    }

    // Get user's SOL balance
    const balance = await connection.getBalance(keypair.publicKey);
    // Lower requirement for testnet, higher for mainnet
    const requiredBalance = network === 'testnet' 
      ? 0.01 * 1e9  // 0.01 SOL for testnet (for testing)
      : 0.1 * 1e9;   // 0.1 SOL for mainnet

    if (balance < requiredBalance) {
      const balanceSOL = (balance / 1e9).toFixed(4);
      const requiredSOL = (requiredBalance / 1e9).toFixed(2);
      const faucetLink = network === 'testnet' 
        ? 'https://faucet.solana.com' 
        : null;
      
      return res.status(400).json({
        success: false,
        error: `Insufficient balance. Need at least ${requiredSOL} SOL, but you have ${balanceSOL} SOL`,
        balance: balanceSOL,
        required: requiredSOL,
        address: keypair.publicKey.toString(),
        network: network,
        ...(faucetLink && { faucetUrl: faucetLink })
      });
    }

    // Create transaction to register name
    // Note: This is a simplified version. Actual SNS registration requires
    // interaction with the SNS program which may need additional instructions
    
    const registrationFee = network === 'testnet' ? 0.01 * 1e9 : 0.1 * 1e9;
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: nameAccount,
        lamports: registrationFee, // Registration fee
      })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = keypair.publicKey;

    // Sign and send transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [keypair],
      { commitment: 'confirmed' }
    );

    res.json({
      success: true,
      message: 'SNS name purchase initiated',
      data: {
        name: name,
        nameAccount: nameAccount.toString(),
        walletAddress: keypair.publicKey.toString(), // Wallet that purchased the name
        owner: keypair.publicKey.toString(), // Owner of the name
        transactionSignature: signature,
        network: network,
        explorerUrl: network === 'mainnet' 
          ? `https://solscan.io/tx/${signature}`
          : `https://solscan.io/tx/${signature}?cluster=testnet`,
        walletExplorerUrl: network === 'mainnet'
          ? `https://solscan.io/account/${keypair.publicKey.toString()}`
          : `https://solscan.io/account/${keypair.publicKey.toString()}?cluster=testnet`
      }
    });

  } catch (error) {
    console.error('Error buying SNS name:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to buy SNS name'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    network: process.env.NETWORK || 'testnet',
    rpcUrl: getRpcUrl()
  });
});

// Get name availability
app.get('/api/check-name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const connection = new Connection(getRpcUrl(), 'confirmed');
    const nameAccount = deriveNameAccount(name);
    const nameAccountInfo = await connection.getAccountInfo(nameAccount);
    
    res.json({
      success: true,
      name: name,
      available: !nameAccountInfo,
      nameAccount: nameAccount.toString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check balance for an address
app.get('/api/check-balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const connection = new Connection(getRpcUrl(), 'confirmed');
    const network = process.env.NETWORK || 'testnet';
    
    let publicKey;
    try {
      publicKey = new PublicKey(address);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Solana address'
      });
    }
    
    const balance = await connection.getBalance(publicKey);
    const balanceSOL = (balance / 1e9).toFixed(4);
    const requiredBalance = network === 'testnet' ? 0.01 : 0.1;
    
    res.json({
      success: true,
      address: address,
      balance: balanceSOL,
      balanceLamports: balance,
      required: requiredBalance.toString(),
      sufficient: balance >= (requiredBalance * 1e9),
      network: network,
      ...(network === 'testnet' && { faucetUrl: 'https://faucet.solana.com' })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Verify transaction and check name registration
app.get('/api/verify-transaction/:signature', async (req, res) => {
  try {
    const { signature } = req.params;
    const connection = new Connection(getRpcUrl(), 'confirmed');
    const network = process.env.NETWORK || 'testnet';
    
    // Get transaction details
    const tx = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    });
    
    if (!tx) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    // Check transaction status
    const isConfirmed = tx.meta?.err === null;
    const slot = tx.slot;
    const blockTime = tx.blockTime;
    
    // Get transaction accounts
    const accountKeys = tx.transaction.message.accountKeys.map(key => 
      typeof key === 'string' ? key : key.pubkey.toString()
    );
    
    res.json({
      success: true,
      transaction: {
        signature: signature,
        confirmed: isConfirmed,
        status: isConfirmed ? 'success' : 'failed',
        error: tx.meta?.err || null,
        slot: slot,
        blockTime: blockTime ? new Date(blockTime * 1000).toISOString() : null,
        fee: tx.meta?.fee ? tx.meta.fee / 1e9 : null,
        accounts: accountKeys
      },
      network: network,
      explorerUrl: network === 'mainnet' 
        ? `https://solscan.io/tx/${signature}`
        : `https://solscan.io/tx/${signature}?cluster=testnet`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Verify name registration status
app.get('/api/verify-name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const connection = new Connection(getRpcUrl(), 'confirmed');
    const network = process.env.NETWORK || 'testnet';
    
    const nameAccount = deriveNameAccount(name);
    const nameAccountInfo = await connection.getAccountInfo(nameAccount);
    
    if (!nameAccountInfo) {
      return res.json({
        success: true,
        name: name,
        registered: false,
        available: true,
        nameAccount: nameAccount.toString(),
        message: 'Name is not registered yet'
      });
    }
    
    // Get account owner
    const owner = nameAccountInfo.owner.toString();
    const lamports = nameAccountInfo.lamports;
    const data = nameAccountInfo.data;
    
    res.json({
      success: true,
      name: name,
      registered: true,
      available: false,
      nameAccount: nameAccount.toString(),
      owner: owner,
      balance: (lamports / 1e9).toFixed(9),
      dataLength: data.length,
      network: network,
      explorerUrl: network === 'mainnet'
        ? `https://solscan.io/account/${nameAccount.toString()}`
        : `https://solscan.io/account/${nameAccount.toString()}?cluster=testnet`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000; // Render uses PORT env var automatically
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Network: ${process.env.NETWORK || 'testnet'}`);
  console.log(`📡 RPC URL: ${getRpcUrl()}`);
  console.log(`\nEndpoints:`);
  console.log(`  POST /api/buy-sns-name - Buy SNS name`);
  console.log(`  GET  /api/check-name/:name - Check name availability`);
  console.log(`  GET  /api/verify-name/:name - Verify name registration`);
  console.log(`  GET  /api/verify-transaction/:signature - Verify transaction`);
  console.log(`  GET  /api/check-balance/:address - Check SOL balance`);
  console.log(`  GET  /api/health - Health check`);
});

