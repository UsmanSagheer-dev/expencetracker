import { useState, useEffect } from "react";

const useTracker = () => {
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
    date: new Date().toLocaleDateString(),
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
    date: new Date().toLocaleDateString(),
  });
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
    if (expenses.length > 0)
      localStorage.setItem("expenses", JSON.stringify(expenses));
    if (loans.length > 0) localStorage.setItem("loans", JSON.stringify(loans));
    if (companyRecords.length > 0)
      localStorage.setItem("companyRecords", JSON.stringify(companyRecords));
  }, [budget, expenses, loans, companyRecords]);

  // Handle selections
  const handleSelectExpense = (index) => {
    if (selectedExpenses.includes(index)) {
      setSelectedExpenses(selectedExpenses.filter((i) => i !== index));
    } else {
      setSelectedExpenses([...selectedExpenses, index]);
    }
  };

  const handleSelectLoan = (id) => {
    if (selectedLoans.includes(id)) {
      setSelectedLoans(selectedLoans.filter((i) => i !== id));
    } else {
      setSelectedLoans([...selectedLoans, id]);
    }
  };

  const handleSelectCompanyRecord = (id) => {
    if (selectedCompanyRecords.includes(id)) {
      setSelectedCompanyRecords(selectedCompanyRecords.filter((i) => i !== id));
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
      setSelectedLoans(loans.map((loan) => loan.id));
    }
  };

  const handleSelectAllCompanyRecords = () => {
    if (selectedCompanyRecords.length === companyRecords.length) {
      setSelectedCompanyRecords([]);
    } else {
      setSelectedCompanyRecords(companyRecords.map((record) => record.id));
    }
  };

  // Handle delete confirmation
  const confirmDelete = (type) => {
    setDeleteType(type);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = () => {
    if (deleteType === "expenses") {
      setExpenses(
        expenses.filter((_, index) => !selectedExpenses.includes(index))
      );
      setSelectedExpenses([]);
    } else if (deleteType === "loans") {
      setLoans(loans.filter((loan) => !selectedLoans.includes(loan.id)));
      setSelectedLoans([]);
    } else if (deleteType === "companyRecords") {
      setCompanyRecords(
        companyRecords.filter(
          (record) => !selectedCompanyRecords.includes(record.id)
        )
      );
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
    if (
      newExpense.title &&
      newExpense.quantity &&
      newExpense.unitPrice &&
      newExpense.unit
    ) {
      const totalAmount =
        parseFloat(newExpense.quantity) * parseFloat(newExpense.unitPrice);
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
      setLoans([
        ...loans,
        {
          ...newLoan,
          id: Date.now(),
          date: new Date().toLocaleDateString(),
        },
      ]);
      setNewLoan({
        personName: "",
        amount: "",
        type: "borrowed",
        date: new Date().toLocaleDateString(),
      });
      setShowLoanModal(false);
    }
  };

  const deleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  const deleteLoan = (id) => {
    setLoans(loans.filter((loan) => loan.id !== id));
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
    setNewCompanyRecord({
      ...newCompanyRecord,
      [e.target.name]: e.target.value,
    });
  };

  const addCompanyRecord = () => {
    if (newCompanyRecord.amount && newCompanyRecord.description) {
      setCompanyRecords([
        ...companyRecords,
        {
          ...newCompanyRecord,
          id: Date.now(),
          date: new Date().toLocaleDateString(),
        },
      ]);
      setNewCompanyRecord({
        amount: "",
        description: "",
        date: new Date().toLocaleDateString(),
      });
      setShowCompanyModal(false);
    }
  };

  const deleteCompanyRecord = (id) => {
    setCompanyRecords(companyRecords.filter((record) => record.id !== id));
  };

  const totalExpenses = expenses.reduce((total, exp) => total + exp.amount, 0);
  const totalBorrowed = loans
    .filter((loan) => loan.type === "borrowed")
    .reduce((total, loan) => total + Number(loan.amount), 0);
  const totalLent = loans
    .filter((loan) => loan.type === "lent")
    .reduce((total, loan) => total + Number(loan.amount), 0);
  const totalCompanyMoney = companyRecords.reduce(
    (total, record) => total + Number(record.amount),
    0
  );

  return {
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
    setBudget,
    setShowModal,
    setShowLoanModal,
    setShowCompanyModal,
    setShowConfirmDelete,
    handleSelectExpense,
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
  };
};

export default useTracker;
