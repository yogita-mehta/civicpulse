import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Camera, 
  MapPin, 
  Bell, 
  BarChart3, 
  Users, 
  Building2,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Photo Upload",
    description: "Capture and submit visual evidence of civic issues instantly with our smart image recognition system.",
    color: "from-cyan-500 to-blue-500",
    delay: 0,
  },
  {
    icon: MapPin,
    title: "GPS Location",
    description: "Automatic geolocation tagging ensures accurate issue placement for faster department response.",
    color: "from-teal-500 to-emerald-500",
    delay: 0.1,
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Stay informed with instant notifications on issue status updates and department actions.",
    color: "from-purple-500 to-pink-500",
    delay: 0.2,
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive insights and metrics for both citizens and government departments.",
    color: "from-amber-500 to-orange-500",
    delay: 0.3,
  },
  {
    icon: Users,
    title: "Community Voting",
    description: "Democratic prioritization allows citizens to upvote critical issues for faster resolution.",
    color: "from-rose-500 to-red-500",
    delay: 0.4,
  },
  {
    icon: Building2,
    title: "Department Sync",
    description: "Seamless integration with city departments for efficient workflow and accountability.",
    color: "from-indigo-500 to-purple-500",
    delay: 0.5,
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-navy to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/10 mb-6"
          >
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Powerful Features</span>
          </motion.div>
          
          <h2 className="section-title mb-6">
            Everything You Need for{" "}
            <span className="gradient-text">Civic Engagement</span>
          </h2>
          <p className="section-subtitle">
            A comprehensive suite of tools designed to streamline communication between citizens and their city government.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: feature.delay }}
              className="group"
            >
              <div className="glass-card-hover h-full p-8">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className={`absolute inset-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Indicator */}
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Learn more
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
