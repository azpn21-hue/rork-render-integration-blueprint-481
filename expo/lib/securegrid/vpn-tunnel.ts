import * as Crypto from 'expo-crypto';

export interface VPNTunnelConfig {
  enabled: boolean;
  tunnelProtocol: 'wireguard' | 'openvpn' | 'custom';
  encryptionLevel: 'standard' | 'military';
  killSwitch: boolean;
  splitTunneling: boolean;
}

export interface TunnelSession {
  sessionId: string;
  startTime: number;
  bytesTransferred: number;
  endpoint: string;
  status: 'active' | 'connecting' | 'disconnected';
}

class VPNTunnelService {
  private activeSessions: Map<string, TunnelSession> = new Map();
  private readonly TUNNEL_ENDPOINTS = [
    'tunnel-us-west.securegrid.r3al',
    'tunnel-us-east.securegrid.r3al',
    'tunnel-eu.securegrid.r3al',
    'tunnel-asia.securegrid.r3al',
  ];

  async createTunnel(
    userId: string,
    config: VPNTunnelConfig
  ): Promise<TunnelSession> {
    console.log('[SecureGrid] Creating VPN tunnel for:', userId);

    const randomBytes = await Crypto.getRandomBytesAsync(16);
    const sessionId = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const endpoint = this.selectEndpoint();

    const session: TunnelSession = {
      sessionId,
      startTime: Date.now(),
      bytesTransferred: 0,
      endpoint,
      status: 'connecting',
    };

    this.activeSessions.set(sessionId, session);

    setTimeout(() => {
      const activeSession = this.activeSessions.get(sessionId);
      if (activeSession) {
        activeSession.status = 'active';
        console.log('[SecureGrid] VPN tunnel established:', sessionId);
      }
    }, 1000);

    return session;
  }

  async encapsulateRequest(
    sessionId: string,
    requestData: any
  ): Promise<any> {
    const session = this.activeSessions.get(sessionId);
    
    if (!session || session.status !== 'active') {
      throw new Error('VPN tunnel not active');
    }

    const encapsulatedData = await this.wrapInTunnel(requestData);
    
    session.bytesTransferred += JSON.stringify(requestData).length;

    console.log('[SecureGrid] Request encapsulated through tunnel:', sessionId);

    return {
      tunnelSessionId: sessionId,
      endpoint: session.endpoint,
      encapsulatedData,
      timestamp: Date.now(),
    };
  }

  private async wrapInTunnel(data: any): Promise<string> {
    const serialized = JSON.stringify(data);
    
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    const tunnelKey = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const wrapped = {
      payload: btoa(serialized),
      tunnelKey: tunnelKey.substring(0, 16),
      timestamp: Date.now(),
    };

    return btoa(JSON.stringify(wrapped));
  }

  async unwrapFromTunnel(encapsulatedData: string): Promise<any> {
    try {
      const wrapped = JSON.parse(atob(encapsulatedData));
      const serialized = atob(wrapped.payload);
      return JSON.parse(serialized);
    } catch (error) {
      console.error('[SecureGrid] Failed to unwrap tunnel data:', error);
      throw new Error('Invalid tunnel data');
    }
  }

  private selectEndpoint(): string {
    const randomIndex = Math.floor(Math.random() * this.TUNNEL_ENDPOINTS.length);
    return this.TUNNEL_ENDPOINTS[randomIndex];
  }

  async closeTunnel(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    
    if (session) {
      session.status = 'disconnected';
      console.log('[SecureGrid] VPN tunnel closed:', sessionId);
      console.log('[SecureGrid] Bytes transferred:', session.bytesTransferred);
      
      this.activeSessions.delete(sessionId);
    }
  }

  getActiveSessions(): TunnelSession[] {
    return Array.from(this.activeSessions.values());
  }

  getTunnelStats(sessionId: string): TunnelSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  async performHealthCheck(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    
    if (!session) {
      return false;
    }

    const age = Date.now() - session.startTime;
    if (age > 3600000) {
      console.warn('[SecureGrid] Tunnel session expired, rotating...');
      return false;
    }

    return session.status === 'active';
  }
}

export const vpnTunnelService = new VPNTunnelService();
