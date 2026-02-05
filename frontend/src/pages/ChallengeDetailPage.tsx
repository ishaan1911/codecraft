import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { challengeService } from '../services/challenges';
import { Challenge, ChallengeCategory } from '../types';

const ChallengeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchChallenge(id);
    }
  }, [id]);

  const fetchChallenge = async (challengeId: string) => {
    setLoading(true);
    try {
      const data = await challengeService.get(challengeId);
      setChallenge(data);
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleStartChallenge = () => {
    navigate(`/challenges/${id}/submit`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading challenge...</div>
        </div>
      </Layout>
    );
  }

  if (!challenge) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Challenge not found</p>
          <button
            onClick={() => navigate('/challenges')}
            className="mt-4 text-primary-600 hover:text-primary-500"
          >
            ← Back to Challenges
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/challenges')}
          className="text-primary-600 hover:text-primary-500 flex items-center"
        >
          ← Back to Challenges
        </button>

        {/* Challenge Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">{getCategoryIcon(challenge.category)}</span>
                <span className="text-sm text-gray-500">
                  {getCategoryName(challenge.category)}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                {challenge.title}
              </h1>
              <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                <span>⏱️ {challenge.time_limit} minutes</span>
                <span>🏆 {challenge.points} points</span>
                <span>💻 {challenge.language || 'Multiple'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Description */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Challenge Description
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {challenge.description}
          </p>
        </div>

        {/* Code Snippet */}
        {challenge.code_snippet && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Code to Review
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono">
                <code>{challenge.code_snippet}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            📋 How to Complete This Challenge
          </h3>
          <ul className="list-disc list-inside text-blue-800 space-y-2">
            {challenge.category === 'comprehension' && (
              <>
                <li>Read and analyze the code carefully</li>
                <li>Explain what the code does in your own words</li>
                <li>Describe when you would use this pattern</li>
                <li>Identify any potential issues or improvements</li>
              </>
            )}
            {challenge.category === 'debugging' && (
              <>
                <li>Identify the bug(s) in the code</li>
                <li>Explain why it's a problem</li>
                <li>Provide the corrected code</li>
                <li>Explain your solution</li>
              </>
            )}
            {challenge.category === 'security' && (
              <>
                <li>Identify all security vulnerabilities</li>
                <li>Explain the potential impact of each issue</li>
                <li>Suggest secure alternatives</li>
                <li>Provide corrected code if applicable</li>
              </>
            )}
            {challenge.category === 'ai_review' && (
              <>
                <li>Review the AI-generated code</li>
                <li>Identify bugs, security issues, and bad practices</li>
                <li>Explain what the AI got wrong</li>
                <li>Suggest improvements</li>
              </>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/challenges')}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleStartChallenge}
            className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium"
          >
            Start Challenge →
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ChallengeDetailPage;