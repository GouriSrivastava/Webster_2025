import React, { useState } from "react";
import BudgetSection from "./budget";

const TripPlanner = () => {
  const [form, setForm] = useState({ origin: "", destination: "", departureDate: "", budgetRange: "range1" });
  const [budgetData, setBudgetData] = useState(null);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budgetError, setBudgetError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBudgetLoading(true);
    setBudgetError(null);

    try {
      const res = await fetch("http://localhost:5000/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Budget fetch failed");
      setBudgetData(data);
    } catch (err) {
      setBudgetError(err.message);
    } finally {
      setBudgetLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Trip Planner</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Origin" value={form.origin}
          onChange={(e) => setForm({ ...form, origin: e.target.value })}
          className="border border-gray-300 rounded-lg p-3" required />

        <input type="text" placeholder="Destination" value={form.destination}
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
          className="border border-gray-300 rounded-lg p-3" required />

        <input type="date" value={form.departureDate}
          onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
          className="border border-gray-300 rounded-lg p-3" required />

        <select value={form.budgetRange}
          onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
          className="border border-gray-300 rounded-lg p-3">
          <option value="range1">₹0 - ₹30,000</option>
          <option value="range2">₹30,001 - ₹75,000</option>
          <option value="range3">₹75,001 - ₹1,00,000</option>
          <option value="range4">₹1,00,001 - ₹4,50,000</option>
        </select>

        <button type="submit"
          className="md:col-span-2 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition">
          {budgetLoading ? "Calculating..." : "Plan My Trip"}
        </button>
      </form>

      {/* BudgetSection */}
      <BudgetSection budgetData={budgetData} budgetLoading={budgetLoading} budgetError={budgetError} />
    </div>
  );
};

export default TripPlanner;
