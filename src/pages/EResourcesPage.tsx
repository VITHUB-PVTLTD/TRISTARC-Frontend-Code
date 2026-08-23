import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, FileText, Download, Filter, RefreshCw } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/common/UIElements';
import { resourceCategories } from '@/data/resources';
import { resourceService } from '@/services/resourceService';
import type { Resource } from '@/types';

const ITEMS_PER_PAGE = 8;

const EResourcesPage: React.FC = () => {
  const [resourcesList, setResourcesList] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    resourceService.getAll().then((data) => {
      if (mounted) {
        setResourcesList(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = resourcesList;
    if (activeCategory !== 'All') {
      const target = activeCategory.toLowerCase().trim();
      list = list.filter((r) => {
        let catVal = '';
        if (typeof r.category === 'string') {
          catVal = r.category;
        } else if (r.category && typeof r.category === 'object') {
          const catObj = r.category as { name?: string; slug?: string };
          catVal = catObj.name || catObj.slug || '';
        }
        return catVal.toLowerCase().trim() === target;
      });
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description?.toLowerCase() ?? '').includes(q)
      );
    }
    return list;
  }, [query, activeCategory, resourcesList]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <>
      <Helmet>
        <title>E-Resources | TRISTARC</title>
        <meta name="description" content="Browse TRISTARC's digital resource library — research documents, study materials, statistical guides, and reports." />
      </Helmet>

      <PageHero
        title="E-Resources"
        description="Browse our curated library of research documents, statistical guides, study materials, and educational resources."
        breadcrumb={[{ label: 'E-Resources' }]}
      />

      <section className="section-py bg-tristarc-bg">
        <Container>
          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-tristarc-text-muted" />
              <input
                type="search"
                placeholder="Search resources..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                className="form-input pl-10"
                aria-label="Search resources"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-tristarc-text-muted shrink-0" />
              <button
                onClick={() => { setActiveCategory('All'); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === 'All' ? 'bg-primary text-white' : 'bg-white text-tristarc-text-secondary border border-tristarc-border hover:border-primary hover:text-primary'}`}
              >
                All
              </button>
              {resourceCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'bg-white text-tristarc-text-secondary border border-tristarc-border hover:border-primary hover:text-primary'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw size={28} className="animate-spin text-primary" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-tristarc-text-muted">No resources found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginated.map((res, i) => {
                const categoryLabel = typeof res.category === 'string' ? res.category : (res.category as any)?.name ?? 'Resource';
                const downloadUrl = res.fileUrl || res.url || '#';
                return (
                  <motion.div key={res.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                    <div className="card-p-hover group flex flex-col h-full overflow-hidden">
                      {res.thumbnailUrl ? (
                        <div className="h-36 -mx-5 -mt-5 mb-4 bg-slate-100 overflow-hidden relative">
                          <img
                            src={res.thumbnailUrl}
                            alt={res.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="blue" className="text-[10px] shadow-sm">{categoryLabel}</Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-light group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300">
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
                      <p className="text-xs text-tristarc-text-secondary leading-relaxed mb-4 line-clamp-3">{res.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-tristarc-border">
                        <div className="flex gap-2">
                          {res.fileType && <span className="text-[10px] bg-tristarc-bg px-2 py-1 rounded font-mono font-bold text-tristarc-text-muted">{res.fileType}</span>}
                          {res.fileSize && <span className="text-[10px] text-tristarc-text-muted">{res.fileSize}</span>}
                        </div>
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent-orange transition-colors"
                        >
                          <Download size={11} /> View
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-primary text-white shadow-sm' : 'bg-white text-tristarc-text-secondary border border-tristarc-border hover:border-primary hover:text-primary'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default EResourcesPage;
