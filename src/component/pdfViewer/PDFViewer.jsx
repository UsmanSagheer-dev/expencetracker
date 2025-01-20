import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Button from '../button/Button';

function PDFViewer({ budget, totalExpenses, expenses, loans = [] }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add main title
    doc.setFontSize(20);
    doc.text("Daily Expense Tracker Report", 20, 10);

    // Add budget summary
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0); // Red color for Total Budget
    doc.text(`Total Budget: Rs${budget}`, 20, 30);
    
    doc.setTextColor(0, 0, 255); // Blue color for Total Expenses
    doc.text(`Total Expenses: Rs${totalExpenses}`, 20, 40);
    
    doc.setTextColor(128, 128, 128); // Grey color for Remaining Budget
    doc.text(`Remaining Budget: Rs${budget - totalExpenses}`, 20, 50);
    
    doc.setTextColor(0, 0, 0); // Reset to black color

    // Add Expense List title
    doc.setFontSize(16);
    doc.text("Expense List", 20, 70);

    // Add expense table
    const expenseTableColumn = ["Title", "Amount", "Date"];
    const expenseTableRows = expenses.map((expense) => [
      expense.title,
      `Rs${expense.amount}`,
      expense.date,
    ]);

    autoTable(doc, {
      head: [expenseTableColumn],
      body: expenseTableRows,
      startY: 80,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }, // Blue header
    });

    // Get the final Y position after the expense table
    const finalY = doc.lastAutoTable.finalY || 80;

    // Add Money Records title
    doc.setFontSize(16);
    doc.text("Money Records", 20, finalY + 20);

    // Add loan summary
    doc.setFontSize(12);
    const totalBorrowed = loans
      .filter(loan => loan.type === "borrowed")
      .reduce((total, loan) => total + Number(loan.amount), 0);
    
    const totalLent = loans
      .filter(loan => loan.type === "lent")
      .reduce((total, loan) => total + Number(loan.amount), 0);

    doc.setTextColor(255, 0, 0); // Red for money taken
    doc.text(`Total Money Taken: Rs${totalBorrowed}`, 20, finalY + 35);
    
    doc.setTextColor(0, 128, 0); // Green for money given
    doc.text(`Total Money Given: Rs${totalLent}`, 20, finalY + 45);
    
    doc.setTextColor(0, 0, 0); // Reset to black

    // Add loan records table
    const loanTableColumn = ["Person Name", "Amount", "Type", "Date"];
    const loanTableRows = loans.map((loan) => [
      loan.personName,
      `Rs${loan.amount}`,
      loan.type === "borrowed" ? "Money Taken From" : "Money Given To",
      loan.date,
    ]);

    autoTable(doc, {
      head: [loanTableColumn],
      body: loanTableRows,
      startY: finalY + 55,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }, // Blue header
    });

    // Add footer with date
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);

    doc.save("daily_expense_report.pdf");
  };

  return (
    <Button onClick={generatePDF} text="Download PDF" style={{ marginTop: '20px' }} />
  );
}

export default PDFViewer;