import { NearbyUser, User } from './user';

export interface AlarmSession {
  id: string;
  userId: string;
  lat: number;
  lon: number;
  geohash: string;
  startedAt: string;
  endedAt?: string;
  isActive: boolean;
}

export interface ProximityEvent {
  nearbyUsers: NearbyUser[];
  timestamp: string;
}

export interface Heart {
  id: string;
  fromUser: User;
  toUser: User;
  isSuper: boolean;
  createdAt: string;
}

export interface AlarmHistory {
  id: string;
  userId: string;
  nearbyCount: number;
  lat: number;
  lon: number;
  locationName?: string;
  recordedAt: string;
}

export interface Story {
  id: string;
  user: User;
  mediaUrl?: string;
  textContent?: string;
  mood?: string;
  locationName?: string;
  expiresAt: string;
  viewCount: number;
  hasViewed: boolean;
  createdAt: string;
}

export interface StoryGroup {
  user: User;
  stories: Story[];
  hasUnviewed: boolean;
}

export type NotificationType =
  | 'alarm'      // someone nearby
  | 'heart'      // someone hearted you
  | 'match'      // mutual heart
  | 'message'    // new message
  | 'story'      // new story
  | 'boost';     // boost activated

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export interface Boost {
  id: string;
  userId: string;
  startedAt: string;
  endsAt: string;
  isActive: boolean;
  minutesRemaining: number;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'monthly' | 'yearly';
  startedAt: string;
  endsAt: string;
  isActive: boolean;
}

export type DailyTask = {
  id: string;
  label: string;
  icon: string;
  isCompleted: boolean;
  reward: number; // love score reward
};
