import * as Crypto from 'expo-crypto';

export interface EncryptedMessage {
  ciphertext: string;
  iv: string;
  authTag: string;
  keyId: string;
  timestamp: number;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  keyId: string;
}

class SecureGridEncryption {
  private keyPairs: Map<string, KeyPair> = new Map();
  private sessionKeys: Map<string, string> = new Map();

  async generateKeyPair(userId: string): Promise<KeyPair> {
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    const privateKey = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const publicKeyBytes = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      privateKey
    );
    
    const keyPair: KeyPair = {
      publicKey: publicKeyBytes,
      privateKey,
      keyId: `key_${Date.now()}_${userId}`,
    };

    this.keyPairs.set(userId, keyPair);
    return keyPair;
  }

  async generateSessionKey(conversationId: string): Promise<string> {
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    const sessionKey = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    this.sessionKeys.set(conversationId, sessionKey);
    return sessionKey;
  }

  async encryptMessage(
    plaintext: string,
    recipientPublicKey: string,
    sessionKey?: string
  ): Promise<EncryptedMessage> {
    const key = sessionKey || recipientPublicKey;
    
    const iv = await Crypto.getRandomBytesAsync(16);
    const ivHex = Array.from(iv)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const dataToEncrypt = JSON.stringify({
      message: plaintext,
      timestamp: Date.now(),
      nonce: await Crypto.getRandomBytesAsync(8),
    });

    const encrypted = await this.xorEncrypt(dataToEncrypt, key, ivHex);
    
    const authTag = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      encrypted + key
    );

    return {
      ciphertext: encrypted,
      iv: ivHex,
      authTag,
      keyId: recipientPublicKey.substring(0, 16),
      timestamp: Date.now(),
    };
  }

  async decryptMessage(
    encrypted: EncryptedMessage,
    privateKey: string
  ): Promise<string> {
    const computedAuthTag = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      encrypted.ciphertext + privateKey
    );

    if (computedAuthTag !== encrypted.authTag) {
      throw new Error('Authentication failed - message may be tampered');
    }

    const decrypted = await this.xorDecrypt(
      encrypted.ciphertext,
      privateKey,
      encrypted.iv
    );

    const parsed = JSON.parse(decrypted);
    
    const messageAge = Date.now() - parsed.timestamp;
    if (messageAge > 300000) {
      console.warn('[SecureGrid] Message older than 5 minutes');
    }

    return parsed.message;
  }

  private async xorEncrypt(
    data: string,
    key: string,
    iv: string
  ): Promise<string> {
    const combinedKey = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      key + iv
    );

    const dataBytes = new TextEncoder().encode(data);
    const keyBytes = this.hexToBytes(combinedKey);
    
    const encrypted = new Uint8Array(dataBytes.length);
    for (let i = 0; i < dataBytes.length; i++) {
      encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    return btoa(String.fromCharCode(...encrypted));
  }

  private async xorDecrypt(
    ciphertext: string,
    key: string,
    iv: string
  ): Promise<string> {
    const combinedKey = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      key + iv
    );

    const encryptedBytes = Uint8Array.from(
      atob(ciphertext),
      c => c.charCodeAt(0)
    );
    const keyBytes = this.hexToBytes(combinedKey);
    
    const decrypted = new Uint8Array(encryptedBytes.length);
    for (let i = 0; i < encryptedBytes.length; i++) {
      decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    return new TextDecoder().decode(decrypted);
  }

  private hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  getPublicKey(userId: string): string | undefined {
    return this.keyPairs.get(userId)?.publicKey;
  }

  getPrivateKey(userId: string): string | undefined {
    return this.keyPairs.get(userId)?.privateKey;
  }

  async rotateKeys(userId: string): Promise<KeyPair> {
    console.log('[SecureGrid] Rotating keys for:', userId);
    return this.generateKeyPair(userId);
  }

  clearSessionKeys(): void {
    this.sessionKeys.clear();
  }
}

export const secureGridEncryption = new SecureGridEncryption();
