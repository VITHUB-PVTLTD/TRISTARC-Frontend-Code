import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, RefreshCw } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/common/UIElements';
import { teamService } from '@/services/teamService';
import type { TeamMember } from '@/types';

const categories = ['All', 'Leadership', 'Faculty', 'Researchers', 'Consultants', 'Trainers'];

const TeamPage: React.FC = () => {
  const [membersList, setMembersList] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    let mounted = true;
    teamService.getAll().then((data) => {
      if (mounted) {
        setMembersList(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return membersList;
    const target = activeCategory.toLowerCase().trim();
    return membersList.filter((m) => {
      let catVal = '';
      if (typeof m.category === 'string') {
        catVal = m.category;
      } else if (m.category && typeof m.category === 'object') {
        const catObj = m.category as { name?: string; slug?: string };
        catVal = catObj.name || catObj.slug || '';
      }
      return catVal.toLowerCase().trim() === target;
    });
  }, [activeCategory, membersList]);

  return (
    <>
      <Helmet>
        <title>Our Team | TRISTARC</title>
        <meta name="description" content="Meet the expert researchers, trainers, and consultants at TRISTARC." />
      </Helmet>

      <PageHero
        title="Our Team"
        description="Expert researchers, statisticians, trainers, and consultants dedicated to advancing research and analytics excellence."
        breadcrumb={[{ label: 'Our Team' }]}
      />

      <section className="section-py bg-tristarc-bg">
        <Container>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-tristarc-text-secondary border border-tristarc-border hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Team Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw size={28} className="animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-tristarc-text-muted">
              No team members listed under this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((member, i) => {
                const categoryName = typeof member.category === 'string' ? member.category : (member.category as any)?.name ?? '';
                const photo = member.photoUrl || member.image;
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                  >
                    <div className="card-hover group flex flex-col h-full overflow-hidden">
                      <div className="h-64 bg-tristarc-bg relative overflow-hidden flex items-center justify-center">
                        {photo ? (
                          <img
                            src={photo}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <User size={64} className="text-tristarc-text-muted/30" />
                        )}
                        {categoryName && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="blue">{categoryName}</Badge>
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-tristarc-text-primary mb-1">{member.name}</h3>
                        {member.designation && <p className="text-xs font-semibold text-primary mb-3">{member.designation}</p>}
                        {member.qualification && <p className="text-xs text-tristarc-text-muted mb-3 font-mono">{member.qualification}</p>}
                        {member.bio && <p className="text-xs text-tristarc-text-secondary leading-relaxed flex-1 line-clamp-4">{member.bio}</p>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default TeamPage;
