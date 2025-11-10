import { useState, useEffect, useRef } from "react";
import "@/App.css";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, TrendingUp, TrendingDown, DollarSign, PiggyBank, Receipt, LogOut, User } from "lucide-react";
import { DailyInsights } from "@/components/DailyInsights";
import { Achievements } from "@/components/Achievements";
import { QuickActions } from "@/components/QuickActions";
import { Logo } from "@/components/Logo";
import { UserGuide } from "@/components/UserGuide";
import { CameraCapture } from "@/components/CameraCapture";
import { VoiceAssistant } from "@/components/VoiceAssistant";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Utilities', 'Other'];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', email: '', password: '' });

  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [bills, setBills] = useState([]);
  const [savings, setSavings] = useState([]);
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    total_bills: 0,
    total_savings: 0,
    balance: 0
  });

  const [incomeForm, setIncomeForm] = useState({ source: '', amount: '', date: '' });
  const [expenseForm, setExpenseForm] = useState({ category: '', amount: '', description: '', date: '' });
  const [billForm, setBillForm] = useState({ name: '', amount: '', due_date: '', status: 'pending' });
  const [savingForm, setSavingForm] = useState({ goal: '', target_amount: '', current_amount: '' });
  const [streak, setStreak] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  // Refs for scrolling
  const incomeRef = useRef(null);
  const expenseRef = useRef(null);
  const billRef = useRef(null);
  const savingRef = useRef(null);

  useEffect(() => {
    if (token) {
      checkAuth();
      calculateStreak();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      updateDailyLogin();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, selectedMonth, selectedYear]);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/auth/login`, loginForm);
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(user);
      setIsAuthenticated(true);
      const hour = new Date().getHours();
      let greeting = 'Good evening';
      if (hour < 12) greeting = 'Good morning';
      else if (hour < 18) greeting = 'Good afternoon';
      toast.success(`${greeting}, ${user.username}! Ready to manage your finances?`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/auth/register`, signupForm);
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(user);
      setIsAuthenticated(true);
      toast.success(`Account created! Welcome, ${user.username}! 🎊`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const calculateStreak = () => {
    const lastLogin = localStorage.getItem('lastLogin');
    const today = new Date().toDateString();
    
    if (!lastLogin) {
      setStreak(1);
    } else {
      const lastDate = new Date(lastLogin);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        const currentStreak = parseInt(localStorage.getItem('streak') || '0') + 1;
        setStreak(currentStreak);
        localStorage.setItem('streak', currentStreak.toString());
      } else if (diffDays === 0) {
        setStreak(parseInt(localStorage.getItem('streak') || '1'));
      } else {
        setStreak(1);
        localStorage.setItem('streak', '1');
      }
    }
  };

  const updateDailyLogin = () => {
    const today = new Date().toDateString();
    localStorage.setItem('lastLogin', today);
  };

  const handleQuickAction = (actionId) => {
    switch(actionId) {
      case 'add-income':
        incomeRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'add-expense':
        expenseRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'pay-bill':
        billRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'set-goal':
        savingRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const handleCameraCapture = (data) => {
    // Auto-fill bill form with scanned data
    setBillForm({
      name: data.billName || '',
      amount: data.amount || '',
      due_date: data.date || '',
      status: 'pending'
    });
    billRef.current?.scrollIntoView({ behavior: 'smooth' });
    toast.success('Bill data filled! Review and save.');
  };

  const handleVoiceCommand = async (data) => {
    if (data.type === 'income') {
      setIncomeForm({
        source: data.description,
        amount: data.amount,
        date: data.date
      });
      incomeRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (data.type === 'bill') {
      setBillForm({
        name: data.description,
        amount: data.amount,
        due_date: data.date,
        status: 'pending'
      });
      billRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setExpenseForm({
        category: data.category,
        amount: data.amount,
        description: data.description,
        date: data.date
      });
      expenseRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    toast.success('Voice data filled! Review and save.');
  };

  const fetchAllData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const params = { month: selectedMonth, year: selectedYear };
      
      const [incomeRes, expensesRes, billsRes, savingsRes, summaryRes] = await Promise.all([
        axios.get(`${API}/income`, { headers, params }),
        axios.get(`${API}/expenses`, { headers, params }),
        axios.get(`${API}/bills`, { headers, params }),
        axios.get(`${API}/savings`, { headers, params }),
        axios.get(`${API}/summary`, { headers, params })
      ]);
      
      setIncome(incomeRes.data);
      setExpenses(expensesRes.data);
      setBills(billsRes.data);
      setSavings(savingsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const addIncome = async () => {
    if (!incomeForm.source || !incomeForm.amount || !incomeForm.date) {
      toast.error('Please fill all income fields');
      return;
    }
    try {
      await axios.post(`${API}/income`, {
        ...incomeForm,
        amount: parseFloat(incomeForm.amount),
        month: selectedMonth,
        year: selectedYear
      }, { headers: { Authorization: `Bearer ${token}` } });
      setIncomeForm({ source: '', amount: '', date: '' });
      fetchAllData();
      const motivationalMessages = [
        'Great! Keep building that wealth!',
        'Income added! You are on fire!',
        'Money coming in! Keep it up!',
        'Another income stream tracked!',
        'Awesome! Your finances are growing!'
      ];
      toast.success(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
    } catch (error) {
      toast.error('Failed to add income');
    }
  };

  const addExpense = async () => {
    if (!expenseForm.category || !expenseForm.amount || !expenseForm.description || !expenseForm.date) {
      toast.error('Please fill all expense fields');
      return;
    }
    try {
      await axios.post(`${API}/expenses`, {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        month: selectedMonth,
        year: selectedYear
      }, { headers: { Authorization: `Bearer ${token}` } });
      setExpenseForm({ category: '', amount: '', description: '', date: '' });
      fetchAllData();
      const trackingMessages = [
        'Tracked! Awareness is the first step!',
        'Good job tracking your spending!',
        'You are managing your money like a pro!',
        'Expense logged! Stay in control!',
        'Tracked! Knowledge is power!'
      ];
      toast.success(trackingMessages[Math.floor(Math.random() * trackingMessages.length)]);
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const addBill = async () => {
    if (!billForm.name || !billForm.amount || !billForm.due_date) {
      toast.error('Please fill all bill fields');
      return;
    }
    try {
      await axios.post(`${API}/bills`, {
        ...billForm,
        amount: parseFloat(billForm.amount),
        month: selectedMonth,
        year: selectedYear
      }, { headers: { Authorization: `Bearer ${token}` } });
      setBillForm({ name: '', amount: '', due_date: '', status: 'pending' });
      fetchAllData();
      toast.success('🧾 Bill added successfully!');
    } catch (error) {
      toast.error('Failed to add bill');
    }
  };

  const addSaving = async () => {
    if (!savingForm.goal || !savingForm.target_amount || !savingForm.current_amount) {
      toast.error('Please fill all saving fields');
      return;
    }
    try {
      await axios.post(`${API}/savings`, {
        ...savingForm,
        target_amount: parseFloat(savingForm.target_amount),
        current_amount: parseFloat(savingForm.current_amount),
        month: selectedMonth,
        year: selectedYear
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSavingForm({ goal: '', target_amount: '', current_amount: '' });
      fetchAllData();
      const goalMessages = [
        'Goal set! Dream big, save bigger!',
        'Awesome goal! You got this!',
        'Great goal! Your future self will thank you!',
        'Goal created! Success is within reach!',
        'Amazing! Lets crush this goal together!'
      ];
      toast.success(goalMessages[Math.floor(Math.random() * goalMessages.length)]);
    } catch (error) {
      toast.error('Failed to add saving goal');
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${API}/income/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAllData();
      toast.success('Income deleted');
    } catch (error) {
      toast.error('Failed to delete income');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API}/expenses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAllData();
      toast.success('Expense deleted');
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const deleteBill = async (id) => {
    try {
      await axios.delete(`${API}/bills/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAllData();
      toast.success('Bill deleted');
    } catch (error) {
      toast.error('Failed to delete bill');
    }
  };

  const deleteSaving = async (id) => {
    try {
      await axios.delete(`${API}/savings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAllData();
      toast.success('Saving goal deleted');
    } catch (error) {
      toast.error('Failed to delete saving goal');
    }
  };

  const toggleBillStatus = async (bill) => {
    try {
      const newStatus = bill.status === 'paid' ? 'pending' : 'paid';
      await axios.patch(`${API}/bills/${bill.id}/status?status=${newStatus}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchAllData();
      toast.success(`Bill marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update bill status');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-backdrop"></div>
        <div className="auth-card-wrapper">
          <Card className="auth-card">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4" data-testid="auth-logo">
                <Logo size="large" />
              </div>
              <CardTitle className="auth-title" data-testid="auth-title">Personal Finance Manager</CardTitle>
              <CardDescription data-testid="auth-description">
                {showLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showLogin ? (
                <form onSubmit={handleLogin} className="auth-form">
                  <div className="form-field">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      data-testid="login-email-input"
                    />
                  </div>
                  <div className="form-field">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      data-testid="login-password-input"
                    />
                  </div>
                  <Button type="submit" className="auth-button" data-testid="login-submit-btn">
                    Sign In
                  </Button>
                  <p className="auth-switch">
                    Don't have an account?{' '}
                    <span onClick={() => setShowLogin(false)} data-testid="switch-to-signup">Sign Up</span>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="auth-form">
                  <div className="form-field">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="johndoe"
                      value={signupForm.username}
                      onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                      required
                      data-testid="signup-username-input"
                    />
                  </div>
                  <div className="form-field">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                      data-testid="signup-email-input"
                    />
                  </div>
                  <div className="form-field">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                      data-testid="signup-password-input"
                    />
                  </div>
                  <Button type="submit" className="auth-button" data-testid="signup-submit-btn">
                    Create Account
                  </Button>
                  <p className="auth-switch">
                    Already have an account?{' '}
                    <span onClick={() => setShowLogin(true)} data-testid="switch-to-login">Sign In</span>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
          <div className="auth-footer">
            <p className="auth-copyright">© 2025 Personal Finance Manager</p>
            <p className="auth-creator">
              Created by <strong>Prathamesh Ravindra Padale</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-content">
          <div>
            <h1 data-testid="app-title">Personal Finance Manager</h1>
            <p data-testid="app-subtitle">Track your income, expenses, bills and savings all in one place</p>
          </div>
          <div className="user-section">
            <UserGuide />
            <Button \n              variant="outline" \n              size="sm" \n              onClick={() => setShowCamera(true)} \n              className="utility-btn camera-btn"\n              data-testid="camera-btn"\n            >\n              <Camera className="h-4 w-4 mr-2" />\n              Scan Bill\n            </Button>\n            <Button \n              variant="outline" \n              size="sm" \n              onClick={() => setShowVoice(true)} \n              className="utility-btn voice-btn"\n              data-testid="voice-btn"\n            >\n              <Mic className="h-4 w-4 mr-2" />\n              Voice\n            </Button>\n            <div className="user-info" data-testid="user-info">
              <User className="h-5 w-5" />
              <span>{user?.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="logout-btn" data-testid="logout-btn">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="controls">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]" data-testid="month-selector">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map(month => (
              <SelectItem key={month} value={month} data-testid={`month-${month}`}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(parseInt(val))}>
          <SelectTrigger className="w-[180px]" data-testid="year-selector">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {[2023, 2024, 2025, 2026].map(year => (
              <SelectItem key={year} value={String(year)} data-testid={`year-${year}`}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <QuickActions onAction={handleQuickAction} />

      <DailyInsights summary={summary} savings={savings} streak={streak} />

      <div className="summary-cards">
        <Card className="summary-card income-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4" style={{color: '#10b981'}} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#10b981'}} data-testid="total-income">
              ${summary.total_income.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="summary-card expense-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4" style={{color: '#ef4444'}} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#ef4444'}} data-testid="total-expenses">
              ${summary.total_expenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="summary-card bills-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Bills</CardTitle>
            <Receipt className="h-4 w-4" style={{color: '#3b82f6'}} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#3b82f6'}} data-testid="total-bills">
              ${summary.total_bills.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="summary-card balance-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Goals</CardTitle>
            <PiggyBank className="h-4 w-4" style={{color: '#f59e0b'}} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#f59e0b'}} data-testid="balance">
              ${summary.total_savings.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Achievements 
        summary={summary}
        income={income}
        expenses={expenses}
        bills={bills}
        savings={savings}
        streak={streak}
      />

      <div className="main-content">
        <Card className="section" ref={incomeRef}>
          <CardHeader>
            <CardTitle data-testid="income-section-title">Income Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="form-group">
              <Input
                type="text"
                placeholder="Income Source"
                value={incomeForm.source}
                onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                data-testid="income-source-input"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                data-testid="income-amount-input"
              />
              <Input
                type="date"
                value={incomeForm.date}
                onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                data-testid="income-date-input"
              />
              <Button onClick={addIncome} className="btn-add" data-testid="add-income-btn">
                Add Income
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {income.map((item) => (
                    <tr key={item.id} data-testid={`income-row-${item.id}`}>
                      <td>{item.source}</td>
                      <td>${item.amount.toFixed(2)}</td>
                      <td>{item.date}</td>
                      <td>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteIncome(item.id)}
                          data-testid={`delete-income-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" style={{color: '#ef4444'}} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="section" ref={expenseRef}>
          <CardHeader>
            <CardTitle data-testid="expenses-section-title">Expense Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="form-group">
              <Select value={expenseForm.category} onValueChange={(val) => setExpenseForm({ ...expenseForm, category: val })}>
                <SelectTrigger data-testid="expense-category-select">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat} data-testid={`category-${cat}`}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                data-testid="expense-amount-input"
              />
              <Input
                type="text"
                placeholder="Description"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                data-testid="expense-description-input"
              />
              <Input
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                data-testid="expense-date-input"
              />
              <Button onClick={addExpense} className="btn-add" data-testid="add-expense-btn">
                Add Expense
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((item) => (
                    <tr key={item.id} data-testid={`expense-row-${item.id}`}>
                      <td>{item.category}</td>
                      <td>{item.description}</td>
                      <td>${item.amount.toFixed(2)}</td>
                      <td>{item.date}</td>
                      <td>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExpense(item.id)}
                          data-testid={`delete-expense-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" style={{color: '#ef4444'}} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="section" ref={billRef}>
          <CardHeader>
            <CardTitle data-testid="bills-section-title">Bill Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="form-group">
              <Input
                type="text"
                placeholder="Bill Name"
                value={billForm.name}
                onChange={(e) => setBillForm({ ...billForm, name: e.target.value })}
                data-testid="bill-name-input"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={billForm.amount}
                onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                data-testid="bill-amount-input"
              />
              <Input
                type="date"
                placeholder="Due Date"
                value={billForm.due_date}
                onChange={(e) => setBillForm({ ...billForm, due_date: e.target.value })}
                data-testid="bill-due-date-input"
              />
              <Select value={billForm.status} onValueChange={(val) => setBillForm({ ...billForm, status: val })}>
                <SelectTrigger data-testid="bill-status-select">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending" data-testid="status-pending">Pending</SelectItem>
                  <SelectItem value="paid" data-testid="status-paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addBill} className="btn-add" data-testid="add-bill-btn">
                Add Bill
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bill Name</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((item) => (
                    <tr key={item.id} data-testid={`bill-row-${item.id}`}>
                      <td>{item.name}</td>
                      <td>${item.amount.toFixed(2)}</td>
                      <td>{item.due_date}</td>
                      <td>
                        <span
                          className="cursor-pointer font-semibold"
                          style={{color: item.status === 'paid' ? '#3b82f6' : '#f59e0b'}}
                          onClick={() => toggleBillStatus(item)}
                          data-testid={`bill-status-${item.id}`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteBill(item.id)}
                          data-testid={`delete-bill-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" style={{color: '#ef4444'}} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="section" ref={savingRef}>
          <CardHeader>
            <CardTitle data-testid="savings-section-title">Savings Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="form-group">
              <Input
                type="text"
                placeholder="Saving Goal"
                value={savingForm.goal}
                onChange={(e) => setSavingForm({ ...savingForm, goal: e.target.value })}
                data-testid="saving-goal-input"
              />
              <Input
                type="number"
                placeholder="Target Amount"
                value={savingForm.target_amount}
                onChange={(e) => setSavingForm({ ...savingForm, target_amount: e.target.value })}
                data-testid="saving-target-input"
              />
              <Input
                type="number"
                placeholder="Current Amount"
                value={savingForm.current_amount}
                onChange={(e) => setSavingForm({ ...savingForm, current_amount: e.target.value })}
                data-testid="saving-current-input"
              />
              <Button onClick={addSaving} className="btn-add" data-testid="add-saving-btn">
                Add Goal
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Goal</th>
                    <th>Target</th>
                    <th>Current</th>
                    <th>Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {savings.map((item) => {
                    const progress = (item.current_amount / item.target_amount) * 100;
                    return (
                      <tr key={item.id} data-testid={`saving-row-${item.id}`}>
                        <td>{item.goal}</td>
                        <td>${item.target_amount.toFixed(2)}</td>
                        <td>${item.current_amount.toFixed(2)}</td>
                        <td>
                          <span className="font-semibold" style={{color: progress >= 100 ? '#10b981' : '#f59e0b'}} data-testid={`saving-progress-${item.id}`}>
                            {progress.toFixed(0)}%
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSaving(item.id)}
                            data-testid={`delete-saving-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" style={{color: '#ef4444'}} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="footer">
        <div className="footer-content">
          <p className="footer-copyright">© 2025 Personal Finance Manager | All Rights Reserved</p>
          <p className="footer-creator">
            <span className="creator-badge">Made with ❤️ by</span>
            <strong className="creator-name">Prathamesh Ravindra Padale</strong>
          </p>
          <p className="footer-tech">Built with React & FastAPI</p>
        </div>
      </div>
    </div>
  );
}

export default App;