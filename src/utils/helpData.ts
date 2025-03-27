
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
        id: "welcome-guide",
        title: "Welcome to Traffic Manager",
        description: "A comprehensive guide for new users",
        category: "getting-started",
        lastUpdated: "Sept 10, 2023",
        tags: ["intro", "overview", "beginner"],
        sections: [
          {
            title: "What is Traffic Manager?",
            content: "[Detailed explanation of the Traffic Manager application, its purpose, features, and benefits for managing traffic across multiple platforms.]",
          },
          {
            title: "Key Features",
            content: "[Overview of the main features including Dashboard, Campaign Management, RDP Management, Budget Optimizer, etc.]",
            image: "Screenshot of Dashboard homepage highlighting key features",
          },
          {
            title: "Setting Up Your Account",
            content: "[Instructions for setting up your account and connecting your first platform.]",
            steps: [
              "Create your account with email and password",
              "Complete your profile information",
              "Connect your first traffic platform",
              "Set up your initial budget parameters"
            ]
          }
        ],
        relatedArticles: ["connecting-platforms", "first-campaign"]
      },
      {
        id: "connecting-platforms",
        title: "Connecting Traffic Platforms",
        description: "How to connect your traffic platforms to Traffic Manager",
        category: "getting-started",
        lastUpdated: "Aug 15, 2023",
        tags: ["platforms", "integration", "api", "setup"],
        sections: [
          {
            title: "Supported Platforms",
            content: "[List of all supported traffic platforms including 9Hits, HitLeap, Otohits, etc.]"
          },
          {
            title: "Finding Your API Keys",
            content: "[Instructions for locating API keys within each supported platform.]",
            image: "Annotated screenshots showing where to find API keys in each platform"
          },
          {
            title: "Connecting a Platform",
            content: "[Step-by-step guide for connecting a platform to Traffic Manager.]",
            steps: [
              "Navigate to Settings > Integrations",
              "Find your platform in the list",
              "Click 'Connect' for unconnected platforms",
              "Enter your API key in the modal",
              "Click 'Save' to establish the connection"
            ],
            tips: [
              "Always copy and paste API keys to avoid typing errors",
              "Test the connection immediately after adding a new platform",
              "If you encounter errors, verify the API key is correct and active",
              "Some platforms may require additional permissions to be set in their dashboard"
            ]
          }
        ],
        relatedArticles: ["platform-troubleshooting", "managing-api-keys"]
      },
      {
        id: "first-campaign",
        title: "Creating Your First Campaign",
        description: "Step-by-step guide to creating your first traffic campaign",
        category: "getting-started",
        tags: ["campaign", "setup", "beginner"],
        sections: [
          {
            title: "Campaign Basics",
            content: "[Explanation of what campaigns are in Traffic Manager and how they work.]"
          },
          {
            title: "Creating a New Campaign",
            content: "[Detailed walkthrough of creating a new campaign.]",
            steps: [
              "Navigate to the Campaigns page",
              "Click the 'Create Campaign' button",
              "Enter the campaign name and URL",
              "Select target platforms",
              "Set budget and traffic parameters",
              "Review and launch campaign"
            ],
            image: "Screenshot of campaign creation wizard with annotations"
          },
          {
            title: "Monitoring Campaign Performance",
            content: "[Explanation of how to track campaign performance and key metrics to monitor.]",
            tips: [
              "Start with a small budget to test performance",
              "Monitor acceptance rate closely in the first 24 hours",
              "Make adjustments based on initial performance data",
              "Use the Budget Optimizer for automated improvements"
            ]
          }
        ],
        relatedArticles: ["campaign-optimization", "budget-management"]
      }
    ]
  },
  {
    id: "features",
    title: "Features & Functionality",
    description: "Detailed guides for each feature in Traffic Manager.",
    articles: [
      {
        id: "dashboard-overview",
        title: "Dashboard Overview",
        description: "Understanding and customizing your dashboard",
        category: "features",
        tags: ["dashboard", "metrics", "customize"],
        sections: [
          {
            title: "Dashboard Elements",
            content: "[Detailed explanation of all dashboard elements and what they represent.]",
            image: "Annotated dashboard screenshot showing all key components"
          },
          {
            title: "Customizing Your Dashboard",
            content: "[Instructions for customizing the dashboard layout and visible widgets.]",
            steps: [
              "Click the 'Customize Dashboard' button",
              "Toggle widgets on/off using the checkboxes",
              "Save your customized layout"
            ]
          }
        ],
        relatedArticles: ["metrics-explained", "platform-status"]
      },
      {
        id: "campaign-management",
        title: "Campaign Management",
        description: "Creating, editing, and optimizing campaigns",
        category: "features",
        tags: ["campaigns", "management", "optimization"],
        sections: [
          {
            title: "Campaign Management Overview",
            content: "[Comprehensive explanation of the campaign management interface and capabilities.]"
          },
          {
            title: "Campaign Settings Explained",
            content: "[Detailed explanation of all campaign settings and parameters.]",
            image: "Screenshot of campaign settings page with annotations"
          },
          {
            title: "Bulk Campaign Actions",
            content: "[Instructions for performing actions on multiple campaigns at once.]",
            steps: [
              "Select campaigns using the checkboxes",
              "Choose an action from the bulk actions menu",
              "Confirm the action"
            ]
          }
        ],
        relatedArticles: ["campaign-optimization", "traffic-analysis"]
      }
    ]
  },
  {
    id: "tools",
    title: "Tools & Calculators",
    description: "Learn how to use specialized tools within Traffic Manager.",
    articles: [
      {
        id: "cpm-calculator",
        title: "CPM Calculator",
        description: "Calculate revenue and optimize CPM rates",
        category: "tools",
        tags: ["calculator", "cpm", "revenue"],
        sections: [
          {
            title: "What is CPM?",
            content: "[Explanation of Cost Per Mille (thousand impressions) and its importance in traffic management.]"
          },
          {
            title: "Using the CPM Calculator",
            content: "[Step-by-step guide for using the CPM Calculator tool.]",
            image: "Screenshot of CPM Calculator interface with annotations",
            steps: [
              "Enter your target CPM rate",
              "Input your acceptance rate percentage",
              "Set your daily visit target or budget",
              "Review the calculated results",
              "Adjust parameters to optimize outcomes"
            ]
          },
          {
            title: "Understanding Calculator Results",
            content: "[Explanation of all the metrics shown in calculator results and how to interpret them.]",
            tips: [
              "Higher CPM isn't always better if acceptance rate is low",
              "Focus on Actual CPM after accounting for acceptance rate",
              "Compare results across platforms to find optimal value",
              "Save your calculations for reference"
            ]
          }
        ],
        relatedArticles: ["acceptance-rate-guide", "budget-optimization"]
      },
      {
        id: "rdp-scaler",
        title: "RDP Scaler",
        description: "Optimize your RDP allocation across platforms",
        category: "tools",
        tags: ["rdp", "scaling", "optimization"],
        sections: [
          {
            title: "What is the RDP Scaler?",
            content: "[Explanation of the RDP Scaler tool, its purpose and benefits.]"
          },
          {
            title: "Scaling Strategies",
            content: "[Description of different scaling strategies and when to use them.]",
            image: "Screenshot of scaling strategy options with annotations"
          }
        ],
        relatedArticles: ["rdp-management", "cost-optimization"]
      },
      {
        id: "script-lab",
        title: "Script Lab",
        description: "Test and optimize traffic scripts",
        category: "tools",
        tags: ["scripts", "testing", "ab-testing"],
        sections: [
          {
            title: "Script Lab Overview",
            content: "[Explanation of the Script Lab feature and its capabilities.]"
          },
          {
            title: "A/B Testing Scripts",
            content: "[Guide for setting up and analyzing A/B tests for traffic scripts.]",
            image: "Screenshot of A/B testing interface",
            steps: [
              "Create a control script version",
              "Create variant script versions with changes",
              "Set traffic distribution percentages",
              "Launch the test",
              "Monitor and analyze results"
            ]
          }
        ],
        relatedArticles: ["script-optimization", "performance-testing"]
      }
    ]
  },
  {
    id: "integrations",
    title: "Integrations & Settings",
    description: "Configure integrations, manage API keys, and customize settings.",
    articles: [
      {
        id: "managing-api-keys",
        title: "Managing API Keys",
        description: "How to add, update, and remove platform API keys",
        category: "integrations",
        tags: ["api", "settings", "integration"],
        sections: [
          {
            title: "API Keys Overview",
            content: "[Explanation of API keys and their importance for platform integration.]"
          },
          {
            title: "Adding New API Keys",
            content: "[Instructions for adding new API keys.]",
            steps: [
              "Navigate to Settings > Integrations",
              "Find the platform you want to connect",
              "Click the 'Connect' button",
              "Enter your API key in the modal",
              "Click 'Save' to complete the connection"
            ],
            image: "Screenshot of API key connection modal"
          },
          {
            title: "Updating or Removing API Keys",
            content: "[Guide for updating or removing existing API keys.]",
            steps: [
              "Navigate to Settings > Integrations",
              "Find the connected platform",
              "Click the 'Manage' button",
              "Use 'Update Key' to change the API key",
              "Use 'Disconnect' to remove the integration"
            ],
            tips: [
              "Always test connections after updating API keys",
              "If you're experiencing connection issues, try regenerating the API key in the platform",
              "Some platforms expire API keys after a certain period",
              "Keep a secure backup of your API keys"
            ]
          }
        ],
        relatedArticles: ["platform-troubleshooting", "security-best-practices"]
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
