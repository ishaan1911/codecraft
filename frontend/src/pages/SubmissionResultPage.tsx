import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { submissionService } from '../services/submissions';
import { challengeService } from '../services/challenges';
import { Submission, Challenge } from '../types';

const SubmissionResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSubmission(id);
    }
  }, [id]);

  const fetchSubmission = async (submissionId: string) => {
    setLoading(true);
    try {
      const submissionData = await submissionService.get(submissionId);
      setSubmission(submissionData);
      
      // Fetch challenge details
      const challengeData = await challengeService.get(submissionData.challenge_id);
      setChallenge(challengeData);
    } catch (error) {
      console.error('Failed to fetch submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading results...</div>
        </div>
      </Layout>
    );
  }

  if (!submission || !challenge) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Submission not found</p>
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

  const score = Number(submission.score) || 0;
  const maxScore = Number(submission.max_score) || 100;
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/challenges')}
            className="text-primary-600 hover:text-primary-500 mb-4"
          >
            ← Back to Challenges
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Submission Results
          </h1>
          <p className="mt-2 text-gray-600">
            {challenge.title}
          </p>
        </div>

        {/* Score Card */}
        <div className={`border-2 rounded-lg p-8 ${getScoreBgColor(percentage)}`}>
          <div className="text-center">
            <div className="mb-4">
              {submission.is_correct ? (
                <span className="text-6xl">🎉</span>
              ) : percentage >= 60 ? (
                <span className="text-6xl">👍</span>
              ) : (
                <span className="text-6xl">📝</span>
              )}
            </div>
            <h2 className="text-4xl font-bold mb-2">
              <span className={getScoreColor(percentage)}>
                {percentage}%
              </span>
            </h2>
            <p className="text-lg text-gray-700">
              Score: {score} / {maxScore} points
            </p>
            {submission.is_correct && (
              <div className="mt-4 inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                ✓ Challenge Completed!
              </div>
            )}
          </div>
        </div>

        {/* AI Feedback */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🤖 AI Feedback
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {submission.feedback}
            </p>
          </div>
        </div>

        {/* Grading Details */}
      {/* Grading Details */}
        {/* Grading Details */}
        {submission.grading_details && Object.keys(submission.grading_details).length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📊 Detailed Breakdown
            </h2>
            <div className="space-y-3">
              {Object.entries(submission.grading_details).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{key}</span>
                  <span className="font-medium text-gray-900">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your Submission */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📝 Your Submission
          </h2>
          
          {submission.code && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Code:</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono">
                  <code>{submission.code}</code>
                </pre>
              </div>
            </div>
          )}
          
          {submission.explanation && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Explanation:</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-line">
                  {submission.explanation}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/challenges')}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            ← Browse More Challenges
          </button>
          <button
            onClick={() => navigate('/submissions')}
            className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            View All Submissions
          </button>
        </div>

        {/* Submission Info */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p>Submitted on: {new Date(submission.submitted_at).toLocaleString()}</p>
          {submission.time_taken && (
            <p>Time taken: {Math.round(submission.time_taken / 60)} minutes</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubmissionResultPage;