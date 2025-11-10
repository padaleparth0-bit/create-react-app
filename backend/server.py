from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class Income(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source: str
    amount: float
    date: str
    month: str
    year: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class IncomeCreate(BaseModel):
    source: str
    amount: float
    date: str
    month: str
    year: int

class Expense(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    amount: float
    description: str
    date: str
    month: str
    year: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExpenseCreate(BaseModel):
    category: str
    amount: float
    description: str
    date: str
    month: str
    year: int

class Bill(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    amount: float
    due_date: str
    status: str
    month: str
    year: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BillCreate(BaseModel):
    name: str
    amount: float
    due_date: str
    status: str
    month: str
    year: int

class Saving(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    goal: str
    target_amount: float
    current_amount: float
    month: str
    year: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SavingCreate(BaseModel):
    goal: str
    target_amount: float
    current_amount: float
    month: str
    year: int

class SummaryResponse(BaseModel):
    total_income: float
    total_expenses: float
    total_bills: float
    total_savings: float
    balance: float

# Income endpoints
@api_router.post("/income", response_model=Income)
async def create_income(input: IncomeCreate):
    income_dict = input.model_dump()
    income_obj = Income(**income_dict)
    doc = income_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.income.insert_one(doc)
    return income_obj

@api_router.get("/income", response_model=List[Income])
async def get_income(month: Optional[str] = None, year: Optional[int] = None):
    query = {}
    if month:
        query['month'] = month
    if year:
        query['year'] = year
    income_list = await db.income.find(query, {"_id": 0}).to_list(1000)
    for item in income_list:
        if isinstance(item['timestamp'], str):
            item['timestamp'] = datetime.fromisoformat(item['timestamp'])
    return income_list

@api_router.delete("/income/{income_id}")
async def delete_income(income_id: str):
    result = await db.income.delete_one({"id": income_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Income not found")
    return {"message": "Income deleted successfully"}

# Expense endpoints
@api_router.post("/expenses", response_model=Expense)
async def create_expense(input: ExpenseCreate):
    expense_dict = input.model_dump()
    expense_obj = Expense(**expense_dict)
    doc = expense_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.expenses.insert_one(doc)
    return expense_obj

@api_router.get("/expenses", response_model=List[Expense])
async def get_expenses(month: Optional[str] = None, year: Optional[int] = None):
    query = {}
    if month:
        query['month'] = month
    if year:
        query['year'] = year
    expenses_list = await db.expenses.find(query, {"_id": 0}).to_list(1000)
    for item in expenses_list:
        if isinstance(item['timestamp'], str):
            item['timestamp'] = datetime.fromisoformat(item['timestamp'])
    return expenses_list

@api_router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: str):
    result = await db.expenses.delete_one({"id": expense_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted successfully"}

# Bill endpoints
@api_router.post("/bills", response_model=Bill)
async def create_bill(input: BillCreate):
    bill_dict = input.model_dump()
    bill_obj = Bill(**bill_dict)
    doc = bill_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.bills.insert_one(doc)
    return bill_obj

@api_router.get("/bills", response_model=List[Bill])
async def get_bills(month: Optional[str] = None, year: Optional[int] = None):
    query = {}
    if month:
        query['month'] = month
    if year:
        query['year'] = year
    bills_list = await db.bills.find(query, {"_id": 0}).to_list(1000)
    for item in bills_list:
        if isinstance(item['timestamp'], str):
            item['timestamp'] = datetime.fromisoformat(item['timestamp'])
    return bills_list

@api_router.patch("/bills/{bill_id}/status")
async def update_bill_status(bill_id: str, status: str):
    result = await db.bills.update_one(
        {"id": bill_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Bill not found")
    return {"message": "Bill status updated successfully"}

@api_router.delete("/bills/{bill_id}")
async def delete_bill(bill_id: str):
    result = await db.bills.delete_one({"id": bill_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bill not found")
    return {"message": "Bill deleted successfully"}

# Savings endpoints
@api_router.post("/savings", response_model=Saving)
async def create_saving(input: SavingCreate):
    saving_dict = input.model_dump()
    saving_obj = Saving(**saving_dict)
    doc = saving_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.savings.insert_one(doc)
    return saving_obj

@api_router.get("/savings", response_model=List[Saving])
async def get_savings(month: Optional[str] = None, year: Optional[int] = None):
    query = {}
    if month:
        query['month'] = month
    if year:
        query['year'] = year
    savings_list = await db.savings.find(query, {"_id": 0}).to_list(1000)
    for item in savings_list:
        if isinstance(item['timestamp'], str):
            item['timestamp'] = datetime.fromisoformat(item['timestamp'])
    return savings_list

@api_router.patch("/savings/{saving_id}")
async def update_saving(saving_id: str, current_amount: float):
    result = await db.savings.update_one(
        {"id": saving_id},
        {"$set": {"current_amount": current_amount}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Saving not found")
    return {"message": "Saving updated successfully"}

@api_router.delete("/savings/{saving_id}")
async def delete_saving(saving_id: str):
    result = await db.savings.delete_one({"id": saving_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Saving not found")
    return {"message": "Saving deleted successfully"}

# Summary endpoint
@api_router.get("/summary", response_model=SummaryResponse)
async def get_summary(month: Optional[str] = None, year: Optional[int] = None):
    query = {}
    if month:
        query['month'] = month
    if year:
        query['year'] = year
    
    income_list = await db.income.find(query, {"_id": 0}).to_list(1000)
    expenses_list = await db.expenses.find(query, {"_id": 0}).to_list(1000)
    bills_list = await db.bills.find(query, {"_id": 0}).to_list(1000)
    savings_list = await db.savings.find(query, {"_id": 0}).to_list(1000)
    
    total_income = sum(item['amount'] for item in income_list)
    total_expenses = sum(item['amount'] for item in expenses_list)
    total_bills = sum(item['amount'] for item in bills_list if item['status'] == 'paid')
    total_savings = sum(item['current_amount'] for item in savings_list)
    balance = total_income - total_expenses - total_bills
    
    return SummaryResponse(
        total_income=total_income,
        total_expenses=total_expenses,
        total_bills=total_bills,
        total_savings=total_savings,
        balance=balance
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()