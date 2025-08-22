import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  Settings, 
  Home,
  ChevronRight,
  LogOut,
  User,
  Shield,
  Briefcase,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard', roles: ['admin', 'marketing', 'viewer'] },
  { href: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin', 'marketing', 'viewer'] },
  { href: '/campaigns', icon: Target, label: 'Campaigns', roles: ['admin', 'marketing'] },
  { href: '/customers', icon: Users, label: 'Customers', roles: ['admin', 'marketing'] },
  { href: '/settings', icon: Settings, label: 'Settings', roles: ['admin'] },
];

export default function EnhancedSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'marketing': return Briefcase;
      case 'viewer': return Eye;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400';
      case 'marketing': return 'text-blue-400';
      case 'viewer': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'marketing': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  if (loading) {
    return (
      <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto flex flex-col">
      {/* Logo Section */}
      <div className="p-6">
        <img 
          className="mx-auto" 
          src="/assets/images/logo-03.png" 
          alt="Logo Peruri" 
          width={180} 
          height={180} 
        />
        <p className="text-gray-400 font-bold text-sm mt-2 text-center">
          Campaign Marketing Management
        </p>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 mt-4">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white border-r-2 border-blue-400' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>
      
      {/* User Profile Section */}
      <div className="border-t border-gray-700">
        {user ? (
          <div className="p-4">
            {/* User Info */}
            <div 
              className="flex items-center cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition-colors"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user.name}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {React.createElement(getRoleIcon(user.role), { className: `w-3 h-3 mr-1 ${getRoleColor(user.role)}` })}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
              <div className="ml-2">
                {userMenuOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {/* Expanded User Menu */}
            {userMenuOpen && (
              <div className="mt-3 space-y-2">
                {/* User Details */}
                <div className="px-3 py-2 bg-gray-800 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Email</div>
                  <div className="text-sm text-white truncate">{user.email}</div>
                  
                  <div className="text-xs text-gray-400 mt-2 mb-1">Department</div>
                  <div className="text-sm text-white">{user.department}</div>
                  
                  {user.lastLogin && (
                    <>
                      <div className="text-xs text-gray-400 mt-2 mb-1">Last Login</div>
                      <div className="text-xs text-gray-300">
                        {new Date(user.lastLogin).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </>
                  )}
                </div>


                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-300 hover:bg-red-900 hover:text-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loggingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-300 mr-2"></div>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Not authenticated */
          <div className="p-4">
            <Link
              href="/login"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}