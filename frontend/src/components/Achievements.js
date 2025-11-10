import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, Trophy, Zap } from "lucide-react";

export const Achievements = ({ summary, income, expenses, bills, savings, streak }) => {
  const achievements = [];

  // First Income
  if (income.length >= 1) {
    achievements.push({
      id: 'first-income',
      title: 'First Income',
      description: 'Added your first income',
      icon: '💵',
      color: '#10b981',
      unlocked: true
    });
  }

  // First Expense
  if (expenses.length >= 1) {
    achievements.push({
      id: 'expense-tracker',
      title: 'Expense Tracker',
      description: 'Started tracking expenses',
      icon: '📊',
      color: '#ef4444',
      unlocked: true
    });
  }

  // Bill Payer
  if (bills.some(b => b.status === 'paid')) {
    achievements.push({
      id: 'bill-payer',
      title: 'Bill Payer',
      description: 'Paid your first bill',
      icon: '💳',
      color: '#3b82f6',
      unlocked: true
    });
  }

  // Goal Setter
  if (savings.length >= 1) {
    achievements.push({
      id: 'goal-setter',
      title: 'Goal Setter',
      description: 'Created a savings goal',
      icon: '🎯',
      color: '#f59e0b',
      unlocked: true
    });
  }

  // Streak Master
  if (streak >= 7) {
    achievements.push({
      id: 'week-streak',
      title: 'Week Warrior',
      description: '7 day streak',
      icon: '🔥',
      color: '#ff6b35',
      unlocked: true
    });
  }

  if (streak >= 30) {
    achievements.push({
      id: 'month-streak',
      title: 'Monthly Master',
      description: '30 day streak',
      icon: '🏆',
      color: '#fbbf24',
      unlocked: true
    });
  }

  // Saver
  if (summary.balance > 1000) {
    achievements.push({
      id: 'saver-1k',
      title: 'Saver',
      description: 'Saved $1,000',
      icon: '💰',
      color: '#10b981',
      unlocked: true
    });
  }

  // Big Saver
  if (summary.balance > 10000) {
    achievements.push({
      id: 'big-saver',
      title: 'Big Saver',
      description: 'Saved $10,000',
      icon: '💎',
      color: '#8b5cf6',
      unlocked: true
    });
  }

  // Goal Achiever
  if (savings.some(s => (s.current_amount / s.target_amount) >= 1)) {
    achievements.push({
      id: 'goal-achiever',
      title: 'Goal Achiever',
      description: 'Completed a savings goal',
      icon: '🌟',
      color: '#fbbf24',
      unlocked: true
    });
  }

  return (
    <Card className="achievements-section">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5" style={{color: '#fbbf24'}} />
          <CardTitle>Achievements</CardTitle>
          <span className="achievement-count" data-testid="achievement-count">{achievements.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="achievements-grid">
          {achievements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Start tracking to unlock achievements! 🎯</p>
          ) : (
            achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="achievement-badge"
                style={{borderColor: achievement.color}}
                data-testid={`achievement-${achievement.id}`}
              >
                <div className="achievement-icon" style={{backgroundColor: `${achievement.color}20`}}>
                  <span style={{fontSize: '2rem'}}>{achievement.icon}</span>
                </div>
                <div className="achievement-info">
                  <h4 style={{color: achievement.color}}>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};