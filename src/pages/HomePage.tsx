import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroSection } from '@/sections/HeroSection';
import { AboutSection } from '@/sections/AboutSection';
import { CoreAreasSection } from '@/sections/CoreAreasSection';
import { ServicesSection } from '@/sections/ServicesSection';
import { CoursesSection } from '@/sections/CoursesSection';
import { WhyTristarcSection } from '@/sections/WhyTristarcSection';
import { TeamPreviewSection } from '@/sections/TeamPreviewSection';
import { EResourcesPreviewSection } from '@/sections/EResourcesPreviewSection';
import { CareersCTASection, ContactCTASection } from '@/sections/CTASections';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>TRISTARC | Statistical Training, Analytics, Research & Consultancy</title>
        <meta
          name="description"
          content="TRISTARC — Tirupati Rao Institute of Statistical Training, Analytics, Research & Consultancy. Professional research services, statistical training, and analytics consulting."
        />
        <link rel="canonical" href="https://tristarc.in/" />
        <meta property="og:title" content="TRISTARC | Statistical Training, Analytics, Research & Consultancy" />
        <meta property="og:description" content="Professional statistical research, training, and consultancy services." />
        <meta property="og:type" content="website" />
      </Helmet>

      <HeroSection />
      <AboutSection />
      <CoreAreasSection />
      <ServicesSection />
      <CoursesSection />
      <WhyTristarcSection />
      <TeamPreviewSection />
      <EResourcesPreviewSection />
      <CareersCTASection />
      <ContactCTASection />
    </>
  );
};

export default HomePage;
