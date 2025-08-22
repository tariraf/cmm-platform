'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { migrateDummyData, createInitialUsers } from '@/scripts/migrate-data';
import { 
  Database, 
  Users, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  RefreshCw
} from 'lucide-react';

export default function DataMigration() {
  const [migrationStatus, setMigrationStatus] = useState<{
    data: 'idle' | 'loading' | 'success' | 'error';
    users: 'idle' | 'loading' | 'success' | 'error';
  }>({
    data: 'idle',
    users: 'idle'
  });
  
  const [results, setResults] = useState<{
    data?: any;
    users?: any;
    errors?: string[];
  }>({});

  const handleDataMigration = async () => {
    setMigrationStatus(prev => ({ ...prev, data: 'loading' }));
    
    try {
      const result = await migrateDummyData();
      
      if (result.success) {
        setMigrationStatus(prev => ({ ...prev, data: 'success' }));
        setResults(prev => ({ ...prev, data: result }));
      } else {
        setMigrationStatus(prev => ({ ...prev, data: 'error' }));
        setResults(prev => ({ 
          ...prev, 
          errors: [...(prev.errors || []), result.error || 'Data migration failed']
        }));
      }
    } catch (error: any) {
      setMigrationStatus(prev => ({ ...prev, data: 'error' }));
      setResults(prev => ({ 
        ...prev, 
        errors: [...(prev.errors || []), error.message || 'Data migration failed']
      }));
    }
  };

  const handleUserCreation = async () => {
    setMigrationStatus(prev => ({ ...prev, users: 'loading' }));
    
    try {
      const result = await createInitialUsers();
      
      if (result.success) {
        setMigrationStatus(prev => ({ ...prev, users: 'success' }));
        setResults(prev => ({ ...prev, users: result }));
      } else {
        setMigrationStatus(prev => ({ ...prev, users: 'error' }));
        setResults(prev => ({ 
          ...prev, 
          errors: [...(prev.errors || []), result.error || 'User creation failed']
        }));
      }
    } catch (error: any) {
      setMigrationStatus(prev => ({ ...prev, users: 'error' }));
      setResults(prev => ({ 
        ...prev, 
        errors: [...(prev.errors || []), error.message || 'User creation failed']
      }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading': return <Loader className="w-5 h-5 animate-spin text-blue-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loading': return 'border-blue-200 bg-blue-50';
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Migration & Setup</h2>
        <p className="text-gray-600">Initialize your Firebase database with demo data and create initial user accounts.</p>
      </div>

      {/* Error Display */}
      {results.errors && results.errors.length > 0 && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Migration Errors</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {results.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Migration */}
        <Card className={`p-6 border-2 ${getStatusColor(migrationStatus.data)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Migrate Demo Data</h3>
                <p className="text-sm text-gray-600">Import customers, campaigns & analytics</p>
              </div>
            </div>
            {getStatusIcon(migrationStatus.data)}
          </div>

          {migrationStatus.data === 'success' && results.data && (
            <div className="mb-4 p-3 bg-green-100 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-2">Migration Successful!</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• {results.data.migrated.customers} customers imported</li>
                <li>• {results.data.migrated.campaigns} campaigns imported</li>
                <li>• {results.data.migrated.leads} leads imported</li>
                <li>• {results.data.migrated.analytics} analytics records imported</li>
              </ul>
            </div>
          )}

          <button
            onClick={handleDataMigration}
            disabled={migrationStatus.data === 'loading'}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {migrationStatus.data === 'loading' ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Migrating...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {migrationStatus.data === 'success' ? 'Re-migrate Data' : 'Migrate Data'}
              </>
            )}
          </button>

          <div className="mt-3 text-xs text-gray-500">
            This will import demo customers, campaigns, leads, and analytics data into your Firestore database.
          </div>
        </Card>

        {/* User Creation */}
        <Card className={`p-6 border-2 ${getStatusColor(migrationStatus.users)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create Demo Users</h3>
                <p className="text-sm text-gray-600">Setup initial user accounts</p>
              </div>
            </div>
            {getStatusIcon(migrationStatus.users)}
          </div>

          {migrationStatus.users === 'success' && results.users && (
            <div className="mb-4 p-3 bg-green-100 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-2">Users Created!</h4>
              <p className="text-xs text-green-700">
                {results.users.usersCreated} demo users have been created successfully.
              </p>
            </div>
          )}

          <button
            onClick={handleUserCreation}
            disabled={migrationStatus.users === 'loading'}
            className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {migrationStatus.users === 'loading' ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                {migrationStatus.users === 'success' ? 'Recreate Users' : 'Create Users'}
              </>
            )}
          </button>

          <div className="mt-3 text-xs text-gray-500 space-y-1">
            <div>Demo accounts that will be created:</div>
            <div>• admin@dico.co.id (admin123)</div>
            <div>• marketing@dico.co.id (marketing123)</div>
            <div>• demo@dico.co.id (demo123)</div>
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-2">Setup Instructions</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>First, create demo users by clicking "Create Users"</li>
              <li>Then, migrate demo data by clicking "Migrate Data"</li>
              <li>Logout and login with one of the demo accounts</li>
              <li>Navigate to Customers or Campaigns to see the imported data</li>
              <li>Try creating, editing, and deleting records to test CRUD functionality</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Firebase Rules Reminder */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-amber-900 mb-2">Firebase Security Rules</h3>
            <p className="text-sm text-amber-800 mb-2">
              Don't forget to update your Firestore security rules to match the provided rules in your Firebase Console.
            </p>
            <p className="text-xs text-amber-700">
              Go to Firebase Console → Firestore Database → Rules tab and replace the rules with the provided firestore.rules file.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}