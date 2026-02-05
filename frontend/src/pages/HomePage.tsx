import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">CodeCraft</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 px-3 py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Prove Your Engineering Skills
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              AI can write code, but can it understand it? CodeCraft helps you demonstrate 
              the irreplaceable human skills that AI coding assistants struggle with.
            </p>
            <div className="mt-10">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg"
              >
                Start Your Journey
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🧠</span>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Code Comprehension</h3>
                <p className="mt-2 text-base text-gray-500">
                  Demonstrate your deep understanding of complex code patterns and architecture
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🐛</span>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Debugging Mastery</h3>
                <p className="mt-2 text-base text-gray-500">
                  Find and fix bugs that AI tools miss in real-world codebases
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Security Review</h3>
                <p className="mt-2 text-base text-gray-500">
                  Identify vulnerabilities and security flaws in AI-generated code
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2026 CodeCraft. Built to address the entry-level job shortage caused by AI coding tools.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
