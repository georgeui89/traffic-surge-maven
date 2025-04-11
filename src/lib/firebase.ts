
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

export { db };
