'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'need-login'>('loading');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      // Extract token and id from URL params
      const tokenParam = searchParams.get('token');
      const idParam = searchParams.get('id');

      if (!tokenParam) {
        setStatus('error');
        setMessage('Invalid verification link. Token is missing.');
        return;
      }

      setToken(tokenParam);

      // Wait for auth to load
      if (authLoading) {
        return;
      }

      // If user is not logged in, prompt them to log in
      if (!isAuthenticated) {
        setStatus('need-login');
        setMessage('Please log in to verify your email address.');
        return;
      }

      // User is logged in, proceed with verification
      try {
        const response = await api.auth.verifyEmailWithToken(tokenParam);

        if (response.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          
          // Redirect to home page after 3 seconds
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(response.error?.message || 'Email verification failed. The link may be invalid or expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Email verification failed. The link may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [searchParams, isAuthenticated, authLoading, router]);

  const handleLoginRedirect = () => {
    // Store the verification URL to redirect back after login
    const currentUrl = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectAfterLogin', currentUrl);
    router.push('/');
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            {status === 'loading' && (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
            {status === 'need-login' && (
              <Mail className="h-12 w-12 text-blue-500" />
            )}
          </div>
          
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
            {status === 'need-login' && 'Login Required'}
          </CardTitle>
          
          <CardDescription className="text-base mt-2">
            {message}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          {status === 'loading' && (
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You will be redirected to the home page in a few seconds.
              </p>
              <Button onClick={() => router.push('/')} className="w-full">
                Go to Home Page
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The verification link may be invalid or has expired. 
                You can request a new verification email from your account settings.
              </p>
              <Button onClick={() => router.push('/')} variant="outline" className="w-full">
                Go to Home Page
              </Button>
            </div>
          )}

          {status === 'need-login' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To verify your email address, you need to log in to your account first.
              </p>
              <Button onClick={handleLoginRedirect} className="w-full">
                Log In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex items-center justify-center min-h-[80vh] p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
