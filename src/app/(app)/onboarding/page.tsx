'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to signup - onboarding flow is now handled there
    router.replace('/signup');
  }, [router]);

  return null;
}
