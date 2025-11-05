import Navigation from '@/components/Navigation';
import ServiceCard from '@/components/ServiceCard';
import Footer from '@/components/Footer';
import { Code2, Zap, Package, Smartphone, Cloud, Shield } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Code2,
      title: "Custom Web Development",
      description: "Full-stack web applications built with React, Node.js, and modern cloud infrastructure for scalability and performance.",
      details: [
        "React, TypeScript, Next.js",
        "RESTful & GraphQL APIs",
        "PostgreSQL, MongoDB databases",
        "AWS, Vercel deployment"
      ],
      ctaText: "Request Quote"
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.",
      details: [
        "React Native development",
        "Native iOS & Android",
        "Offline-first architecture",
        "App Store deployment"
      ],
      ctaText: "Discuss Mobile App"
    },
    {
      icon: Zap,
      title: "AI App Builder",
      description: "Revolutionary AI-assisted development platform that turns your ideas into working applications through intelligent prompting.",
      details: [
        "Natural language input",
        "Smart architecture suggestions",
        "Automated code generation",
        "Iterative refinement"
      ],
      ctaText: "Try Builder"
    },
    {
      icon: Package,
      title: "Code Templates",
      description: "Production-ready templates and components that save you weeks of development time and ensure best practices.",
      details: [
        "React component libraries",
        "Full-stack app starters",
        "API boilerplates",
        "Regular updates"
      ],
      ctaText: "Browse Store"
    },
    {
      icon: Cloud,
      title: "Cloud Architecture",
      description: "Scalable, secure cloud infrastructure design and implementation using modern DevOps practices and tools.",
      details: [
        "AWS, Azure, GCP setup",
        "Kubernetes orchestration",
        "CI/CD pipelines",
        "Cost optimization"
      ],
      ctaText: "Plan Architecture"
    },
    {
      icon: Shield,
      title: "Maintenance & Support",
      description: "Ongoing technical support, updates, and optimization to keep your applications running smoothly and securely.",
      details: [
        "24/7 monitoring",
        "Security patches",
        "Performance tuning",
        "Feature enhancements"
      ],
      ctaText: "Get Support"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6" data-testid="text-page-title">
              Professional Software Services
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Comprehensive development solutions backed by years of experience 
              and a commitment to excellence in Worcester, MA and beyond.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  {...service}
                  onCtaClick={() => console.log(`${service.title} clicked`)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
