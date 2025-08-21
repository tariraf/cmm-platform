import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Campaign, Customer, Lead } from '@/types';

// Campaign Services
export const campaignService = {
  // Create new campaign
  async create(campaign: Omit<Campaign, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'campaigns'), {
        ...campaign,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  // Get all campaigns
  async getAll(): Promise<Campaign[]> {
    try {
      const campaignsRef = collection(db, 'campaigns');
      const q = query(campaignsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Campaign[];
    } catch (error) {
      console.error('Error getting campaigns:', error);
      throw error;
    }
  },

  // Get campaign by ID
  async getById(id: string): Promise<Campaign | null> {
    try {
      const docRef = doc(db, 'campaigns', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Campaign;
      }
      return null;
    } catch (error) {
      console.error('Error getting campaign:', error);
      throw error;
    }
  },

  // Update campaign
  async update(id: string, updates: Partial<Campaign>): Promise<void> {
    try {
      const docRef = doc(db, 'campaigns', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  // Delete campaign
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'campaigns', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  },

  // Get active campaigns
  async getActive(): Promise<Campaign[]> {
    try {
      const campaignsRef = collection(db, 'campaigns');
      const q = query(
        campaignsRef, 
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Campaign[];
    } catch (error) {
      console.error('Error getting active campaigns:', error);
      throw error;
    }
  }
};

// Customer Services
export const customerService = {
  // Create new customer
  async create(customer: Omit<Customer, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'customers'), {
        ...customer,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Get all customers
  async getAll(): Promise<Customer[]> {
    try {
      const customersRef = collection(db, 'customers');
      const q = query(customersRef, orderBy('companyName', 'asc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
    } catch (error) {
      console.error('Error getting customers:', error);
      throw error;
    }
  },

  // Get customer by ID
  async getById(id: string): Promise<Customer | null> {
    try {
      const docRef = doc(db, 'customers', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Customer;
      }
      return null;
    } catch (error) {
      console.error('Error getting customer:', error);
      throw error;
    }
  },

  // Update customer
  async update(id: string, updates: Partial<Customer>): Promise<void> {
    try {
      const docRef = doc(db, 'customers', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete customer
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'customers', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Search customers
  async search(query: string): Promise<Customer[]> {
    try {
      const customersRef = collection(db, 'customers');
      // Note: Firestore doesn't support full-text search natively
      // This is a simplified search - consider using Algolia for better search
      const querySnapshot = await getDocs(customersRef);
      
      const customers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
      
      return customers.filter(customer => 
        customer.companyName.toLowerCase().includes(query.toLowerCase()) ||
        customer.contactPerson.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }
};

// Lead Services
export const leadService = {
  // Create new lead
  async create(lead: Omit<Lead, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'leads'), {
        ...lead,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  // Get all leads
  async getAll(): Promise<Lead[]> {
    try {
      const leadsRef = collection(db, 'leads');
      const q = query(leadsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
    } catch (error) {
      console.error('Error getting leads:', error);
      throw error;
    }
  },

  // Get lead by ID
  async getById(id: string): Promise<Lead | null> {
    try {
      const docRef = doc(db, 'leads', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Lead;
      }
      return null;
    } catch (error) {
      console.error('Error getting lead:', error);
      throw error;
    }
  },

  // Update lead
  async update(id: string, updates: Partial<Lead>): Promise<void> {
    try {
      const docRef = doc(db, 'leads', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  },

  // Delete lead
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'leads', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },

  // Get leads by status
  async getByStatus(status: Lead['status']): Promise<Lead[]> {
    try {
      const leadsRef = collection(db, 'leads');
      const q = query(
        leadsRef, 
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
    } catch (error) {
      console.error('Error getting leads by status:', error);
      throw error;
    }
  },

  // Get leads by source
  async getBySource(source: Lead['source']): Promise<Lead[]> {
    try {
      const leadsRef = collection(db, 'leads');
      const q = query(
        leadsRef, 
        where('source', '==', source),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
    } catch (error) {
      console.error('Error getting leads by source:', error);
      throw error;
    }
  },

  // Real-time listener for leads
  onLeadsChange(callback: (leads: Lead[]) => void) {
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const leads = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
      callback(leads);
    });
  }
};

// Analytics Data Services
export const analyticsService = {
  // Save analytics data
  async saveAnalytics(platform: string, data: any): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'analytics'), {
        platform,
        data,
        createdAt: Timestamp.now(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving analytics:', error);
      throw error;
    }
  },

  // Get analytics by platform and period
  async getAnalytics(platform: string, month: number, year: number): Promise<any> {
    try {
      const analyticsRef = collection(db, 'analytics');
      const q = query(
        analyticsRef,
        where('platform', '==', platform),
        where('month', '==', month),
        where('year', '==', year),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }
};