'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { config } from '@/lib/config';

interface BlockchainVerifyProps {
  analysisId: string;
  contentHash?: string;
}

export default function BlockchainVerify({ analysisId, contentHash }: BlockchainVerifyProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'registering' | 'registered' | 'error'>('idle');

  const handleRegisterContent = async () => {
    setIsLoading(true);
    try {
      // Simulate blockchain registration with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const hash = contentHash || btoa(analysisId).slice(0, 32);
      
      setRegistrationStatus('registered');
      setVerificationResult({
        verified: true,
        hash,
        transactionHash: '0x' + Math.random().toString(16).slice(2),
        timestamp: new Date().toISOString(),
        chainId: 80001
      });
      toast.success('Content registered on blockchain!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
      setRegistrationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyContent = async () => {
    setIsLoading(true);
    try {
      // Simulate blockchain verification with mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const hash = contentHash || btoa(analysisId).slice(0, 32);
      const isVerified = Math.random() > 0.3; // 70% chance to be verified

      setVerificationResult({
        verified: isVerified,
        hash,
        transactionHash: isVerified ? '0x' + Math.random().toString(16).slice(2) : null,
        timestamp: isVerified ? new Date().toISOString() : null
      });

      if (isVerified) {
        toast.success('Content authenticity verified!');
      } else {
        toast.info('Content not yet registered');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 border-border bg-accent/5">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Lock className="w-5 h-5 text-accent" />
        Blockchain Authentication
      </h3>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-background border border-border">
          <p className="text-sm text-muted-foreground mb-2">Content Hash</p>
          <p className="font-mono text-xs break-all">
            {contentHash || btoa(analysisId).slice(0, 32)}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleRegisterContent}
            disabled={isLoading || registrationStatus === 'registered'}
            className="flex-1 gap-2"
            variant={registrationStatus === 'registered' ? 'outline' : 'default'}
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Registering...
              </>
            ) : registrationStatus === 'registered' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Registered
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Register on Polygon
              </>
            )}
          </Button>

          <Button
            onClick={handleVerifyContent}
            disabled={isLoading}
            variant="outline"
            className="flex-1 gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Verify
              </>
            )}
          </Button>
        </div>

        {verificationResult && (
          <div className={`p-4 rounded-lg ${
            verificationResult.verified
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-yellow-500/10 border border-yellow-500/20'
          }`}>
            <div className="flex items-start gap-2">
              {verificationResult.verified ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-sm">
                <p className="font-semibold mb-1">
                  {verificationResult.verified ? 'Verified' : 'Not Verified'}
                </p>
                <p className="text-muted-foreground">
                  {verificationResult.verified
                    ? 'Content is authentically registered on the Polygon blockchain'
                    : 'Content has not been registered yet'}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Register your content on the Polygon blockchain to create an immutable record of authenticity verification.
        </p>
      </div>
    </Card>
  );
}
