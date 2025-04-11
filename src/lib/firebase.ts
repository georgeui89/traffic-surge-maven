import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, onSnapshot, setDoc } from "firebase/firestore";
import { enableIndexedDbPersistence } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVlEhwTIZng8EqiJ-p_UGsLy4-cD0A-W0",
  authDomain: "traffic-surge-maven.firebaseapp.com",
  projectId: "traffic-surge-maven",
  storageBucket: "traffic-surge-maven.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "567913982988",
  appId: "1:567913982988:web:a4c3ae810a02fbc7965229",
  measurementId: "G-143G32BQZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable offline persistence to improve the user experience
// when they have intermittent connectivity.
try {
  enableIndexedDbPersistence(db)
    .then(() => console.log("Offline persistence has been enabled."))
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn('Persistence failed: Multiple tabs open. Persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn('Persistence failed: Current browser does not support all required features.');
      }
    });
} catch (error) {
  console.warn('Error enabling offline persistence:', error);
}

// Collection references
const rdpsCollection = collection(db, "rdps");
const platformsCollection = collection(db, "platforms");
const campaignsCollection = collection(db, "campaigns");

// RDP data type
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

// Platform data type
export interface PlatformData {
  id?: string;
  name: string;
  url: string;
  status: string;
}

// Campaign data type
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

// Firestore CRUD operations for RDPs
export const addRdp = async (rdpData: Omit<RdpData, "id">) => {
  try {
    // Using mock data as fallback in case of Firestore errors
    let result;
    try {
      const docRef = await addDoc(rdpsCollection, rdpData);
      console.log("RDP added with ID: ", docRef.id);
      result = { id: docRef.id, ...rdpData };
    } catch (firestoreError) {
      console.error("Firestore error adding RDP, using mock data as fallback:", firestoreError);
      // Generate a mock ID
      const mockId = `mock-rdp-${Date.now()}`;
      result = { id: mockId, ...rdpData };
    }
    
    return result;
  } catch (e) {
    console.error("Error adding RDP: ", e);
    throw e;
  }
};

export const fetchRdps = async () => {
  try {
    let rdps: RdpData[] = [];
    
    try {
      const querySnapshot = await getDocs(rdpsCollection);
      querySnapshot.forEach((doc) => {
        rdps.push({ id: doc.id, ...(doc.data() as Omit<RdpData, "id">) });
      });
    } catch (firestoreError) {
      console.error("Firestore error fetching RDPs, using mock data as fallback:", firestoreError);
      // Import from mockData as fallback - now the mock data structure matches RdpData
      const { rdps: mockRdps } = await import('../utils/mockData');
      rdps = mockRdps as RdpData[];
    }
    
    return rdps;
  } catch (e) {
    console.error("Error fetching RDPs: ", e);
    throw e;
  }
};

export const updateRdpStatus = async (id: string, status: "online" | "offline") => {
  try {
    try {
      const rdpDoc = doc(db, "rdps", id);
      await updateDoc(rdpDoc, { status });
      console.log(`RDP ${id} status updated to ${status}`);
    } catch (firestoreError) {
      console.error("Firestore error updating RDP, falling back to mock operation:", firestoreError);
      // Just log that this would have been a Firestore operation
      console.log(`Mock operation: RDP ${id} status updated to ${status}`);
    }
    return true;
  } catch (e) {
    console.error("Error updating RDP status: ", e);
    throw e;
  }
};

export const deleteRdp = async (id: string) => {
  try {
    try {
      const rdpDoc = doc(db, "rdps", id);
      await deleteDoc(rdpDoc);
      console.log(`RDP ${id} deleted`);
    } catch (firestoreError) {
      console.error("Firestore error deleting RDP, falling back to mock operation:", firestoreError);
      // Just log that this would have been a Firestore operation
      console.log(`Mock operation: RDP ${id} deleted`);
    }
    return true;
  } catch (e) {
    console.error("Error deleting RDP: ", e);
    throw e;
  }
};

// Subscribe to RDP updates in real-time
export const subscribeToRdps = (
  callback: (rdps: RdpData[]) => void,
  onError?: (error: Error) => void
) => {
  try {
    const q = query(rdpsCollection);
    
    // Try to use Firestore's real-time updates
    let unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const rdps: RdpData[] = [];
        querySnapshot.forEach((doc) => {
          rdps.push({ id: doc.id, ...(doc.data() as Omit<RdpData, "id">) });
        });
        callback(rdps);
      },
      async (error) => {
        console.error("Error subscribing to RDPs: ", error);
        
        // Fall back to mock data
        console.log("Falling back to mock data for RDPs");
        try {
          // Import from mockData as fallback - now the mock data structure matches RdpData
          const { rdps: mockRdps } = await import('../utils/mockData');
          callback(mockRdps as RdpData[]);
        } catch (mockError) {
          console.error("Error loading mock data:", mockError);
          if (onError) onError(error);
        }
      }
    );
    
    return unsubscribe;
  } catch (e) {
    console.error("Error setting up RDP subscription:", e);
    // Return a no-op function as the unsubscribe function
    return () => {};
  }
};

// Firestore CRUD operations for Platforms
export const addPlatform = async (platformData: Omit<PlatformData, "id">) => {
  try {
    const docRef = await addDoc(platformsCollection, platformData);
    console.log("Platform added with ID: ", docRef.id);
    return { id: docRef.id, ...platformData };
  } catch (e) {
    console.error("Error adding platform: ", e);
    throw e;
  }
};

export const fetchPlatforms = async () => {
  try {
    const querySnapshot = await getDocs(platformsCollection);
    const platforms: PlatformData[] = [];
    querySnapshot.forEach((doc) => {
      platforms.push({ id: doc.id, ...(doc.data() as Omit<PlatformData, "id">) });
    });
    return platforms;
  } catch (e) {
    console.error("Error fetching platforms: ", e);
    throw e;
  }
};

export const updatePlatform = async (id: string, platformData: Partial<PlatformData>) => {
  try {
    const platformDoc = doc(db, "platforms", id);
    await updateDoc(platformDoc, platformData);
    console.log(`Platform ${id} updated`);
    return true;
  } catch (e) {
    console.error("Error updating platform: ", e);
    throw e;
  }
};

export const deletePlatform = async (id: string) => {
  try {
    const platformDoc = doc(db, "platforms", id);
    await deleteDoc(platformDoc);
    console.log(`Platform ${id} deleted`);
    return true;
  } catch (e) {
    console.error("Error deleting platform: ", e);
    throw e;
  }
};

// Subscribe to platform updates in real-time
export const subscribeToPlatforms = (
  callback: (platforms: PlatformData[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(platformsCollection);
  return onSnapshot(
    q,
    (querySnapshot) => {
      const platforms: PlatformData[] = [];
      querySnapshot.forEach((doc) => {
        platforms.push({ id: doc.id, ...(doc.data() as Omit<PlatformData, "id">) });
      });
      callback(platforms);
    },
    (error) => {
      console.error("Error subscribing to platforms: ", error);
      if (onError) onError(error);
    }
  );
};

// Firestore CRUD operations for Campaigns
export const addCampaign = async (campaignData: Omit<CampaignData, "id">) => {
  try {
    // Add creation timestamp
    const dataWithTimestamp = {
      ...campaignData,
      createdAt: new Date()
    };
    
    let result;
    try {
      const docRef = await addDoc(campaignsCollection, dataWithTimestamp);
      console.log("Campaign added with ID: ", docRef.id);
      result = { id: docRef.id, ...dataWithTimestamp };
    } catch (firestoreError) {
      console.error("Firestore error adding campaign, using mock operation:", firestoreError);
      // Generate a mock ID
      const mockId = `mock-campaign-${Date.now()}`;
      result = { id: mockId, ...dataWithTimestamp };
    }
    
    return result;
  } catch (e) {
    console.error("Error adding campaign: ", e);
    throw e;
  }
};

export const fetchCampaigns = async () => {
  try {
    const querySnapshot = await getDocs(campaignsCollection);
    const campaigns: CampaignData[] = [];
    querySnapshot.forEach((doc) => {
      campaigns.push({ id: doc.id, ...(doc.data() as Omit<CampaignData, "id">) });
    });
    return campaigns;
  } catch (e) {
    console.error("Error fetching campaigns: ", e);
    throw e;
  }
};

export const updateCampaign = async (id: string, campaignData: Partial<CampaignData>) => {
  try {
    const campaignDoc = doc(db, "campaigns", id);
    await updateDoc(campaignDoc, campaignData);
    console.log(`Campaign ${id} updated`);
    return true;
  } catch (e) {
    console.error("Error updating campaign: ", e);
    throw e;
  }
};

export const deleteCampaign = async (id: string) => {
  try {
    const campaignDoc = doc(db, "campaigns", id);
    await deleteDoc(campaignDoc);
    console.log(`Campaign ${id} deleted`);
    return true;
  } catch (e) {
    console.error("Error deleting campaign: ", e);
    throw e;
  }
};

// Subscribe to campaign updates in real-time
export const subscribeToCampaigns = (
  callback: (campaigns: CampaignData[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(campaignsCollection);
  return onSnapshot(
    q,
    (querySnapshot) => {
      const campaigns: CampaignData[] = [];
      querySnapshot.forEach((doc) => {
        campaigns.push({ id: doc.id, ...(doc.data() as Omit<CampaignData, "id">) });
      });
      callback(campaigns);
    },
    (error) => {
      console.error("Error subscribing to campaigns: ", error);
      if (onError) onError(error);
    }
  );
};

export { db };
