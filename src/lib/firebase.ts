
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, onSnapshot } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVlEhwTIZng8EqiJ-p_UGsLy4-cD0A-W0",
  authDomain: "traffic-surge-maven.firebaseapp.com",
  projectId: "traffic-surge-maven",
  storageBucket: "traffic-surge-maven.firebasestorage.app",
  messagingSenderId: "567913982988",
  appId: "1:567913982988:web:a4c3ae810a02fbc7965229",
  measurementId: "G-143G32BQZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    const docRef = await addDoc(rdpsCollection, rdpData);
    console.log("RDP added with ID: ", docRef.id);
    return { id: docRef.id, ...rdpData };
  } catch (e) {
    console.error("Error adding RDP: ", e);
    throw e;
  }
};

export const fetchRdps = async () => {
  try {
    const querySnapshot = await getDocs(rdpsCollection);
    const rdps: RdpData[] = [];
    querySnapshot.forEach((doc) => {
      rdps.push({ id: doc.id, ...(doc.data() as Omit<RdpData, "id">) });
    });
    return rdps;
  } catch (e) {
    console.error("Error fetching RDPs: ", e);
    throw e;
  }
};

export const updateRdpStatus = async (id: string, status: "online" | "offline") => {
  try {
    const rdpDoc = doc(db, "rdps", id);
    await updateDoc(rdpDoc, { status });
    console.log(`RDP ${id} status updated to ${status}`);
    return true;
  } catch (e) {
    console.error("Error updating RDP status: ", e);
    throw e;
  }
};

export const deleteRdp = async (id: string) => {
  try {
    const rdpDoc = doc(db, "rdps", id);
    await deleteDoc(rdpDoc);
    console.log(`RDP ${id} deleted`);
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
  const q = query(rdpsCollection);
  return onSnapshot(
    q,
    (querySnapshot) => {
      const rdps: RdpData[] = [];
      querySnapshot.forEach((doc) => {
        rdps.push({ id: doc.id, ...(doc.data() as Omit<RdpData, "id">) });
      });
      callback(rdps);
    },
    (error) => {
      console.error("Error subscribing to RDPs: ", error);
      if (onError) onError(error);
    }
  );
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
    
    const docRef = await addDoc(campaignsCollection, dataWithTimestamp);
    console.log("Campaign added with ID: ", docRef.id);
    return { id: docRef.id, ...dataWithTimestamp };
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
