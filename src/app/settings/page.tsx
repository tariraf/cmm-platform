'use client';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import DataMigration from '@/components/admin/DataMigration';
import { Settings, Shield, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Settings & Administration" 
        subtitle="System configuration and data management"
      />
      
      <div className="p-6">
        {/* Admin Warning */}
        <Card className="p-4 bg-amber-50 border-amber-200 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-amber-900">Admin Access</h3>
              <p className="text-sm text-amber-800 mt-1">
                You are accessing administrative functions. Please be careful when making changes to system data.
              </p>
            </div>
          </div>
        </Card>

        {/* Data Migration Section */}
        <DataMigration />

        {/* System Information */}
        <Card className="mt-6 p-6">
          <div className="flex items-center mb-4">
            <Settings className="w-6 h-6 text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current User</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Role:</strong> {user.role}</div>
                <div><strong>Department:</strong> {user.department}</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">System Status</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Environment:</strong> Development</div>
                <div><strong>Database:</strong> Firebase Firestore</div>
                <div><strong>Authentication:</strong> Firebase Auth</div>
                <div><strong>Version:</strong> 1.0.0</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/customers')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900">Manage Customers</h4>
              <p className="text-sm text-gray-600 mt-1">View and edit customer records</p>
            </button>
            
            <button 
              onClick={() => router.push('/campaigns')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900">Manage Campaigns</h4>
              <p className="text-sm text-gray-600 mt-1">Create and monitor campaigns</p>
            </button>
            
            <button 
              onClick={() => router.push('/analytics')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900">View Analytics</h4>
              <p className="text-sm text-gray-600 mt-1">Check performance metrics</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}