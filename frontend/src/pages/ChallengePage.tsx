import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchChallenge(parseInt(id));
    }
  }, [id]);

  const fetchChallenge = async (challengeId: number) => {
    try {
      setLoading(true);
      const data = await challengesService.getChallenge(challengeId);
      setChallenge(data);
    } catch (err: any) {
      setError('Failed to load challenge');
      console.error('Error fetching challenge:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      alert('Please provide an answer');
      return;
    }

    setSubmitting(true);
    try {
      // TODO: Implement submission API call
      console.log('Submitting answer:', answer);
      alert('Submission functionality will be implemented in Week 3!');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Loading challenge...</div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Challenge not found'}</p>
          <button
            onClick={() => navigate('/challenges')}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/challenges')}
          className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
        >
          ← Back to Challenges
        </button>

        <h1 className="text-3xl font-bold mb-3">{challenge.title}</h1>

        <div className="flex gap-2 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              categoryColors[challenge.category]
            }`}
          >
            {challenge.category}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              difficultyColors[challenge.difficulty]
            }`}
          >
            {challenge.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {challenge.points} points
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Challenge Details */}
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {challenge.description}
            </p>
          </div>

          {/* Question */}
          {challenge.question && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Question</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {challenge.question}
              </p>
            </div>
          )}

          {/* Code Snippet */}
          {challenge.code_snippet && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Code to Analyze</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{challenge.code_snippet}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Right Column - Submission */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Your Answer</h2>
            
            <form onSubmit={handleSubmit}>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={submitting}
              />

              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting || !answer.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Answer'}
                </button>
                <button
                  type="button"
                  onClick={() => setAnswer('')}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific and detailed in your explanation</li>
                <li>• Reference specific lines of code when applicable</li>
                <li>• Explain your reasoning clearly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}