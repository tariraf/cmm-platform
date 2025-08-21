import { TikTokAnalytics, InstagramAnalytics, TwitterAnalytics, SEOAnalytics } from '@/types/analytics';

export const dummyTikTokData: TikTokAnalytics[] = [
  {
    date: '2024-12-01',
    month: 12,
    year: 2024,
    videoViews: 125000,
    profileViews: 8500,
    likes: 15200,
    shares: 2400,
    comments: 1800,
    trafficSources: {
      search: 32000,
      personalProfile: 18000,
      fyp: 65000,
      following: 8000,
      sound: 2000
    },
    searchQueries: [
      { keyword: 'meterai digital peruri', clicks: 318, impressions: 2100 },
      { keyword: 'tanda tangan elektronik', clicks: 270, impressions: 1800 },
      { keyword: 'cara buat meterai online', clicks: 232, impressions: 1500 },
      { keyword: 'dokumen digital', clicks: 120, impressions: 900 },
      { keyword: 'peruri official', clicks: 97, impressions: 650 }
    ]
  }
];

export const dummyInstagramData: InstagramAnalytics[] = [
  {
    date: '2024-12-01',
    month: 12,
    year: 2024,
    reach: 45000,
    impressionsOrganic: 28900,
    impressionsAds: 16100,
    engagement: 3200,
    adsViewsBreakdown: {
      followers: 9660, // 60%
      nonFollowers: 6440 // 40%
    },
    topPosts: [
      {
        id: 'post_1',
        type: 'reel',
        caption: 'Tutorial Meterai Digital - Mudah & Cepat!',
        views: 15400,
        likes: 820,
        comments: 156,
        shares: 89,
        date: '2024-12-01'
      },
      {
        id: 'post_2',
        type: 'carousel',
        caption: 'Keuntungan Menggunakan E-Sign PERURI',
        views: 12300,
        likes: 650,
        comments: 98,
        shares: 45,
        date: '2024-12-02'
      },
      {
        id: 'post_3',
        type: 'photo',
        caption: 'Meterai Elektronik vs Meterai Fisik',
        views: 9800,
        likes: 420,
        comments: 67,
        shares: 23,
        date: '2024-12-03'
      },
      {
        id: 'post_4',
        type: 'video',
        caption: 'Cara Daftar Akun PERURI',
        views: 8900,
        likes: 380,
        comments: 45,
        shares: 18,
        date: '2024-12-04'
      },
      {
        id: 'post_5',
        type: 'photo',
        caption: 'Tips Keamanan Dokumen Digital',
        views: 7200,
        likes: 290,
        comments: 34,
        shares: 12,
        date: '2024-12-05'
      }
    ]
  }
];

export const dummyTwitterData: TwitterAnalytics[] = [
  {
    month: 12,
    year: 2024,
    weeks: [
      {
        weekNumber: 1,
        startDate: '2024-12-01',
        endDate: '2024-12-07',
        postsCount: 12,
        impressions: 45000,
        engagement: 2800,
        topPerformingPost: {
          content: 'Meterai digital PERURI kini hadir dengan fitur terbaru! Lebih mudah, aman, dan terpercaya. #MeteraiDigital #PERURI',
          impressions: 8500,
          engagement: 620,
          type: 'text'
        }
      },
      {
        weekNumber: 2,
        startDate: '2024-12-08',
        endDate: '2024-12-14',
        postsCount: 15,
        impressions: 52000,
        engagement: 3200,
        topPerformingPost: {
          content: 'Thread: Cara menggunakan meterai digital step by step 🧵',
          impressions: 12000,
          engagement: 890,
          type: 'thread'
        }
      },
      {
        weekNumber: 3,
        startDate: '2024-12-15',
        endDate: '2024-12-21',
        postsCount: 18,
        impressions: 48000,
        engagement: 2900,
        topPerformingPost: {
          content: 'Video tutorial: Tanda tangan digital yang sah secara hukum',
          impressions: 9800,
          engagement: 750,
          type: 'video'
        }
      },
      {
        weekNumber: 4,
        startDate: '2024-12-22',
        endDate: '2024-12-28',
        postsCount: 10,
        impressions: 38000,
        engagement: 2100,
        topPerformingPost: {
          content: 'Infografis: Perbedaan meterai fisik vs digital',
          impressions: 7200,
          engagement: 480,
          type: 'image'
        }
      }
    ]
  }
];

export const dummySEOData: SEOAnalytics[] = [
  {
    month: 12,
    year: 2024,
    activeUsers: 25000,
    newUsers: 23000,
    sessions: 45000,
    pageviews: 125000,
    bounceRate: 47.5,
    avgSessionDuration: 185, // seconds
    organicTraffic: 18500,
    keywords: [
      { keyword: 'meterai digital', clicks: 318, impressions: 2100, ctr: 15.1, position: 2.3 },
      { keyword: 'e-sign', clicks: 270, impressions: 1800, ctr: 15.0, position: 1.8 },
      { keyword: 'meterai peruri', clicks: 232, impressions: 1500, ctr: 15.5, position: 2.1 },
      { keyword: 'cara membuat tanda tangan online', clicks: 120, impressions: 900, ctr: 13.3, position: 3.2 },
      { keyword: 'meterai elektronik', clicks: 97, impressions: 650, ctr: 14.9, position: 2.8 },
      { keyword: 'meterai digital', clicks: 55, impressions: 400, ctr: 13.8, position: 4.1 },
      { keyword: 'peruri', clicks: 46, impressions: 320, ctr: 14.4, position: 3.5 }
    ],
    topPages: [
      { page: '/meterai-digital', views: 18500, users: 15200, bounceRate: 42.3 },
      { page: '/cara-daftar', views: 12800, users: 10500, bounceRate: 38.7 },
      { page: '/e-sign-tutorial', views: 9200, users: 7800, bounceRate: 45.1 },
      { page: '/pricing', views: 6500, users: 5200, bounceRate: 52.8 },
      { page: '/help-center', views: 4800, users: 3900, bounceRate: 48.3 }
    ],
    campaigns: [
      { name: 'Promo Healthcare', ctr: 10.0, clicks: 2400, impressions: 24000 },
      { name: 'Meterai Digital Campaign', ctr: 8.5, clicks: 1800, impressions: 21200 },
      { name: 'E-Sign Awareness', ctr: 7.2, clicks: 1200, impressions: 16700 }
    ]
  }
];