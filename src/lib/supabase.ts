import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
export const supabase = createClient(
  'https://rolxojxzqlozbaxeajtn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvbHhvanh6cWxvemJheGVhanRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMzI1NDcsImV4cCI6MjA1OTkwODU0N30.i3vvfOsEQn0x2Yv8PJkNkAjcGEjVHy0Ht_oYnoHUIiw'
);

// Define type interfaces for our data structures
export interface PlatformData {
  id?: string;
  name: string;
  url: string;
  status: string;
  cpm?: number;           // Cost per thousand impressions (revenue potential)
  costPerCredit?: number; // Cost per credit used
  acceptanceRate?: number; // Rate at which visits are accepted as valid impressions
  conversionFactor?: number; // Conversion factor for platform-specific metrics
}

export interface RdpData {
  id?: string;
  name: string;
  dedicatedIp: string;
  provider: string;
  cpuCores: number;
  memory: number;
  cost: number;
  costPeriod: "monthly" | "daily";
  platforms: {
    id: string;
    name: string;
    weight: number;
  }[];
  status: "online" | "offline";
  visits: number;
  revenue: number;
}

export interface CampaignData {
  id?: string;
  name: string;
  url: string;
  platform: string;
  status: string;
  campaignType: string;
  visits?: number;
  revenue?: number;
  cost?: number;
  createdAt?: Date;
}

// CRUD operations for platforms
export const fetchPlatforms = async (): Promise<PlatformData[]> => {
  try {
    const { data, error } = await supabase.from('platforms').select('*');
    
    if (error) {
      console.error('Error fetching platforms from Supabase:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception when fetching platforms:', error);
    // Import mock data as fallback
    const { platforms } = await import('../utils/mockData');
    return platforms;
  }
};

export const addPlatform = async (platformData: Omit<PlatformData, "id">): Promise<PlatformData> => {
  try {
    const { data, error } = await supabase.from('platforms').insert(platformData).select().single();
    
    if (error) {
      console.error('Error adding platform to Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception when adding platform:', error);
    throw error;
  }
};

export const updatePlatform = async (id: string, platformData: Partial<PlatformData>): Promise<boolean> => {
  try {
    const { error } = await supabase.from('platforms').update(platformData).eq('id', id);
    
    if (error) {
      console.error('Error updating platform in Supabase:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exception when updating platform:', error);
    throw error;
  }
};

export const deletePlatform = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('platforms').delete().eq('id', id);
    
    if (error) {
      console.error('Error deleting platform from Supabase:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exception when deleting platform:', error);
    throw error;
  }
};

// CRUD operations for RDPs
export const fetchRdps = async (): Promise<RdpData[]> => {
  try {
    const { data, error } = await supabase.from('rdps').select('*');
    
    if (error) {
      console.error('Error fetching RDPs from Supabase:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception when fetching RDPs:', error);
    // Import mock data as fallback
    const { rdps } = await import('../utils/mockData');
    return rdps;
  }
};

export const addRdp = async (rdpData: Omit<RdpData, "id">): Promise<RdpData> => {
  try {
    const { data, error } = await supabase.from('rdps').insert(rdpData).select().single();
    
    if (error) {
      console.error('Error adding RDP to Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception when adding RDP:', error);
    throw error;
  }
};

export const updateRdpStatus = async (id: string, status: "online" | "offline"): Promise<boolean> => {
  try {
    const { error } = await supabase.from('rdps').update({ status }).eq('id', id);
    
    if (error) {
      console.error('Error updating RDP status in Supabase:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exception when updating RDP status:', error);
    throw error;
  }
};

export const deleteRdp = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('rdps').delete().eq('id', id);
    
    if (error) {
      console.error('Error deleting RDP from Supabase:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exception when deleting RDP:', error);
    throw error;
  }
};

// CRUD operations for campaigns
export const fetchCampaigns = async (): Promise<CampaignData[]> => {
  try {
    const { data, error } = await supabase.from('campaigns').select('*');
    
    if (error) {
      console.error('Error fetching campaigns from Supabase:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception when fetching campaigns:', error);
    // Import mock data as fallback
    const { campaigns } = await import('../utils/mockData');
    return campaigns;
  }
};

export const addCampaign = async (campaignData: Omit<CampaignData, "id">): Promise<CampaignData> => {
  const dataWithTimestamp = {
    ...campaignData,
    createdAt: new Date()
  };
  
  try {
    const { data, error } = await supabase.from('campaigns').insert(dataWithTimestamp).select().single();
    
    if (error) {
      console.error('Error adding campaign to Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception when adding campaign:', error);
    throw error;
  }
};

export const updateCampaign = async (id: string, campaignData: Partial<CampaignData>): Promise<boolean> => {
  try {
    const { error } = await supabase.from('campaigns').update(campaignData).eq('id', id);
    
    if (error) {
      console.error('Error updating campaign in Supabase:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exception when updating campaign:', error);
    throw error;
  }
};

export const deleteCampaign = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('campaigns').delete().eq('id', id);
    
    if (error) {
      console.error('Error deleting campaign from Supabase:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exception when deleting campaign:', error);
    throw error;
  }
};

// Real-time subscriptions
export const subscribeToPlatforms = (
  callback: (platforms: PlatformData[]) => void,
  onError?: (error: Error) => void
) => {
  // First, fetch initial data
  fetchPlatforms()
    .then(platforms => callback(platforms))
    .catch(error => {
      if (onError) onError(error);
    });
  
  // Then set up the real-time subscription
  const subscription = supabase
    .channel('public:platforms')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'platforms' }, () => {
      fetchPlatforms()
        .then(platforms => callback(platforms))
        .catch(error => {
          if (onError) onError(error);
        });
    })
    .subscribe();
  
  // Return a function to unsubscribe
  return () => {
    subscription.unsubscribe();
  };
};

export const subscribeToRdps = (
  callback: (rdps: RdpData[]) => void,
  onError?: (error: Error) => void
) => {
  // First, fetch initial data
  fetchRdps()
    .then(rdps => callback(rdps))
    .catch(error => {
      if (onError) onError(error);
    });
  
  // Then set up the real-time subscription
  const subscription = supabase
    .channel('public:rdps')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rdps' }, () => {
      fetchRdps()
        .then(rdps => callback(rdps))
        .catch(error => {
          if (onError) onError(error);
        });
    })
    .subscribe();
  
  // Return a function to unsubscribe
  return () => {
    subscription.unsubscribe();
  };
};

export const subscribeToCampaigns = (
  callback: (campaigns: CampaignData[]) => void,
  onError?: (error: Error) => void
) => {
  // First, fetch initial data
  fetchCampaigns()
    .then(campaigns => callback(campaigns))
    .catch(error => {
      if (onError) onError(error);
    });
  
  // Then set up the real-time subscription
  const subscription = supabase
    .channel('public:campaigns')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, () => {
      fetchCampaigns()
        .then(campaigns => callback(campaigns))
        .catch(error => {
          if (onError) onError(error);
        });
    })
    .subscribe();
  
  // Return a function to unsubscribe
  return () => {
    subscription.unsubscribe();
  };
};
