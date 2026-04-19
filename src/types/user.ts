export type Mood =
  | 'happy' | 'romantic' | 'adventurous' | 'chill'
  | 'curious' | 'mysterious' | 'playful' | 'creative';

export type BadgeKey =
  | 'first_heart' | 'first_match' | 'streak_7' | 'streak_30'
  | 'super_heart' | 'early_adopter' | 'popular' | 'explorer';

export interface User {
  id: string;
  phone: string;
  name: string;
  bio?: string;
  /** Earned badge keys from backend (optional until loaded) */
  badges?: BadgeKey[];
  avatarUrl?: string;
  mood?: Mood;
  interests: string[];
  musicStatus?: {
    track: string;
    artist: string;
    albumArt?: string;
  };
  loveScore: number;
  streakCount: number;
  lastActive: string; // ISO
  isPremium: boolean;
  isGhost: boolean;
  createdAt: string; // ISO
}

export interface NearbyUser {
  id: string;
  name: string;
  avatarUrl?: string;
  mood?: Mood;
  interests: string[];
  /** Proximity alarm feed (meters) */
  distanceMeters?: number;
  /** Browse / discovery APIs often return km */
  distance?: number;
  bio?: string;
  isPremium?: boolean;
  loveScore?: number;
  streakCount?: number;
  isAnonymous: boolean; // non-premium users see blurred profiles
  hasHeartedMe: boolean;
}

export interface UserProfile extends User {
  badges: BadgeKey[];
  heartCount: number;        // hearts given
  heartReceivedCount: number; // hearts received
  mutualMatches: number;
}

export interface AuthUser {
  user: User;
  accessToken: string;
  refreshToken: string;
}
