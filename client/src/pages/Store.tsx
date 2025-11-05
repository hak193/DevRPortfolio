import { useState } from 'react';
import Navigation from '@/components/Navigation';
import TemplateCard from '@/components/TemplateCard';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import dashboardImg from '@assets/generated_images/React_dashboard_template_preview_8047865f.png';
import apiImg from '@assets/generated_images/Node_API_template_preview_7f2604df.png';
import ecommerceImg from '@assets/generated_images/E-commerce_app_template_preview_928913a6.png';
import componentImg from '@assets/generated_images/Component_library_template_preview_905a7d29.png';
import snippetsImg from '@assets/generated_images/Code_snippets_template_preview_642e6c51.png';

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'React', 'Node.js', 'Full-Stack', 'Components', 'Snippets'];

  const templates = [
    {
      title: "React Dashboard Pro",
      description: "Modern admin dashboard with charts, tables, authentication, and real-time data visualization. Perfect for SaaS applications.",
      previewImage: dashboardImg,
      techStack: ["React", "TypeScript", "Tailwind", "Chart.js"],
      price: 49,
      category: "React"
    },
    {
      title: "Node.js REST API",
      description: "Production-ready RESTful API with authentication, validation, error handling, and PostgreSQL integration.",
      previewImage: apiImg,
      techStack: ["Node.js", "Express", "PostgreSQL", "JWT"],
      price: 29,
      category: "Node.js"
    },
    {
      title: "E-Commerce Starter",
      description: "Full-featured online store with product catalog, shopping cart, checkout flow, and Stripe payment integration.",
      previewImage: ecommerceImg,
      techStack: ["React", "Node.js", "Stripe", "MongoDB"],
      price: 'free' as const,
      category: "Full-Stack"
    },
    {
      title: "UI Component Library",
      description: "Comprehensive collection of reusable React components with Tailwind CSS, Storybook docs, and TypeScript support.",
      previewImage: componentImg,
      techStack: ["React", "Tailwind", "Storybook", "TypeScript"],
      price: 39,
      category: "Components"
    },
    {
      title: "Code Snippets Collection",
      description: "Curated collection of useful code snippets for common development tasks, utilities, and design patterns.",
      previewImage: snippetsImg,
      techStack: ["JavaScript", "TypeScript", "React", "Node.js"],
      price: 'free' as const,
      category: "Snippets"
    },
    {
      title: "Authentication System",
      description: "Complete authentication solution with login, signup, password reset, email verification, and role-based access control.",
      previewImage: dashboardImg,
      techStack: ["React", "Node.js", "JWT", "PostgreSQL"],
      price: 35,
      category: "Full-Stack"
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6" data-testid="text-page-title">
              Premium Code Templates
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Production-ready templates to accelerate your development. All templates include lifetime updates.
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-background border-border h-12"
                data-testid="input-search-templates"
              />
            </div>
          </div>
        </section>

        <section className="py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'secondary'}
                  className="cursor-pointer px-4 py-2 text-sm hover-elevate active-elevate-2"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`badge-category-${category.toLowerCase()}`}
                >
                  {category === 'all' ? 'All Templates' : category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No templates found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template, index) => (
                  <TemplateCard
                    key={index}
                    {...template}
                    onView={() => console.log(`View ${template.title}`)}
                    onDownload={() => console.log(`Download ${template.title}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
