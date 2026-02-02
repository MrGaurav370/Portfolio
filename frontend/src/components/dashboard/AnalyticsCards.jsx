import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, BarChart3 } from 'lucide-react';
import { Card } from '../ui/card';

const AnalyticsCards = ({ data }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${data.revenue.total.toLocaleString()}`,
      change: data.revenue.change,
      trend: data.revenue.trend,
      icon: <DollarSign size={24} />,
      color: '#00d9ff'
    },
    {
      title: 'Total Users',
      value: data.users.total.toLocaleString(),
      change: data.users.change,
      trend: data.users.trend,
      icon: <Users size={24} />,
      color: '#00b8e6'
    },
    {
      title: 'Total Orders',
      value: data.orders.total.toLocaleString(),
      change: data.orders.change,
      trend: data.orders.trend,
      icon: <ShoppingCart size={24} />,
      color: '#0097cc'
    },
    {
      title: 'Growth Rate',
      value: `${data.growth.total}%`,
      change: data.growth.change,
      trend: data.growth.trend,
      icon: <BarChart3 size={24} />,
      color: '#0076b3'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="bg-[#1a1a1a] border-[#2a2a2a] p-6 hover:border-[#00d9ff]/50 transition-all duration-300 relative overflow-hidden group"
        >
          {/* Angular background accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#00d9ff]/5 transform rotate-45 translate-x-10 -translate-y-10 group-hover:bg-[#00d9ff]/10 transition-all duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded" style={{ color: card.color }}>
                {card.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                card.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {card.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(card.change)}%
              </div>
            </div>
            
            <h3 className="text-gray-400 text-sm mb-2">{card.title}</h3>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsCards;
