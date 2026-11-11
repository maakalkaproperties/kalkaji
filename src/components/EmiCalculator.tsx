'use client';

import React, { useState } from 'react';
import { BadgeIndianRupee, Calculator, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';
import { formatIndianPrice } from '@/lib/utils';

interface EmiCalculatorProps {
  propertyPrice?: number;
}

export default function EmiCalculator({ propertyPrice = 15000000 }: EmiCalculatorProps) {
  // Default loan is 80% of property price
  const defaultLoan = Math.round(propertyPrice * 0.8);
  const [loanAmount, setLoanAmount] = useState(defaultLoan);
  const [interestRate, setInterestRate] = useState(8.4);
  const [tenureYears, setTenureYears] = useState(20);

  // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
            Home Loan Assistant
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-red-600" />
            <span>Estimated Monthly EMI Calculator</span>
          </h3>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-500 block">Monthly EMI</span>
          <span className="text-2xl sm:text-3xl font-black text-red-600">
            ₹{emi.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-semibold text-slate-500">/mo</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Loan Amount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Loan Amount</span>
              <span className="text-red-600 font-extrabold">{formatIndianPrice(loanAmount)}</span>
            </div>
            <input
              type="range"
              min={1000000}
              max={Math.max(50000000, propertyPrice)}
              step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹10 Lacs</span>
              <span>₹5 Cr+</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Interest Rate (% per annum)</span>
              <span className="text-red-600 font-extrabold">{interestRate}%</span>
            </div>
            <input
              type="range"
              min={7.5}
              max={12.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>7.5% (Prime)</span>
              <span>12.0%</span>
            </div>
          </div>

          {/* Loan Tenure Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Loan Tenure (Years)</span>
              <span className="text-red-600 font-extrabold">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Breakdown Card (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Loan Payment Summary
          </div>

          <div className="flex justify-between text-xs py-1 border-b border-slate-200/60">
            <span className="text-slate-600">Principal Amount:</span>
            <span className="font-bold text-slate-900">{formatIndianPrice(loanAmount)}</span>
          </div>

          <div className="flex justify-between text-xs py-1 border-b border-slate-200/60">
            <span className="text-slate-600">Total Interest Payable:</span>
            <span className="font-bold text-red-600">{formatIndianPrice(totalInterest)}</span>
          </div>

          <div className="flex justify-between text-xs py-1 border-b border-slate-200/60">
            <span className="text-slate-600">Total Payment:</span>
            <span className="font-extrabold text-slate-900">{formatIndianPrice(totalPayment)}</span>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Pre-approved tie-ups: SBI, HDFC, ICICI &amp; Axis Bank</span>
          </div>
        </div>
      </div>
    </div>
  );
}
