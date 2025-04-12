
/**
 * Budget Utilities and Types
 */

export interface Platform {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  color: string;
  costPerVisit: number;
  acceptanceRate: number;
  cpm: number;
}

export interface ExpectedResults {
  dailyVisits: number;
  dailyImpressions: number;
  dailyRevenue: number;
  roi: number;
}

export interface Recommendation {
  id: string;
  changes: {
    description: string;
    impact: string;
    impactType: 'success' | 'warning';
  }[];
  allocations: {
    [key: string]: number;
  };
}

export const PLATFORM_COLORS = [
  'primary',
  'traffic',
  'platforms',
  'earnings',
  'muted-foreground',
  'success',
  'warning'
];

export const getRandomColor = (): string => {
  return PLATFORM_COLORS[Math.floor(Math.random() * PLATFORM_COLORS.length)];
};

// Updated with realistic values based on traffic exchange platforms
export const initialPlatforms: Platform[] = [
  { 
    id: '9hits', 
    name: '9Hits', 
    percentage: 20, 
    amount: 1, 
    color: 'primary',
    costPerVisit: 0.0001, 
    acceptanceRate: 0.2, 
    cpm: 0.5 
  },
  { 
    id: 'hitleap', 
    name: 'HitLeap', 
    percentage: 20, 
    amount: 1, 
    color: 'traffic',
    costPerVisit: 0.0002, 
    acceptanceRate: 0.15, 
    cpm: 0.4 
  },
  { 
    id: 'otohits', 
    name: 'Otohits', 
    percentage: 20, 
    amount: 1, 
    color: 'platforms',
    costPerVisit: 0.00001, 
    acceptanceRate: 0.1, 
    cpm: 0.1 
  },
  { 
    id: 'easyhits4u', 
    name: 'EasyHits4U', 
    percentage: 20, 
    amount: 1, 
    color: 'earnings',
    costPerVisit: 0.0005, 
    acceptanceRate: 0.25, 
    cpm: 0.6 
  },
  { 
    id: 'webhit', 
    name: 'Webhit.net', 
    percentage: 20, 
    amount: 1, 
    color: 'muted-foreground',
    costPerVisit: 0.0003, 
    acceptanceRate: 0.2, 
    cpm: 0.5 
  }
];

/**
 * Calculates expected results based on platform allocations and daily budget
 * 
 * For each platform:
 * - Expected Visits = Amount / Cost per Visit
 * - Expected Impressions = Expected Visits × Acceptance Rate
 * - Expected Revenue = (Expected Impressions / 1000) × CPM
 */
export const calculateExpectedResults = (
  platforms: Platform[],
  dailyBudget: number
): ExpectedResults => {
  let totalVisits = 0;
  let totalImpressions = 0;
  let totalRevenue = 0;
  
  platforms.forEach(platform => {
    // Calculate visits based on cost per visit
    const visits = platform.amount / platform.costPerVisit;
    
    // Calculate impressions (visits * acceptance rate)
    const impressions = visits * platform.acceptanceRate;
    
    // Calculate revenue (impressions / 1000 * CPM)
    const revenue = (impressions / 1000) * platform.cpm;
    
    totalVisits += visits;
    totalImpressions += impressions;
    totalRevenue += revenue;
  });
  
  const roi = dailyBudget > 0 ? ((totalRevenue - dailyBudget) / dailyBudget) * 100 : 0;
  
  return {
    dailyVisits: totalVisits,
    dailyImpressions: totalImpressions,
    dailyRevenue: totalRevenue,
    roi: roi
  };
};

/**
 * Optimizes budget allocation based on target (ROI, traffic, impressions)
 * 
 * - Maximum Traffic: Allocate budget to platforms with lowest cost per visit
 * - Maximum Impressions: Allocate budget to platforms with highest acceptance rate / cost per visit
 * - Maximum ROI: Allocate budget to platforms with highest (acceptance rate * cpm / 1000 - cost per visit)
 */
export const optimizeBudgetAllocation = (
  platforms: Platform[],
  target: 'roi' | 'traffic' | 'impressions',
  dailyBudget: number
): Platform[] => {
  // Calculate platform scores based on optimization target
  const scores = platforms.map(platform => {
    if (target === 'traffic') {
      // Optimize for maximum traffic - prioritize platforms with lowest cost per visit
      return {
        platform,
        score: 1 / platform.costPerVisit
      };
    } else if (target === 'impressions') {
      // Optimize for maximum impressions - prioritize platforms with best cost per impression
      return {
        platform,
        score: platform.acceptanceRate / platform.costPerVisit
      };
    } else {
      // Default: optimize for ROI - prioritize platforms with best profit per dollar
      const revenuePerVisit = (platform.acceptanceRate * platform.cpm) / 1000;
      const profitPerVisit = revenuePerVisit - platform.costPerVisit;
      return {
        platform,
        score: Math.max(0, profitPerVisit / platform.costPerVisit)
      };
    }
  });
  
  // Get total score (for normalization)
  const totalScore = scores.reduce((sum, item) => sum + item.score, 0);
  
  if (totalScore === 0) {
    // If all scores are 0, distribute evenly
    return platforms.map(p => ({
      ...p,
      percentage: 100 / platforms.length,
      amount: (dailyBudget * (100 / platforms.length)) / 100
    }));
  }
  
  // Normalize scores to percentages and calculate new amounts
  const updatedPlatforms = scores.map(item => {
    const newPercentage = (item.score / totalScore) * 100;
    return {
      ...item.platform,
      percentage: newPercentage,
      amount: (dailyBudget * newPercentage) / 100
    };
  });
  
  return updatedPlatforms;
};

export const generateRecommendation = (
  platforms: Platform[],
  optimizedPlatforms: Platform[]
): Recommendation => {
  // Generate meaningful recommendations based on differences
  const changes = [];
  const allocations = {};
  
  optimizedPlatforms.forEach(optimized => {
    const original = platforms.find(p => p.id === optimized.id);
    allocations[optimized.id] = optimized.percentage;
    
    if (original) {
      const percentageDiff = optimized.percentage - original.percentage;
      if (Math.abs(percentageDiff) >= 5) {
        changes.push({
          description: `${percentageDiff > 0 ? 'Increase' : 'Decrease'} ${original.name} budget allocation`,
          impact: `${percentageDiff > 0 ? '+' : ''}${percentageDiff.toFixed(0)}%`,
          impactType: percentageDiff > 0 ? 'success' : 'warning'
        });
      }
    }
  });
  
  return {
    id: `rec-${Date.now()}`,
    changes,
    allocations
  };
};

export const exportToCsv = (data: any, filename: string = 'export.csv'): void => {
  // Convert object to CSV
  const replacer = (key: any, value: any) => value === null ? '' : value;
  const header = Object.keys(data[0]);
  const csv = [
    header.join(','), // CSV header row
    ...data.map((row: any) => header.map(fieldName => 
      JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');
  
  // Create download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
