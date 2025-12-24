import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Users, Building2, MessageSquare, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onRegisterClick: () => void;
}

export const HeroSection = ({ onRegisterClick }: HeroSectionProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Citizens' },
    { icon: Building2, value: '120+', label: 'City Departments' },
    { icon: MessageSquare, value: '200K+', label: 'Issues Resolved' },
    { icon: TrendingUp, value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Floating orbs (visuals from Hero-2) */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="floating-orb w-96 h-96 bg-primary/20 top-20 -left-48 animate-float" />
        <div
          className="floating-orb w-80 h-80 bg-secondary/20 top-40 right-0 animate-float"
          style={{ animationDelay: '-5s' }}
        />
        <div
          className="floating-orb w-64 h-64 bg-teal-500/20 bottom-40 left-1/4 animate-float"
          style={{ animationDelay: '-10s' }}
        />
        <div
          className="floating-orb w-48 h-48 bg-amber-500/20 bottom-20 right-1/4 animate-float"
          style={{ animationDelay: '-15s' }}
        />
      </motion.div>

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      {/* Content */}
      <motion.div style={{ opacity }} className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Now Available in 50+ Cities
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="gradient-text">CivicPulse</span>{' '}
            <span className="text-foreground">Hub</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl md:text-3xl font-display font-medium text-foreground/90 mb-6"
          >
            Empowering Citizens, Transforming Cities
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Bridge the gap between citizens and government with our intelligent civic
            engagement platform. Report issues instantly, track resolutions in real-time,
            and help build smarter, more responsive communities.
          </motion.p>

          {/* CTA buttons (Hero-1 logic preserved) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              onClick={onRegisterClick}
              className="btn-primary px-8 py-6 text-base flex items-center gap-2 group"
            >
              Register Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              className="px-8 py-6 text-base"
              asChild
            >
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="glass-card p-6 text-center hover:border-primary/30 transition-all"
              >
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a
            href="#features"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <span className="text-xs font-medium">Scroll to explore</span>
            <ChevronDown className="h-5 w-5 animate-scroll" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};
