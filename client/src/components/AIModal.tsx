import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  isLoading?: boolean;
}

export default function AIModal({ isOpen, onClose, title, content, isLoading = false }: AIModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 animate-in fade-in duration-200" data-testid="modal-ai">
      <div className="relative w-full max-w-2xl bg-card rounded-xl p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover-elevate rounded-md"
          aria-label="Close"
          data-testid="button-modal-close"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6" data-testid="text-modal-title">
          {title}
        </h2>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Generating...</p>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none" data-testid="text-modal-content">
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {content}
            </p>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} data-testid="button-modal-done">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
