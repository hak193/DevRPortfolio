import Navigation from '@/components/Navigation';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6" data-testid="text-page-title">
              Let's Work Together
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a project in mind? Questions about our services? We'd love to hear from you.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
