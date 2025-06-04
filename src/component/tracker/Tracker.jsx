import React from 'react';
import Button from '../button/Button';
import PDFViewer from '../pdfViewer/PDFViewer';
import useTracker from './useTracker';
import './tracker.css';

function Tracker() {
  const {
    budget,
    expenses,
    loans,
    newExpense,
    newLoan,
    isEditing,
    showModal,
    showLoanModal,
    companyRecords,
    showCompanyModal,
    newCompanyRecord,
    selectedExpenses,
    selectedLoans,
    selectedCompanyRecords,
    showConfirmDelete,
    deleteType,
    totalExpenses,
    totalBorrowed,
    totalLent,
    totalCompanyMoney,
    setShowModal,
    setShowLoanModal,
    setShowCompanyModal,
    handleSelectExpense,
    setShowConfirmDelete,
    handleSelectLoan,
    handleSelectCompanyRecord,
    handleSelectAllExpenses,
    handleSelectAllLoans,
    handleSelectAllCompanyRecords,
    confirmDelete,
    handleDeleteConfirmed,
    handleBudgetChange,
    handleExpenseChange,
    handleLoanChange,
    addOrUpdateExpense,
    addLoan,
    deleteExpense,
    deleteLoan,
    editExpense,
    handleCompanyRecordChange,
    addCompanyRecord,
    deleteCompanyRecord,
  } = useTracker();

  return (
    <div className="tracker-container">
      <h1 className="tracker-title">Daily Expense Tracker</h1>

      {/* Budget Section */}
      <div className="budget-section">
        <h2 className="section-title">Set Your Daily Budget</h2>
        <input
          type="number"
          value={budget}
          onChange={handleBudgetChange}
          placeholder="Enter your budget"
          className="budget-input"
        />
        <div className="budget-info">
          <p className="budget-total">
            <strong>Total Budget:</strong> Rs{budget}
          </p>
          <p className="budget-expenses">
            <strong>Total Expenses:</strong> Rs{totalExpenses}
          </p>
          <p className="budget-remaining">
            <strong>Remaining Budget:</strong> Rs{budget - totalExpenses}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <Button
          onClick={() => setShowModal(true)}
          text={isEditing ? 'Edit Expense' : 'Add Expense'}
          className="btn btn-expense"
        />
        <Button
          onClick={() => setShowLoanModal(true)}
          text="Add Money Record"
          className="btn btn-loan"
        />
        <Button
          onClick={() => setShowCompanyModal(true)}
          text="Add Company Record"
          className="btn btn-company"
        />
      </div>

      {/* Expense Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{isEditing ? 'Edit Expense' : 'Add Expense'}</h2>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={newExpense.title}
                onChange={handleExpenseChange}
                placeholder="Expense Title"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={newExpense.quantity}
                onChange={handleExpenseChange}
                placeholder="Quantity"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <input
                type="text"
                name="unit"
                value={newExpense.unit}
                onChange={handleExpenseChange}
                placeholder="Unit (kg, liters, etc.)"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Price</label>
              <input
                type="number"
                name="unitPrice"
                value={newExpense.unitPrice}
                onChange={handleExpenseChange}
                placeholder="Unit Price (Rs per unit)"
                className="form-input"
              />
            </div>
            <div className="modal-actions">
              <Button
                onClick={addOrUpdateExpense}
                text={isEditing ? 'Update Expense' : 'Add Expense'}
                className="btn btn-expense"
              />
              <Button
                onClick={() => setShowModal(false)}
                text="Close"
                className="btn btn-close"
              />
            </div>
          </div>
        </div>
      )}

      {/* Loan Modal */}
      {showLoanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Add Money Record</h2>
            <div className="form-group">
              <label className="form-label">Person Name</label>
              <input
                type="text"
                name="personName"
                value={newLoan.personName}
                onChange={handleLoanChange}
                placeholder="Enter person name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                name="amount"
                value={newLoan.amount}
                onChange={handleLoanChange}
                placeholder="Enter amount"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                name="type"
                value={newLoan.type}
                onChange={handleLoanChange}
                className="form-input"
              >
                <option value="borrowed">Money Taken From</option>
                <option value="lent">Money Given To</option>
              </select>
            </div>
            <div className="modal-actions">
              <Button
                onClick={addLoan}
                text="Add Record"
                className="btn btn-loan"
              />
              <Button
                onClick={() => setShowLoanModal(false)}
                text="Close"
                className="btn btn-close"
              />
            </div>
          </div>
        </div>
      )}

      {/* Company Record Modal */}
      {showCompanyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Add Company Record</h2>
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                name="amount"
                value={newCompanyRecord.amount}
                onChange={handleCompanyRecordChange}
                placeholder="Enter amount"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={newCompanyRecord.description}
                onChange={handleCompanyRecordChange}
                placeholder="Enter description"
                className="form-input"
              />
            </div>
            <div className="modal-actions">
              <Button
                onClick={addCompanyRecord}
                text="Add Record"
                className="btn btn-company"
              />
              <Button
                onClick={() => setShowCompanyModal(false)}
                text="Close"
                className="btn btn-close"
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content modal-content--center">
            <h2 className="modal-title">Confirm Deletion</h2>
            <p className="modal-text">Are you sure you want to delete the selected {deleteType}?</p>
            <div className="modal-actions">
              <Button
                onClick={handleDeleteConfirmed}
                text="Confirm Delete"
                className="btn btn-delete"
              />
              <Button
                onClick={() => setShowConfirmDelete(false)}
                text="Cancel"
                className="btn btn-close"
              />
            </div>
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="expense-list">
        <h2 className="section-title">Expense List</h2>
        {expenses.length > 0 && (
          <div className="action-buttons">
            <Button
              onClick={handleSelectAllExpenses}
              text={selectedExpenses.length === expenses.length ? 'Deselect All' : 'Select All'}
              className="btn btn-select"
            />
            {selectedExpenses.length > 0 && (
              <Button
                onClick={() => confirmDelete('expenses')}
                text="Delete Selected"
                className="btn btn-delete"
              />
            )}
          </div>
        )}
        <ul className="expense-grid">
          {expenses.map((expense, index) => (
            <li key={index} className="expense-item">
              <input
                type="checkbox"
                checked={selectedExpenses.includes(index)}
                onChange={() => handleSelectExpense(index)}
                className="expense-checkbox"
              />
              <div className="expense-details">
                <p className="expense-title">{expense.title} - Rs{expense.amount}</p>
                <p className="expense-date">Date: {expense.date}</p>
              </div>
              <Button
                onClick={() => editExpense(index)}
                text="Edit"
                className="btn btn-edit"
              />
              <Button
                onClick={() => deleteExpense(index)}
                text="Delete"
                className="btn btn-delete"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Loan List */}
      <div className="loan-list">
        <h2 className="section-title">Money Records</h2>
        <div className="summary">
          <p className="summary-taken">
            <strong>Total Money Taken:</strong> Rs{totalBorrowed}
          </p>
          <p className="summary-given">
            <strong>Total Money Given:</strong> Rs{totalLent}
          </p>
        </div>
        {loans.length > 0 && (
          <div className="action-buttons">
            <Button
              onClick={handleSelectAllLoans}
              text={selectedLoans.length === loans.length ? 'Deselect All' : 'Select All'}
              className="btn btn-select"
            />
            {selectedLoans.length > 0 && (
              <Button
                onClick={() => confirmDelete('loans')}
                text="Delete Selected"
                className="btn btn-delete"
              />
            )}
          </div>
        )}
        <ul className="loan-list__items">
          {loans.map((loan) => (
            <li key={loan.id} className="loan-item">
              <input
                type="checkbox"
                checked={selectedLoans.includes(loan.id)}
                onChange={() => handleSelectLoan(loan.id)}
                className="loan-checkbox"
              />
              <div className="loan-details">
                <p>
                  <strong>{loan.personName}</strong> - Rs{loan.amount} (
                  {loan.type === 'borrowed' ? 'Money Taken From' : 'Money Given To'})
                </p>
                <p className="loan-date">Date: {loan.date}</p>
              </div>
              <Button
                onClick={() => deleteLoan(loan.id)}
                text="Delete"
                className="btn btn-delete"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Company Records */}
      <div className="company-records">
        <h2 className="section-title">Company Records</h2>
        <p className="summary-total">
          <strong>Total Company Records:</strong> Rs{totalCompanyMoney}
        </p>
        {companyRecords.length > 0 && (
          <div className="action-buttons">
            <Button
              onClick={handleSelectAllCompanyRecords}
              text={selectedCompanyRecords.length === companyRecords.length ? 'Deselect All' : 'Select All'}
              className="btn btn-select"
            />
            {selectedCompanyRecords.length > 0 && (
              <Button
                onClick={() => confirmDelete('companyRecords')}
                text="Delete Selected"
                className="btn btn-delete"
              />
            )}
          </div>
        )}
        <ul className="company-list__items">
          {companyRecords.map((record) => (
            <li key={record.id} className="company-item">
              <input
                type="checkbox"
                checked={selectedCompanyRecords.includes(record.id)}
                onChange={() => handleSelectCompanyRecord(record.id)}
                className="company-checkbox"
              />
              <div className="company-details">
                <p>
                  <strong>Rs{record.amount}</strong> - {record.description}
                </p>
                <p className="company-date">Date: {record.date}</p>
              </div>
              <Button
                onClick={() => deleteCompanyRecord(record.id)}
                text="Delete"
                className="btn btn-delete"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* PDF Viewer */}
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