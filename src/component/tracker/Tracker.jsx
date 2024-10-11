import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Tracker() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: "",
    quantity: "",
    unitPrice: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Load data from local storage when the component mounts
  useEffect(() => {
    const savedBudget = localStorage.getItem("budget");
    const savedExpenses = localStorage.getItem("expenses");

    if (savedBudget) setBudget(Number(JSON.parse(savedBudget)));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  // Save budget and expenses to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("budget", JSON.stringify(budget));
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [budget, expenses]);

  // Handle budget input
  const handleBudgetChange = (e) => {
    setBudget(Number(e.target.value));
  };

  // Handle new expense inputs
  const handleExpenseChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  // Add new or edit an expense
  const addOrUpdateExpense = () => {
    if (newExpense.title && newExpense.quantity && newExpense.unitPrice) {
      const totalAmount = parseFloat(newExpense.quantity) * parseFloat(newExpense.unitPrice);
      const currentDate = new Date().toLocaleDateString();
      const titleWithPrice = `${newExpense.title} (${newExpense.quantity} kg/liters @ Rs${newExpense.unitPrice} per unit)`;

      if (isEditing) {
        // Update the expense if editing
        const updatedExpenses = expenses.map((expense, index) =>
          index === currentIndex
            ? { title: titleWithPrice, amount: totalAmount, date: currentDate }
            : expense
        );
        setExpenses(updatedExpenses);
        setIsEditing(false);
        setCurrentIndex(null);
      } else {
        // Add new expense
        setExpenses([
          ...expenses,
          { title: titleWithPrice, amount: totalAmount, date: currentDate }
        ]);
      }

      setNewExpense({ title: "", quantity: "", unitPrice: "" });
    }
  };

  // Delete an expense
  const deleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  // Edit an expense
  const editExpense = (index) => {
    const expenseToEdit = expenses[index];
    const [title, details] = expenseToEdit.title.split(" (");
    const [quantity, unitPrice] = details.split(" @ Rs");

    setNewExpense({
      title,
      quantity: quantity.split(" ")[0], // Extract only quantity number
      unitPrice: unitPrice.split(" ")[0] // Extract unit price
    });
    setIsEditing(true);
    setCurrentIndex(index);
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, exp) => total + exp.amount, 0);

  // Generate PDF and download
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 20, 10);
    doc.text(`Total Budget: Rs${budget}`, 20, 20);
    doc.text(`Total Expenses: Rs${totalExpenses}`, 20, 30);
    doc.text(`Remaining Budget: Rs${budget - totalExpenses}`, 20, 40);

    const tableColumn = ["Title", "Amount", "Date"];
    const tableRows = expenses.map((expense) => [expense.title, `Rs${expense.amount}`, expense.date]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
    });

    doc.save("expense_report.pdf");
  };

  return (
    <div className="App">
      <h1>Daily Expense Tracker</h1>
      <div className="budget-section">
        <h2>Set Your Daily Budget</h2>
        <input
          type="number"
          value={budget}
          onChange={handleBudgetChange}
          placeholder="Enter your budget"
        />
      </div>
      <div className="budget-info">
        <p>
          <strong>Total Budget: </strong> Rs{budget}
        </p>
        <p>
          <strong>Total Expenses: </strong> Rs{totalExpenses}
        </p>
        <p>
          <strong>Remaining Budget: </strong> Rs{budget - totalExpenses}
        </p>
      </div>
      <div className="expense-section">
        <h2>{isEditing ? "Edit Expense" : "Add Expense"}</h2>
        <input
          type="text"
          name="title"
          value={newExpense.title}
          onChange={handleExpenseChange}
          placeholder="Expense Title"
        />
        <input
          type="number"
          name="quantity"
          value={newExpense.quantity}
          onChange={handleExpenseChange}
          placeholder="Quantity (kg, liters, etc.)"
        />
        <input
          type="number"
          name="unitPrice"
          value={newExpense.unitPrice}
          onChange={handleExpenseChange}
          placeholder="Unit Price (Rs per kg/liter)"
        />
        <button onClick={addOrUpdateExpense}>
          {isEditing ? "Update Expense" : "Add Expense"}
        </button>
      </div>
      <div className="expense-list">
        <h2>Expense List</h2>
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>
              {expense.title} - Rs{expense.amount} (Date: {expense.date}){" "}
              <button onClick={() => editExpense(index)}>Edit</button>
              <button onClick={() => deleteExpense(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={generatePDF} style={{ marginTop: "20px" }}>
        Download PDF
      </button>
    </div>
  );
}

export default Tracker;
