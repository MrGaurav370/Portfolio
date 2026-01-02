import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Lock, Clock, BookOpen, Star, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { coursesData, lessonsData } from '../mockElearning';

const CourseDetail = () => {
  const { id } = useParams();
  const course = coursesData.find(c => c.id === parseInt(id));
  const lessons = lessonsData[id] || [];
  const [activeTab, setActiveTab] = useState('overview');

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link to="/elearning">
            <Button
              variant="outline"
              className="border-[#2a2a2a] text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff]"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Course Header */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border-b border-[#2a2a2a]">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-[#00d9ff] text-black">{course.level}</Badge>
                <Badge variant="outline" className="border-[#00d9ff] text-[#00d9ff]">
                  {course.category}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-300 text-lg mb-6">{course.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  <span>{course.rating} ({course.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
            <div>
              <Card className="bg-[#0a0a0a] border-[#2a2a2a] p-6">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full rounded mb-4"
                />
                <p className="text-3xl font-bold text-[#00d9ff] mb-4">${course.price}</p>
                {course.enrolled ? (
                  <Button className="w-full bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold mb-3">
                    <Play size={16} className="mr-2" />
                    Continue Learning
                  </Button>
                ) : (
                  <Button className="w-full bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold mb-3">
                    Enroll Now
                  </Button>
                )}
                <p className="text-sm text-gray-400 text-center">30-day money-back guarantee</p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#2a2a2a]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'text-[#00d9ff] border-b-2 border-[#00d9ff]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'curriculum'
                ? 'text-[#00d9ff] border-b-2 border-[#00d9ff]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Curriculum
          </button>
          <button
            onClick={() => setActiveTab('instructor')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'instructor'
                ? 'text-[#00d9ff] border-b-2 border-[#00d9ff]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Instructor
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#00d9ff] mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Master Angular 16 framework fundamentals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#00d9ff] mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Build real-world web applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#00d9ff] mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Understand components, services, and routing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-[#00d9ff] mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Implement state management patterns</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-3 text-gray-300">
                <li>• Basic JavaScript knowledge</li>
                <li>• Understanding of HTML and CSS</li>
                <li>• Computer with internet connection</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="bg-[#1a1a1a] border-[#2a2a2a] p-4 hover:border-[#00d9ff]/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {lesson.completed ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : course.enrolled ? (
                        <Play size={20} className="text-[#00d9ff]" />
                      ) : (
                        <Lock size={20} className="text-gray-500" />
                      )}
                      <span className="font-semibold text-white">{lesson.title}</span>
                    </div>
                    <span className="text-sm text-gray-400">{lesson.duration}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'instructor' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">About the Instructor</h2>
            <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-[#00d9ff]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#00d9ff]">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{course.instructor}</h3>
                  <p className="text-gray-400">Senior Angular Developer</p>
                </div>
              </div>
              <p className="text-gray-300">
                {course.instructor} is an experienced web developer with over 10 years of experience
                in building modern web applications. Passionate about teaching and helping students
                achieve their goals.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
