import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, RefreshCw } from 'lucide-react';
import { SectionHeading, Badge } from '@/components/common/UIElements';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { teamService } from '@/services/teamService';
import type { TeamMember } from '@/types';

export const TeamPreviewSection: React.FC = () => {
  const [teamList, setTeamList] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    teamService.getAll().then((data) => {
      if (mounted) {
        setTeamList(data.slice(0, 4));
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="section-py bg-white" aria-labelledby="team-heading">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
            overline="Our People"
            title="Meet Our Team"
            subtitle="Expert researchers, trainers, and consultants driving TRISTARC's mission."
          />
          <Button variant="secondary" size="md" to="/team" rightIcon={<ArrowRight size={16} />}>
            Meet Our Team
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <RefreshCw size={28} className="animate-spin text-primary" />
          </div>
        ) : teamList.length === 0 ? (
          <div className="text-center py-12 text-tristarc-text-muted">
            No team members listed yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamList.map((member, i) => {
              const categoryName = typeof member.category === 'string'
                ? member.category
                : (member.category as any)?.name ?? '';
              const photo = member.photoUrl || member.image;

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <div className="card-hover group flex flex-col h-full overflow-hidden border border-tristarc-border shadow-card rounded-2xl bg-white">
                    {/* Photo Container */}
                    <div className="h-56 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      {photo ? (
                        <img
                          src={photo}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <User size={56} className="text-slate-300" />
                      )}
                      {categoryName && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="blue" className="shadow-xs">{categoryName}</Badge>
                        </div>
                      )}
                    </div>

                    {/* Member Details */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-bold text-tristarc-text-primary mb-0.5 group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      {member.designation && (
                        <p className="text-xs font-semibold text-primary mb-2">
                          {member.designation}
                        </p>
                      )}
                      {member.qualification && (
                        <p className="text-xs text-tristarc-text-muted mb-2 font-mono">
                          {member.qualification}
                        </p>
                      )}
                      {member.bio && (
                        <p className="text-xs text-tristarc-text-secondary leading-relaxed flex-1 line-clamp-3">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
};

export default TeamPreviewSection;

