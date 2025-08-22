'use client';
import { useState, useEffect } from 'react';
import { customerService } from '@/lib/firestore';
import { Customer } from '@/types';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all customers
  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new customer
  const createCustomer = async (customerData: Omit<Customer, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      const id = await customerService.create(customerData);
      
      // Add to local state
      const newCustomer: Customer = { ...customerData, id };
      setCustomers(prev => [newCustomer, ...prev]);
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating customer:', err);
      return false;
    }
  };

  // Update customer
  const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<boolean> => {
    try {
      setError(null);
      await customerService.update(id, updates);
      
      // Update local state
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === id 
            ? { ...customer, ...updates, updatedAt: new Date().toISOString() }
            : customer
        )
      );
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating customer:', err);
      return false;
    }
  };

  // Delete customer
  const deleteCustomer = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await customerService.delete(id);
      
      // Remove from local state
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting customer:', err);
      return false;
    }
  };

  // Search customers
  const searchCustomers = async (query: string): Promise<Customer[]> => {
    try {
      setError(null);
      return await customerService.search(query);
    } catch (err: any) {
      setError(err.message);
      console.error('Error searching customers:', err);
      return [];
    }
  };

  // Get customer by ID
  const getCustomer = async (id: string): Promise<Customer | null> => {
    try {
      setError(null);
      return await customerService.getById(id);
    } catch (err: any) {
      setError(err.message);
      console.error('Error getting customer:', err);
      return null;
    }
  };

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    getCustomer,
    refreshCustomers: loadCustomers,
    clearError: () => setError(null)
  };
}