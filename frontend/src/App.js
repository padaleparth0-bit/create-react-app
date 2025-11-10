import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, TrendingUp, TrendingDown, DollarSign, PiggyBank, Receipt } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Utilities', 'Other'];

function App() {
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

  // Form states
  const [incomeForm, setIncomeForm] = useState({ source: '', amount: '', date: '' });
  const [expenseForm, setExpenseForm] = useState({ category: '', amount: '', description: '', date: '' });
  const [billForm, setBillForm] = useState({ name: '', amount: '', due_date: '', status: 'pending' });
  const [savingForm, setSavingForm] = useState({ goal: '', target_amount: '', current_amount: '' });

  useEffect(() => {
    fetchAllData();
  }, [selectedMonth, selectedYear]);

  const fetchAllData = async () => {
    try {
      const [incomeRes, expensesRes, billsRes, savingsRes, summaryRes] = await Promise.all([
        axios.get(`${API}/income`, { params: { month: selectedMonth, year: selectedYear } }),
        axios.get(`${API}/expenses`, { params: { month: selectedMonth, year: selectedYear } }),
        axios.get(`${API}/bills`, { params: { month: selectedMonth, year: selectedYear } }),
        axios.get(`${API}/savings`, { params: { month: selectedMonth, year: selectedYear } }),
        axios.get(`${API}/summary`, { params: { month: selectedMonth, year: selectedYear } })
      ]);
      setIncome(incomeRes.data);
      setExpenses(expensesRes.data);
      setBills(billsRes.data);
      setSavings(savingsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
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
      });
      setIncomeForm({ source: '', amount: '', date: '' });
      fetchAllData();
      toast.success('Income added successfully');
    } catch (error) {
      console.error('Error adding income:', error);
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
      });
      setExpenseForm({ category: '', amount: '', description: '', date: '' });
      fetchAllData();
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
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
      });
      setBillForm({ name: '', amount: '', due_date: '', status: 'pending' });
      fetchAllData();
      toast.success('Bill added successfully');
    } catch (error) {
      console.error('Error adding bill:', error);
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
      });
      setSavingForm({ goal: '', target_amount: '', current_amount: '' });
      fetchAllData();
      toast.success('Saving goal added successfully');
    } catch (error) {
      console.error('Error adding saving:', error);
      toast.error('Failed to add saving goal');
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${API}/income/${id}`);
      fetchAllData();
      toast.success('Income deleted');
    } catch (error) {
      toast.error('Failed to delete income');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API}/expenses/${id}`);
      fetchAllData();
      toast.success('Expense deleted');
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const deleteBill = async (id) => {
    try {
      await axios.delete(`${API}/bills/${id}`);
      fetchAllData();
      toast.success('Bill deleted');
    } catch (error) {
      toast.error('Failed to delete bill');
    }
  };

  const deleteSaving = async (id) => {
    try {
      await axios.delete(`${API}/savings/${id}`);
      fetchAllData();
      toast.success('Saving goal deleted');
    } catch (error) {
      toast.error('Failed to delete saving goal');
    }
  };

  const toggleBillStatus = async (bill) => {
    try {
      const newStatus = bill.status === 'paid' ? 'pending' : 'paid';
      await axios.patch(`${API}/bills/${bill.id}/status?status=${newStatus}`);
      fetchAllData();
      toast.success(`Bill marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update bill status');
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 data-testid="app-title">Personal Finance Manager</h1>
        <p data-testid="app-subtitle">Track your income, expenses, bills and savings all in one place</p>
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

      <div className="summary-cards">
        <Card className="summary-card income-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4" style={{color: '#2563eb'}} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#2563eb'}} data-testid="total-income">
              ${summary.total_income.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="summary-card expense-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4" style={{color: '#dc2626'}} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#dc2626'}} data-testid="total-expenses">
              ${summary.total_expenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="summary-card bills-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Bills</CardTitle>
            <Receipt className="h-4 w-4" style={{color: '#1a1a1a'}} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#1a1a1a'}} data-testid="total-bills">
              ${summary.total_bills.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="summary-card balance-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Goals</CardTitle>
            <PiggyBank className="h-4 w-4" style={{color: '#eab308'}} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#eab308'}} data-testid="balance">
              ${summary.total_savings.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="main-content">
        {/* Income Section */}
        <Card className="section">
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
                          <Trash2 className="h-4 w-4" style={{color: '#dc2626'}} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Section */}
        <Card className="section">
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
                          <Trash2 className="h-4 w-4" style={{color: '#dc2626'}} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Bills Section */}
        <Card className="section">
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
                          style={{color: item.status === 'paid' ? '#1a1a1a' : '#eab308'}}
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
                          <Trash2 className="h-4 w-4 text-rose-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Savings Section */}
        <Card className="section">
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
                          <span className="font-semibold" style={{color: progress >= 100 ? '#eab308' : '#eab308'}} data-testid={`saving-progress-${item.id}`}>
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
                            <Trash2 className="h-4 w-4 text-rose-600" />
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
        <p>© 2025 Personal Finance Manager | Built with React & FastAPI</p>
      </div>
    </div>
  );
}

export default App;