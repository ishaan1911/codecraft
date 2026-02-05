import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { challengeService } from 'services/challenges';
import { Challenge } from '../types';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { User } from '../types';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [recommendedChallenges, setRecommendedChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        
        // Fetch recommended challenges (for now, just get 3 easy/medium ones)
        const allChallenges = await challengeService.list();
        const recommended = allChallenges
          .filter(c => c.difficulty === 'easy' || c.difficulty === 'medium')
          .slice(0, 3);
        setRecommendedChallenges(recommended);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }
    const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'comprehension': return '🧠';
      case 'debugging': return '🐛';
      case 'security': return '🔒';
      case 'ai_review': return '🤖';
      case 'design': return '📐';
      default: return '💻';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Track your progress and start new challenges
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Skill Level
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {user?.skill_level || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0 / 6
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Streak
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0 days
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Accuracy
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      N/A
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
       {/* Recommended Challenges */}
        {recommendedChallenges.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Recommended for You
              </h2>
              <button
                onClick={() => navigate('/challenges')}
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedChallenges.map((challenge) => (
                <button
                  key={challenge.id}
                  onClick={() => navigate(`/challenges/${challenge.id}`)}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {challenge.description}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>⏱️ {challenge.time_limit}min</span>
                    <span>🏆 {challenge.points}pts</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/challenges')}
              className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <span className="font-medium">Browse Challenges</span>
              <p className="text-sm text-gray-500 mt-1">
                Explore code comprehension, debugging, and security challenges
              </p>
            </button>
            <button 
              onClick={() => navigate('/submissions')}
              className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <span className="font-medium">View Submissions</span>
              <p className="text-sm text-gray-500 mt-1">
                Review your past submissions and feedback
              </p>
            </button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Profile Information
            </h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="text-sm text-gray-900">{user.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;