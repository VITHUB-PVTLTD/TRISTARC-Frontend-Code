import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, Calendar, CheckCircle2, X, RefreshCw, AlertCircle, FileText, Upload } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { SectionHeading, Badge } from '@/components/common/UIElements';
import { Button } from '@/components/common/Button';
import { InputField, TextArea } from '@/components/forms/FormFields';
import { careerService } from '@/services/careerService';
import { useAuth } from '@/context/AuthContext';
import type { Job } from '@/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Application Form Schema
const applicationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  position: z.string().min(2, 'Position is required'),
  coverMessage: z.string().optional(),
});
type ApplicationForm = z.infer<typeof applicationSchema>;

// Application Modal
const ApplicationModal: React.FC<{ job: Job | null; onClose: () => void }> = ({ job, onClose }) => {
  const { user } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      position: job?.title ?? '',
      fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict validation: Only PDF and <= 5MB
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setFileError('Invalid file type. Only PDF documents (.pdf) are accepted.');
      setResumeFile(null);
      setResumeBase64(null);
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeBytes) {
      setFileError('File size exceeds the 5MB limit. Please upload a smaller PDF.');
      setResumeFile(null);
      setResumeBase64(null);
      return;
    }

    setFileError('');
    setResumeFile(file);

    // Convert to Base64 Data URL
    const reader = new FileReader();
    reader.onload = () => {
      setResumeBase64(reader.result as string);
    };
    reader.onerror = () => {
      setFileError('Error reading PDF file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ApplicationForm) => {
    if (!job) return;
    setSubmitError('');

    try {
      await careerService.apply({
        jobId: job.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        coverMessage: data.coverMessage,
        resumeUrl: resumeBase64 || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || 'Failed to submit application. Please try again.');
    }
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Career application form">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-tristarc-border">
          <div>
            <h2 className="font-bold text-tristarc-text-primary">Apply for Position</h2>
            <p className="text-sm text-accent-orange font-medium">{job.title}</p>
          </div>
          <button onClick={onClose} className="text-tristarc-text-muted hover:text-tristarc-text-primary transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {submitError && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle size={14} className="shrink-0" /> {submitError}
            </div>
          )}

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-accent-green-light flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-accent-green" />
              </div>
              <h3 className="text-lg font-bold text-tristarc-text-primary mb-2">Application Submitted!</h3>
              <p className="text-tristarc-text-secondary text-sm mb-6">
                Thank you for your interest in joining TRISTARC. You can track your application status anytime in your dashboard.
              </p>
              <Button variant="primary" onClick={onClose}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <InputField label="Full Name" required placeholder="Your full name" error={errors.fullName} {...register('fullName')} />
              <InputField label="Email Address" type="email" required placeholder="your@email.com" error={errors.email} {...register('email')} />
              <InputField label="Phone Number" type="tel" required placeholder="+91 XXXXX XXXXX" error={errors.phone} {...register('phone')} />
              <InputField label="Position Applied For" required placeholder="e.g. Research Analyst" error={errors.position} {...register('position')} />
              <TextArea label="Cover Message" placeholder="Tell us why you're interested in this role..." rows={4} {...register('coverMessage')} />

              {/* Resume File Upload (PDF Only <= 5MB) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Resume / CV (PDF Only, Max 5MB)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    id="resume-pdf-upload"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="resume-pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Upload size={20} />
                    </div>
                    {resumeFile ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-primary">
                        <FileText size={15} />
                        <span>{resumeFile.name}</span>
                        <span className="text-slate-400 font-normal">({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-primary hover:underline">Click to upload PDF resume</span>
                        <span className="text-[11px] text-slate-400">Supported format: .PDF only (max 5 MB)</span>
                      </>
                    )}
                  </label>
                </div>
                {fileError && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{fileError}</p>
                )}
              </div>

              <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full justify-center">
                Submit Application
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const CareersPage: React.FC = () => {
  const [jobList, setJobList] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    careerService.getAll().then((data) => {
      if (mounted) {
        setJobList(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Helmet>
        <title>Careers | TRISTARC</title>
        <meta name="description" content="Explore career opportunities at TRISTARC — join our research and analytics team." />
      </Helmet>

      <PageHero
        title="Careers at TRISTARC"
        description="Join our team of researchers, analysts, trainers, and consultants. Explore current opportunities and be part of our mission."
        breadcrumb={[{ label: 'Careers' }]}
      />

      <section className="section-py bg-tristarc-bg">
        <Container>
          <div className="text-center mb-12">
            <SectionHeading
              overline="Join Our Team"
              title="Current Openings"
              subtitle="Explore exciting full-time, part-time, and research career positions available at TRISTARC."
              centered
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <RefreshCw size={28} className="animate-spin text-primary" />
            </div>
          ) : jobList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16 px-8 bg-white rounded-3xl border border-slate-200/80 shadow-card max-w-xl mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-4 text-accent-orange">
                <Briefcase size={28} />
              </div>
              <h3 className="text-lg font-bold text-tristarc-text-primary mb-2">
                There are no current openings
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Stay alert for future openings! We regularly post new opportunities for research analysts, consultants, academic trainers, and project associates.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {jobList.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <div className="card-p-hover group">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(job as any).featured && <Badge variant="orange">Featured</Badge>}
                          {job.employmentType && <Badge variant="blue">{job.employmentType}</Badge>}
                        </div>
                        <h3 className="text-lg font-bold text-tristarc-text-primary group-hover:text-primary transition-colors mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-xs text-tristarc-text-muted mb-3">
                          {job.department && (
                            <span className="flex items-center gap-1">
                              <Briefcase size={12} />
                              {job.department}
                            </span>
                          )}
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {job.location}
                            </span>
                          )}
                          {job.experience && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {job.experience}
                            </span>
                          )}
                          {job.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Deadline: {job.deadline}
                            </span>
                          )}
                        </div>
                        {job.description && (
                          <p className="text-sm text-tristarc-text-secondary leading-relaxed line-clamp-2">
                            {job.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => { setSelectedJob(job); setModalOpen(true); }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Application Modal */}
      {modalOpen && (
        <ApplicationModal
          job={selectedJob}
          onClose={() => { setModalOpen(false); setSelectedJob(null); }}
        />
      )}
    </>
  );
};

export default CareersPage;
