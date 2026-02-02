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
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button
                  variant="outline"
                  className="border-[#2a2a2a] text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff]"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Portfolio
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded">
                  <LayoutDashboard className="text-[#00d9ff]" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Enterprise Dashboard</h1>
                  <p className="text-sm text-gray-400">Real-time analytics and insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
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
