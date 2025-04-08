
export interface ArticleSection {
  title: string;
  content: string;
  image?: string;
  steps?: string[];
  tips?: string[];
}

export interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  lastUpdated?: string;
  tags: string[];
  sections: ArticleSection[];
  relatedArticles?: string[];
  isNew?: boolean; // Added to mark new articles
}

export interface HelpCategory {
  id: string;
  title: string;
  description: string;
  articles: HelpArticle[];
}

// Sample help data
export const helpCategoriesData: HelpCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of Traffic Manager and how to set up your account.",
    articles: [
      {
        id: "what-is-traffic-manager",
        title: "What is Traffic Manager?",
        description: "A comprehensive introduction to Traffic Manager",
        category: "getting-started",
        lastUpdated: "April 8, 2024",
        tags: ["intro", "overview", "beginner"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Welcome to Traffic Manager! This application is designed to help you centralize, analyze, and optimize your traffic arbitrage activities, specifically when using autosurf platforms and monetizing with networks like Adsterra. Our goal is to help you maximize your ROI through better tracking, calculation, and strategic decision-making."
          },
          {
            title: "Who is it for?",
            content: "Traffic Manager is built for individuals and teams actively engaged in traffic arbitrage who need a centralized system to monitor performance, calculate profitability, and make data-driven decisions."
          },
          {
            title: "Key Benefits",
            content: "Traffic Manager provides several important benefits:",
            steps: [
              "Real-time insights into traffic quality and performance",
              "Centralized tracking of all platforms and campaigns",
              "Accurate profit calculation based on your inputs",
              "Optimization tools to maximize ROI",
              "Automation capabilities to save time and improve results"
            ],
            image: "Dashboard screenshot showing key features"
          },
          {
            title: "Key Takeaways",
            content: "Traffic Manager brings together all the tools you need for successful traffic arbitrage in one place, helping you make smarter decisions and increase profitability through data-driven insights."
          }
        ],
        relatedArticles: ["understanding-key-concepts", "setting-up-account"]
      },
      {
        id: "understanding-key-concepts",
        title: "Understanding Key Concepts",
        description: "Learn the fundamental concepts and terminology used in Traffic Manager",
        category: "getting-started",
        lastUpdated: "April 8, 2024",
        tags: ["concepts", "terminology", "fundamentals"],
        isNew: true,
        sections: [
          {
            title: "Traffic Arbitrage",
            content: "The practice of buying traffic (e.g., from autosurf platforms) and selling it at a higher price (e.g., by displaying ads from networks like Adsterra on your pages)."
          },
          {
            title: "Autosurf Platforms",
            content: "Services like 9Hits, BigHits4U, Hitleap, etc., that provide automated website visits."
          },
          {
            title: "CPM (Cost Per Mille / Thousand Impressions)",
            content: "A common advertising metric. Can refer to the rate an ad network pays ($ per 1000 impressions) or sometimes the cost of buying 1000 visits. In Traffic Manager, be mindful of context."
          },
          {
            title: "Actual CPM ($)",
            content: "CRUCIAL INPUT. This is the effective revenue you actually earn from Adsterra per 1000 valid impressions for a specific traffic source. This depends heavily on traffic quality, geo, ad placements, and Adsterra's evaluation. You must determine and input this based on your Adsterra reports."
          },
          {
            title: "Acceptance Rate (%)",
            content: "CRUCIAL INPUT. The percentage of estimated visits from an autosurf platform that Adsterra considers valid and counts as a payable ad impression. This is highly variable and depends on traffic quality, visit duration, anti-fraud measures, etc. You must estimate and input this based on your experience and Adsterra reports."
          },
          {
            title: "ROI (Return on Investment)",
            content: "Calculated as ((Revenue - Costs) / Costs) * 100%. Shows the profitability of your campaigns."
          },
          {
            title: "RDP (Remote Desktop Protocol) / VPS (Virtual Private Server)",
            content: "Remote computers often used to run autosurf client applications 24/7."
          },
          {
            title: "Key Takeaways",
            content: "Accurate inputs for Actual CPM ($) and Acceptance Rate (%) are essential for reliable ROI calculations. These values must be manually determined based on your experience and ad network reports."
          }
        ],
        relatedArticles: ["what-is-traffic-manager", "cpm-calculator-guide"]
      },
      {
        id: "setting-up-account",
        title: "Setting Up Your Account",
        description: "How to set up your Traffic Manager account and configure initial settings",
        category: "getting-started",
        lastUpdated: "April 7, 2024",
        tags: ["account", "setup", "configuration"],
        isNew: true,
        sections: [
          {
            title: "Initial Login",
            content: "After creating your account, log in using your credentials. You'll be directed to the Dashboard, which provides an overview of your traffic arbitrage operations."
          },
          {
            title: "Key Settings (Navigate to Settings -> Metrics)",
            content: "Before starting, it's helpful to set your default values:",
            steps: [
              "Daily Revenue Goal ($): Used for dashboard progress bars.",
              "Default Acceptance Rate (%): Used if you don't specify per campaign.",
              "Default CPM Rate ($): Note: This is often less useful than Actual CPM per campaign.",
              "Default RDP Cost ($/day): Used for RDP ROI calculations."
            ]
          },
          {
            title: "Appearance",
            content: "Configure Dark Mode and date/time formats in Settings -> Appearance."
          },
          {
            title: "Key Takeaways",
            content: "Setting up your default values will save time when creating new campaigns and provide meaningful metrics on your dashboard."
          }
        ],
        relatedArticles: ["connecting-adsterra", "navigating-dashboard"]
      },
      {
        id: "connecting-adsterra",
        title: "Connecting Adsterra",
        description: "How to connect your Adsterra Publisher API to Traffic Manager",
        category: "getting-started",
        lastUpdated: "April 6, 2024",
        tags: ["adsterra", "integration", "api", "setup"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Connecting your Adsterra Publisher API allows Traffic Manager to fetch reference data (like general CPM trends or reported earnings) for comparison purposes. Important: Traffic Manager's core revenue calculations rely on the Actual CPM and Acceptance Rate you manually input, not automatically pulled real-time data per campaign via API."
          },
          {
            title: "How to Connect",
            content: "Follow these steps to connect your Adsterra account:",
            steps: [
              "Log in to your Adsterra Publisher account.",
              "Navigate to the API section (or Profile/Developer section).",
              "Generate a new API token/key with at least read access.",
              "Copy the API key.",
              "In Traffic Manager, go to Settings -> Integrations.",
              "Paste the key into the Adsterra API Key field and click \"Test Connection\" or \"Save\"."
            ],
            image: "Screenshot of Settings -> Integrations"
          },
          {
            title: "Key Takeaways",
            content: "The Adsterra API connection is primarily for reference data and comparison, not for automatic revenue calculations. You still need to manually input Actual CPM and Acceptance Rate for each campaign."
          }
        ],
        relatedArticles: ["managing-integrations", "setting-up-account"]
      },
      {
        id: "navigating-dashboard",
        title: "Navigating the Dashboard",
        description: "Understanding the Dashboard interface and key metrics",
        category: "getting-started",
        lastUpdated: "April 5, 2024",
        tags: ["dashboard", "metrics", "navigation", "overview"],
        isNew: true,
        sections: [
          {
            title: "Overview",
            content: "The Dashboard provides a real-time snapshot of your entire operation."
          },
          {
            title: "Key Metrics (Top Row)",
            content: "Shows total visits, valid impressions, revenue, and acceptance rate across all active campaigns (with trend indicators)."
          },
          {
            title: "Charts",
            content: "Visualize traffic trends (Visits vs. Impressions) and daily earnings over selected periods."
          },
          {
            title: "Status Widgets",
            content: "Quickly see the health of connected Platforms, active RDPs, and active Campaigns."
          },
          {
            title: "Filters",
            content: "Use the filters (Date Range, etc.) to adjust the data displayed.",
            image: "Annotated Screenshot of the Dashboard"
          },
          {
            title: "Key Takeaways",
            content: "Check your Dashboard daily to get a quick overview of performance and identify any issues that need attention."
          }
        ],
        relatedArticles: ["what-is-traffic-manager", "campaign-management"]
      }
    ]
  },
  {
    id: "features",
    title: "Features & Functionality",
    description: "Detailed guides for each feature in Traffic Manager.",
    articles: [
      {
        id: "campaign-management",
        title: "Campaign Management Deep Dive",
        description: "Track individual traffic sources and their performance",
        category: "features",
        lastUpdated: "April 8, 2024",
        tags: ["campaigns", "tracking", "performance"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Track individual traffic sources (autosurf platforms) and their performance."
          },
          {
            title: "Creating a Campaign",
            content: "Click \"+New Campaign\". Fill in the details:",
            steps: [
              "Campaign Name: Your identifier (e.g., \"9Hits - USA Desktop\").",
              "Platform: Select from the list (affects default Conversion Factor). Add custom platforms in Platform Management.",
              "Conversion Factor: Auto-filled (e.g., 1 sec/credit, 60 sec/point). Edit if needed. Crucial for calculating estimated visits from credits.",
              "Credits Earned: MANUAL INPUT. Update this regularly with credits earned from the platform. Traffic Manager typically cannot fetch this automatically.",
              "Acceptance Rate (%): MANUAL INPUT. Your estimate of valid impressions per visit.",
              "Actual CPM ($): MANUAL INPUT. Your effective earnings per 1000 valid impressions from Adsterra for this source.",
              "Campaign Cost / Test Budget ($): Input associated costs (e.g., credit purchase, allocated VPS cost).",
              "Revenue Goal ($): Optional target for this campaign.",
              "(Optional) Daily Credit Earning Rate: Used for time-to-goal estimation.",
              "Average Visit Length (seconds): Used to convert time-based credits to visits."
            ],
            image: "Screenshot of Campaign Creation Form"
          },
          {
            title: "Calculated Metrics",
            content: "The app automatically calculates Estimated Visits, Valid Impressions, Revenue, ROI, Credits Needed for Goal, etc., based on your inputs."
          },
          {
            title: "Table View",
            content: "Monitor status, visits, revenue, and ROI for all campaigns. Use search and filters."
          },
          {
            title: "Key Takeaways",
            content: "Regularly update Credits Earned to keep calculations accurate. Monitor ROI to identify which campaigns deserve more investment."
          }
        ],
        relatedArticles: ["platform-management", "rdp-management"]
      },
      {
        id: "rdp-management",
        title: "RDP Management Explained",
        description: "Track the remote desktops running your autosurf clients",
        category: "features",
        lastUpdated: "April 7, 2024",
        tags: ["rdp", "management", "servers", "infrastructure"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Track the remote desktops or servers running your autosurf clients and their associated costs/profitability."
          },
          {
            title: "Adding an RDP",
            content: "Click \"+ Add RDP\". Enter a name/identifier and its estimated daily or monthly cost."
          },
          {
            title: "Assigning Platforms (Manual)",
            content: "You can note which platforms/campaigns are running on which RDP in the RDP's details (useful for troubleshooting or allocation)."
          },
          {
            title: "Table View",
            content: "Monitor status (Online/Offline - manual toggle), assigned platforms, estimated Visits, Revenue, Cost, and ROI per RDP."
          },
          {
            title: "Importance",
            content: "Helps determine if your infrastructure costs are justified by the revenue generated.",
            image: "Screenshot of RDP Management Table"
          },
          {
            title: "Key Takeaways",
            content: "Regularly review RDP performance to identify infrastructure that isn't generating positive ROI and consider reallocating resources."
          }
        ],
        relatedArticles: ["rdp-scaler", "campaign-management"]
      },
      {
        id: "platform-management",
        title: "Platform Management",
        description: "Manage your autosurf platforms within Traffic Manager",
        category: "features",
        lastUpdated: "April 6, 2024",
        tags: ["platforms", "management", "integration"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Manage the list of autosurf platforms used in your campaigns."
          },
          {
            title: "Adding Platforms",
            content: "Click \"+ Add Platform\" if a platform you use isn't listed. You'll need to define its Conversion Factor (e.g., sec/credit, visits/hit)."
          },
          {
            title: "Status",
            content: "Indicates potential issues (manual flag or based on campaign performance - clarify implementation)."
          },
          {
            title: "Platform API Keys",
            content: "Some platforms might offer APIs for specific minor functions (check platform docs). The \"Connect/Manage\" buttons here are for inputting those keys if available and supported. This section generally does NOT enable automatic credit fetching.",
            image: "Screenshot of Platform Management List"
          },
          {
            title: "Key Takeaways",
            content: "Ensure the Conversion Factor for each platform is accurate to get reliable visit estimates from the credits you earn."
          }
        ],
        relatedArticles: ["campaign-management", "managing-integrations"]
      },
      {
        id: "traffic-analytics",
        title: "Traffic Analytics Insights",
        description: "Analyze traffic quality, sources, and performance trends",
        category: "features",
        lastUpdated: "April 5, 2024",
        tags: ["analytics", "traffic", "performance", "insights"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Analyze traffic quality, sources, and performance trends in detail."
          },
          {
            title: "Key Sections",
            content: "The Traffic Analytics page includes several important sections:"
          },
          {
            title: "KPIs",
            content: "Detailed view of Visits, Impressions, Acceptance Rate, Avg. Time on Site over selected period."
          },
          {
            title: "Traffic Quality Indicators",
            content: "Visualize trends like session duration or bounce rate (if tracked)."
          },
          {
            title: "Platform Acceptance Rates",
            content: "Compare which platforms yield higher valid impression rates."
          },
          {
            title: "Traffic Sources Distribution",
            content: "See which platforms contribute the most visits."
          },
          {
            title: "Key Insights & Suggestions",
            content: "Automated text highlighting important trends or potential issues, with actionable recommendations."
          },
          {
            title: "Filtering",
            content: "Use filters (Date, Platform) to drill down into specific segments.",
            image: "Screenshot of Traffic Analytics Page"
          },
          {
            title: "Key Takeaways",
            content: "Weekly analysis of traffic quality helps identify which platforms are sending the most valuable traffic, allowing you to focus your resources accordingly."
          }
        ],
        relatedArticles: ["reporting", "budget-optimizer"]
      },
      {
        id: "reporting",
        title: "Using the Reporting Feature",
        description: "Generate downloadable summaries of your performance",
        category: "features",
        lastUpdated: "April 4, 2024",
        tags: ["reports", "download", "export", "analytics"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Generate downloadable summaries of your performance."
          },
          {
            title: "Generating Reports",
            content: "Follow these steps to generate a report:",
            steps: [
              "Go to Reporting.",
              "Select a Report Template (e.g., Performance Overview, RDP Efficiency) or choose \"Create Custom Report\".",
              "Configure parameters: Date Range, Platforms, Metrics, Group By.",
              "Choose Export Options: Format (PDF, CSV, Excel, JSON) and Delivery (Download, Email).",
              "Click \"Generate Report\"."
            ],
            image: "Screenshot of Report Generation Options"
          },
          {
            title: "Saved/Scheduled Reports",
            content: "Access previously generated reports or set up recurring reports."
          },
          {
            title: "Key Takeaways",
            content: "Monthly reports provide historical data for tracking progress and identifying long-term trends that may not be obvious in day-to-day operations."
          }
        ],
        relatedArticles: ["traffic-analytics"]
      }
    ]
  },
  {
    id: "tools",
    title: "Tools & Calculators",
    description: "Learn how to use specialized tools within Traffic Manager.",
    articles: [
      {
        id: "cpm-calculator-guide",
        title: "CPM Calculator Guide",
        description: "Estimate potential revenue based on credits/traffic",
        category: "tools",
        lastUpdated: "April 8, 2024",
        tags: ["calculator", "cpm", "revenue", "estimation"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Estimate potential revenue based on credits/traffic, or estimate credits needed to reach a revenue goal."
          },
          {
            title: "Mode 1: Calculate Revenue",
            content: "Inputs: Platform, Credits Earned, Seconds Per Visit (or Avg Visit Length), Acceptance Rate (%), Actual CPM ($).\nOutputs: Expected Valid Impressions, Estimated Revenue."
          },
          {
            title: "Mode 2: Calculate Credits",
            content: "Inputs: Platform, Target Revenue ($), Seconds Per Visit (or Avg Visit Length), Acceptance Rate (%), Actual CPM ($).\nOutputs: Credits Needed."
          },
          {
            title: "Use Case",
            content: "Useful for quick estimations before running a campaign or scaling up. Remember results depend heavily on input accuracy.",
            image: "Screenshot of CPM Calculator"
          },
          {
            title: "Key Takeaways",
            content: "Use the CPM Calculator for planning and forecasting before investing in credits or infrastructure."
          }
        ],
        relatedArticles: ["campaign-management", "understanding-key-concepts"]
      },
      {
        id: "rdp-scaler",
        title: "RDP Scaler Explained",
        description: "Optimize your RDP allocation across platforms",
        category: "tools",
        lastUpdated: "April 7, 2024",
        tags: ["rdp", "scaling", "optimization"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Estimate the optimal number of RDPs/VPSs to run based on costs and projected revenue, aiming to maximize profit or ROI."
          },
          {
            title: "Inputs",
            content: "Number of RDPs, Cost per RDP, Visits per RDP, Acceptance Rate (%), CPM Rate ($)."
          },
          {
            title: "Outputs",
            content: "Projected Monthly Cost, Revenue, Profit, and ROI for that configuration."
          },
          {
            title: "Optimization Suggestion",
            content: "The tool may recommend increasing or decreasing RDPs based on its calculations."
          },
          {
            title: "Insights Panel",
            content: "Provides tips and typical performance data for reference.",
            image: "Screenshot of RDP Scaler"
          },
          {
            title: "Key Takeaways",
            content: "Make data-driven scaling decisions rather than guessing how many RDPs you need for optimal profitability."
          }
        ],
        relatedArticles: ["rdp-management", "budget-optimizer"]
      },
      {
        id: "script-lab",
        title: "Script Lab Introduction",
        description: "Test and optimize traffic scripts",
        category: "tools",
        lastUpdated: "April 6, 2024",
        tags: ["scripts", "testing", "optimization"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Create, test, and manage redirect scripts, often used on the landing pages receiving traffic before redirecting to an offer or final destination. Optimizing these can impact traffic quality and acceptance rates."
          },
          {
            title: "Script Editor",
            content: "Write or paste your JavaScript redirect code."
          },
          {
            title: "Configuration",
            content: "Set Target URL, Redirect Delay, and Advanced Options (like tracking impressions via the script, mobile detection, geo-targeting)."
          },
          {
            title: "Templates",
            content: "Use pre-built basic or advanced redirect scripts as a starting point."
          },
          {
            title: "Testing",
            content: "Use the \"Run\" button to test the script's behavior."
          },
          {
            title: "Performance",
            content: "Monitor execution count, success rate, and load times.",
            image: "Screenshot of Script Lab Interface"
          },
          {
            title: "Key Takeaways",
            content: "Well-optimized redirect scripts can significantly improve traffic quality and acceptance rates, increasing your revenue without additional costs."
          }
        ],
        relatedArticles: ["script-optimization", "traffic-analytics"]
      }
    ]
  },
  {
    id: "integrations",
    title: "Integrations & Settings",
    description: "Configure integrations, manage API keys, and customize settings.",
    articles: [
      {
        id: "managing-integrations",
        title: "Managing Integrations",
        description: "Connect external platforms and services to Traffic Manager",
        category: "integrations",
        lastUpdated: "April 5, 2024",
        tags: ["integrations", "api", "setup", "connections"],
        isNew: true,
        sections: [
          {
            title: "Adsterra Publisher API",
            content: "Primarily for reference data. See the Getting Started section for details on connecting your Adsterra account."
          },
          {
            title: "Platform API Keys",
            content: "Input API keys provided by specific autosurf platforms if they offer APIs and Traffic Manager supports specific features via those APIs (e.g., potentially checking account status, not usually for credit balance). Check individual platform documentation. Use \"Manage/Connect\" buttons to add/update keys."
          },
          {
            title: "Auto-Scaling Toggle",
            content: "Master switch to enable/disable automation features related to performance-based RDP scaling.",
            image: "Screenshot of Integrations Tab"
          },
          {
            title: "Key Takeaways",
            content: "Most platform integrations provide limited functionality due to API restrictions, but they can still be useful for status monitoring and reference data."
          }
        ],
        relatedArticles: ["connecting-adsterra", "platform-management"]
      },
      {
        id: "budget-optimizer",
        title: "Mastering the Budget Optimizer",
        description: "Intelligently allocate your advertising budget across platforms",
        category: "intelligence",
        lastUpdated: "April 4, 2024",
        tags: ["budget", "optimization", "allocation", "strategy"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Intelligently allocate your total daily advertising budget across your active platforms to achieve a specific goal (e.g., maximize overall ROI or total revenue)."
          },
          {
            title: "How it Works",
            content: "Analyzes recent performance data (visits, revenue, costs inferred from campaigns) for each platform."
          },
          {
            title: "Using the Tool",
            content: "Follow these steps to optimize your budget allocation:",
            steps: [
              "Set your Daily Budget ($).",
              "Choose your Optimization Target (Max ROI, Max Revenue, etc.).",
              "View the Platform Allocations suggested by the optimizer (or manually adjust the sliders).",
              "Review the Expected Results (projected visits, revenue, ROI).",
              "(Optional) Use the AI Budget Recommendations for data-driven suggestions.",
              "Click \"Apply Recommendations\" or \"Optimize Budget Allocation\" to save the strategy (note: this plans the budget; you still need to manage the actual traffic sources)."
            ],
            image: "Screenshot of Budget Optimizer"
          },
          {
            title: "Key Takeaways",
            content: "Weekly budget optimization ensures your money is consistently going to the platforms that deliver the best results based on your goals."
          }
        ],
        relatedArticles: ["campaign-management", "rdp-scaler"]
      },
      {
        id: "configuring-automation",
        title: "Configuring Automation",
        description: "Set up rules to automate aspects of your traffic management",
        category: "intelligence",
        lastUpdated: "April 3, 2024",
        tags: ["automation", "rules", "ai", "optimization"],
        isNew: true,
        sections: [
          {
            title: "Purpose",
            content: "Set up rules to automate certain aspects of your traffic management (feature may be progressively rolled out)."
          },
          {
            title: "AI Autopilot",
            content: "(If enabled) Allows the system to make automated adjustments based on performance, according to the chosen level (Conservative, Balanced, Aggressive)."
          },
          {
            title: "Automation Rules",
            content: "Different types of rules you can configure:"
          },
          {
            title: "Time Scheduling",
            content: "Configure campaigns (or RDPs) to run only during specific high-performing hours/days."
          },
          {
            title: "Performance Scaling",
            content: "Automatically adjust RDP count based on defined ROI or traffic quality thresholds (requires careful setup)."
          },
          {
            title: "Error Handling",
            content: "Define actions if a platform shows errors (e.g., pause related campaigns, shift budget - advanced).",
            image: "Screenshot of Automation Settings"
          },
          {
            title: "Key Takeaways",
            content: "Start with simple automation rules and gradually increase complexity as you become comfortable with how they work and affect your campaigns."
          }
        ],
        relatedArticles: ["budget-optimizer", "rdp-scaler"]
      }
    ]
  }
];

// Helper function to find an article by ID
export function findArticleById(id: string): HelpArticle | undefined {
  for (const category of helpCategoriesData) {
    const article = category.articles.find(article => article.id === id);
    if (article) return article;
  }
  return undefined;
}

// Helper function to search articles by keyword
export function searchArticles(keyword: string): HelpArticle[] {
  const results: HelpArticle[] = [];
  
  if (!keyword || keyword.trim() === '') return results;
  
  const searchTerm = keyword.toLowerCase().trim();
  
  for (const category of helpCategoriesData) {
    for (const article of category.articles) {
      // Search in title, description, and tags
      if (
        article.title.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ) {
        results.push(article);
        continue;
      }
      
      // Search in section content
      let foundInSections = false;
      for (const section of article.sections) {
        if (
          section.title.toLowerCase().includes(searchTerm) ||
          section.content.toLowerCase().includes(searchTerm)
        ) {
          results.push(article);
          foundInSections = true;
          break;
        }
      }
      
      if (foundInSections) continue;
    }
  }
  
  return results;
}

// Helper function to get new articles
export function getNewArticles(): HelpArticle[] {
  const results: HelpArticle[] = [];
  
  for (const category of helpCategoriesData) {
    for (const article of category.articles) {
      if (article.isNew) {
        results.push(article);
      }
    }
  }
  
  return results;
}
