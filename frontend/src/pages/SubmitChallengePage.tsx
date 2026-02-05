import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { challengeService } from '../services/challenges';
import { submissionService } from '../services/submissions';
import { Challenge } from '../types';

const SubmitChallengePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');

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
      setError('Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!challenge) return;
    
    // Validation
    if (challenge.category === 'debugging' && !code.trim()) {
      setError('Please provide your code solution');
      return;
    }
    
    if ((challenge.category === 'comprehension' || 
         challenge.category === 'security' || 
         challenge.category === 'ai_review') && !explanation.trim()) {
      setError('Please provide your explanation/review');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const submission = await submissionService.create({
        challenge_id: challenge.id,
        code: code || undefined,
        explanation: explanation || undefined
      });
      
      // Navigate to results page
      navigate(`/submissions/${submission.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Submission failed. Please try again.');
      setSubmitting(false);
    }
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
          <p className="text-red-600">{error || 'Challenge not found'}</p>
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate(`/challenges/${challenge.id}`)}
            className="text-primary-600 hover:text-primary-500 mb-4"
          >
            ← Back to Challenge
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Submit: {challenge.title}
          </h1>
          <p className="mt-2 text-gray-600">
            Complete your solution and submit for AI grading
          </p>
        </div>

        {/* Challenge Code (Reference) */}
        {challenge.code_snippet && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Challenge Code
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono">
                <code>{challenge.code_snippet}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Code Editor (for debugging challenges) */}
          {challenge.category === 'debugging' && (
            <div className="bg-white shadow rounded-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Your Solution Code
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your fixed code here..."
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required={challenge.category === 'debugging'}
              />
              <p className="mt-2 text-sm text-gray-500">
                Provide your corrected version of the code with the bug(s) fixed.
              </p>
            </div>
          )}

          {/* Explanation (for comprehension, security, ai_review) */}
          {(challenge.category === 'comprehension' || 
            challenge.category === 'security' || 
            challenge.category === 'ai_review') && (
            <div className="bg-white shadow rounded-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                {challenge.category === 'comprehension' ? 'Your Explanation' : 'Your Review'}
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder={
                  challenge.category === 'comprehension' 
                    ? "Explain what the code does, how it works, and any potential issues..."
                    : "Identify security issues, bugs, and suggest improvements..."
                }
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required={challenge.category === 'comprehension' || challenge.category === 'security' || challenge.category === 'ai_review'}
              />
              <p className="mt-2 text-sm text-gray-500">
                {challenge.category === 'comprehension' 
                  ? 'Provide a detailed explanation of the code, covering what it does, how it works, and any considerations.'
                  : 'Identify all issues and provide recommendations for improvements.'}
              </p>
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Grading Criteria
            </h3>
            <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
              {challenge.category === 'comprehension' && (
                <>
                  <li>Accuracy: Technical correctness of your explanation</li>
                  <li>Completeness: Covering all important aspects</li>
                  <li>Clarity: How well you communicate your understanding</li>
                  <li>Depth: Demonstrating deeper insights</li>
                </>
              )}
              {challenge.category === 'debugging' && (
                <>
                  <li>Bug identification: Finding the actual issues</li>
                  <li>Correct fix: Properly resolving the problems</li>
                  <li>Code quality: Clean and maintainable solution</li>
                  <li>Explanation: Understanding why it was broken</li>
                </>
              )}
              {(challenge.category === 'security' || challenge.category === 'ai_review') && (
                <>
                  <li>Issue identification: Finding all problems</li>
                  <li>Severity assessment: Understanding impact</li>
                  <li>Recommendations: Providing good solutions</li>
                  <li>Best practices: Demonstrating security knowledge</li>
                </>
              )}
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/challenges/${challenge.id}`)}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting & Grading...' : 'Submit for Grading →'}
            </button>
          </div>
        </form>

        {submitting && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 text-yellow-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-yellow-800">
                Your submission is being graded by AI. This may take a few seconds...
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubmitChallengePage;