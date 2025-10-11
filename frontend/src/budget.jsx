import React, { useState } from "react";

const BudgetSection = ({ budgetData, budgetLoading, budgetError }) => {
  const [budgetOpen, setBudgetOpen] = useState(false);

  if (!budgetData?.data && !budgetLoading && !budgetError) return null;

  return (
    <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* --- Toggle Header --- */}
      <button
        type="button"
        onClick={() => setBudgetOpen(!budgetOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 transition-colors"
      >
        <div className="flex items-center">
          <div className="bg-teal-100 p-2 rounded-lg mr-3">
            <svg
              className="w-6 h-6 text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold tracking-wide text-gray-800">
              Budget Summary
            </h3>
            {budgetLoading && (
              <p className="text-sm text-gray-600">
                Optimizing your budget...
              </p>
            )}
            {budgetError && (
              <p className="text-sm text-red-600">{budgetError}</p>
            )}
          </div>
        </div>

        {/* Arrow */}
        <svg
          className={`w-5 h-5 text-gray-600 transform transition-transform ${
            budgetOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* --- Collapsible Content --- */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          budgetOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-6 py-4 bg-white">
          {budgetData?.summary && (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
              {budgetData.summary}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["flights", "hotels", "food"].map((cat) => (
              <div
                key={cat}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h4 className="text-sm font-semibold text-gray-800 mb-2 capitalize">
                  {cat} (suggested)
                </h4>

                {(budgetData?.data?.[cat] || []).slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span className="truncate mr-2">{item.name}</span>
                    <span className="font-semibold text-gray-900">
                      {item.price
                        ? `₹${Number(item.price).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                ))}

                {(budgetData?.data?.[cat] || []).length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-100 text-sm font-medium text-gray-700">
                    Total: ₹
                    {(
                      budgetData.data[cat]
                        .slice(0, 3)
                        .reduce((sum, x) => sum + Number(x.price || 0), 0)
                    ).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSection;
