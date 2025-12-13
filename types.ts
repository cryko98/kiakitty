import React from 'react';

export interface Post {
  id: string;
  type: 'image' | 'video';
  thumbnail: string;
  views: string;
  caption: string;
  isPinned?: boolean;
}

export interface NavItem {
  icon: React.ElementType;
  label?: string;
  isActive?: boolean;
  isSpecial?: boolean;
}

export enum TabType {
  POSTS = 'posts',
  LIKES = 'likes',
  PRIVATE = 'private'
}