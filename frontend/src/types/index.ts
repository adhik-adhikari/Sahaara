export interface User {
  id: number;
  name: string;
  handle: string;
  av: string;
  color: string;
  tag: string;
}

export interface Tag {
  label: string;
  color: string;
}

export interface Post {
  id: number;
  user: User;
  message: string;
  reactions: number;
  replies: number;
  topReaction: string;
  tags: Tag[];
  liked: boolean;
}

export interface Quote {
  text: string;
  attr: string;
}

export interface BreathPhase {
  label: string;
  color: string;
  scale: number;
  dur: number;
}
