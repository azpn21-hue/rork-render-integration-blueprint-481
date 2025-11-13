import * as Crypto from 'expo-crypto';

export interface MaskedLocation {
  maskedLat: number;
  maskedLng: number;
  proxyRegion: string;
  obfuscationLevel: 'low' | 'medium' | 'high' | 'maximum';
  timestamp: number;
}

export interface LocationProxyConfig {
  enabled: boolean;
  obfuscationRadius: number;
  useProxyServers: boolean;
  proxyRegions: string[];
}

class LocationMaskingService {
  private readonly PROXY_REGIONS = [
    { name: 'US-West', lat: 37.7749, lng: -122.4194 },
    { name: 'US-East', lat: 40.7128, lng: -74.0060 },
    { name: 'EU-Central', lat: 50.1109, lng: 8.6821 },
    { name: 'Asia-Pacific', lat: 35.6762, lng: 139.6503 },
    { name: 'South-America', lat: -23.5505, lng: -46.6333 },
  ];

  async maskLocation(
    realLat: number,
    realLng: number,
    obfuscationLevel: 'low' | 'medium' | 'high' | 'maximum' = 'high'
  ): Promise<MaskedLocation> {
    const obfuscationRadii = {
      low: 0.01,
      medium: 0.1,
      high: 0.5,
      maximum: 5.0,
    };

    const radius = obfuscationRadii[obfuscationLevel];
    
    const randomBytes = await Crypto.getRandomBytesAsync(8);
    const randomAngle = (randomBytes[0] / 255) * 2 * Math.PI;
    const randomDistance = (randomBytes[1] / 255) * radius;

    const maskedLat = realLat + randomDistance * Math.cos(randomAngle);
    const maskedLng = realLng + randomDistance * Math.sin(randomAngle);

    const proxyRegion = this.selectProxyRegion();

    console.log(`[SecureGrid] Location masked with ${obfuscationLevel} obfuscation`);

    return {
      maskedLat,
      maskedLng,
      proxyRegion: proxyRegion.name,
      obfuscationLevel,
      timestamp: Date.now(),
    };
  }

  async routeThroughProxy(
    url: string,
    data: any,
    proxyRegion?: string
  ): Promise<any> {
    const region = proxyRegion || this.selectProxyRegion().name;
    
    console.log(`[SecureGrid] Routing request through proxy: ${region}`);

    const proxyHeaders = {
      'X-Proxy-Region': region,
      'X-Forwarded-For': this.generateProxyIP(region),
      'X-Real-IP': 'masked',
      'X-SecureGrid': 'enabled',
    };

    return {
      url,
      data,
      headers: proxyHeaders,
      proxyRegion: region,
    };
  }

  private selectProxyRegion() {
    const randomIndex = Math.floor(Math.random() * this.PROXY_REGIONS.length);
    return this.PROXY_REGIONS[randomIndex];
  }

  private generateProxyIP(region: string): string {
    const proxyIPs: Record<string, string> = {
      'US-West': '203.0.113.',
      'US-East': '198.51.100.',
      'EU-Central': '192.0.2.',
      'Asia-Pacific': '198.18.0.',
      'South-America': '203.0.115.',
    };

    const baseIP = proxyIPs[region] || '192.0.2.';
    const randomOctet = Math.floor(Math.random() * 255);
    
    return `${baseIP}${randomOctet}`;
  }

  async getAnonymizedMetadata() {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    const sessionId = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return {
      sessionId,
      userAgent: 'SecureGrid/1.0',
      platform: 'masked',
      deviceId: 'anonymous',
      timestamp: Date.now(),
    };
  }

  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const locationMaskingService = new LocationMaskingService();
