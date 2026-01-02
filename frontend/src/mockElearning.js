// Mock data for E-Learning Platform

export const coursesData = [
  {
    id: 1,
    title: 'Angular 16 Complete Guide',
    instructor: 'John Smith',
    description: 'Master Angular 16 from basics to advanced concepts including components, services, routing, and state management.',
    price: 49.99,
    rating: 4.8,
    students: 1250,
    duration: '12 hours',
    lessons: 45,
    level: 'Intermediate',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    progress: 65,
    enrolled: true
  },
  {
    id: 2,
    title: 'TypeScript Fundamentals',
    instructor: 'Sarah Johnson',
    description: 'Learn TypeScript from scratch with hands-on projects and real-world examples.',
    price: 39.99,
    rating: 4.9,
    students: 2100,
    duration: '8 hours',
    lessons: 32,
    level: 'Beginner',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=600&fit=crop',
    progress: 30,
    enrolled: true
  },
  {
    id: 3,
    title: 'RxJS State Management',
    instructor: 'Mike Davis',
    description: 'Deep dive into RxJS operators, observables, and reactive programming patterns.',
    price: 59.99,
    rating: 4.7,
    students: 890,
    duration: '10 hours',
    lessons: 38,
    level: 'Advanced',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    progress: 0,
    enrolled: false
  },
  {
    id: 4,
    title: 'UI/UX Design Principles',
    instructor: 'Emma Wilson',
    description: 'Learn modern UI/UX design principles and create beautiful user interfaces.',
    price: 44.99,
    rating: 4.8,
    students: 1680,
    duration: '9 hours',
    lessons: 35,
    level: 'Beginner',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    progress: 0,
    enrolled: false
  },
  {
    id: 5,
    title: 'NgRx Store Complete Guide',
    instructor: 'David Brown',
    description: 'Master NgRx Store for Angular state management with real-world projects.',
    price: 54.99,
    rating: 4.6,
    students: 750,
    duration: '11 hours',
    lessons: 42,
    level: 'Advanced',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    progress: 0,
    enrolled: false
  },
  {
    id: 6,
    title: 'Web Performance Optimization',
    instructor: 'Lisa Anderson',
    description: 'Learn techniques to optimize web application performance and improve user experience.',
    price: 49.99,
    rating: 4.9,
    students: 1420,
    duration: '7 hours',
    lessons: 28,
    level: 'Intermediate',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    progress: 0,
    enrolled: false
  }
];

export const lessonsData = {
  1: [
    { id: 1, title: 'Introduction to Angular 16', duration: '15:20', completed: true },
    { id: 2, title: 'Setting Up Development Environment', duration: '20:15', completed: true },
    { id: 3, title: 'Components and Templates', duration: '25:30', completed: true },
    { id: 4, title: 'Data Binding', duration: '18:45', completed: false },
    { id: 5, title: 'Services and Dependency Injection', duration: '22:10', completed: false },
    { id: 6, title: 'Routing and Navigation', duration: '28:30', completed: false }
  ]
};

export const quizData = {
  1: [
    {
      id: 1,
      question: 'What is Angular?',
      options: [
        'A JavaScript library',
        'A TypeScript framework',
        'A CSS framework',
        'A database'
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'What is a component in Angular?',
      options: [
        'A service',
        'A building block of UI',
        'A router',
        'A module'
      ],
      correctAnswer: 1
    }
  ]
};
