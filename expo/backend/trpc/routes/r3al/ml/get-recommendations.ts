import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

interface UserActivity {
  userId: string;
  interactions: {
    type: 'resonate' | 'amplify' | 'circle_join' | 'dm_sent' | 'post_created' | 'profile_view';
    targetId: string;
    timestamp: string;
    weight: number;
  }[];
  interests: string[];
  location?: { lat: number; lng: number };
  truthScore: number;
  verificationLevel: number;
}

interface RecommendationScore {
  userId: string;
  score: number;
  reasons: string[];
  matchFactors: {
    interestOverlap: number;
    proximityScore: number;
    truthCompatibility: number;
    activitySimilarity: number;
    circleAlignment: number;
  };
}

function calculateInterestOverlap(user1Interests: string[], user2Interests: string[]): number {
  if (!user1Interests.length || !user2Interests.length) return 0;
  
  const set1 = new Set(user1Interests.map(i => i.toLowerCase()));
  const set2 = new Set(user2Interests.map(i => i.toLowerCase()));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

function calculateProximityScore(
  loc1?: { lat: number; lng: number },
  loc2?: { lat: number; lng: number }
): number {
  if (!loc1 || !loc2) return 0.5;
  
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  if (distance < 10) return 1.0;
  if (distance < 50) return 0.8;
  if (distance < 100) return 0.6;
  if (distance < 500) return 0.4;
  return 0.2;
}

function calculateTruthCompatibility(score1: number, score2: number): number {
  const diff = Math.abs(score1 - score2);
  
  if (diff < 10) return 1.0;
  if (diff < 20) return 0.8;
  if (diff < 30) return 0.6;
  if (diff < 40) return 0.4;
  return 0.2;
}

function calculateActivitySimilarity(
  user1Activities: UserActivity['interactions'],
  user2Activities: UserActivity['interactions']
): number {
  if (!user1Activities.length || !user2Activities.length) return 0;
  
  const type1Counts: Record<string, number> = {};
  const type2Counts: Record<string, number> = {};
  
  user1Activities.forEach(a => {
    type1Counts[a.type] = (type1Counts[a.type] || 0) + 1;
  });
  
  user2Activities.forEach(a => {
    type2Counts[a.type] = (type2Counts[a.type] || 0) + 1;
  });
  
  const allTypes = new Set([...Object.keys(type1Counts), ...Object.keys(type2Counts)]);
  let similarity = 0;
  
  allTypes.forEach(type => {
    const count1 = type1Counts[type] || 0;
    const count2 = type2Counts[type] || 0;
    const maxCount = Math.max(count1, count2);
    const minCount = Math.min(count1, count2);
    similarity += minCount / maxCount;
  });
  
  return similarity / allTypes.size;
}

function calculateCircleAlignment(
  user1Activities: UserActivity['interactions'],
  user2Activities: UserActivity['interactions']
): number {
  const user1Circles = new Set(
    user1Activities
      .filter(a => a.type === 'circle_join')
      .map(a => a.targetId)
  );
  
  const user2Circles = new Set(
    user2Activities
      .filter(a => a.type === 'circle_join')
      .map(a => a.targetId)
  );
  
  if (!user1Circles.size || !user2Circles.size) return 0;
  
  const sharedCircles = new Set(
    [...user1Circles].filter(c => user2Circles.has(c))
  );
  
  return sharedCircles.size / Math.max(user1Circles.size, user2Circles.size);
}

export const getRecommendationsProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
    type: z.enum(['matches', 'circles', 'posts']),
    limit: z.number().default(20),
    includeReasons: z.boolean().default(false),
  }))
  .query(async ({ input }) => {
    console.log(`[ML] Computing ${input.type} recommendations for ${input.userId}`);
    
    const currentUser: UserActivity = {
      userId: input.userId,
      interactions: [
        { type: 'resonate', targetId: 'post_1', timestamp: new Date().toISOString(), weight: 1 },
        { type: 'circle_join', targetId: 'tech_enthusiasts', timestamp: new Date().toISOString(), weight: 2 },
        { type: 'dm_sent', targetId: 'user_2', timestamp: new Date().toISOString(), weight: 1.5 },
      ],
      interests: ['technology', 'fitness', 'travel', 'music'],
      location: { lat: 37.7749, lng: -122.4194 },
      truthScore: 85,
      verificationLevel: 3,
    };
    
    const potentialMatches: UserActivity[] = [
      {
        userId: 'user_1',
        interactions: [
          { type: 'resonate', targetId: 'post_2', timestamp: new Date().toISOString(), weight: 1 },
          { type: 'circle_join', targetId: 'tech_enthusiasts', timestamp: new Date().toISOString(), weight: 2 },
        ],
        interests: ['technology', 'fitness', 'photography'],
        location: { lat: 37.7849, lng: -122.4094 },
        truthScore: 82,
        verificationLevel: 3,
      },
      {
        userId: 'user_2',
        interactions: [
          { type: 'post_created', targetId: 'post_3', timestamp: new Date().toISOString(), weight: 2 },
          { type: 'circle_join', targetId: 'fitness_lovers', timestamp: new Date().toISOString(), weight: 2 },
        ],
        interests: ['fitness', 'nutrition', 'wellness'],
        location: { lat: 37.8049, lng: -122.4294 },
        truthScore: 90,
        verificationLevel: 4,
      },
      {
        userId: 'user_3',
        interactions: [
          { type: 'resonate', targetId: 'post_4', timestamp: new Date().toISOString(), weight: 1 },
          { type: 'profile_view', targetId: 'user_1', timestamp: new Date().toISOString(), weight: 0.5 },
        ],
        interests: ['travel', 'food', 'culture'],
        location: { lat: 40.7128, lng: -74.0060 },
        truthScore: 78,
        verificationLevel: 2,
      },
    ];
    
    const recommendations: RecommendationScore[] = potentialMatches.map(candidate => {
      const interestOverlap = calculateInterestOverlap(currentUser.interests, candidate.interests);
      const proximityScore = calculateProximityScore(currentUser.location, candidate.location);
      const truthCompatibility = calculateTruthCompatibility(currentUser.truthScore, candidate.truthScore);
      const activitySimilarity = calculateActivitySimilarity(currentUser.interactions, candidate.interactions);
      const circleAlignment = calculateCircleAlignment(currentUser.interactions, candidate.interactions);
      
      const weights = {
        interest: 0.3,
        proximity: 0.15,
        truth: 0.25,
        activity: 0.15,
        circle: 0.15,
      };
      
      const score = 
        interestOverlap * weights.interest +
        proximityScore * weights.proximity +
        truthCompatibility * weights.truth +
        activitySimilarity * weights.activity +
        circleAlignment * weights.circle;
      
      const reasons: string[] = [];
      if (interestOverlap > 0.5) reasons.push('Shared interests');
      if (proximityScore > 0.7) reasons.push('Nearby');
      if (truthCompatibility > 0.8) reasons.push('Compatible truth scores');
      if (circleAlignment > 0.3) reasons.push('Common circles');
      
      return {
        userId: candidate.userId,
        score: Math.round(score * 100),
        reasons,
        matchFactors: {
          interestOverlap: Math.round(interestOverlap * 100),
          proximityScore: Math.round(proximityScore * 100),
          truthCompatibility: Math.round(truthCompatibility * 100),
          activitySimilarity: Math.round(activitySimilarity * 100),
          circleAlignment: Math.round(circleAlignment * 100),
        },
      };
    });
    
    const sorted = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, input.limit);
    
    console.log(`[ML] Generated ${sorted.length} recommendations with avg score: ${
      sorted.reduce((sum, r) => sum + r.score, 0) / sorted.length
    }`);
    
    return {
      recommendations: sorted,
      totalCandidates: potentialMatches.length,
      algorithm: 'hybrid-collaborative-content',
      timestamp: new Date().toISOString(),
    };
  });
