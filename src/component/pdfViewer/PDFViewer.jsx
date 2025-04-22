import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import SignatureCanvas from 'react-signature-canvas';
import Button from '../button/Button';

function PDFViewer({ 
  budget, 
  totalExpenses, 
  expenses, 
  loans = [], 
  companyRecords = [],
  totalCompanyMoney 
}) {
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const sigCanvas = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
    setSignatureImage(null);
  };

  const saveSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      try {
        // Use the regular toDataURL instead of getTrimmedCanvas
        const signatureData = sigCanvas.current.toDataURL('image/png');
        setSignatureImage(signatureData);
        setShowSignatureModal(false);
      } catch (error) {
        console.error("Error saving signature:", error);
        alert('There was an error saving your signature. Please try again.');
      }
    } else {
      alert('Please provide a signature before saving.');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let currentY = 10;
    
    // Helper function to check if we need a new page
    const checkForNewPage = (requiredSpace) => {
      if (currentY + requiredSpace > pageHeight - 20) {
        doc.addPage();
        // Reset Y position and add header to new page
        currentY = 20;
        addHeaderToCurrentPage();
        return true;
      }
      return false;
    };
    
    // Function to add header to current page
    const addHeaderToCurrentPage = () => {
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, pageWidth, 20, 'F');
      doc.text("Expense Tracker", 20, 15);
      doc.setFontSize(12);
      doc.text(`Report Date: ${formatDate(new Date())}`, pageWidth - 20, 15, { align: 'right' });
      doc.setTextColor(0, 0, 0);
    };

    // Add header to first page
    addHeaderToCurrentPage();
    currentY = 30;

    // Main Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text("Daily Expense Tracker Report", pageWidth / 2, currentY, { align: 'center' });
    currentY += 20;

    // Budget Summary
    checkForNewPage(45);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Budget Summary", 20, currentY);
    currentY += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Budget: Rs${Number(budget).toFixed(2)}`, 20, currentY);
    currentY += 10;
    doc.text(`Total Expenses: Rs${Number(totalExpenses).toFixed(2)}`, 20, currentY);
    currentY += 10;
    doc.text(`Remaining Budget: Rs${(Number(budget) - Number(totalExpenses)).toFixed(2)}`, 20, currentY);
    currentY += 15;

    // Expense List Table
    checkForNewPage(20);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Expense List", 20, currentY);
    currentY += 10;

    const expenseColumns = ["Title", "Amount", "Date"];
    const expenseData = expenses.length > 0 
      ? expenses.map(expense => [
          expense.title,
          `Rs${Number(expense.amount).toFixed(2)}`,
          formatDate(expense.date)
        ])
      : [['No expenses recorded', '', '']];

    // AutoTable handles its own pagination
    autoTable(doc, {
      head: [expenseColumns],
      body: expenseData,
      startY: currentY,
      theme: 'grid',
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12
      },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      didDrawPage: function(data) {
        // Add header to each new page created by autoTable
        addHeaderToCurrentPage();
      }
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // Loan Records
    checkForNewPage(20);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Money Records", 20, currentY);
    currentY += 10;

    const loanColumns = ["Person Name", "Amount", "Type", "Date"];
    const loanData = loans.length > 0
      ? loans.map(loan => [
          loan.personName,
          `Rs${Number(loan.amount).toFixed(2)}`,
          loan.type === "borrowed" ? "Money Taken From" : "Money Given To",
          formatDate(loan.date)
        ])
      : [['No loan records', '', '', '']];

    autoTable(doc, {
      head: [loanColumns],
      body: loanData,
      startY: currentY,
      theme: 'grid',
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12
      },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      didDrawPage: function(data) {
        // Add header to each new page created by autoTable
        addHeaderToCurrentPage();
      }
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // Company Records Section
    checkForNewPage(45);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Company Records", 20, currentY);
    currentY += 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Company Money: Rs${totalCompanyMoney.toFixed(2)}`, 20, currentY);
    currentY += 15;

    const companyColumns = ["Amount", "Description", "Date"];
    const companyData = companyRecords.length > 0
      ? companyRecords.map(record => [
          `Rs${Number(record.amount).toFixed(2)}`,
          record.description,
          formatDate(record.date)
        ])
      : [['No company records', '', '']];

    autoTable(doc, {
      head: [companyColumns],
      body: companyData,
      startY: currentY,
      theme: 'grid',
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12
      },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      didDrawPage: function(data) {
        // Add header to each new page created by autoTable
        addHeaderToCurrentPage();
      }
    });

    currentY = doc.lastAutoTable.finalY + 20;

    // Signature Section - check if we need a new page for signature
    if (checkForNewPage(50) || currentY > pageHeight - 50) {
      // If we're too close to the bottom of the page, add a new page for signature
      currentY = 40; // Give some space at the top
    }

    // Signature Section
    if (signatureImage) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Authorized Signature", 20, currentY);
      currentY += 10;
      doc.addImage(signatureImage, 'PNG', 20, currentY, 60, 20); // Adjust size as needed
      currentY += 30;
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    // for(let i = 1; i <= pageCount; i++) {
    //   doc.setPage(i);
    //   doc.setFontSize(10);
    //   doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
    //   doc.text(`Generated on: ${formatDate(new Date())}`, 20, pageHeight - 10);
    // }

    doc.save(`expense_report_${formatDate(new Date()).replace(/-/g, '_')}.pdf`);
  };

  return (
    <div>
      <Button 
        onClick={() => setShowSignatureModal(true)} 
        text="Add Signature & Download PDF" 
        style={{ 
          marginTop: '20px',
          backgroundColor: '#2980b9',
          color: 'white',
          padding: '10px 20px'
        }} 
      />

      {showSignatureModal && (
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
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            width: '90%',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <h2>Add Your Signature</h2>
            <div style={{ border: '1px solid #ccc', backgroundColor: '#fff', margin: '10px auto' }}>
              <SignatureCanvas 
                ref={sigCanvas}
                canvasProps={{
                  width: 400,
                  height: 200,
                  className: 'signature-canvas'
                }}
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <Button 
                onClick={saveSignature} 
                text="Save Signature" 
                style={{ backgroundColor: '#4CAF50', marginRight: '10px' }}
              />
              <Button 
                onClick={clearSignature} 
                text="Clear" 
                style={{ backgroundColor: '#ff4444', marginRight: '10px' }}
              />
              <Button 
                onClick={() => setShowSignatureModal(false)} 
                text="Cancel" 
                style={{ backgroundColor: '#757575' }}
              />
            </div>
            {signatureImage && (
              <Button 
                onClick={generatePDF} 
                text="Download PDF" 
                style={{ 
                  marginTop: '10px',
                  backgroundColor: '#2980b9',
                  color: 'white'
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Show Generate PDF button outside the modal if signature is already captured */}
      {signatureImage && !showSignatureModal && (
        <Button 
          onClick={generatePDF} 
          text="Generate PDF Report" 
          style={{ 
            marginTop: '10px',
            backgroundColor: '#2980b9',
            color: 'white',
            padding: '10px 20px'
          }}
        />
      )}
    </div>
  );
}

export default PDFViewer;