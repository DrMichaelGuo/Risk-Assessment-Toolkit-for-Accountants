// Risk Assessment Toolkit JavaScript
// Apple-style interactions and functionality

// Risk data for the assessment
const riskData = [
    {
        id: 1,
        factor: "Output from AI tool contains financial misstatement",
        defaultLikelihood: 3,
        defaultImpact: 4,
        category: "Accuracy & Assurance",
        notes: "Add human review and sign-off"
    },
    {
        id: 2,
        factor: "Sensitive data is leaked via prompt input",
        defaultLikelihood: 2,
        defaultImpact: 4,
        category: "Data Privacy",
        notes: "Use redaction guide + private model"
    },
    {
        id: 3,
        factor: "Audit trail cannot reproduce AI decision",
        defaultLikelihood: 3,
        defaultImpact: 3,
        category: "Accuracy & Assurance",
        notes: "Log prompts and outputs; pin model version"
    },
    {
        id: 4,
        factor: "Users lack technical understanding of AI tool",
        defaultLikelihood: 4,
        defaultImpact: 2,
        category: "Skills Gap",
        notes: "Run CPD training and sandbox testing"
    },
    {
        id: 5,
        factor: "AI generates biased or non-compliant outcomes",
        defaultLikelihood: 2,
        defaultImpact: 4,
        category: "Data Privacy",
        notes: "Conduct periodic bias audits"
    },
    {
        id: 6,
        factor: "Vendor platform becomes unavailable mid-cycle",
        defaultLikelihood: 2,
        defaultImpact: 3,
        category: "Vendor / Tech Dependency",
        notes: "Check SLA uptime; plan failover"
    },
    {
        id: 7,
        factor: "Regulatory breach (GDPR, ISA) due to misuse",
        defaultLikelihood: 2,
        defaultImpact: 4,
        category: "Data Privacy",
        notes: "Legal sign-off + DPIA required"
    },
    {
        id: 8,
        factor: "Cost of implementation exceeds benefits",
        defaultLikelihood: 3,
        defaultImpact: 2,
        category: "Vendor / Tech Dependency",
        notes: "Model ROI before scaling"
    },
    {
        id: 9,
        factor: "Stakeholders reject or mistrust AI-generated output",
        defaultLikelihood: 3,
        defaultImpact: 2,
        category: "Skills Gap",
        notes: "Include explainability in outputs"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    populateAssessment();
    calculateRisks();
    addScrollAnimations();
    initializeMatrixInteractions();
});

// Navigation functionality
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        }
    });
}

// Populate the assessment table
function populateAssessment() {
    const container = document.getElementById('risk-items');
    container.innerHTML = '';

    riskData.forEach(risk => {
        const riskItem = document.createElement('div');
        riskItem.className = 'risk-item';
        riskItem.innerHTML = `
            <div class="risk-factor">${risk.factor}</div>
            <div>
                <input type="number" 
                       class="risk-input likelihood-input" 
                       min="1" max="4" 
                       value="${risk.defaultLikelihood}"
                       data-risk-id="${risk.id}"
                       onchange="calculateRisks()">
            </div>
            <div>
                <input type="number" 
                       class="risk-input impact-input" 
                       min="1" max="4" 
                       value="${risk.defaultImpact}"
                       data-risk-id="${risk.id}"
                       onchange="calculateRisks()">
            </div>
            <div>
                <div class="risk-score" id="score-${risk.id}">
                    ${risk.defaultLikelihood * risk.defaultImpact}
                </div>
            </div>
            <div class="risk-notes">${risk.notes}</div>
        `;
        container.appendChild(riskItem);
    });
}

// Calculate risk scores and update display
function calculateRisks() {
    let totalRisks = 0;
    let criticalRisks = 0;
    let highRisks = 0;
    let mediumRisks = 0;
    let lowRisks = 0;

    const categoryStats = {};

    riskData.forEach(risk => {
        const likelihoodInput = document.querySelector(`input.likelihood-input[data-risk-id="${risk.id}"]`);
        const impactInput = document.querySelector(`input.impact-input[data-risk-id="${risk.id}"]`);
        const scoreElement = document.getElementById(`score-${risk.id}`);

        if (likelihoodInput && impactInput && scoreElement) {
            const likelihood = parseInt(likelihoodInput.value) || 1;
            const impact = parseInt(impactInput.value) || 1;
            const score = likelihood * impact;

            // Update score display
            scoreElement.textContent = score;
            scoreElement.className = 'risk-score ' + getRiskLevel(score);

            // Update statistics
            totalRisks++;
            if (score >= 12) criticalRisks++;
            else if (score >= 9) highRisks++;
            else if (score >= 5) mediumRisks++;
            else lowRisks++;

            // Update category statistics
            if (!categoryStats[risk.category]) {
                categoryStats[risk.category] = { total: 0, high: 0, critical: 0 };
            }
            categoryStats[risk.category].total++;
            if (score >= 9) categoryStats[risk.category].high++;
            if (score >= 12) categoryStats[risk.category].critical++;
        }
    });

    // Update dashboard
    updateDashboard(totalRisks, criticalRisks, highRisks, mediumRisks, lowRisks);
    updateCharts(categoryStats);
}

// Get risk level based on score
function getRiskLevel(score) {
    if (score >= 12) return 'critical';
    if (score >= 9) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
}

// Update dashboard statistics
function updateDashboard(total, critical, high, medium, low) {
    document.getElementById('total-risks').textContent = total;
    document.getElementById('critical-risks').textContent = critical;
    document.getElementById('high-risks').textContent = high;
    document.getElementById('medium-risks').textContent = medium;
}

// Update charts (simplified version)
function updateCharts(categoryStats) {
    const riskChartElement = document.getElementById('risk-chart');
    const categoryChartElement = document.getElementById('category-chart');

    // Create simple visual representations
    const totalRisks = riskData.length;
    const criticalCount = document.getElementById('critical-risks').textContent;
    const highCount = document.getElementById('high-risks').textContent;
    const mediumCount = document.getElementById('medium-risks').textContent;
    const lowCount = totalRisks - criticalCount - highCount - mediumCount;

    // Risk distribution chart
    riskChartElement.innerHTML = `
        <div style="display: flex; height: 200px; align-items: end; gap: 10px; justify-content: center;">
            <div style="background: var(--risk-low); width: 40px; height: ${(lowCount / totalRisks) * 150}px; border-radius: 4px; position: relative;">
                <span style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-secondary);">Low</span>
            </div>
            <div style="background: var(--risk-medium); width: 40px; height: ${(mediumCount / totalRisks) * 150}px; border-radius: 4px; position: relative;">
                <span style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-secondary);">Med</span>
            </div>
            <div style="background: var(--risk-high); width: 40px; height: ${(highCount / totalRisks) * 150}px; border-radius: 4px; position: relative;">
                <span style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-secondary);">High</span>
            </div>
            <div style="background: var(--risk-critical); width: 40px; height: ${(criticalCount / totalRisks) * 150}px; border-radius: 4px; position: relative;">
                <span style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-secondary);">Crit</span>
            </div>
        </div>
    `;

    // Category breakdown
    let categoryHtml = '';
    Object.keys(categoryStats).forEach(category => {
        const stats = categoryStats[category];
        categoryHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--gray-2);">
                <span style="font-size: 14px; font-weight: 500;">${category}</span>
                <div style="display: flex; gap: 8px;">
                    <span style="background: var(--risk-high); color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${stats.high}</span>
                    <span style="background: var(--risk-critical); color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${stats.critical}</span>
                </div>
            </div>
        `;
    });
    categoryChartElement.innerHTML = categoryHtml;
}

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .action-card, .download-card, .dashboard-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize matrix interactions
function initializeMatrixInteractions() {
    document.querySelectorAll('.risk-cell').forEach(cell => {
        cell.addEventListener('click', function() {
            const risk = this.getAttribute('data-risk');
            showRiskTooltip(this, risk);
        });
    });
}

// Show risk tooltip
function showRiskTooltip(element, riskScore) {
    // Remove existing tooltips
    document.querySelectorAll('.risk-tooltip').forEach(tooltip => tooltip.remove());

    const tooltip = document.createElement('div');
    tooltip.className = 'risk-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        transform: translateX(-50%);
    `;
    tooltip.textContent = `Risk Score: ${riskScore}`;

    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top - 40 + 'px';

    document.body.appendChild(tooltip);

    // Remove tooltip after 2 seconds
    setTimeout(() => {
        tooltip.remove();
    }, 2000);
}

// Utility functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Export functionality
function exportResults() {
    const results = [];
    
    riskData.forEach(risk => {
        const likelihoodInput = document.querySelector(`input.likelihood-input[data-risk-id="${risk.id}"]`);
        const impactInput = document.querySelector(`input.impact-input[data-risk-id="${risk.id}"]`);
        
        if (likelihoodInput && impactInput) {
            const likelihood = parseInt(likelihoodInput.value) || 1;
            const impact = parseInt(impactInput.value) || 1;
            const score = likelihood * impact;
            
            results.push({
                'Risk Factor': risk.factor,
                'Category': risk.category,
                'Likelihood': likelihood,
                'Impact': impact,
                'Risk Score': score,
                'Risk Level': getRiskLevel(score).toUpperCase(),
                'Notes': risk.notes
            });
        }
    });

    // Convert to CSV
    const csvContent = convertToCSV(results);
    downloadCSV(csvContent, 'risk-assessment-results.csv');

    // Show success message
    showNotification('Assessment results exported successfully!', 'success');
}

// Convert data to CSV format
function convertToCSV(data) {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header] || '';
                // Escape commas and quotes
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value.replace(/"/g, '""')}"` 
                    : value;
            }).join(',')
        )
    ].join('\n');
    
    return csvContent;
}

// Download CSV file
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Reset assessment
function resetAssessment() {
    if (confirm('Are you sure you want to reset all assessment scores to default values?')) {
        riskData.forEach(risk => {
            const likelihoodInput = document.querySelector(`input.likelihood-input[data-risk-id="${risk.id}"]`);
            const impactInput = document.querySelector(`input.impact-input[data-risk-id="${risk.id}"]`);
            
            if (likelihoodInput) likelihoodInput.value = risk.defaultLikelihood;
            if (impactInput) impactInput.value = risk.defaultImpact;
        });
        
        calculateRisks();
        showNotification('Assessment reset to default values', 'info');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: var(--shadow-large);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}



// How To Use Modal Functions
function showHowToUse() {
    const modal = document.getElementById('howToUseModal');
    modal.classList.add('show');
    
    // Add event listener for escape key
    document.addEventListener('keydown', closeModalOnEscape);
    
    // Add event listener for clicking outside
    modal.addEventListener('click', closeModalOnOutsideClick);
    
    // Add event listener for close button
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Show a notification
    showNotification('How To Use guide opened', 'info');
}

function closeModal() {
    const modal = document.getElementById('howToUseModal');
    modal.classList.remove('show');
    
    // Remove event listeners
    document.removeEventListener('keydown', closeModalOnEscape);
    modal.removeEventListener('click', closeModalOnOutsideClick);
}

function closeModalOnEscape(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

function closeModalOnOutsideClick(e) {
    if (e.target === document.getElementById('howToUseModal')) {
        closeModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + E to export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportResults();
    }
    
    // Ctrl/Cmd + R to reset (with confirmation)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
        e.preventDefault();
        resetAssessment();
    }
    
    // Ctrl/Cmd + H to show How To Use
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        showHowToUse();
    }
});

// Add loading state for better UX
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add a subtle entrance animation
    setTimeout(() => {
        document.querySelectorAll('.hero-content > *').forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('fade-in-up');
        });
    }, 200);
});
