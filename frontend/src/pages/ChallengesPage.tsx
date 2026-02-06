import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await api.get('/challenges/');
      setChallenges(response.data);
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
      setError('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Challenges</h1>
      
      {challenges.length === 0 ? (
        <p className="text-gray-600">No challenges found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">{challenge.title}</h2>
              <p className="text-gray-600 mb-4">{challenge.description}</p>
              <div className="flex justify-between text-sm">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{challenge.category}</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{challenge.difficulty}</span>
                <span className="text-gray-500">{challenge.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}