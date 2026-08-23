import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/UIElements';
import { Button } from '@/components/common/Button';
import { InputField, TextArea } from '@/components/forms/FormFields';
import { siteConfig } from '@/data/site';
import { contactService } from '@/services/contactService';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Please write at least 10 characters'),
});
type ContactForm = z.infer<typeof contactSchema>;

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitError('');
    try {
      await contactService.submit(data);
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | TRISTARC</title>
        <meta name="description" content="Get in touch with TRISTARC — contact our research and analytics team for enquiries, partnerships, or service requests." />
      </Helmet>

      <PageHero
        title="Contact Us"
        description="Reach out to our team for research enquiries, course registrations, or service requests."
        breadcrumb={[{ label: 'Contact Us' }]}
      />

      <section className="section-py bg-tristarc-bg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading overline="Get In Touch" title="Contact Information" />

              <p className="text-body text-tristarc-text-secondary">
                Have a research, analytics, training, or consultancy enquiry? We'd be glad to help.
              </p>

              {[
                { icon: MapPin, label: 'Address', value: siteConfig.contact.address },
                { icon: Mail, label: 'Email', value: siteConfig.contact.email },
                { icon: Phone, label: 'Phone', value: siteConfig.contact.phone },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0 text-primary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-tristarc-text-muted uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-sm text-tristarc-text-primary">{value}</p>
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="rounded-2xl overflow-hidden bg-primary-light h-48 flex items-center justify-center border border-tristarc-border">
                <div className="text-center">
                  <MapPin size={32} className="text-primary/30 mx-auto mb-2" />
                  <p className="text-xs text-tristarc-text-muted">Map to be integrated</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-p">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-accent-green-light flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-accent-green" />
                    </div>
                    <h3 className="text-xl font-bold text-tristarc-text-primary mb-2">Message Sent!</h3>
                    <p className="text-tristarc-text-secondary">
                      Thank you for reaching out. Our team will respond to your enquiry shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-tristarc-text-primary mb-6">Send a Message</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <InputField
                          label="Full Name"
                          required
                          placeholder="Your full name"
                          error={errors.fullName}
                          {...register('fullName')}
                        />
                        <InputField
                          label="Email Address"
                          type="email"
                          required
                          placeholder="your@email.com"
                          error={errors.email}
                          {...register('email')}
                        />
                      </div>
                      <InputField
                        label="Phone Number"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        hint="Optional"
                        {...register('phone')}
                      />
                      <InputField
                        label="Subject"
                        required
                        placeholder="Research enquiry / Course registration / Other"
                        error={errors.subject}
                        {...register('subject')}
                      />
                      <TextArea
                        label="Message"
                        required
                        placeholder="Please describe your enquiry..."
                        rows={5}
                        error={errors.message}
                        {...register('message')}
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isSubmitting}
                        className="w-full justify-center"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ContactPage;
