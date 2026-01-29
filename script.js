// Social Media ROI Calculator JavaScript

let currentPlatform = 'all';
let roiData = {};
let roiChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializePlatformSelector();
    loadSavedData();
    setupInputListeners();
    calculateROI();
});

// Platform selection functionality
function initializePlatformSelector() {
    const platforms = document.querySelectorAll('.platform-option');
    platforms.forEach(platform => {
        platform.addEventListener('click', function() {
            // Remove active class from all platforms
            platforms.forEach(p => p.classList.remove('selected'));
            
            // Add active class to clicked platform
            this.classList.add('selected');
            
            // Update current platform
            currentPlatform = this.dataset.platform;
            
            // Load platform-specific data
            loadPlatformData();
            calculateROI();
        });
    });
}

// Input listeners for real-time calculation
function setupInputListeners() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(calculateROI, 500));
        input.addEventListener('blur', saveData);
    });
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Main ROI calculation function
function calculateROI() {
    const data = gatherInputData();
    const results = performCalculations(data);
    updateDisplay(results);
    updateChart(results);
    updateInsights(results);
    roiData = results;
}

// Gather all input data
function gatherInputData() {
    return {
        // Revenue sources
        directSales: parseFloat(document.getElementById('directSales').value) || 0,
        affiliateCommissions: parseFloat(document.getElementById('affiliateCommissions').value) || 0,
        sponsorships: parseFloat(document.getElementById('sponsorships').value) || 0,
        leadValue: parseFloat(document.getElementById('leadValue').value) || 0,
        brandAwareness: parseFloat(document.getElementById('brandAwareness').value) || 0,
        otherRevenue: parseFloat(document.getElementById('otherRevenue').value) || 0,
        
        // Cost sources
        timeSpent: parseFloat(document.getElementById('timeSpent').value) || 0,
        hourlyRate: parseFloat(document.getElementById('hourlyRate').value) || 50,
        adSpend: parseFloat(document.getElementById('adSpend').value) || 0,
        toolsCosts: parseFloat(document.getElementById('toolsCosts').value) || 0,
        contentCreation: parseFloat(document.getElementById('contentCreation').value) || 0,
        otherCosts: parseFloat(document.getElementById('otherCosts').value) || 0,
        
        // Performance metrics
        followers: parseFloat(document.getElementById('followers').value) || 0,
        engagement: parseFloat(document.getElementById('engagement').value) || 0,
        websiteTraffic: parseFloat(document.getElementById('websiteTraffic').value) || 0,
        conversions: parseFloat(document.getElementById('conversions').value) || 0
    };
}

// Perform all calculations
function performCalculations(data) {
    // Calculate totals
    const totalRevenue = data.directSales + data.affiliateCommissions + data.sponsorships + 
                        data.leadValue + data.brandAwareness + data.otherRevenue;
    
    const timeCosts = data.timeSpent * data.hourlyRate;
    const totalCosts = timeCosts + data.adSpend + data.toolsCosts + 
                      data.contentCreation + data.otherCosts;
    
    const netProfit = totalRevenue - totalCosts;
    const roi = totalCosts > 0 ? ((netProfit / totalCosts) * 100) : 0;
    
    // Calculate per-follower metrics
    const costPerFollower = data.followers > 0 ? totalCosts / data.followers : 0;
    const revenuePerFollower = data.followers > 0 ? totalRevenue / data.followers : 0;
    
    // Calculate conversion rate
    const conversionRate = data.websiteTraffic > 0 ? (data.conversions / data.websiteTraffic) * 100 : 0;
    
    // Calculate engagement metrics
    const engagementRate = data.followers > 0 ? (data.engagement / data.followers) * 100 : 0;
    
    // Cost breakdown
    const costBreakdown = [
        { label: 'Time Investment', value: timeCosts, percentage: totalCosts > 0 ? (timeCosts / totalCosts) * 100 : 0 },
        { label: 'Advertising Spend', value: data.adSpend, percentage: totalCosts > 0 ? (data.adSpend / totalCosts) * 100 : 0 },
        { label: 'Tools & Software', value: data.toolsCosts, percentage: totalCosts > 0 ? (data.toolsCosts / totalCosts) * 100 : 0 },
        { label: 'Content Creation', value: data.contentCreation, percentage: totalCosts > 0 ? (data.contentCreation / totalCosts) * 100 : 0 },
        { label: 'Other Costs', value: data.otherCosts, percentage: totalCosts > 0 ? (data.otherCosts / totalCosts) * 100 : 0 }
    ];
    
    // Revenue breakdown
    const revenueBreakdown = [
        { label: 'Direct Sales', value: data.directSales, percentage: totalRevenue > 0 ? (data.directSales / totalRevenue) * 100 : 0 },
        { label: 'Affiliate Commissions', value: data.affiliateCommissions, percentage: totalRevenue > 0 ? (data.affiliateCommissions / totalRevenue) * 100 : 0 },
        { label: 'Sponsorships', value: data.sponsorships, percentage: totalRevenue > 0 ? (data.sponsorships / totalRevenue) * 100 : 0 },
        { label: 'Lead Generation', value: data.leadValue, percentage: totalRevenue > 0 ? (data.leadValue / totalRevenue) * 100 : 0 },
        { label: 'Brand Awareness', value: data.brandAwareness, percentage: totalRevenue > 0 ? (data.brandAwareness / totalRevenue) * 100 : 0 },
        { label: 'Other Revenue', value: data.otherRevenue, percentage: totalRevenue > 0 ? (data.otherRevenue / totalRevenue) * 100 : 0 }
    ];
    
    return {
        totalRevenue,
        totalCosts,
        netProfit,
        roi,
        costPerFollower,
        revenuePerFollower,
        conversionRate,
        engagementRate,
        costBreakdown,
        revenueBreakdown,
        data
    };
}

// Update display with calculated results
function updateDisplay(results) {
    // Update main ROI display
    document.getElementById('roiNumber').textContent = results.roi.toFixed(1) + '%';
    
    // Update metrics cards
    document.getElementById('totalRevenue').textContent = formatCurrency(results.totalRevenue);
    document.getElementById('totalCosts').textContent = formatCurrency(results.totalCosts);
    document.getElementById('netProfit').textContent = formatCurrency(results.netProfit);
    document.getElementById('costPerFollower').textContent = formatCurrency(results.costPerFollower);
    document.getElementById('revenuePerFollower').textContent = formatCurrency(results.revenuePerFollower);
    document.getElementById('conversionRate').textContent = results.conversionRate.toFixed(2) + '%';
    
    // Update cost breakdown
    updateCostBreakdown(results.costBreakdown);
    
    // Color-code ROI based on performance
    const roiElement = document.getElementById('roiNumber');
    roiElement.className = 'roi-number';
    if (results.roi > 100) {
        roiElement.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    } else if (results.roi > 0) {
        roiElement.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
    } else {
        roiElement.style.background = 'linear-gradient(135deg, #dc3545, #e83e8c)';
    }
    roiElement.style.webkitBackgroundClip = 'text';
    roiElement.style.webkitTextFillColor = 'transparent';
    roiElement.style.backgroundClip = 'text';
}

// Format currency values
function formatCurrency(value) {
    if (value === 0) return '$0';
    if (value < 0) return '-$' + Math.abs(value).toFixed(2);
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return '$' + (value / 1000).toFixed(1) + 'K';
    return '$' + value.toFixed(2);
}

// Update cost breakdown list
function updateCostBreakdown(breakdown) {
    const container = document.getElementById('costBreakdown');
    container.innerHTML = '';
    
    breakdown.forEach(item => {
        if (item.value > 0) {
            const li = document.createElement('li');
            li.className = 'breakdown-item';
            li.innerHTML = `
                <span class="breakdown-label">
                    ${item.label} (${item.percentage.toFixed(1)}%)
                </span>
                <span class="breakdown-value">${formatCurrency(item.value)}</span>
            `;
            container.appendChild(li);
        }
    });
    
    if (container.innerHTML === '') {
        container.innerHTML = '<li class="breakdown-item"><span class="breakdown-label">No costs recorded</span></li>';
    }
}

// Update chart visualization
function updateChart(results) {
    const ctx = document.getElementById('roiChart').getContext('2d');
    
    if (roiChart) {
        roiChart.destroy();
    }
    
    const chartData = {
        labels: ['Revenue', 'Costs', 'Net Profit'],
        datasets: [{
            label: 'Financial Overview',
            data: [results.totalRevenue, results.totalCosts, results.netProfit],
            backgroundColor: [
                '#28a745',
                '#dc3545',
                results.netProfit >= 0 ? '#17a2b8' : '#6c757d'
            ],
            borderColor: [
                '#1e7e34',
                '#c82333',
                results.netProfit >= 0 ? '#138496' : '#5a6268'
            ],
            borderWidth: 2
        }]
    };
    
    roiChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y >= 0 ? 
                                formatCurrency(context.parsed.y) : 
                                '-' + formatCurrency(Math.abs(context.parsed.y));
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Generate insights and recommendations
function updateInsights(results) {
    const insights = generateInsights(results);
    const container = document.getElementById('insightCards');
    container.innerHTML = '';
    
    insights.forEach(insight => {
        const card = document.createElement('div');
        card.className = `insight-card ${insight.type}`;
        card.innerHTML = `
            <div class="insight-title">
                <span class="status-indicator status-${insight.status}"></span>
                ${insight.title}
            </div>
            <div class="insight-text">${insight.text}</div>
        `;
        container.appendChild(card);
    });
}

// Generate insight recommendations
function generateInsights(results) {
    const insights = [];
    
    // ROI Analysis
    if (results.roi > 200) {
        insights.push({
            type: 'success',
            status: 'good',
            title: 'Excellent ROI Performance',
            text: `Your ${results.roi.toFixed(1)}% ROI is outstanding! Consider scaling your successful strategies and documenting what's working for future campaigns.`
        });
    } else if (results.roi > 100) {
        insights.push({
            type: 'success',
            status: 'good',
            title: 'Positive ROI',
            text: `Your ${results.roi.toFixed(1)}% ROI is profitable. Look for opportunities to optimize conversion rates and reduce cost per acquisition.`
        });
    } else if (results.roi > 0) {
        insights.push({
            type: 'warning',
            status: 'warning',
            title: 'Break-Even Performance',
            text: `Your ${results.roi.toFixed(1)}% ROI is marginally profitable. Focus on increasing conversion rates or reducing operational costs.`
        });
    } else {
        insights.push({
            type: 'danger',
            status: 'poor',
            title: 'Negative ROI',
            text: `Your ${results.roi.toFixed(1)}% ROI indicates losses. Review your strategy, reduce costs, or improve revenue generation methods.`
        });
    }
    
    // Cost Analysis
    const timeCostPercentage = results.totalCosts > 0 ? 
        ((results.data.timeSpent * results.data.hourlyRate) / results.totalCosts) * 100 : 0;
    
    if (timeCostPercentage > 70) {
        insights.push({
            type: 'warning',
            status: 'warning',
            title: 'High Time Investment',
            text: `${timeCostPercentage.toFixed(1)}% of your costs are time-based. Consider automating tasks or hiring support to scale efficiently.`
        });
    }
    
    if (results.data.adSpend > 0 && results.totalCosts > 0) {
        const adSpendPercentage = (results.data.adSpend / results.totalCosts) * 100;
        if (adSpendPercentage > 50) {
            insights.push({
                type: 'warning',
                status: 'warning',
                title: 'High Ad Spend Ratio',
                text: `${adSpendPercentage.toFixed(1)}% of costs are advertising. Monitor ROAS closely and test organic growth strategies.`
            });
        }
    }
    
    // Conversion Analysis
    if (results.conversionRate < 1 && results.data.websiteTraffic > 0) {
        insights.push({
            type: 'warning',
            status: 'warning',
            title: 'Low Conversion Rate',
            text: `Your ${results.conversionRate.toFixed(2)}% conversion rate has room for improvement. Consider A/B testing your landing pages and call-to-actions.`
        });
    } else if (results.conversionRate > 5) {
        insights.push({
            type: 'success',
            status: 'good',
            title: 'Strong Conversion Rate',
            text: `Your ${results.conversionRate.toFixed(2)}% conversion rate is excellent! This indicates high-quality traffic and effective messaging.`
        });
    }
    
    // Follower Efficiency
    if (results.revenuePerFollower > 1) {
        insights.push({
            type: 'success',
            status: 'good',
            title: 'Engaged Audience',
            text: `${formatCurrency(results.revenuePerFollower)} revenue per follower shows strong audience engagement and monetization.`
        });
    } else if (results.data.followers > 1000 && results.revenuePerFollower < 0.1) {
        insights.push({
            type: 'warning',
            status: 'warning',
            title: 'Monetization Opportunity',
            text: `With ${results.data.followers.toLocaleString()} followers but low revenue per follower, focus on improving monetization strategies.`
        });
    }
    
    // Engagement Analysis
    if (results.engagementRate > 5) {
        insights.push({
            type: 'success',
            status: 'good',
            title: 'High Engagement',
            text: `Your ${results.engagementRate.toFixed(1)}% engagement rate indicates strong audience connection. Leverage this for partnerships and sales.`
        });
    } else if (results.engagementRate < 1 && results.data.followers > 0) {
        insights.push({
            type: 'warning',
            status: 'warning',
            title: 'Low Engagement',
            text: `${results.engagementRate.toFixed(1)}% engagement suggests content isn't resonating. Try different content types and posting times.`
        });
    }
    
    // General recommendations
    if (results.totalRevenue === 0 && results.totalCosts > 0) {
        insights.push({
            type: 'danger',
            status: 'poor',
            title: 'No Tracked Revenue',
            text: 'Consider implementing better tracking for indirect benefits like brand awareness, lead generation, and customer acquisition.'
        });
    }
    
    return insights;
}

// Data persistence
function saveData() {
    const data = gatherInputData();
    data.platform = currentPlatform;
    localStorage.setItem(`socialMediaROI_${currentPlatform}`, JSON.stringify(data));
}

function loadSavedData() {
    const saved = localStorage.getItem(`socialMediaROI_${currentPlatform}`);
    if (saved) {
        const data = JSON.parse(saved);
        populateInputs(data);
    }
}

function populateInputs(data) {
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key);
        if (element && data[key] !== undefined) {
            element.value = data[key];
        }
    });
}

function loadPlatformData() {
    loadSavedData();
}

// Export functionality
function exportToPDF() {
    // Create a simplified view for PDF export
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Social Media ROI Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .metric { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; text-align: center; }
                .metric-value { font-size: 24px; font-weight: bold; color: #667eea; }
                .metric-label { font-size: 14px; color: #666; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Social Media ROI Report</h1>
                <p>Platform: ${currentPlatform.toUpperCase()}</p>
                <p>Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="metric">
                <div class="metric-value">${roiData.roi ? roiData.roi.toFixed(1) : 0}%</div>
                <div class="metric-label">ROI</div>
            </div>
            
            <div class="metric">
                <div class="metric-value">${formatCurrency(roiData.totalRevenue || 0)}</div>
                <div class="metric-label">Total Revenue</div>
            </div>
            
            <div class="metric">
                <div class="metric-value">${formatCurrency(roiData.totalCosts || 0)}</div>
                <div class="metric-label">Total Costs</div>
            </div>
            
            <div class="metric">
                <div class="metric-value">${formatCurrency(roiData.netProfit || 0)}</div>
                <div class="metric-label">Net Profit</div>
            </div>
            
            <table>
                <tr><th>Metric</th><th>Value</th></tr>
                <tr><td>Cost per Follower</td><td>${formatCurrency(roiData.costPerFollower || 0)}</td></tr>
                <tr><td>Revenue per Follower</td><td>${formatCurrency(roiData.revenuePerFollower || 0)}</td></tr>
                <tr><td>Conversion Rate</td><td>${(roiData.conversionRate || 0).toFixed(2)}%</td></tr>
            </table>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function exportToCSV() {
    const data = gatherInputData();
    const csv = [
        ['Metric', 'Value'],
        ['Platform', currentPlatform],
        ['Total Revenue', roiData.totalRevenue || 0],
        ['Total Costs', roiData.totalCosts || 0],
        ['Net Profit', roiData.netProfit || 0],
        ['ROI (%)', roiData.roi || 0],
        ['Cost per Follower', roiData.costPerFollower || 0],
        ['Revenue per Follower', roiData.revenuePerFollower || 0],
        ['Conversion Rate (%)', roiData.conversionRate || 0],
        ['', ''],
        ['Input Data', ''],
        ['Direct Sales', data.directSales],
        ['Affiliate Commissions', data.affiliateCommissions],
        ['Sponsorships', data.sponsorships],
        ['Lead Value', data.leadValue],
        ['Brand Awareness', data.brandAwareness],
        ['Other Revenue', data.otherRevenue],
        ['Time Spent (hours)', data.timeSpent],
        ['Hourly Rate', data.hourlyRate],
        ['Ad Spend', data.adSpend],
        ['Tools Costs', data.toolsCosts],
        ['Content Creation', data.contentCreation],
        ['Other Costs', data.otherCosts],
        ['Followers', data.followers],
        ['Engagement', data.engagement],
        ['Website Traffic', data.websiteTraffic],
        ['Conversions', data.conversions]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-media-roi-${currentPlatform}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function shareResults() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    const data = gatherInputData();
    
    // Encode key metrics in URL
    params.append('roi', (roiData.roi || 0).toFixed(1));
    params.append('revenue', roiData.totalRevenue || 0);
    params.append('costs', roiData.totalCosts || 0);
    params.append('platform', currentPlatform);
    
    url.search = params.toString();
    
    navigator.clipboard.writeText(url.toString()).then(() => {
        showNotification('Share link copied to clipboard! 🔗');
    }).catch(() => {
        prompt('Copy this link to share your results:', url.toString());
    });
}

// Notification system
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, duration);
}

// Load URL parameters if shared
function loadSharedData() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('roi')) {
        showNotification('Loaded shared ROI data! 📊');
    }
}

// Initialize shared data on load
document.addEventListener('DOMContentLoaded', loadSharedData);