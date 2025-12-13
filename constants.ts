import { Post } from './types';

// The requested profile picture
export const PROFILE_PIC_URL = "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7346962671465398318~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=10399&refresh_token=db32218d&x-expires=1765828800&x-signature=YYmHGRgMSGnMvtzNl3QWlqCk8DA%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=no1a";

export const COIN_NAME = "Kia Kitty Cat";
export const USERNAME = "kia_kitty_cat";
export const TICKER = "$KIA";
// Placeholder for the requested CA format
export const CA_ADDRESS = "XXXXXXXXXXXXXXXXXXXXXXXXXXX"; 

export const STATS = {
  following: "262",
  followers: "121.3K",
  likes: "4.2M"
};

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=1',
    views: '839.9K',
    caption: 'Lululemon $169.12',
    isPinned: true
  },
  {
    id: '2',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=2',
    views: '7662',
    caption: 'Stonks go up'
  },
  {
    id: '3',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=3',
    views: '8837',
    caption: 'Boardroom meeting'
  },
  {
    id: '4',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=4',
    views: '13.4K',
    caption: 'Building the future'
  },
  {
    id: '5',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=5',
    views: '11.1K',
    caption: 'Build A Bear $63.10'
  },
  {
    id: '6',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=6',
    views: '72K',
    caption: 'Celcuity $52.24'
  },
  {
    id: '7',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=7',
    views: '3452',
    caption: 'Office life'
  },
  {
    id: '8',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=8',
    views: '27.1K',
    caption: 'CIA Kitty'
  },
  {
    id: '9',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=9',
    views: '5728',
    caption: 'Holdings, Inc $0.239'
  },
  {
    id: '10',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=10',
    views: '29.6K',
    caption: 'Palantir Technologies $159.27'
  },
  {
    id: '11',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=11',
    views: '9561',
    caption: 'Working hard'
  },
  {
    id: '12',
    type: 'video',
    thumbnail: 'https://picsum.photos/400/600?random=12',
    views: '3390',
    caption: '$NVDA vs $MSFT'
  }
];