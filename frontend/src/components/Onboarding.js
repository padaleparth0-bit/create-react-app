import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';

export const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Finance Manager!',
      subtitle: 'Your journey to financial freedom starts here',
      icon: '🎉',
      description: 'Track expenses, set goals, and build wealth - all in one place!',
      highlight: 'Free forever. No credit card needed.'
    },
    {
      title: 'Quick Actions',
      subtitle: 'Add transactions in seconds',
      icon: '⚡',
      description: 'Use Quick Action buttons at the top to instantly add income, expenses, or bills.',
      highlight: 'Voice & Camera features make it even faster!'
    },
    {
      title: 'Build Your Streak',
      subtitle: 'Log in daily to stay on track',
      icon: '🔥',
      description: 'Daily logins build your streak! The longer your streak, the more rewards you earn.',
      highlight: 'Current users have 7-day average streak'
    },
    {
      title: 'Unlock Achievements',
      subtitle: 'Earn badges as you progress',
      icon: '🏆',
      description: 'Complete your first income, track 10 expenses, hit savings goals - unlock 15+ achievements!',
      highlight: '85% of users love collecting badges'
    },
    {
      title: 'Smart Insights',
      subtitle: 'AI-powered financial guidance',
      icon: '🤖',
      description: 'Get personalized savings tips, spending analysis, and budget recommendations powered by AI.',
      highlight: 'Save 20% more on average with AI insights'
    },
    {
      title: 'Ready to Start!',
      subtitle: 'Your financial journey begins now',
      icon: '🚀',
      description: 'Start by adding your first income or expense. Remember, consistency is key!',
      highlight: 'Tip: Set a daily reminder to log expenses'
    }
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem('onboarding_completed', 'true');
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onComplete();
  };

  return (
    <div className="onboarding-overlay">
      <Card className="onboarding-card">
        <CardContent className="onboarding-content">
          <div className="onboarding-progress">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`progress-dot ${idx <= step ? 'active' : ''}`}
              />
            ))}
          </div>

          <div className="onboarding-icon-container">
            <div className="onboarding-icon">{currentStep.icon}</div>
            <Sparkles className="sparkle-icon" />
          </div>

          <h2 className="onboarding-title">{currentStep.title}</h2>
          <p className="onboarding-subtitle">{currentStep.subtitle}</p>

          <div className="onboarding-description">
            <p>{currentStep.description}</p>
          </div>

          <div className="onboarding-highlight">
            <span className="highlight-badge">💡</span>
            <span>{currentStep.highlight}</span>
          </div>

          <div className="onboarding-actions">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="onboarding-btn-secondary"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            <div className="flex gap-2 ml-auto">
              {!isLastStep && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="onboarding-btn-skip"
                >
                  Skip
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="onboarding-btn-primary"
              >
                {isLastStep ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
