import React, { useState, useEffect } from 'react';
import Button from '../button/Button';
import PDFViewer from '../pdfViewer/PDFViewer';

function Tracker() {
  // Existing state
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [loans, setLoans] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: "",
    quantity: "",
    unit: "",
    unitPrice: "",
  });
  const [newLoan, setNewLoan] = useState({
    personName: "",
    amount: "",
    type: "borrowed",
    date: new Date().toLocaleDateString()
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [companyRecords, setCompanyRecords] = useState([]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [newCompanyRecord, setNewCompanyRecord] = useState({
    amount: "",
    description: "",
    date: new Date().toLocaleDateString()
  });

  // New state for selection and deletion
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedLoans, setSelectedLoans] = useState([]);
  const [selectedCompanyRecords, setSelectedCompanyRecords] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteType, setDeleteType] = useState(null);

  // Load saved data
  useEffect(() => {
    const savedBudget = localStorage.getItem("budget");
    const savedExpenses = localStorage.getItem("expenses");
    const savedLoans = localStorage.getItem("loans");
    const savedCompanyRecords = localStorage.getItem("companyRecords");

    if (savedBudget) setBudget(Number(JSON.parse(savedBudget)));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedLoans) setLoans(JSON.parse(savedLoans));
    if (savedCompanyRecords) setCompanyRecords(JSON.parse(savedCompanyRecords));
  }, []);

  // Save data
  useEffect(() => {
    if (budget !== 0) localStorage.setItem("budget", JSON.stringify(budget));
    if (expenses.length > 0) localStorage.setItem("expenses", JSON.stringify(expenses));
    if (loans.length > 0) localStorage.setItem("loans", JSON.stringify(loans));
    if (companyRecords.length > 0) localStorage.setItem("companyRecords", JSON.stringify(companyRecords));
  }, [budget, expenses, loans, companyRecords]);

  // Handle selections
  const handleSelectExpense = (index) => {
    if (selectedExpenses.includes(index)) {
      setSelectedExpenses(selectedExpenses.filter(i => i !== index));
    } else {
      setSelectedExpenses([...selectedExpenses, index]);
    }
  };

  const handleSelectLoan = (id) => {
    if (selectedLoans.includes(id)) {
      setSelectedLoans(selectedLoans.filter(i => i !== id));
    } else {
      setSelectedLoans([...selectedLoans, id]);
    }
  };

  const handleSelectCompanyRecord = (id) => {
    if (selectedCompanyRecords.includes(id)) {
      setSelectedCompanyRecords(selectedCompanyRecords.filter(i => i !== id));
    } else {
      setSelectedCompanyRecords([...selectedCompanyRecords, id]);
    }
  };

  const handleSelectAllExpenses = () => {
    if (selectedExpenses.length === expenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(expenses.map((_, index) => index));
    }
  };

  const handleSelectAllLoans = () => {
    if (selectedLoans.length === loans.length) {
      setSelectedLoans([]);
    } else {
      setSelectedLoans(loans.map(loan => loan.id));
    }
  };

  const handleSelectAllCompanyRecords = () => {
    if (selectedCompanyRecords.length === companyRecords.length) {
      setSelectedCompanyRecords([]);
    } else {
      setSelectedCompanyRecords(companyRecords.map(record => record.id));
    }
  };

  // Handle delete confirmation
  const confirmDelete = (type) => {
    setDeleteType(type);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = () => {
    if (deleteType === 'expenses') {
      setExpenses(expenses.filter((_, index) => !selectedExpenses.includes(index)));
      setSelectedExpenses([]);
    } else if (deleteType === 'loans') {
      setLoans(loans.filter(loan => !selectedLoans.includes(loan.id)));
      setSelectedLoans([]);
    } else if (deleteType === 'companyRecords') {
      setCompanyRecords(companyRecords.filter(record => !selectedCompanyRecords.includes(record.id)));
      setSelectedCompanyRecords([]);
    }
    setShowConfirmDelete(false);
    setDeleteType(null);
  };

  const handleBudgetChange = (e) => {
    setBudget(Number(e.target.value));
  };

  const handleExpenseChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleLoanChange = (e) => {
    setNewLoan({ ...newLoan, [e.target.name]: e.target.value });
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

  const addLoan = () => {
    if (newLoan.personName && newLoan.amount) {
      setLoans([...loans, {
        ...newLoan,
        id: Date.now(),
        date: new Date().toLocaleDateString()
      }]);
      setNewLoan({
        personName: "",
        amount: "",
        type: "borrowed",
        date: new Date().toLocaleDateString()
      });
      setShowLoanModal(false);
    }
  };

  const deleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  const deleteLoan = (id) => {
    setLoans(loans.filter(loan => loan.id !== id));
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

  const handleCompanyRecordChange = (e) => {
    setNewCompanyRecord({ ...newCompanyRecord, [e.target.name]: e.target.value });
  };

  const addCompanyRecord = () => {
    if (newCompanyRecord.amount && newCompanyRecord.description) {
      setCompanyRecords([...companyRecords, {
        ...newCompanyRecord,
        id: Date.now(),
        date: new Date().toLocaleDateString()
      }]);
      setNewCompanyRecord({
        amount: "",
        description: "",
        date: new Date().toLocaleDateString()
      });
      setShowCompanyModal(false);
    }
  };

  const deleteCompanyRecord = (id) => {
    setCompanyRecords(companyRecords.filter(record => record.id !== id));
  };

  const totalExpenses = expenses.reduce((total, exp) => total + exp.amount, 0);
  const totalBorrowed = loans
    .filter(loan => loan.type === "borrowed")
    .reduce((total, loan) => total + Number(loan.amount), 0);
  const totalLent = loans
    .filter(loan => loan.type === "lent")
    .reduce((total, loan) => total + Number(loan.amount), 0);
  const totalCompanyMoney = companyRecords.reduce((total, record) => 
    total + Number(record.amount), 0
  );

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
<div style={{
  backgroundColor: '#f0f0f0',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '10px' 
}}>
  <Button 
    onClick={() => setShowModal(true)} 
    text={isEditing ? "Edit Expense" : "Add Expense"} 
    style={{ backgroundColor: '#4CAF50' }} 
  />
  <Button 
    onClick={() => setShowLoanModal(true)} 
    text="Add Money Record" 
    style={{ backgroundColor: '#2196F3' }} 
  />
  <Button 
    onClick={() => setShowCompanyModal(true)} 
    text="Add Company Record" 
    style={{ backgroundColor: '#9C27B0' }} 
  />
</div>
    

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
            <Button onClick={addOrUpdateExpense} text={isEditing ? "Update Expense" : "Add Expense"} style={{ backgroundColor: '#4CAF50' }} />
            <Button onClick={() => setShowModal(false)} text="Close" style={{ backgroundColor: '#757575' }} />
          </div>
        </div>
      )}

      {showLoanModal && (
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
            <h2>Add Money Record</h2>
            <label>Person Name</label><br />
            <input
              type="text"
              name="personName"
              value={newLoan.personName}
              onChange={handleLoanChange}
              placeholder="Enter person name"
              style={{
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            /><br />
            <label>Amount</label><br />
            <input
              type="number"
              name="amount"
              value={newLoan.amount}
              onChange={handleLoanChange}
              placeholder="Enter amount"
              style={{
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            /><br />
            <label>Type</label><br />
            <select
              name="type"
              value={newLoan.type}
              onChange={handleLoanChange}
              style={{
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            >
              <option value="borrowed">Money Taken From</option>
              <option value="lent">Money Given To</option>
            </select><br />
            <Button onClick={addLoan} text="Add Record" style={{ backgroundColor: '#2196F3' }} />
            <Button onClick={() => setShowLoanModal(false)} text="Close" style={{ backgroundColor: '#757575' }} />
          </div>
        </div>
      )}

      {showCompanyModal && (
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
            <h2>Add Company Record</h2>
            <label>Amount</label><br />
            <input
              type="number"
              name="amount"
              value={newCompanyRecord.amount}
              onChange={handleCompanyRecordChange}
              placeholder="Enter amount"
              style={{
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            /><br />
            <label>Description</label><br />
            <input
              type="text"
              name="description"
              value={newCompanyRecord.description}
              onChange={handleCompanyRecordChange}
              placeholder="Enter description"
              style={{
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            /><br />
            <Button onClick={addCompanyRecord} text="Add Record" style={{ backgroundColor: '#9C27B0' }} />
            <Button onClick={() => setShowCompanyModal(false)} text="Close" style={{ backgroundColor: '#757575' }} />
          </div>
        </div>
      )}

      {showConfirmDelete && (
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
            textAlign: 'center'
          }}>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete the selected {deleteType}?</p>
            <Button 
              onClick={handleDeleteConfirmed} 
              text="Confirm Delete" 
              style={{ backgroundColor: '#ff4444', marginRight: '10px' }}
            />
            <Button 
              onClick={() => setShowConfirmDelete(false)} 
              text="Cancel"
              style={{ backgroundColor: '#757575' }}
            />
          </div>
        </div>
      )}

      <div className="expense-list">
        <h2>Expense List</h2>
        {expenses.length > 0 && (
          <div style={{ marginBottom: '10px',display: 'flex', justifyContent: 'center', alignItems: 'center',gap: '10px',flexWrap: 'wrap' }}>
            <Button 
              onClick={handleSelectAllExpenses} 
              text={selectedExpenses.length === expenses.length ? "Deselect All" : "Select All"} 
              style={{ backgroundColor: '#FF9800' }}
            />
            {selectedExpenses.length > 0 && (
              <Button 
                onClick={() => confirmDelete('expenses')} 
                text="Delete Selected" 
                style={{ marginLeft: '10px', backgroundColor: '#ff4444' }}
              />
            )}
          </div>
        )}
        <ul style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',flexWrap:'wrap',gap:'10px'}}>
          {expenses.map((expense, index) => (
            <li key={index} style={{ 
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              color:'red'
            }}>
              <input
                type="checkbox"
                checked={selectedExpenses.includes(index)}
                onChange={() => handleSelectExpense(index)}
                style={{ marginRight: '10px' }}
              />
              {expense.title} - Rs{expense.amount} (Date: {expense.date}){" "}
              <Button onClick={() => editExpense(index)} text="Edit" style={{ marginLeft: '5px', backgroundColor: '#2196F3' }} />
              <Button onClick={() => deleteExpense(index)} text="Delete" style={{ marginLeft: '5px', backgroundColor: '#ff4444' }} />
            </li>
          ))}
        </ul>
      </div>

      <div className="loan-list" style={{ marginTop: '20px' }}>
        <h2>Money Records</h2>
        <div className="summary" style={{ margin: '20px 0' }}>
          <p style={{ color: 'red', fontFamily: 'monospace', fontSize: '20px' }}><strong>Total Money Taken: </strong> Rs{totalBorrowed}</p>
          <p style={{ color: 'green', fontFamily: 'monospace', fontSize: '20px' }}><strong>Total Money Given: </strong> Rs{totalLent}</p>
        </div>
        {loans.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <Button 
              onClick={handleSelectAllLoans} 
              text={selectedLoans.length === loans.length ? "Deselect All" : "Select All"} 
              style={{ backgroundColor: '#FF9800' }}
            />
            {selectedLoans.length > 0 && (
              <Button 
                onClick={() => confirmDelete('loans')} 
                text="Delete Selected" 
                style={{ marginLeft: '10px', backgroundColor: '#ff4444' }}
              />
            )}
          </div>
        )}
        <ul>
          {loans.map((loan) => (
            <li key={loan.id} style={{ 
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="checkbox"
                checked={selectedLoans.includes(loan.id)}
                onChange={() => handleSelectLoan(loan.id)}
                style={{ marginRight: '10px' }}
              />
              <div>
                <strong>{loan.personName}</strong> - Rs{loan.amount} 
                ({loan.type === "borrowed" ? "Money Taken From" : "Money Given To"})
                <br />
                Date: {loan.date}
              </div>
              <Button 
                onClick={() => deleteLoan(loan.id)} 
                text="Delete" 
                style={{ marginLeft: '5px', backgroundColor: '#ff4444' }}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="company-records" style={{ marginTop: '20px' }}>
        <h2>Company Records</h2>
        <div className="summary" style={{ margin: '20px 0' }}>
          <p style={{ color: 'purple', fontFamily: 'monospace', fontSize: '20px' }}>
            <strong>Total Company Records: </strong> Rs{totalCompanyMoney}
          </p>
        </div>
        {companyRecords.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <Button 
              onClick={handleSelectAllCompanyRecords} 
              text={selectedCompanyRecords.length === companyRecords.length ? "Deselect All" : "Select All"} 
              style={{ backgroundColor: '#FF9800' }}
            />
            {selectedCompanyRecords.length > 0 && (
              <Button 
                onClick={() => confirmDelete('companyRecords')} 
                text="Delete Selected" 
                style={{ marginLeft: '10px', backgroundColor: '#ff4444' }}
              />
            )}
          </div>
        )}
        <ul>
          {companyRecords.map((record) => (
            <li key={record.id} style={{ 
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="checkbox"
                checked={selectedCompanyRecords.includes(record.id)}
                onChange={() => handleSelectCompanyRecord(record.id)}
                style={{ marginRight: '10px' }}
              />
              <div>
                <strong>Rs{record.amount}</strong> - {record.description}
                <br />
                Date: {record.date}
              </div>
              <Button 
                onClick={() => deleteCompanyRecord(record.id)} 
                text="Delete" 
                style={{ marginLeft: '5px', backgroundColor: '#ff4444' }}
              />
            </li>
          ))}
        </ul>
      </div>

      <PDFViewer 
        budget={budget} 
        totalExpenses={totalExpenses} 
        expenses={expenses} 
        loans={loans}
        companyRecords={companyRecords}
        totalCompanyMoney={totalCompanyMoney}
      />
    </div>
  );
}

export default Tracker;