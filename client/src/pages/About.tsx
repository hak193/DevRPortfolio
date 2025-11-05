import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Award, Users, Zap, Heart } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for the highest quality in every line of code we write and every solution we deliver."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Your success is our success. We work closely with you to understand and exceed your expectations."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We embrace cutting-edge technologies and methodologies to build future-proof applications."
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Transparent communication, honest timelines, and ethical practices are at our core."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6" data-testid="text-page-title">
              About I-DevR Code
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Professional software development rooted in Worcester, Massachusetts
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="prose prose-lg prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                At I-DevR Code, we believe great software should be accessible to businesses of all sizes. 
                Based in Worcester, MA, we combine local expertise with global standards to deliver 
                custom applications, AI-powered development tools, and premium code templates that 
                accelerate your digital transformation.
              </p>

              <h2 className="text-3xl font-bold mb-6 mt-12">What Sets Us Apart</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We're not just developers—we're problem solvers who understand that technology is 
                a means to an end. Whether you need a custom web application, want to leverage our 
                AI app builder, or are looking for production-ready templates, we focus on delivering 
                real business value, not just code.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">Worcester Roots, Global Reach</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Proudly serving Worcester and Central Massachusetts, we bring the same dedication 
              and quality to local businesses as we do to clients across the country. Our deep 
              understanding of the local tech ecosystem combined with modern development practices 
              makes us the ideal partner for your next project.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From startups to established enterprises, we've helped businesses transform their 
              ideas into powerful software solutions. Let's build something amazing together.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
