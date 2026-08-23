import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Download, RefreshCw } from 'lucide-react';
import { SectionHeading, Badge } from '@/components/common/UIElements';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { resourceService } from '@/services/resourceService';
import type { Resource } from '@/types';

export const EResourcesPreviewSection: React.FC = () => {
  const [resourceList, setResourceList] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    resourceService.getAll().then((data) => {
      if (mounted) {
        setResourceList(data.slice(0, 3));
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="section-py bg-tristarc-bg" aria-labelledby="eresources-heading">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
            overline="Knowledge Hub"
            title="E-Resources"
            subtitle="Research guides, statistical references, and study materials for practitioners and learners."
          />
          <Button variant="secondary" size="md" to="/e-resources" rightIcon={<ArrowRight size={16} />}>
            Explore Resources
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <RefreshCw size={28} className="animate-spin text-primary" />
          </div>
        ) : resourceList.length === 0 ? (
          <div className="text-center py-12 text-tristarc-text-muted">
            No resources published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resourceList.map((res, i) => {
              const categoryLabel = typeof res.category === 'string'
                ? res.category
                : (res.category as any)?.name ?? 'Resource';
              const downloadUrl = res.fileUrl || res.url || '#';

              return (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="card-p-hover group flex flex-col h-full overflow-hidden border border-tristarc-border shadow-card rounded-2xl bg-white">
                    {res.thumbnailUrl ? (
                      <div className="h-44 -mx-6 -mt-6 mb-4 bg-slate-100 overflow-hidden relative">
                        <img
                          src={res.thumbnailUrl}
                          alt={res.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant="blue" className="text-[10px] shadow-xs">{categoryLabel}</Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <FileText size={18} />
                        </div>
                        <div>
                          <Badge variant="blue" className="text-[10px] mb-1">{categoryLabel}</Badge>
                          {res.date && <p className="text-[10px] text-tristarc-text-muted">{res.date}</p>}
                        </div>
                      </div>
                    )}

                    <h3 className="text-sm font-semibold text-tristarc-text-primary group-hover:text-primary transition-colors leading-snug mb-2 flex-1">
                      {res.title}
                    </h3>
                    <p className="text-xs text-tristarc-text-secondary leading-relaxed mb-4 line-clamp-3">
                      {res.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-tristarc-border mt-auto">
                      <div className="flex gap-2">
                        {res.fileType && (
                          <span className="text-[10px] bg-tristarc-bg px-2 py-1 rounded font-mono font-bold text-tristarc-text-muted">
                            {res.fileType}
                          </span>
                        )}
                        {res.fileSize && (
                          <span className="text-[10px] text-tristarc-text-muted">{res.fileSize}</span>
                        )}
                      </div>
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent-orange transition-colors"
                      >
                        <Download size={12} />
                        View
                      </a>
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

export default EResourcesPreviewSection;

