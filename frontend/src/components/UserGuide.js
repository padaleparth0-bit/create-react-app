import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Zap, TrendingUp, Award, Target, Calendar, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const UserGuide = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="help-btn"
          data-testid="help-button"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto guide-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome to Your Finance Manager! 🎯</DialogTitle>
          <DialogDescription>
            Learn how to make the most of your financial journey
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="gamification">Achievements</TabsTrigger>
            <TabsTrigger value="tips">Pro Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-4 mt-4">
            <div className="guide-section">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Zap className="h-5 w-5 text-yellow-500" />
                Quick Start Guide
              </h3>
              
              <div className="space-y-3">
                <div className="guide-step">
                  <div className="step-number">1</div>
                  <div>
                    <h4 className="font-semibold">Use Quick Actions</h4>
                    <p className="text-sm text-gray-600">Click the colorful buttons at the top to quickly navigate to any section. No scrolling needed!</p>
                  </div>
                </div>

                <div className="guide-step">
                  <div className="step-number">2</div>
                  <div>
                    <h4 className="font-semibold">Track Your Income</h4>
                    <p className="text-sm text-gray-600">Add your salary, freelance work, or any money coming in. This helps you see your total earning power!</p>
                  </div>
                </div>

                <div className="guide-step">
                  <div className="step-number">3</div>
                  <div>
                    <h4 className="font-semibold">Log Your Expenses</h4>
                    <p className="text-sm text-gray-600">Track where your money goes. Choose categories like Food, Transport, Entertainment to see spending patterns.</p>
                  </div>
                </div>

                <div className="guide-step">
                  <div className="step-number">4</div>
                  <div>
                    <h4 className="font-semibold">Manage Bills</h4>
                    <p className="text-sm text-gray-600">Never forget a bill! Add due dates and mark them as paid. Your monthly bills are automatically calculated.</p>
                  </div>
                </div>

                <div className="guide-step">
                  <div className="step-number">5</div>
                  <div>
                    <h4 className="font-semibold">Set Savings Goals</h4>
                    <p className="text-sm text-gray-600">Dream vacation? New phone? Create goals with target amounts and watch your progress grow!</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4 mt-4">
            <div className="guide-section">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Key Features
              </h3>

              <div className="features-grid">
                <div className="feature-card">
                  <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                  <h4 className="font-semibold">Smart Insights</h4>
                  <p className="text-sm text-gray-600">See your savings rate, monthly balance, and financial health at a glance.</p>
                </div>

                <div className="feature-card">
                  <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                  <h4 className="font-semibold">Month/Year Filter</h4>
                  <p className="text-sm text-gray-600">View your finances by any month and year to track your progress over time.</p>
                </div>

                <div className="feature-card">
                  <Target className="h-8 w-8 text-orange-500 mb-2" />
                  <h4 className="font-semibold">Goal Tracking</h4>
                  <p className="text-sm text-gray-600">Visual progress bars show how close you are to achieving your savings goals.</p>
                </div>

                <div className="feature-card">
                  <Award className="h-8 w-8 text-purple-500 mb-2" />
                  <h4 className="font-semibold">Secure & Private</h4>
                  <p className="text-sm text-gray-600">Your data is encrypted and only you can see it. Each user has their own secure account.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gamification" className="space-y-4 mt-4">
            <div className="guide-section">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Award className="h-5 w-5 text-yellow-500" />
                Achievements & Rewards
              </h3>

              <div className="achievement-info-card">
                <h4 className="font-semibold text-red-500 mb-2">🔥 Daily Streak</h4>
                <p className="text-sm text-gray-600">Log in every day to build your streak! The longer your streak, the better your financial habits become.</p>
              </div>

              <div className="achievement-info-card">
                <h4 className="font-semibold text-green-500 mb-2">📊 Savings Rate</h4>
                <p className="text-sm text-gray-600">Shows what percentage of your income you're saving. Aim for 20%+ to be on track for financial freedom!</p>
              </div>

              <div className="achievement-info-card">
                <h4 className="font-semibold text-orange-500 mb-2">🎯 Goals Progress</h4>
                <p className="text-sm text-gray-600">Average progress across all your savings goals. Complete goals to unlock special achievements!</p>
              </div>

              <h4 className="font-semibold mt-4 mb-2">Unlockable Badges:</h4>
              <div className="badges-list">
                <div className="badge-item">💵 <strong>First Income</strong> - Add your first income</div>
                <div className="badge-item">📊 <strong>Expense Tracker</strong> - Log your first expense</div>
                <div className="badge-item">💳 <strong>Bill Payer</strong> - Pay your first bill</div>
                <div className="badge-item">🎯 <strong>Goal Setter</strong> - Create a savings goal</div>
                <div className="badge-item">🔥 <strong>Week Warrior</strong> - 7-day login streak</div>
                <div className="badge-item">🏆 <strong>Monthly Master</strong> - 30-day login streak</div>
                <div className="badge-item">💰 <strong>Saver</strong> - Save $1,000</div>
                <div className="badge-item">💎 <strong>Big Saver</strong> - Save $10,000</div>
                <div className="badge-item">⭐ <strong>Goal Achiever</strong> - Complete a savings goal</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4 mt-4">
            <div className="guide-section">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Zap className="h-5 w-5 text-blue-500" />
                Pro Tips for Success
              </h3>

              <div className="tips-list">
                <div className="tip-item">
                  <span className="tip-icon">💡</span>
                  <div>
                    <h4 className="font-semibold">Track Everything</h4>
                    <p className="text-sm text-gray-600">The more you track, the better insights you get. Even small expenses add up!</p>
                  </div>
                </div>

                <div className="tip-item">
                  <span className="tip-icon">📅</span>
                  <div>
                    <h4 className="font-semibold">Daily Habit</h4>
                    <p className="text-sm text-gray-600">Spend 2 minutes every evening logging your expenses. It becomes automatic!</p>
                  </div>
                </div>

                <div className="tip-item">
                  <span className="tip-icon">🎯</span>
                  <div>
                    <h4 className="font-semibold">Start Small Goals</h4>
                    <p className="text-sm text-gray-600">Begin with achievable goals ($100-$500). Success builds momentum!</p>
                  </div>
                </div>

                <div className="tip-item">
                  <span className="tip-icon">📊</span>
                  <div>
                    <h4 className="font-semibold">Review Monthly</h4>
                    <p className="text-sm text-gray-600">Use month filter to compare spending patterns and adjust your budget.</p>
                  </div>
                </div>

                <div className="tip-item">
                  <span className="tip-icon">🔥</span>
                  <div>
                    <h4 className="font-semibold">Protect Your Streak</h4>
                    <p className="text-sm text-gray-600">Set a daily reminder to log in. Streaks create powerful financial habits!</p>
                  </div>
                </div>

                <div className="tip-item">
                  <span className="tip-icon">💰</span>
                  <div>
                    <h4 className="font-semibold">Pay Yourself First</h4>
                    <p className="text-sm text-gray-600">When income comes in, immediately set aside savings before spending.</p>
                  </div>
                </div>
              </div>

              <div className="success-formula">
                <h4 className="font-semibold text-center mb-3">Success Formula:</h4>
                <div className="formula-box">
                  <p className="text-center text-lg font-semibold">
                    Track Daily + Set Goals + Build Streak = Financial Freedom 🚀
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="guide-footer">
          <p className="text-center text-sm text-gray-600">
            Need more help? Your financial journey starts with one small step today! 💪
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};