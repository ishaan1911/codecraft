import React, { useEffect, useState, useCallback} from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { challengeService } from '../services/challenges';
import { Challenge, ChallengeCategory, ChallengeDifficulty } from '../types';

const ChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<ChallengeCategory | ''>('');
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, [category, difficulty]);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const data = await challengeService.list(
        category || undefined,
        difficulty || undefined
      );
      setChallenges(data);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  }, [category, difficulty]);
  
  // Filter challenges by search term
  const filteredChallenges = challenges.filter(challenge =>
  challenge.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  challenge.description?.toLowerCase().includes(searchTerm.toLowerCase())
);

  const getDifficultyColor = (diff: ChallengeDifficulty) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
    }
  };

  const getCategoryIcon = (cat: ChallengeCategory) => {
    switch (cat) {
      case 'comprehension': return '🧠';
      case 'debugging': return '🐛';
      case 'security': return '🔒';
      case 'ai_review': return '🤖';
      case 'design': return '📐';
    }
  };

  const getCategoryName = (cat: ChallengeCategory) => {
    switch (cat) {
      case 'comprehension': return 'Code Comprehension';
      case 'debugging': return 'Debugging';
      case 'security': return 'Security Review';
      case 'ai_review': return 'AI Code Review';
      case 'design': return 'System Design';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
          <p className="mt-2 text-gray-600">
            Test your skills with code comprehension, debugging, and security challenges
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ChallengeCategory | '')}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Categories</option>
                <option value="comprehension">Code Comprehension</option>
                <option value="debugging">Debugging</option>
                <option value="security">Security Review</option>
                <option value="ai_review">AI Code Review</option>
                <option value="design">System Design</option>
              </select>
            </div>
            
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as ChallengeDifficulty | '')}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-500">
                Showing {filteredChallenges.length} of {challenges.length} challenges
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading challenges...</div>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No challenges found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <Link
                key={challenge.id}
                to={`/challenges/${challenge.id}`}
                className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
              >
                {new Date(challenge.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-primary-600 text-white text-xs font-bold rounded">
                      NEW
                    </span>
                  )}
                  
                <div className="flex items-start justify-between"></div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">
                      {getCategoryIcon(challenge.category)}
                    </span>
                    <div>
                      <span className="text-xs text-gray-500">
                        {getCategoryName(challenge.category)}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {challenge.title}
                </h3>
                
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {challenge.description}
                </p>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>⏱️ {challenge.time_limit} min</span>
                  <span>🏆 {challenge.points} pts</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChallengesPage;