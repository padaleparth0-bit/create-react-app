import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Award, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const DailyInsights = ({ summary, savings, streak = 0 }) => {
  const savingsRate = summary.total_income > 0 
    ? ((summary.balance / summary.total_income) * 100).toFixed(1)
    : 0;
  
  const totalSavingsProgress = savings.reduce((acc, s) => {
    return acc + ((s.current_amount / s.target_amount) * 100);
  }, 0) / (savings.length || 1);

  return (
    <div className="insights-container">
      <Card className="insight-card streak-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            <Flame className="h-5 w-5" style={{color: '#ff6b35'}} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold" style={{color: '#ff6b35'}} data-testid="streak-count">
            {streak} days 🔥
          </div>
          <p className="text-xs text-gray-500 mt-1">Keep tracking daily!</p>
        </CardContent>
      </Card>

      <Card className="insight-card savings-rate-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <Target className="h-5 w-5" style={{color: '#10b981'}} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold" style={{color: '#10b981'}} data-testid="savings-rate">
            {savingsRate}%
          </div>
          <Progress value={parseFloat(savingsRate)} className="mt-2" />
          <p className="text-xs text-gray-500 mt-1">
            {savingsRate > 20 ? '🎉 Excellent!' : savingsRate > 10 ? '👍 Good job!' : '💪 Keep going!'}
          </p>
        </CardContent>
      </Card>

      <Card className="insight-card goals-progress-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
            <Award className="h-5 w-5" style={{color: '#f59e0b'}} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold" style={{color: '#f59e0b'}} data-testid="goals-progress">
            {totalSavingsProgress.toFixed(0)}%
          </div>
          <Progress value={totalSavingsProgress} className="mt-2" />
          <p className="text-xs text-gray-500 mt-1">
            {savings.length} active {savings.length === 1 ? 'goal' : 'goals'}
          </p>
        </CardContent>
      </Card>

      <Card className="insight-card spending-insight-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            {summary.balance >= 0 ? 
              <TrendingUp className="h-5 w-5" style={{color: '#10b981'}} /> :
              <TrendingDown className="h-5 w-5" style={{color: '#ef4444'}} />
            }
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold" style={{color: summary.balance >= 0 ? '#10b981' : '#ef4444'}} data-testid="month-balance">
            ${Math.abs(summary.balance).toFixed(0)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {summary.balance >= 0 ? '💰 Surplus' : '⚠️ Deficit'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};