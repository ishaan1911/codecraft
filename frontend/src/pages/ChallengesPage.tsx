import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { challengesService, Challenge } from '../services/challenges';

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

const categoryColors = {
  comprehension: 'bg-blue-100 text-blue-800',
  debugging: 'bg-purple-100 text-purple-800',
  security: 'bg-pink-100 text-pink-800',
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallenges();
  }, [categoryFilter, difficultyFilter]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await challengesService.filterChallenges(
        categoryFilter || undefined,
        difficultyFilter || undefined
      );
      setChallenges(data);
    } catch (err: any) {
      setError('Failed to load challenges');
      console.error('Error fetching challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeClick = (challengeId: number) => {
    navigate(`/challenges/${challengeId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Loading challenges...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Challenges</h1>
      <p className="text-gray-600 mb-8">
        Test your skills with code comprehension, debugging, and security challenges
      </p>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search challenges..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="comprehension">Comprehension</option>
            <option value="debugging">Debugging</option>
            <option value="security">Security</option>
          </select>
        </div>

        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Challenges Grid */}
      {challenges.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No challenges found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => handleChallengeClick(challenge.id)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {challenge.title}
              </h3>

              <div className="flex gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    categoryColors[challenge.category]
                  }`}
                >
                  {challenge.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    difficultyColors[challenge.difficulty]
                  }`}
                >
                  {challenge.difficulty}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {challenge.description}
              </p>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{challenge.points} pts</span>
                <span className="text-blue-600 font-medium hover:text-blue-700">
                  Start Challenge →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}