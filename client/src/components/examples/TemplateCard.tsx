import TemplateCard from '../TemplateCard';
import dashboardImg from '@assets/generated_images/React_dashboard_template_preview_8047865f.png';
import apiImg from '@assets/generated_images/Node_API_template_preview_7f2604df.png';
import ecommerceImg from '@assets/generated_images/E-commerce_app_template_preview_928913a6.png';

export default function TemplateCardExample() {
  const templates = [
    {
      title: "React Dashboard Pro",
      description: "Modern admin dashboard with charts, tables, and real-time data visualization.",
      previewImage: dashboardImg,
      techStack: ["React", "TypeScript", "Tailwind"],
      price: 49
    },
    {
      title: "Node.js REST API",
      description: "Production-ready RESTful API with authentication, validation, and PostgreSQL.",
      previewImage: apiImg,
      techStack: ["Node.js", "Express", "PostgreSQL"],
      price: 29
    },
    {
      title: "E-Commerce Starter",
      description: "Full-featured online store with cart, checkout, and payment integration.",
      previewImage: ecommerceImg,
      techStack: ["React", "Node.js", "Stripe"],
      price: 'free' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {templates.map((template, index) => (
        <TemplateCard
          key={index}
          {...template}
          onView={() => console.log(`View ${template.title}`)}
          onDownload={() => console.log(`Download ${template.title}`)}
        />
      ))}
    </div>
  );
}
