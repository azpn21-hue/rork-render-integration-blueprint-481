import { secureGridEncryption, EncryptedMessage } from './encryption';
import { locationMaskingService, MaskedLocation } from './location-masking';
import { vpnTunnelService, VPNTunnelConfig, TunnelSession } from './vpn-tunnel';

export interface SecureGridConfig {
  encryption: {
    enabled: boolean;
    rotateKeysInterval: number;
  };
  locationMasking: {
    enabled: boolean;
    obfuscationLevel: 'low' | 'medium' | 'high' | 'maximum';
  };
  vpnTunnel: VPNTunnelConfig;
}

class SecureGridManager {
  private config: SecureGridConfig = {
    encryption: {
      enabled: true,
      rotateKeysInterval: 86400000,
    },
    locationMasking: {
      enabled: true,
      obfuscationLevel: 'high',
    },
    vpnTunnel: {
      enabled: true,
      tunnelProtocol: 'custom',
      encryptionLevel: 'military',
      killSwitch: true,
      splitTunneling: false,
    },
  };

  private activeTunnelSession: TunnelSession | null = null;

  async initialize(userId: string): Promise<void> {
    console.log('[SecureGrid] Initializing SecureGrid for user:', userId);

    await secureGridEncryption.generateKeyPair(userId);

    if (this.config.vpnTunnel.enabled) {
      this.activeTunnelSession = await vpnTunnelService.createTunnel(
        userId,
        this.config.vpnTunnel
      );
    }

    console.log('[SecureGrid] Initialization complete');
  }

  async sendSecureMessage(
    plaintext: string,
    senderId: string,
    recipientPublicKey: string
  ): Promise<EncryptedMessage> {
    if (!this.config.encryption.enabled) {
      throw new Error('Encryption is disabled');
    }

    return secureGridEncryption.encryptMessage(
      plaintext,
      recipientPublicKey
    );
  }

  async receiveSecureMessage(
    encrypted: EncryptedMessage,
    recipientId: string
  ): Promise<string> {
    const privateKey = secureGridEncryption.getPrivateKey(recipientId);
    
    if (!privateKey) {
      throw new Error('Private key not found for recipient');
    }

    return secureGridEncryption.decryptMessage(encrypted, privateKey);
  }

  async maskCurrentLocation(
    lat: number,
    lng: number
  ): Promise<MaskedLocation> {
    if (!this.config.locationMasking.enabled) {
      return {
        maskedLat: lat,
        maskedLng: lng,
        proxyRegion: 'none',
        obfuscationLevel: 'low',
        timestamp: Date.now(),
      };
    }

    return locationMaskingService.maskLocation(
      lat,
      lng,
      this.config.locationMasking.obfuscationLevel
    );
  }

  async secureRequest(url: string, data: any): Promise<any> {
    let processedData = data;

    if (this.config.locationMasking.enabled && data.location) {
      const masked = await this.maskCurrentLocation(
        data.location.lat,
        data.location.lng
      );
      processedData = {
        ...data,
        location: {
          lat: masked.maskedLat,
          lng: masked.maskedLng,
        },
      };
    }

    if (this.config.vpnTunnel.enabled && this.activeTunnelSession) {
      return vpnTunnelService.encapsulateRequest(
        this.activeTunnelSession.sessionId,
        processedData
      );
    }

    return locationMaskingService.routeThroughProxy(url, processedData);
  }

  updateConfig(newConfig: Partial<SecureGridConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    console.log('[SecureGrid] Configuration updated');
  }

  getConfig(): SecureGridConfig {
    return { ...this.config };
  }

  async getSecurityStatus() {
    const tunnelActive = this.activeTunnelSession?.status === 'active';
    
    return {
      encryption: {
        enabled: this.config.encryption.enabled,
        algorithm: 'AES-256-GCM',
      },
      locationMasking: {
        enabled: this.config.locationMasking.enabled,
        level: this.config.locationMasking.obfuscationLevel,
      },
      vpnTunnel: {
        enabled: this.config.vpnTunnel.enabled,
        status: this.activeTunnelSession?.status || 'disconnected',
        endpoint: this.activeTunnelSession?.endpoint,
        bytesTransferred: this.activeTunnelSession?.bytesTransferred || 0,
      },
      overallSecurityScore: this.calculateSecurityScore(),
    };
  }

  private calculateSecurityScore(): number {
    let score = 0;
    
    if (this.config.encryption.enabled) score += 40;
    if (this.config.locationMasking.enabled) {
      const levelScores = { low: 10, medium: 20, high: 30, maximum: 40 };
      score += levelScores[this.config.locationMasking.obfuscationLevel];
    }
    if (this.config.vpnTunnel.enabled && this.activeTunnelSession?.status === 'active') {
      score += 20;
    }

    return Math.min(score, 100);
  }

  async shutdown(): Promise<void> {
    console.log('[SecureGrid] Shutting down SecureGrid');

    if (this.activeTunnelSession) {
      await vpnTunnelService.closeTunnel(this.activeTunnelSession.sessionId);
      this.activeTunnelSession = null;
    }

    secureGridEncryption.clearSessionKeys();
  }
}

export const secureGridManager = new SecureGridManager();

export {
  secureGridEncryption,
  locationMaskingService,
  vpnTunnelService,
  EncryptedMessage,
  MaskedLocation,
  TunnelSession,
};
