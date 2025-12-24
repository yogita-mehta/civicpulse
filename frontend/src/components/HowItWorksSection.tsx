import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Eye, Cog, MessageCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Report Issue",
    description: "Citizens submit civic issues with photos, GPS location, and detailed descriptions through our intuitive mobile or web interface.",
    color: "primary",
  },
  {
    number: "02",
    icon: Eye,
    title: "Track Progress",
    description: "Monitor your submission in real-time with status updates, estimated resolution times, and department assignment notifications.",
    color: "teal-500",
  },
  {
    number: "03",
    icon: Cog,
    title: "Department Action",
    description: "City departments receive, prioritize, and resolve issues through our streamlined workflow management system.",
    color: "secondary",
  },
  {
    number: "04",
    icon: MessageCircle,
    title: "Citizen Feedback",
    description: "Close the loop with feedback mechanisms, satisfaction ratings, and transparent resolution documentation.",
    color: "amber-500",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy-dark" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 mb-6"
          >
            <Cog className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-medium text-teal-400">Simple Process</span>
          </motion.div>
          
          <h2 className="section-title mb-6">
            How <span className="gradient-text">CivicPulse</span> Works
          </h2>
          <p className="section-subtitle">
            A streamlined four-step process that transforms civic engagement from frustration to seamless collaboration.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-teal-500 via-secondary to-amber-500 -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Card */}
                <div className="glass-card p-8 h-full relative group hover:border-primary/30 transition-all duration-500 hover:transform hover:-translate-y-2">
                  {/* Step Number */}
                  <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full bg-${step.color} flex items-center justify-center font-display font-bold text-lg text-white shadow-glow-sm`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 relative">
                    <div className={`w-16 h-16 rounded-2xl bg-${step.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className={`h-8 w-8 text-${step.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (visible on mobile between cards) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.a
            href="#register"
            className="btn-primary inline-flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Reporting Today
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
