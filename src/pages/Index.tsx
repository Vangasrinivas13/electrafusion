
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MOCK_POLLS } from '@/utils/auth';
import PollCard from '@/components/polls/PollCard';
import { Vote, ShieldCheck, BarChart4, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  // Get 3 featured polls (most votes)
  const featuredPolls = [...MOCK_POLLS]
    .filter(poll => poll.status === 'active')
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <Vote className="h-16 w-16 mb-6 animate-pulse-slow" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            ElectraFusion Voting System
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl">
            Secure, transparent, and easy-to-use online voting platform for organizations of all sizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-primary font-semibold">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose ElectraFusion?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg">
              <ShieldCheck className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                End-to-end encryption and anonymous voting options protect your data and voter privacy.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg">
              <BarChart4 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
              <p className="text-gray-600">
                Watch live voting analytics with beautiful visualizations as votes come in.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multiple Voting Methods</h3>
              <p className="text-gray-600">
                Choose from single-choice, multiple-choice, or ranked-choice voting for your polls.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Polls */}
      {featuredPolls.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Polls
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPolls.map(poll => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/login">
                <Button size="lg">
                  View All Polls
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Voting?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create an account today and experience the future of online voting.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-primary font-semibold">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Vote className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">ElectraFusion</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link to="/" className="hover:text-primary">Home</Link>
              <Link to="/login" className="hover:text-primary">Login</Link>
              <Link to="/register" className="hover:text-primary">Register</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ElectraFusion. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
