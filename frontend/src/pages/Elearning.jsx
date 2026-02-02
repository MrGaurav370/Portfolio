import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Users, Star, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { coursesData } from '../mockElearning';

const Elearning = () => {
  const [filter, setFilter] = useState('all');

  const filteredCourses = filter === 'enrolled' 
    ? coursesData.filter(c => c.enrolled) 
    : coursesData;

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
                  <BookOpen className="text-[#00d9ff]" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold">E-Learning Platform</h1>
                  <p className="text-sm text-gray-400">Learn Angular & Web Development</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-8 mb-8 border border-[#2a2a2a]">
          <h2 className="text-4xl font-bold mb-4">Start Learning Today</h2>
          <p className="text-gray-400 text-lg mb-6">Access high-quality courses and master new skills</p>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-[#00d9ff]">50+</p>
              <p className="text-gray-400">Courses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#00d9ff]">10k+</p>
              <p className="text-gray-400">Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#00d9ff]">4.8</p>
              <p className="text-gray-400">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 font-semibold transition-all duration-300 ${
              filter === 'all'
                ? 'bg-[#00d9ff] text-black'
                : 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:border-[#00d9ff]/50'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setFilter('enrolled')}
            className={`px-6 py-3 font-semibold transition-all duration-300 ${
              filter === 'enrolled'
                ? 'bg-[#00d9ff] text-black'
                : 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:border-[#00d9ff]/50'
            }`}
          >
            My Courses
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="bg-[#1a1a1a] border-[#2a2a2a] overflow-hidden hover:border-[#00d9ff]/50 transition-all duration-300 group"
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                {course.enrolled && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#00d9ff] text-black">Enrolled</Badge>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="border-[#2a2a2a] text-gray-400">
                    {course.level}
                  </Badge>
                  <Badge variant="outline" className="border-[#2a2a2a] text-gray-400">
                    {course.category}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00d9ff] transition-colors">
                  {course.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-yellow-500 text-yellow-500" />
                    {course.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-400">by {course.instructor}</p>
                  <p className="text-xl font-bold text-[#00d9ff]">${course.price}</p>
                </div>

                {course.enrolled && course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-[#00d9ff] font-semibold">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                <Link to={`/elearning/course/${course.id}`}>
                  <Button className="w-full bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold">
                    {course.enrolled ? (
                      <>
                        <Play size={16} className="mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      'View Course'
                    )}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Elearning;
