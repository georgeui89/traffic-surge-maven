import { subDays, format, subHours, addDays, addHours } from 'date-fns';
import { PlatformData, RdpData, CampaignData } from '@/lib/supabase';

// Platforms
export const platforms: PlatformData[] = [
  { id: '9hits', name: '9Hits', status: 'healthy', url: 'https://9hits.com' },
  { id: 'bighits4u', name: 'BigHits4U', status: 'healthy', url: 'https://bighits4u.com' },
  { id: 'hitleap', name: 'Hitleap.com', status: 'warning', url: 'https://hitleap.com' },
  { id: 'otohits', name: 'Otohits.net', status: 'healthy', url: 'https://otohits.net' },
  { id: 'webhit', name: 'Webhit.net', status: 'healthy', url: 'https://webhit.net' },
  { id: 'netvisiteurs', name: 'Netvisiteurs', status: 'error', url: 'https://netvisiteurs.com' },
  { id: 'nolsosurf', name: 'Nols-o-surf', status: 'healthy', url: 'https://nolsosurf.com' },
  { id: 'livesurf', name: 'Livesurf.ru', status: 'warning', url: 'https://livesurf.ru' },
  { id: 'gethit', name: 'GetHit.com', status: 'healthy', url: 'https://gethit.com' },
  { id: 'feelingsurf', name: 'Feelingsurf.fr', status: 'healthy', url: 'https://feelingsurf.fr' },
  { id: 'easyhits4u', name: 'EasyHits4U', status: 'healthy', url: 'https://easyhits4u.com' },
  { id: 'startexchange', name: 'StartExchange', status: 'healthy', url: 'https://startexchange.com' },
];

// RDPs
export const rdps: RdpData[] = [
  { 
    id: 'rdp1', 
    name: 'RDP-01', 
    status: 'online', 
    dedicatedIp: '192.168.1.10', 
    provider: 'Digital Ocean',
    cpuCores: 4,
    memory: 8,
    cost: 1.2, 
    costPeriod: 'monthly',
    visits: 5420, 
    revenue: 2.71,
    platforms: [
      { id: '9hits', name: '9Hits', weight: 60 },
      { id: 'otohits', name: 'Otohits.net', weight: 40 }
    ]
  },
  { 
    id: 'rdp2', 
    name: 'RDP-02', 
    status: 'online', 
    dedicatedIp: '192.168.1.11', 
    provider: 'Contabo',
    cpuCores: 2,
    memory: 4,
    cost: 1.2, 
    costPeriod: 'monthly',
    visits: 4230, 
    revenue: 2.12,
    platforms: [
      { id: 'bighits4u', name: 'BigHits4U', weight: 100 }
    ]
  },
  { 
    id: 'rdp3', 
    name: 'RDP-03', 
    status: 'offline', 
    dedicatedIp: '192.168.1.12', 
    provider: 'Hetzner',
    cpuCores: 8,
    memory: 16,
    cost: 1.2, 
    costPeriod: 'monthly',
    visits: 0, 
    revenue: 0,
    platforms: [
      { id: 'hitleap', name: 'Hitleap.com', weight: 100 }
    ]
  },
  { 
    id: 'rdp4', 
    name: 'RDP-04', 
    status: 'online', 
    dedicatedIp: '192.168.1.13', 
    provider: 'AWS',
    cpuCores: 4,
    memory: 8,
    cost: 1.2, 
    costPeriod: 'monthly',
    visits: 6180, 
    revenue: 3.09,
    platforms: [
      { id: 'otohits', name: 'Otohits.net', weight: 70 },
      { id: 'webhit', name: 'Webhit.net', weight: 30 }
    ]
  },
  { 
    id: 'rdp5', 
    name: 'RDP-05', 
    status: 'online', 
    dedicatedIp: '192.168.1.14', 
    provider: 'Vultr',
    cpuCores: 2,
    memory: 4,
    cost: 1.2, 
    costPeriod: 'monthly',
    visits: 3970, 
    revenue: 1.99,
    platforms: [
      { id: 'webhit', name: 'Webhit.net', weight: 100 }
    ]
  },
];

// Campaigns
export const campaigns: CampaignData[] = [
  { id: 'camp1', name: 'Main Website', status: 'active', platform: '9hits', visits: 12500, revenue: 6.25, url: 'https://example.com', campaignType: 'direct' },
  { id: 'camp2', name: 'Blog', status: 'active', platform: 'bighits4u', visits: 8700, revenue: 4.35, url: 'https://blog.example.com', campaignType: 'popup' },
  { id: 'camp3', name: 'Landing Page', status: 'paused', platform: 'hitleap', visits: 4300, revenue: 2.15, url: 'https://landing.example.com', campaignType: 'banner' },
  { id: 'camp4', name: 'Product Page', status: 'active', platform: 'otohits', visits: 9200, revenue: 4.60, url: 'https://example.com/product', campaignType: 'direct' },
  { id: 'camp5', name: 'New Promotion', status: 'active', platform: 'webhit', visits: 6800, revenue: 3.40, url: 'https://promo.example.com', campaignType: 'popup' },
];

// Generate daily traffic data for the past 30 days
export const generateDailyTrafficData = (days = 30) => {
  const data = [];
  const today = new Date();
  const baseVisits = 15000;
  const baseImpressions = 6000;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Add some randomness and weekend effect
    const multiplier = isWeekend ? 0.7 : 1;
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    
    const visits = Math.round(baseVisits * multiplier * randomFactor);
    const impressions = Math.round(baseImpressions * multiplier * randomFactor);
    const revenue = Number((impressions * 0.0005).toFixed(2));
    
    data.push({
      date: format(date, 'MMM dd'),
      visits,
      impressions,
      revenue,
    });
  }
  
  return data;
};

// Generate hourly traffic data for the past 24 hours
export const generateHourlyTrafficData = (hours = 24) => {
  const data = [];
  const now = new Date();
  const baseVisits = 625;
  const baseImpressions = 250;
  
  for (let i = hours - 1; i >= 0; i--) {
    const time = subHours(now, i);
    const hour = time.getHours();
    
    // Traffic fluctuates throughout the day
    let multiplier = 1;
    if (hour >= 0 && hour < 6) multiplier = 0.3; // Night (low)
    else if (hour >= 6 && hour < 12) multiplier = 0.8; // Morning (medium)
    else if (hour >= 12 && hour < 18) multiplier = 1.2; // Afternoon (high)
    else multiplier = 1.0; // Evening (medium-high)
    
    const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
    
    const visits = Math.round(baseVisits * multiplier * randomFactor);
    const impressions = Math.round(baseImpressions * multiplier * randomFactor);
    const revenue = Number((impressions * 0.0005).toFixed(2));
    
    data.push({
      time: format(time, 'HH:mm'),
      visits,
      impressions,
      revenue,
    });
  }
  
  return data;
};

// Generate platform performance data
export const generatePlatformPerformanceData = () => {
  return platforms.slice(0, 6).map(platform => {
    const visits = Math.round(1000 + Math.random() * 10000);
    const impressions = Math.round(visits * (0.3 + Math.random() * 0.2)); // 30-50% acceptance rate
    const revenue = Number((impressions * 0.0005).toFixed(2));
    const cpm = Number((revenue / impressions * 1000).toFixed(2));
    
    return {
      platform: platform.name,
      visits,
      impressions,
      revenue,
      cpm,
    };
  });
};

// Generate acceptance rate data
export const generateAcceptanceRateData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 14; i >= 0; i--) {
    const date = subDays(today, i);
    const rate = 30 + Math.random() * 15; // 30-45% acceptance rate
    
    data.push({
      date: format(date, 'MMM dd'),
      rate: Number(rate.toFixed(1)),
    });
  }
  
  return data;
};

// Generate future traffic prediction data
export const generatePredictionData = () => {
  const data = [];
  const today = new Date();
  const baseVisits = 15500;
  const baseImpressions = 6200;
  
  // Past 7 days
  for (let i = 7; i >= 1; i--) {
    const date = subDays(today, i);
    const randomFactor = 0.9 + Math.random() * 0.2;
    
    data.push({
      date: format(date, 'MMM dd'),
      visits: Math.round(baseVisits * randomFactor),
      impressions: Math.round(baseImpressions * randomFactor),
      type: 'historical',
    });
  }
  
  // Today
  data.push({
    date: format(today, 'MMM dd'),
    visits: Math.round(baseVisits * (1 + Math.random() * 0.1)),
    impressions: Math.round(baseImpressions * (1 + Math.random() * 0.1)),
    type: 'today',
  });
  
  // Future 7 days (prediction)
  for (let i = 1; i <= 7; i++) {
    const date = addDays(today, i);
    const growthFactor = 1 + (i * 0.02) + (Math.random() * 0.05);
    
    data.push({
      date: format(date, 'MMM dd'),
      visits: Math.round(baseVisits * growthFactor),
      impressions: Math.round(baseImpressions * growthFactor),
      type: 'prediction',
    });
  }
  
  return data;
};

// Dashboard summary data
export const dashboardSummary = {
  totalVisits: 145672,
  validImpressions: 52441,
  revenue: 26.22,
  dailyGoal: 30,
  acceptanceRate: 36,
  activeRdps: 4,
  totalRdps: 5,
  activeCampaigns: 4,
  totalCampaigns: 5,
  platforms: {
    active: 8,
    total: 12,
    warning: 2,
    error: 1,
  },
};

// Default settings
export const defaultSettings = {
  darkMode: false,
  dailyRevenueGoal: 30,
  defaultAcceptanceRate: 36,
  defaultCpmRate: 0.5,
  rdpDefaultCost: 1.2,
  notificationsEnabled: true,
  autoscalingEnabled: false,
};
