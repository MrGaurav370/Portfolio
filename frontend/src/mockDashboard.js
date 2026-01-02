// Mock data for Enterprise Dashboard

export const analyticsData = {
  revenue: {
    total: 124500,
    change: 12.5,
    trend: 'up'
  },
  users: {
    total: 2543,
    change: 8.2,
    trend: 'up'
  },
  orders: {
    total: 856,
    change: -3.1,
    trend: 'down'
  },
  growth: {
    total: 18.7,
    change: 5.4,
    trend: 'up'
  }
};

export const revenueChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [65000, 72000, 68000, 85000, 95000, 124500],
      borderColor: '#00d9ff',
      backgroundColor: 'rgba(0, 217, 255, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
};

export const salesChartData = {
  labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
  datasets: [
    {
      label: 'Sales',
      data: [320, 450, 280, 390, 520],
      backgroundColor: [
        'rgba(0, 217, 255, 0.8)',
        'rgba(0, 217, 255, 0.6)',
        'rgba(0, 217, 255, 0.4)',
        'rgba(0, 217, 255, 0.3)',
        'rgba(0, 217, 255, 0.2)'
      ],
      borderColor: '#00d9ff',
      borderWidth: 1
    }
  ]
};

export const categoryChartData = {
  labels: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'],
  datasets: [
    {
      data: [35, 25, 15, 15, 10],
      backgroundColor: [
        '#00d9ff',
        '#00b8e6',
        '#0097cc',
        '#0076b3',
        '#005599'
      ],
      borderColor: '#1a1a1a',
      borderWidth: 2
    }
  ]
};

export const usersTableData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    joinDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'Active',
    joinDate: '2024-02-20'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    role: 'User',
    status: 'Active',
    joinDate: '2024-03-10'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    role: 'Manager',
    status: 'Active',
    joinDate: '2024-01-25'
  },
  {
    id: 5,
    name: 'Robert Brown',
    email: 'robert.b@example.com',
    role: 'User',
    status: 'Inactive',
    joinDate: '2023-12-05'
  }
];
