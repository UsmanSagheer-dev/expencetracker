import React, { useState, useEffect } from 'react';
import Button from '../button/Button';
import PDFViewer from '../pdfViewer/PDFViewer';

function Tracker() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: "",
    quantity: "",
    unit: "",
    unitPrice: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedBudget = localStorage.getItem("budget");
    const savedExpenses = localStorage.getItem("expenses");

    if (savedBudget) setBudget(Number(JSON.parse(savedBudget)));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  useEffect(() => {
    if (budget !== 0) localStorage.setItem("budget", JSON.stringify(budget));
    if (expenses.length > 0) localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [budget, expenses]);

  const handleBudgetChange = (e) => {
    setBudget(Number(e.target.value));
  };

  const handleExpenseChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const addOrUpdateExpense = () => {
    if (newExpense.title && newExpense.quantity && newExpense.unitPrice && newExpense.unit) {
      const totalAmount = parseFloat(newExpense.quantity) * parseFloat(newExpense.unitPrice);
      const currentDate = new Date().toLocaleDateString();
      const titleWithPrice = `${newExpense.title} (${newExpense.quantity} ${newExpense.unit} @ Rs${newExpense.unitPrice} per unit)`;

      if (isEditing) {
        const updatedExpenses = expenses.map((expense, index) =>
          index === currentIndex
            ? { title: titleWithPrice, amount: totalAmount, date: currentDate }
            : expense
        );
        setExpenses(updatedExpenses);
        setIsEditing(false);
        setCurrentIndex(null);
      } else {
        setExpenses([
          ...expenses,
          { title: titleWithPrice, amount: totalAmount, date: currentDate },
        ]);
      }

      setNewExpense({ title: "", quantity: "", unit: "", unitPrice: "" });
      setShowModal(false);
    }
  };

  const deleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  const editExpense = (index) => {
    const expenseToEdit = expenses[index];
    const [title, details] = expenseToEdit.title.split(" (");
    const [quantityAndUnit, unitPriceString] = details.split(" @ Rs");
    const [quantity, unit] = quantityAndUnit.split(" ");
    const unitPrice = unitPriceString.split(" ")[0];

    setNewExpense({
      title: title.trim(),
      quantity: quantity.trim(),
      unit: unit.trim(),
      unitPrice: unitPrice.trim(),
    });

    setIsEditing(true);
    setCurrentIndex(index);
    setShowModal(true);
  };

  const totalExpenses = expenses.reduce((total, exp) => total + exp.amount, 0);

  return (
    <div className="App" >
      <h1>Daily Expense Tracker</h1>
      <div className="budget-section">
        <h2>Set Your Daily Budget</h2>
        <input
          type="number"
          value={budget}
          onChange={handleBudgetChange}
          placeholder="Enter your budget"
          style={{
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: '300px',
          }}
        />
      </div>
      <div className="budget-info">
        <p style={{ color: 'red', fontFamily: 'monospace', fontSize: '25px' }}><strong>Total Budget: </strong> Rs{budget}</p>
        <p style={{ color: 'blue', fontFamily: 'fantasy', fontSize: '25px' }}><strong>Total Expenses: </strong> Rs{totalExpenses}</p>
        <p style={{ color: "grey", fontFamily: 'revert-layer', fontSize: '25px' }}><strong>Remaining Budget: </strong> Rs{budget - totalExpenses}</p>
      </div>

      <Button onClick={() => setShowModal(true)} text={isEditing ? "Edit Expense" : "Add Expense"} />

      {showModal && (
        <div className="modal" style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
       
        }}>
          <div className="modal-content" style={{
            background: '#fff',
            padding: '20px 50px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            width: '90%',
            maxWidth: '400px',
          }}>
            <h2>{isEditing ? "Edit Expense" : "Add Expense"}</h2>
            <label>Enter title</label><br />
            <input
              type="text"
              name="title"
              value={newExpense.title}
              onChange={handleExpenseChange}
              placeholder="Expense Title"
              style={{
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            /><br />
            <label>Enter quantity</label><br />
            <input
              type="number"
              name="quantity"
              value={newExpense.quantity}
              onChange={handleExpenseChange}
              placeholder="Quantity"
              style={{
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            /><br />
            <label>Enter unit</label><br />
            <input
              type="text"
              name="unit"
              value={newExpense.unit}
              onChange={handleExpenseChange}
              placeholder="Unit (kg, liters, etc.)"
              style={{
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            /><br />
            <label>Enter unit price</label><br />
            <input
              type="number"
              name="unitPrice"
              value={newExpense.unitPrice}
              onChange={handleExpenseChange}
              placeholder="Unit Price (Rs per unit)"
              style={{
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            /><br />
            <Button onClick={addOrUpdateExpense} text={isEditing ? "Update Expense" : "Add Expense"} />
            <Button onClick={() => setShowModal(false)} text="Close" />
          </div>
        </div>
      )}

      <div className="expense-list">
        <h2>Expense List</h2>
        <ul>
          {expenses.map((expense, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              {expense.title} - Rs{expense.amount} (Date: {expense.date}){" "}
              <Button onClick={() => editExpense(index)} text="Edit" style={{ marginLeft: '5px' }} />
              <Button onClick={() => deleteExpense(index)} text="Delete" style={{ marginLeft: '5px' }} />
            </li>
          ))}
        </ul>
      </div>

      <PDFViewer budget={budget} totalExpenses={totalExpenses} expenses={expenses} />
    </div>
  );
}

export default Tracker;


