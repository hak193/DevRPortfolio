import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, StopCircle, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ScreenShare() {
  const [isSharing, setIsSharing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startScreenShare = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      setStream(mediaStream);
      setIsSharing(true);

      mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });

      toast({
        title: 'Screen sharing started',
        description: 'Your screen is now being shared',
      });
    } catch (error) {
      console.error('Error starting screen share:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast({
            title: 'Permission denied',
            description: 'You need to grant permission to share your screen',
            variant: 'destructive',
          });
        } else if (error.name === 'NotFoundError') {
          toast({
            title: 'No screen available',
            description: 'No screen or window was selected for sharing',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Screen share failed',
            description: error.message || 'Unable to start screen sharing',
            variant: 'destructive',
          });
        }
      }
    }
  };

  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsSharing(false);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    toast({
      title: 'Screen sharing stopped',
      description: 'Your screen is no longer being shared',
    });
  };

  return (
    <div className="flex flex-col h-[600px]" data-testid="screen-share">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          <span className="font-medium">Screen Share</span>
        </div>
        {isSharing ? (
          <Button
            onClick={stopScreenShare}
            variant="destructive"
            size="sm"
            data-testid="button-stop-share"
          >
            <StopCircle className="mr-2 h-4 w-4" />
            Stop Sharing
          </Button>
        ) : (
          <Button
            onClick={startScreenShare}
            size="sm"
            data-testid="button-start-share"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Start Screen Share
          </Button>
        )}
      </div>

      <div className="flex-1 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
        {isSharing && stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
            data-testid="video-screen-share"
          />
        ) : (
          <div className="text-center text-muted-foreground" data-testid="text-no-share">
            <Share2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No screen sharing active</p>
            <p className="text-sm">Click "Start Screen Share" to share your screen</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground" data-testid="text-screen-share-info">
        <p>Screen sharing allows you to share your entire screen, a specific window, or a browser tab.</p>
        <p className="mt-1">Note: This is a local preview. For sharing with others, additional peer-to-peer setup is required.</p>
      </div>
    </div>
  );
}
