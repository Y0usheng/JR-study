// src/App.jsx
import { useState } from 'react'
import './App.css'

// 1. 税率数据配置
const TAX_DATA = {
  '2023-24': [
    { min: 0, max: 18200, rate: 0, base: 0 },
    { min: 18201, max: 45000, rate: 0.19, base: 0 },
    { min: 45001, max: 120000, rate: 0.325, base: 5092 },
    { min: 120001, max: 180000, rate: 0.37, base: 29467 },
    { min: 180001, max: Infinity, rate: 0.45, base: 51667 }
  ],
  '2024-25': [
    { min: 0, max: 18200, rate: 0, base: 0 },
    { min: 18201, max: 45000, rate: 0.16, base: 0 },
    { min: 45001, max: 135000, rate: 0.30, base: 4288 },
    { min: 135001, max: 190000, rate: 0.37, base: 31288 },
    { min: 190001, max: Infinity, rate: 0.45, base: 51638 }
  ],
  '2025-26': [
    { min: 0, max: 18200, rate: 0, base: 0 },
    { min: 18201, max: 45000, rate: 0.16, base: 0 },
    { min: 45001, max: 135000, rate: 0.30, base: 4288 },
    { min: 135001, max: 190000, rate: 0.37, base: 31288 },
    { min: 190001, max: Infinity, rate: 0.45, base: 51638 }
  ]
};

const formatCurrency = (val) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(val);

function App() {
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [income, setIncome] = useState('');
  const [result, setResult] = useState(null);

  const currentBrackets = TAX_DATA[selectedYear];

  const handleCalculate = () => {
    const incomeNum = parseFloat(income);

    if (!income || isNaN(incomeNum) || incomeNum < 0) {
      alert("Please enter a valid positive income amount.");
      return;
    }

    let tax = 0;

    for (let bracket of currentBrackets) {
      if (incomeNum <= bracket.max || bracket.max === Infinity) {
        const threshold = bracket.min > 0 ? bracket.min - 1 : 0;
        const taxableAmount = incomeNum - threshold;
        tax = (taxableAmount * bracket.rate) + bracket.base;
        break;
      }
    }

    if (incomeNum <= 18200) tax = 0;

    // --- 新增：计算有效税率 ---
    const effectiveRate = incomeNum > 0 ? (tax / incomeNum) * 100 : 0;

    setResult({
      originalIncome: incomeNum, // 保存原始收入用于显示
      tax: tax,
      net: incomeNum - tax,
      rate: effectiveRate
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Australian Income Tax Calculator</h1>
        <p>Calculate your income tax based on ATO rates</p>
      </header>

      <section className="card">
        <h2 style={{ fontSize: '16px', marginBottom: '12px' }}>Select Financial Year</h2>
        <div className="year-selector-group">
          {Object.keys(TAX_DATA).map(year => (
            <button
              key={year}
              className={`year-btn ${selectedYear === year ? 'active' : ''}`}
              onClick={() => {
                setSelectedYear(year);
                setResult(null);
              }}
            >
              FY {year}
            </button>
          ))}
        </div>
      </section>

      <main className="main-grid">
        <div className="card">
          <h2>Tax Rates - FY {selectedYear}</h2>
          <table className="tax-table">
            <thead>
              <tr>
                <th>Taxable Income</th>
                <th>Tax Rate</th>
              </tr>
            </thead>
            <tbody>
              {currentBrackets.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    {row.max === Infinity
                      ? `${formatCurrency(row.min)} and above`
                      : `${formatCurrency(row.min)} – ${formatCurrency(row.max)}`
                    }
                  </td>
                  <td>
                    {row.rate === 0
                      ? 'Nil'
                      : `${(row.rate * 100).toFixed(1)}%` + (row.base > 0 ? ` + ${formatCurrency(row.base)}` : '')
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Calculate Tax</h2>
          <div className="input-group">
            <label className="input-label">Annual Taxable Income</label>
            <div className="input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                className="income-input"
                placeholder="0.00"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              />
            </div>
          </div>

          <button className="calculate-btn" onClick={handleCalculate}>
            Calculate Tax
          </button>

          {/* --- 修改：结果展示区域 --- */}
          {result && (
            <div className="result-box">
              <h3>Results</h3>

              <div className="result-row">
                <span>Taxable Income:</span>
                <span>{formatCurrency(result.originalIncome)}</span>
              </div>

              <div className="result-row">
                <span>Income Tax:</span>
                <span className="text-highlight">{formatCurrency(result.tax)}</span>
              </div>

              {/* 分割线 */}
              <div className="result-divider"></div>

              <div className="result-row">
                <span>Net Income:</span>
                <span>{formatCurrency(result.net)}</span>
              </div>

              <div className="result-row">
                <span>Effective Tax Rate:</span>
                <span>{result.rate.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App