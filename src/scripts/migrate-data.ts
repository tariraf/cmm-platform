import { campaignService, customerService, leadService, analyticsService } from '@/lib/firestore';
import { dummyCampaigns, dummyCustomers, dummyLeads } from '@/data/dummy';
import { 
  dummyTikTokData, 
  dummyInstagramData, 
  dummyTwitterData, 
  dummySEOData 
} from '@/data/enhanced-dummy';

export async function migrateDummyData() {
  console.log('🚀 Starting data migration...');

  try {
    // Migrate Campaigns
    console.log('📊 Migrating campaigns...');
    for (const campaign of dummyCampaigns) {
      const { id, ...campaignData } = campaign;
      await campaignService.create(campaignData);
    }
    console.log(`✅ Migrated ${dummyCampaigns.length} campaigns`);

    // Migrate Customers  
    console.log('👥 Migrating customers...');
    for (const customer of dummyCustomers) {
      const { id, ...customerData } = customer;
      await customerService.create(customerData);
    }
    console.log(`✅ Migrated ${dummyCustomers.length} customers`);

    // Migrate Leads
    console.log('🎯 Migrating leads...');
    for (const lead of dummyLeads) {
      const { id, ...leadData } = lead;
      await leadService.create(leadData);
    }
    console.log(`✅ Migrated ${dummyLeads.length} leads`);

    // Migrate Analytics Data
    console.log('📈 Migrating analytics data...');
    
    // TikTok Analytics
    for (const data of dummyTikTokData) {
      await analyticsService.saveAnalytics('tiktok', data);
    }
    
    // Instagram Analytics
    for (const data of dummyInstagramData) {
      await analyticsService.saveAnalytics('instagram', data);
    }
    
    // Twitter Analytics
    for (const data of dummyTwitterData) {
      await analyticsService.saveAnalytics('twitter', data);
    }
    
    // SEO Analytics
    for (const data of dummySEOData) {
      await analyticsService.saveAnalytics('seo', data);
    }
    
    console.log('✅ Analytics data migrated successfully');

    console.log('🎉 Data migration completed successfully!');
    
    return {
      success: true,
      migrated: {
        campaigns: dummyCampaigns.length,
        customers: dummyCustomers.length,
        leads: dummyLeads.length,
        analytics: dummyTikTokData.length + dummyInstagramData.length + dummyTwitterData.length + dummySEOData.length
      }
    };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function createInitialUsers() {
  console.log('👤 Creating initial demo users...');
  
  const { registerUser } = await import('@/lib/auth');
  
  const demoUsers = [
    {
      email: 'admin@dico.co.id',
      password: 'admin123',
      name: 'Admin DICO',
      role: 'admin' as const
    },
    {
      email: 'marketing@dico.co.id', 
      password: 'marketing123',
      name: 'Marketing Team',
      role: 'marketing' as const
    },
    {
      email: 'demo@dico.co.id',
      password: 'demo123', 
      name: 'Demo User',
      role: 'viewer' as const
    }
  ];

  try {
    for (const user of demoUsers) {
      await registerUser(user.email, user.password, user.name, user.role);
      console.log(`✅ Created user: ${user.email}`);
    }
    
    console.log('🎉 Initial users created successfully!');
    return { success: true, usersCreated: demoUsers.length };
    
  } catch (error) {
    console.error('❌ User creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Run migration if called directly
if (typeof window === 'undefined') {
  // This is server-side, you can run the migration
  migrateDummyData()
    .then(result => {
      console.log('Migration result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Migration error:', error);
      process.exit(1);
    });
}