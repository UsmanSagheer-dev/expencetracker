// PDFViewer.js
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Button from '../button/Button';

function PDFViewer({ budget, totalExpenses, expenses }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 20, 10);
    doc.text(`Total Budget: Rs${budget}`, 20, 20);
    doc.text(`Total Expenses: Rs${totalExpenses}`, 20, 30);
    doc.text(`Remaining Budget: Rs${budget - totalExpenses}`, 20, 40);

    const tableColumn = ["Title", "Amount", "Date"];
    const tableRows = expenses.map((expense) => [
      expense.title,
      `Rs${expense.amount}`,
      expense.date,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
    });

    doc.save("expense_report.pdf");
  };

  return (
    <Button onClick={generatePDF} text="Download PDF" style={{ marginTop: '20px' }} />
  );
}

export default PDFViewer;
