import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Receipt, Target, Zap } from "lucide-react";

export const QuickActions = ({ onAction }) => {
  const quickActions = [
    {
      id: 'add-income',
      title: 'Add Income',
      icon: DollarSign,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      id: 'add-expense',
      title: 'Add Expense',
      icon: ShoppingBag,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      id: 'pay-bill',
      title: 'Pay Bill',
      icon: Receipt,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      id: 'set-goal',
      title: 'Set Goal',
      icon: Target,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ];

  return (
    <div className="quick-actions-container">
      <div className="quick-actions-header">
        <Zap className="h-5 w-5" style={{color: '#fbbf24'}} />
        <h3>Quick Actions</h3>
      </div>
      <div className="quick-actions-grid">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className="quick-action-btn"
              style={{
                borderColor: action.color,
                backgroundColor: action.bgColor
              }}
              onClick={() => onAction(action.id)}
              data-testid={`quick-action-${action.id}`}
            >
              <Icon className="h-6 w-6" style={{color: action.color}} />
              <span style={{color: action.color}}>{action.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};