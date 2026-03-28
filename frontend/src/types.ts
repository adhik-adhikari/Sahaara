export type CheckInQuestion = {
  id: string;
  prompt: string;
  type: "scale" | "text";
  min?: number;
  max?: number;
  labels?: Record<string, string>;
  placeholder?: string;
};

export type Widget = {
  id: string;
  title: string;
  description: string;
  cta: string;
};

export type CommunityPost = {
  id: string;
  display_name: string;
  room: string;
  body: string;
  relatable_count: number;
  support_count: number;
  created_at: string;
};

export type CheckInResult = {
  tier: string;
  tier_emoji: string;
  message: string;
  suggested_widgets: Widget[];
};
