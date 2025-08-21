import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  Settings, 
  Home,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/campaigns', icon: Target, label: 'Campaigns' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '/seo', icon: TrendingUp, label: 'SEO Metrics' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div>
        <img className='ml-6' src="/assets/images/logo-03.png" alt="Logo Peruri" width={200} height={200} />
        <p className="text-gray-400 font-bold text-sm mt-1 text-center">Campaign Marketing Management</p>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => {
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
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">D</span>
          </div>
          <div className="ml-3">
            <p className="text-white text-sm font-medium">DICO Team</p>
            <p className="text-gray-400 text-xs">Marketing Division</p>
          </div>
        </div>
      </div>
    </div>
  );
}
