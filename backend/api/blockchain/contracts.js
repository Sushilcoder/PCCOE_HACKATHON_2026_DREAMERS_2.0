const { ethers } = require('ethers');

// Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "bytes32", "name": "_contentHash", "type": "bytes32" },
      { "internalType": "bytes", "name": "_signature", "type": "bytes" },
      { "internalType": "string", "name": "_metadata", "type": "string" }
    ],
    "name": "registerContent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "_contentHash", "type": "bytes32" }],
    "name": "verifyContent",
    "outputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "contentHash", "type": "bytes32" },
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "bytes", "name": "signature", "type": "bytes" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "string", "name": "metadata", "type": "string" },
          { "internalType": "bool", "name": "verified", "type": "bool" }
        ],
        "internalType": "struct ContentAuthenticity.ContentRecord",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "_contentHash", "type": "bytes32" }],
    "name": "getContent",
    "outputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "contentHash", "type": "bytes32" },
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "bytes", "name": "signature", "type": "bytes" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "string", "name": "metadata", "type": "string" },
          { "internalType": "bool", "name": "verified", "type": "bool" }
        ],
        "internalType": "struct ContentAuthenticity.ContentRecord",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "_contentHash", "type": "bytes32" }],
    "name": "isVerified",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

/**
 * Blockchain contract manager
 */
class BlockchainContractManager {
  constructor(rpcUrl, contractAddress, privateKey = null) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contractAddress = contractAddress;
    this.privateKey = privateKey;
    this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.provider);
    
    if (privateKey) {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      this.contract = this.contract.connect(wallet);
    }
  }

  /**
   * Register content on blockchain
   */
  async registerContent(contentHash, signature, metadata) {
    try {
      if (!this.privateKey) {
        throw new Error('Private key required for registration');
      }

      const tx = await this.contract.registerContent(
        contentHash,
        signature,
        JSON.stringify(metadata),
        { gasLimit: 500000 }
      );

      const receipt = await tx.wait();
      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'success' : 'failed'
      };
    } catch (error) {
      console.error('Error registering content:', error);
      throw error;
    }
  }

  /**
   * Verify content on blockchain
   */
  async verifyContent(contentHash) {
    try {
      const record = await this.contract.verifyContent(contentHash);
      return {
        contentHash: record.contentHash,
        creator: record.creator,
        timestamp: new Date(Number(record.timestamp) * 1000).toISOString(),
        verified: record.verified,
        metadata: JSON.parse(record.metadata || '{}')
      };
    } catch (error) {
      console.error('Error verifying content:', error);
      throw error;
    }
  }

  /**
   * Get content record
   */
  async getContent(contentHash) {
    try {
      const record = await this.contract.getContent(contentHash);
      return {
        contentHash: record.contentHash,
        creator: record.creator,
        timestamp: new Date(Number(record.timestamp) * 1000).toISOString(),
        verified: record.verified,
        metadata: JSON.parse(record.metadata || '{}')
      };
    } catch (error) {
      console.error('Error getting content:', error);
      throw error;
    }
  }

  /**
   * Check if content is verified
   */
  async isVerified(contentHash) {
    try {
      return await this.contract.isVerified(contentHash);
    } catch (error) {
      console.error('Error checking verification:', error);
      return false;
    }
  }

  /**
   * Generate content hash (SHA256)
   */
  static generateHash(data) {
    return ethers.keccak256(ethers.toUtf8Bytes(data));
  }

  /**
   * Sign data with private key
   */
  static signData(data, privateKey) {
    const wallet = new ethers.Wallet(privateKey);
    const messageHash = ethers.hashMessage(data);
    const signature = wallet.signingKey.sign(messageHash);
    return ethers.Signature.from(signature).serialized;
  }

  /**
   * Verify signature
   */
  static verifySignature(data, signature, address) {
    try {
      const recovered = ethers.verifyMessage(data, signature);
      return recovered.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }
}

module.exports = {
  BlockchainContractManager,
  CONTRACT_ABI
};
