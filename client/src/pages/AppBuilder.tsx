import Navigation from '@/components/Navigation';
import AppBuilderForm from '@/components/AppBuilderForm';
import Footer from '@/components/Footer';

export default function AppBuilder() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6" data-testid="text-page-title">
              AI-Powered App Builder
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transform your ideas into working applications with intelligent AI assistance. 
              Our smart prompting system guides you through the entire development process.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <AppBuilderForm />
          </div>
        </section>

        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-bold mb-2">Describe Your App</h3>
                <p className="text-sm text-muted-foreground">
                  Use our guided form to define your application's purpose, features, and requirements.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-bold mb-2">AI Refinement</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI asks clarifying questions and suggests optimal architectures and technologies.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-bold mb-2">Get Your Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Receive a detailed development plan, cost estimate, and timeline for your project.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
