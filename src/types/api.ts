export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  cursor?: string;
  hasMore: boolean;
}

// Auth
export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

// Location
export interface UpdateLocationRequest {
  lat: number;
  lon: number;
  geohash: string;
}

// Profile
export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  mood?: string;
  interests?: string[];
}

// Messages
export interface SendMessageRequest {
  content: string;
  type: 'text' | 'voice' | 'gift' | 'emoji' | 'image';
  metadata?: Record<string, unknown>;
}

// Stories
export interface CreateStoryRequest {
  mediaUrl?: string;
  textContent?: string;
  mood?: string;
  locationName?: string;
}
