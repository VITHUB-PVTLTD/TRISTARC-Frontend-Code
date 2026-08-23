import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <>
    <Helmet>
      <title>404 — Page Not Found | TRISTARC</title>
    </Helmet>
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md px-4"
      >
        {/* 404 */}
        <div className="relative mb-8">
          <h1 className="text-[9rem] font-extrabold text-primary/10 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search size={56} className="text-primary/30" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-tristarc-text-primary mb-3">Page Not Found</h2>
        <p className="text-body text-tristarc-text-secondary mb-8">
          The page you are looking for could not be found. It may have been moved, deleted, or the URL may be incorrect.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary btn-lg">
            <Home size={18} />
            Back to Home
          </Link>
          <Link to="/contact" className="btn-secondary btn-lg">
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  </>
);

export default NotFoundPage;
