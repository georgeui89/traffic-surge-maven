
import { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import CpmCalculator from '@/components/calculator/CpmCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ParticleBackground } from '@/components/ui/particle-background';

const CpmCalculatorPage = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <PageTransition>
      <ParticleBackground />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">CPM Strategy Calculator</h1>
            <p className="page-description">Plan and optimize your autosurf traffic strategy across multiple platforms</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="calculator">Multi-Platform Calculator</TabsTrigger>
            <TabsTrigger value="guide">Strategy Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="mt-6">
            <CpmCalculator className="mb-6" />
          </TabsContent>
          
          <TabsContent value="guide" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>CPM Strategy Guide</CardTitle>
                <CardDescription>
                  Learn how to optimize your traffic arbitrage strategy across multiple platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Understanding CPM and Traffic Monetization</h3>
                  <p className="text-muted-foreground mt-2">
                    CPM (Cost Per Mille) is the amount of money you earn for every 1,000 impressions on your site. 
                    Traffic arbitrage involves purchasing traffic from autosurf platforms at a lower cost than the 
                    revenue generated from ad impressions, creating a profit margin.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Key Metrics</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-2 text-muted-foreground">
                    <li>
                      <strong>Credits:</strong> The currency used on autosurf platforms to generate visits to your site.
                    </li>
                    <li>
                      <strong>Visits:</strong> The raw number of visitors sent to your site from autosurf platforms.
                    </li>
                    <li>
                      <strong>Acceptance Rate:</strong> The percentage of visits that are counted as valid impressions by ad networks.
                    </li>
                    <li>
                      <strong>Valid Impressions:</strong> The number of visits that successfully generate ad impressions.
                    </li>
                    <li>
                      <strong>Revenue:</strong> The money earned from ad impressions, calculated as (Valid Impressions / 1000) × CPM Rate.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Multi-Platform Strategy</h3>
                  <p className="text-muted-foreground mt-2">
                    Different autosurf platforms have varying costs, acceptance rates, and traffic quality. By distributing your budget 
                    across multiple platforms, you can optimize for the best overall ROI. The calculator helps you determine the optimal 
                    distribution based on your revenue goals.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Optimization Tips</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-2 text-muted-foreground">
                    <li>
                      <strong>Maximize Visit Duration:</strong> Longer visits (30+ seconds) generally lead to higher acceptance rates.
                    </li>
                    <li>
                      <strong>Mobile Optimization:</strong> Ensure your site is mobile-friendly as many autosurf platforms use mobile traffic.
                    </li>
                    <li>
                      <strong>Geographical Targeting:</strong> Focus on high-value regions like US, Canada, and Europe for better CPM rates.
                    </li>
                    <li>
                      <strong>Ad Placement:</strong> Position ads where they're most likely to be viewed, increasing impression rates.
                    </li>
                    <li>
                      <strong>Platform Mix:</strong> Distribute your budget across platforms based on their efficiency (revenue generated per credit).
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default CpmCalculatorPage;
