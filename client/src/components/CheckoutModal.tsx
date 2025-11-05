import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Template } from "@shared/schema";

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY");
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  template: Template;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({ template, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/account`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsProcessing(false);
      } else {
        // Payment succeeded
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase! You can now download the template.",
        });
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold">{template.title}</h4>
            <p className="text-sm text-muted-foreground">{template.category}</p>
          </div>
          <span className="text-2xl font-bold">${template.price}</span>
        </div>
      </div>

      <PaymentElement />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
          data-testid="button-cancel-payment"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="flex-1"
          data-testid="button-confirm-payment"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${template.price}`
          )}
        </Button>
      </div>
    </form>
  );
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  onSuccess: () => void;
}

export default function CheckoutModal({ isOpen, onClose, template, onSuccess }: CheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && template) {
      setIsLoading(true);
      // Create PaymentIntent when modal opens
      apiRequest("POST", "/api/payments/create-intent", { templateId: template.id })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to initialize payment",
            variant: "destructive",
          });
          onClose();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, template, onClose, toast]);

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Enter your payment details to purchase this template
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
              template={template} 
              onSuccess={() => {
                setClientSecret("");
                onSuccess();
                onClose();
              }}
              onCancel={onClose}
            />
          </Elements>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Initializing payment...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}