import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import AnalyticsCards from '../components/dashboard/AnalyticsCards';
import Charts from '../components/dashboard/Charts';
import UserTable from '../components/dashboard/UserTable';
import { Button } from '../components/ui/button';
import {
  analyticsData,
  revenueChartData,
  salesChartData,
  categoryChartData,
  usersTableData
} from '../mockDashboard';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link to="/">
                <Button
                  variant="outline"
                  aria-label="Back to Portfolio"
                  className="border-[#2a2a2a] text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff] px-3 sm:px-4"
                >
                  <ArrowLeft size={16} className="sm:mr-2" />
                  <span className="hidden sm:inline">Back to Portfolio</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2 min-w-0">
                <div className="hidden min-[420px]:block p-2 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded">
                  <LayoutDashboard className="text-[#00d9ff]" size={20} />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-xl font-bold truncate">Enterprise Dashboard</h1>
                  <p className="hidden sm:block text-sm text-gray-400">Real-time analytics and insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Analytics Cards */}
        <AnalyticsCards data={analyticsData} />

        {/* Charts */}
        <Charts
          revenueData={revenueChartData}
          salesData={salesChartData}
          categoryData={categoryChartData}
        />

        {/* User Table */}
        <UserTable users={usersTableData} />
      </div>
    </div>
  );
};

export default Dashboard;
