import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, ArrowRight } from 'lucide-react';
import AIModal from './AIModal';

export default function AppBuilderForm() {
  const [formData, setFormData] = useState({
    appName: '',
    appType: '',
    description: '',
    features: '',
    targetAudience: ''
  });
  
  const [aiModal, setAiModal] = useState({ isOpen: false, title: '', content: '', isLoading: false });
  const [step, setStep] = useState(1);

  const handleAIHelp = (field: string) => {
    setAiModal({
      isOpen: true,
      title: `AI Suggestions for ${field}`,
      content: '',
      isLoading: true
    });

    setTimeout(() => {
      const suggestions: Record<string, string> = {
        'App Type': 'Consider these popular app types:\n\n• Web Application - Best for business tools, dashboards, and SaaS products\n• Mobile App - Ideal for on-the-go access and native features\n• E-Commerce Platform - Perfect for online stores and marketplaces\n• Social Platform - Great for community building and user engagement',
        'Features': 'Based on modern applications, consider:\n\n• User Authentication & Profiles\n• Real-time Notifications\n• Search & Filtering\n• Data Analytics Dashboard\n• Payment Integration\n• File Upload & Management\n• Mobile Responsiveness',
        'Target Audience': 'Define your audience:\n\n• Demographics: Age, location, profession\n• Tech Savviness: Beginner, intermediate, expert\n• Use Case: Business, personal, education\n• Device Preference: Desktop, mobile, both\n\nExample: "Small business owners aged 30-50 who need simple inventory management on both desktop and mobile."'
      };

      setAiModal({
        isOpen: true,
        title: `AI Suggestions for ${field}`,
        content: suggestions[field] || 'AI suggestions will help you refine your requirements.',
        isLoading: false
      });
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                1
              </div>
              <div className={`flex-1 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <div className={`flex-1 h-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Basic Info</span>
              <span>Requirements</span>
              <span>Review</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="appName" className="text-base font-medium mb-2">App Name</Label>
                <Input
                  id="appName"
                  value={formData.appName}
                  onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                  placeholder="Enter your application name"
                  className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary mt-2"
                  data-testid="input-app-name"
                />
              </div>

              <div>
                <Label htmlFor="appType" className="text-base font-medium mb-2">App Type</Label>
                <Input
                  id="appType"
                  value={formData.appType}
                  onChange={(e) => setFormData({ ...formData, appType: e.target.value })}
                  placeholder="e.g., Web App, Mobile App, E-Commerce"
                  className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary mt-2"
                  data-testid="input-app-type"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => handleAIHelp('App Type')}
                  data-testid="button-ai-help-type"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Suggestions for App Type
                </Button>
              </div>

              <Button type="button" onClick={() => setStep(2)} className="w-full" data-testid="button-next-step">
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="description" className="text-base font-medium mb-2">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what your app will do..."
                  rows={6}
                  className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary mt-2"
                  data-testid="textarea-description"
                />
              </div>

              <div>
                <Label htmlFor="features" className="text-base font-medium mb-2">Key Features</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="List the main features you need..."
                  rows={6}
                  className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary mt-2"
                  data-testid="textarea-features"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => handleAIHelp('Features')}
                  data-testid="button-ai-help-features"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Feature Suggestions
                </Button>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1" data-testid="button-back-step">
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(3)} className="flex-1" data-testid="button-next-step-2">
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="targetAudience" className="text-base font-medium mb-2">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="Who will use this app?"
                  rows={4}
                  className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary mt-2"
                  data-testid="textarea-target-audience"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => handleAIHelp('Target Audience')}
                  data-testid="button-ai-help-audience"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Help Define My Audience
                </Button>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1" data-testid="button-back-step-2">
                  Back
                </Button>
                <Button type="submit" className="flex-1" data-testid="button-submit-app">
                  Generate App Plan
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
          <h3 className="text-xl font-bold mb-4">AI Assistant</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Our AI will help you refine your requirements and suggest the best architecture for your application.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5" />
              <span className="text-muted-foreground">Smart requirement gathering</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5" />
              <span className="text-muted-foreground">Technology recommendations</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5" />
              <span className="text-muted-foreground">Feature suggestions</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5" />
              <span className="text-muted-foreground">Cost estimation</span>
            </div>
          </div>
        </div>
      </div>

      <AIModal
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal({ ...aiModal, isOpen: false })}
        title={aiModal.title}
        content={aiModal.content}
        isLoading={aiModal.isLoading}
      />
    </div>
  );
}
