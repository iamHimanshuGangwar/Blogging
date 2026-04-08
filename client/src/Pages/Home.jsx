import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Bloglist from '../components/Bloglist';
import Features from '../components/Features';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 overflow-hidden">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-pink-400/5 to-orange-300/5 pointer-events-none"></div>
      {/* Glow Effects */}
      <div className="absolute -top-32 -right-20 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl dark:bg-purple-700/5"></div>
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl dark:bg-pink-700/5"></div>
      
      <div className="relative z-10">
      <Navbar />
      <Header />
    
      {/* Features Section */}
  
      {/* Blog List Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <Bloglist />
      </section>

<section className="py-8 bg-transparent">
        <Features />
      </section>
      
      {/* Newsletter Section */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <Newsletter />
      </section>

      <Footer />
      </div>
    </div>
  );
};

export default Home;
