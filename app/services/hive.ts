import { trpc } from "@/lib/trpc";

export type ConnectionStatus = "active" | "pending";

export interface HiveConnection {
  connectionId: string;
  userId: string;
  displayName: string;
  avatarUrl: string;
  status: ConnectionStatus;
  resonanceScore: number;
  connectedAt: string;
  sharedInterests: string[];
  pulseCompatibility: number;
}

export interface HiveStats {
  activeConnections: number;
  pendingRequests: number;
  totalResonance: number;
}

export interface HiveNFT {
  nftId: string;
  tokenId: number;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  mintedAt: string;
  blockchain: string;
  contractAddress?: string;
}

export const useHiveConnections = (options?: {
  userId?: string;
  limit?: number;
  status?: "active" | "pending" | "all";
}) => {
  return trpc.r3al.hive.getConnections.useQuery(options || {});
};

export const useRequestHiveConnection = () => {
  return trpc.r3al.hive.requestConnection.useMutation();
};

export const useRespondHiveConnection = () => {
  return trpc.r3al.hive.respondConnection.useMutation();
};

export const useGenerateHiveNFT = () => {
  return trpc.r3al.hive.generateNFT.useMutation();
};

export const useHiveNFT = (userId?: string) => {
  return trpc.r3al.hive.getNFT.useQuery({ userId });
};

export const getResonanceColor = (score: number): string => {
  if (score >= 0.9) return "#00E676";
  if (score >= 0.75) return "#76FF03";
  if (score >= 0.6) return "#FFD600";
  if (score >= 0.4) return "#FF9100";
  return "#FF3D00";
};

export const getResonanceLabel = (score: number): string => {
  if (score >= 0.9) return "Deep Resonance";
  if (score >= 0.75) return "Strong Connection";
  if (score >= 0.6) return "Good Harmony";
  if (score >= 0.4) return "Emerging Bond";
  return "New Connection";
};
