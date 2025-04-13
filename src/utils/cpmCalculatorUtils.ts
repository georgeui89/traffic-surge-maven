
// Predefined platform data with enhanced metrics
export const platformData = {
  "Otohits": { 
    conversionFactor: 1, 
    visitLength: 30, 
    acceptanceRate: 40, 
    cpm: 0.45, 
    color: "#00CCFF",
    efficiency: 0.85
  },
  "9Hits": { 
    conversionFactor: 1, 
    visitLength: 30, 
    acceptanceRate: 40, 
    cpm: 0.43, 
    color: "#FF5500",
    efficiency: 0.82
  },
  "HitLeap": { 
    conversionFactor: 1, 
    visitLength: 30, 
    acceptanceRate: 35, 
    cpm: 0.49, 
    color: "#66CC33",
    efficiency: 0.79
  },
  "BigHits4U": { 
    conversionFactor: 60, 
    visitLength: 30, 
    acceptanceRate: 30, 
    cpm: 0.53, 
    color: "#FFCC00",
    efficiency: 0.75
  },
  "Webhit.net": { 
    conversionFactor: 1, 
    visitLength: 30, 
    acceptanceRate: 30, 
    cpm: 0.47, 
    color: "#CC33FF",
    efficiency: 0.70
  }
};

// Format seconds into human-readable time
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

// Calculate credits needed to achieve target revenue
export function calculateCreditsForRevenue(platform: string, revenueGoal: number) {
  const data = platformData[platform as keyof typeof platformData];
  if (!data || revenueGoal <= 0) {
    return { 
      platform,
      revenueGoal: 0,
      validImpressionsNeeded: 0,
      visitsNeeded: 0,
      secondsNeeded: 0,
      creditsNeeded: 0,
      timeEstimate: '0h 0m 0s'
    };
  }
  
  const { conversionFactor, visitLength, acceptanceRate, cpm } = data;
  
  // Calculate valid impressions needed
  const validImpressionsNeeded = (revenueGoal * 1000) / cpm;
  
  // Calculate total visits needed based on acceptance rate
  const visitsNeeded = validImpressionsNeeded / (acceptanceRate / 100);
  
  // Calculate total seconds needed
  const secondsNeeded = visitsNeeded * visitLength;
  
  // Calculate credits needed
  const creditsNeeded = secondsNeeded / conversionFactor;
  
  return {
    platform,
    revenueGoal,
    validImpressionsNeeded: Math.round(validImpressionsNeeded),
    visitsNeeded: Math.round(visitsNeeded),
    secondsNeeded: Math.round(secondsNeeded),
    creditsNeeded: Math.ceil(creditsNeeded),
    timeEstimate: formatTime(secondsNeeded)
  };
}

// Calculate expected revenue from available credits
export function calculateRevenueFromCredits(platform: string, availableCredits: number) {
  const data = platformData[platform as keyof typeof platformData];
  if (!data || availableCredits <= 0) {
    return {
      platform,
      availableCredits: 0,
      secondsAvailable: 0,
      visitsPossible: 0,
      validImpressions: 0,
      estimatedRevenue: 0,
      timeEstimate: '0h 0m 0s'
    };
  }
  
  const { conversionFactor, visitLength, acceptanceRate, cpm } = data;
  
  // Calculate total seconds available
  const secondsAvailable = availableCredits * conversionFactor;
  
  // Calculate visits possible
  const visitsPossible = secondsAvailable / visitLength;
  
  // Calculate valid impressions
  const validImpressions = visitsPossible * (acceptanceRate / 100);
  
  // Calculate revenue
  const revenue = (validImpressions * cpm) / 1000;
  
  return {
    platform,
    availableCredits,
    secondsAvailable,
    visitsPossible: Math.round(visitsPossible),
    validImpressions: Math.round(validImpressions),
    estimatedRevenue: parseFloat(revenue.toFixed(2)),
    timeEstimate: formatTime(secondsAvailable)
  };
}

// Distribute revenue across selected platforms
export function distributeRevenue(totalRevenue: number, selectedPlatforms: string[], distributionMethod: string, customDistribution: Record<string, number> = {}) {
  let platformRevenues: Record<string, number> = {};
  
  if (!selectedPlatforms.length) return platformRevenues;

  if (distributionMethod === "equal") {
    // Equal distribution
    const revenuePerPlatform = totalRevenue / selectedPlatforms.length;
    selectedPlatforms.forEach(platform => {
      platformRevenues[platform] = parseFloat(revenuePerPlatform.toFixed(2));
    });
  } 
  else if (distributionMethod === "weighted") {
    // Calculate weights based on CPM and acceptance rate
    const weights: Record<string, number> = {};
    let totalWeight = 0;
    
    selectedPlatforms.forEach(platform => {
      const data = platformData[platform as keyof typeof platformData];
      if (data) {
        const weight = data.cpm * (data.acceptanceRate / 100) * data.efficiency;
        weights[platform] = weight;
        totalWeight += weight;
      }
    });
    
    // Distribute revenue based on weights
    selectedPlatforms.forEach(platform => {
      if (weights[platform]) {
        const revenue = totalRevenue * (weights[platform] / totalWeight);
        platformRevenues[platform] = parseFloat(revenue.toFixed(2));
      }
    });
  }
  else if (distributionMethod === "manual") {
    // Use custom distribution percentages
    let totalPercentage = 0;
    
    selectedPlatforms.forEach(platform => {
      totalPercentage += (customDistribution[platform] || 0);
    });
    
    if (totalPercentage <= 0) {
      // Fallback to equal if no valid percentages
      return distributeRevenue(totalRevenue, selectedPlatforms, "equal");
    }
    
    // Normalize if total doesn't equal 100%
    const normalizationFactor = 100 / totalPercentage;
    
    selectedPlatforms.forEach(platform => {
      const percentage = (customDistribution[platform] || 0) * normalizationFactor;
      const revenue = totalRevenue * (percentage / 100);
      platformRevenues[platform] = parseFloat(revenue.toFixed(2));
    });
  }
  else if (distributionMethod === "optimal") {
    // Distribute based on platform efficiency ratings
    const efficiencies: Record<string, number> = {};
    let totalEfficiency = 0;
    
    selectedPlatforms.forEach(platform => {
      const data = platformData[platform as keyof typeof platformData];
      if (data) {
        const efficiency = data.efficiency;
        efficiencies[platform] = efficiency;
        totalEfficiency += efficiency;
      }
    });
    
    selectedPlatforms.forEach(platform => {
      if (efficiencies[platform]) {
        const revenue = totalRevenue * (efficiencies[platform] / totalEfficiency);
        platformRevenues[platform] = parseFloat(revenue.toFixed(2));
      }
    });
  }
  
  return platformRevenues;
}

// Generate multi-platform calculation results
export function generateMultiPlatformResults(platformRevenues: Record<string, number>) {
  const results = [];
  let totalVisits = 0;
  let totalImpressions = 0;
  let totalRevenue = 0;
  let totalCredits = 0;
  
  // Calculate for each platform
  Object.keys(platformRevenues).forEach(platform => {
    const revenueGoal = platformRevenues[platform];
    const calculation = calculateCreditsForRevenue(platform, revenueGoal);
    
    totalVisits += calculation.visitsNeeded;
    totalImpressions += calculation.validImpressionsNeeded;
    totalRevenue += calculation.revenueGoal;
    totalCredits += calculation.creditsNeeded;
    
    results.push(calculation);
  });
  
  // Summary totals
  const summary = {
    totalVisits,
    totalImpressions,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalCredits: Math.ceil(totalCredits)
  };
  
  return {
    calculations: results,
    summary
  };
}

// Calculate CPM strategy for multiple platforms
export function calculateCPMStrategy(selectedPlatforms: string[], totalRevenueGoal: number, distributionMethod: string = "equal", customDistribution: Record<string, number> = {}) {
  if (!selectedPlatforms.length || totalRevenueGoal <= 0) {
    return { 
      results: [], 
      totals: { 
        visits: 0, 
        validImpressions: 0, 
        revenue: 0, 
        acceptanceRate: 0,
        credits: 0,
        timeEstimate: '0h 0m 0s'
      } 
    };
  }

  // Distribute revenue among platforms
  const platformRevenues = distributeRevenue(
    totalRevenueGoal, 
    selectedPlatforms, 
    distributionMethod, 
    customDistribution
  );

  // Calculate detailed metrics for each platform
  const platformResults = Object.keys(platformRevenues).map(platform => {
    const revenue = platformRevenues[platform];
    const metrics = calculateCreditsForRevenue(platform, revenue);
    
    return {
      platform,
      creditsNeeded: metrics.creditsNeeded,
      revenue: metrics.revenueGoal,
      visits: metrics.visitsNeeded,
      validImpressions: metrics.validImpressionsNeeded,
      cpm: platformData[platform as keyof typeof platformData]?.cpm || 0,
      acceptanceRate: platformData[platform as keyof typeof platformData]?.acceptanceRate || 0,
      visitLength: platformData[platform as keyof typeof platformData]?.visitLength || 0,
      timeEstimate: metrics.timeEstimate,
      efficiency: platformData[platform as keyof typeof platformData]?.efficiency || 0,
      color: platformData[platform as keyof typeof platformData]?.color || "#CCCCCC"
    };
  });

  // Calculate totals
  let totalVisits = 0;
  let totalValidImpressions = 0;
  let totalRevenue = 0;
  let totalAcceptanceRate = 0;
  let totalCredits = 0;
  let totalSeconds = 0;

  platformResults.forEach(result => {
    totalVisits += result.visits;
    totalValidImpressions += result.validImpressions;
    totalRevenue += result.revenue;
    totalAcceptanceRate += result.acceptanceRate;
    totalCredits += result.creditsNeeded;
    totalSeconds += result.visits * result.visitLength;
  });

  const avgAcceptanceRate = totalAcceptanceRate / platformResults.length;

  return {
    results: platformResults,
    totals: {
      visits: Math.ceil(totalVisits),
      validImpressions: Math.ceil(totalValidImpressions),
      revenue: totalRevenue,
      acceptanceRate: avgAcceptanceRate,
      credits: Math.ceil(totalCredits),
      timeEstimate: formatTime(totalSeconds)
    }
  };
}
