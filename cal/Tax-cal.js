const readline = require('readline');

// 创建命令行交互接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const TAX_BRACKETS = [
    { threshold: 18200, rate: 0 },
    { threshold: 45000, rate: 0.16 },
    { threshold: 135000, rate: 0.30 },
    { threshold: 190000, rate: 0.37 },
    { threshold: Infinity, rate: 0.45 }
];

/**
 * 计算税额的核心函数
 * @param {number} income - 年度应税收入
 * @returns {object} - 包含总税额、实发工资和税率详情
 */
function calculateTax(income) {
    let tax = 0;
    let previousThreshold = 0;
    let breakdown = []; // 用于记录每层级的计算详情

    for (const bracket of TAX_BRACKETS) {
        // 如果收入低于当前层级的起征点，说明计算结束（或不需要在这一层交税）
        if (income <= previousThreshold) {
            break;
        }

        // 计算当前层级的应税额度
        // 取 (当前层级上限) 和 (总收入) 中较小的一个，减去 (上一层级上限)
        const currentBracketCap = Math.min(income, bracket.threshold);
        const taxableAmountInBracket = currentBracketCap - previousThreshold;

        if (taxableAmountInBracket > 0) {
            const taxInBracket = taxableAmountInBracket * bracket.rate;
            tax += taxInBracket;

            breakdown.push({
                range: `$${previousThreshold + 1} - $${bracket.threshold === Infinity ? '∞' : bracket.threshold}`,
                amount: taxableAmountInBracket,
                rate: `${(bracket.rate * 100).toFixed(0)}%`,
                tax: taxInBracket
            });
        }

        previousThreshold = bracket.threshold;
    }

    return {
        totalTax: tax,
        netIncome: income - tax,
        breakdown: breakdown
    };
}

/**
 * 主程序逻辑
 */
console.log("=== Node.js Income Tax Calculator ===");

rl.question('Please enter your Annual Taxable Income: $', (input) => {
    // 1. 输入验证
    const income = parseFloat(input);

    if (isNaN(income) || income < 0) {
        console.error("Error: Please enter a valid positive number.");
        rl.close();
        return;
    }

    // 2. 执行计算
    const result = calculateTax(income);

    // 3. 格式化输出结果
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    console.log(`\n--- Calculation Result for ${formatter.format(income)} ---`);

    // 输出详细的分层计算过程 (可选)
    console.log("\nTax Breakdown:");
    result.breakdown.forEach(item => {
        console.log(`  Zone [${item.range}]: Taxable $${item.amount} @ ${item.rate} = ${formatter.format(item.tax)}`);
    });

    console.log("\n---------------------------------");
    console.log(`Total Tax Payable:  ${formatter.format(result.totalTax)}`);
    console.log(`Net Income (After Tax): ${formatter.format(result.netIncome)}`);
    console.log("---------------------------------");

    rl.close();
});