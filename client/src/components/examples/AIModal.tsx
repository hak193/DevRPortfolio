import { useState } from 'react';
import AIModal from '../AIModal';
import { Button } from '@/components/ui/button';

export default function AIModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="p-8">
      <Button onClick={handleOpen} data-testid="button-open-modal">
        Open AI Modal
      </Button>
      
      <AIModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="AI Suggestions"
        content="Based on your requirements, I recommend starting with a React-based architecture using TypeScript for type safety. The application should use a component-based structure with state management via React Context or Zustand for simpler needs, or Redux Toolkit for more complex state requirements.

Key considerations:
• Use Tailwind CSS for styling consistency
• Implement authentication with JWT tokens
• Structure the API with RESTful endpoints
• Deploy on Vercel for optimal performance"
        isLoading={isLoading}
      />
    </div>
  );
}
