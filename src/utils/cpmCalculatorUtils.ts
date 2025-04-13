
// Predefined platform data
export const platformData = {
  "Otohits": { conversionFactor: 1, visitLength: 30, acceptanceRate: 40, cpm: 0.50 },
  "9Hits": { conversionFactor: 1, visitLength: 30, acceptanceRate: 40, cpm: 0.43 },
  "BigHits4U": { conversionFactor: 60, visitLength: 30, acceptanceRate: 30, cpm: 0.45 },
  "Hitleap": { conversionFactor: 1, visitLength: 30, acceptanceRate: 35, cpm: 0.49 },
  "Webhit.net": { conversionFactor: 1, visitLength: 30, acceptanceRate: 30, cpm: 0.47 }
};

// Function to calculate credits and metrics for a platform
export function calculatePlatformMetrics(platform: string, revenueGoal: number) {
  const data = platformData[platform as keyof typeof platformData];
  if (!data || revenueGoal <= 0) {
    return { credits: 0, revenue: 0, visits: 0, validImpressions: 0 };
  }
  const { conversionFactor, visitLength, acceptanceRate, cpm } = data;
  
  const validImpressionsNeeded = (revenueGoal * 1000) / cpm;
  const visitsNeeded = validImpressionsNeeded / (acceptanceRate / 100);
  const totalSecondsNeeded = visitsNeeded * visitLength;
  const creditsNeeded = totalSecondsNeeded / conversionFactor;

  return {
    credits: creditsNeeded,
    revenue: revenueGoal,
    visits: visitsNeeded,
    validImpressions: validImpressionsNeeded,
    cpm: cpm,
    acceptanceRate: acceptanceRate,
    visitLength: visitLength
  };
}

// Main function to process selected platforms and revenue goal
export function calculateCPMStrategy(selectedPlatforms: string[], totalRevenueGoal: number) {
  if (!selectedPlatforms.length || totalRevenueGoal <= 0) {
    return { 
      results: [], 
      totals: { 
        visits: 0, 
        validImpressions: 0, 
        revenue: 0, 
        acceptanceRate: 0 
      } 
    };
  }

  const revenuePerPlatform = totalRevenueGoal / selectedPlatforms.length;
  let totalVisits = 0;
  let totalValidImpressions = 0;
  let totalRevenue = 0;
  let totalAcceptanceRate = 0;

  const results = selectedPlatforms.map(platform => {
    const metrics = calculatePlatformMetrics(platform, revenuePerPlatform);
    totalVisits += metrics.visits;
    totalValidImpressions += metrics.validImpressions;
    totalRevenue += metrics.revenue;
    totalAcceptanceRate += metrics.acceptanceRate;
    return {
      platform,
      creditsNeeded: metrics.credits.toFixed(2),
      revenue: metrics.revenue.toFixed(2),
      visits: Math.ceil(metrics.visits),
      validImpressions: Math.ceil(metrics.validImpressions),
      cpm: metrics.cpm,
      acceptanceRate: metrics.acceptanceRate,
      visitLength: metrics.visitLength
    };
  });

  const avgAcceptanceRate = totalAcceptanceRate / selectedPlatforms.length;

  return {
    results,
    totals: {
      visits: Math.ceil(totalVisits),
      validImpressions: Math.ceil(totalValidImpressions),
      revenue: totalRevenue.toFixed(2),
      acceptanceRate: avgAcceptanceRate.toFixed(2)
    }
  };
}
