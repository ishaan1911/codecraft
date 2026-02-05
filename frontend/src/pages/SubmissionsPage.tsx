import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { submissionService } from '../services/submissions';
import { Submission } from '../types';

const SubmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await submissionService.list();
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    const percentage = score;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading submissions...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
          <p className="mt-2 text-gray-600">
            Review your past challenge submissions and feedback
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No submissions yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start solving challenges to see your submissions here
            </p>
            <button
              onClick={() => navigate('/challenges')}
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Browse Challenges
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                onClick={() => navigate(`/submissions/${submission.id}`)}
                className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Challenge #{submission.challenge_id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Submitted {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(Number(submission.score) || 0)}`}>
                      {Math.round((Number(submission.score) / Number(submission.max_score)) * 100)}%
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {submission.score} / {submission.max_score}
                    </div>
                  </div>
                </div>
                
                {submission.is_correct && (
                  <div className="mt-4 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✓ Completed
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubmissionsPage;