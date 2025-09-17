// Patent Innovation Dashboard JavaScript
class PatentDashboard {
    constructor() {
        this.charts = {};
        this.data = {
            timeline: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Applications Filed',
                    data: [12, 19, 15, 25, 22, 18, 28, 32, 24, 30, 26, 35],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Patents Granted',
                    data: [8, 12, 10, 18, 15, 12, 20, 22, 16, 24, 18, 28],
                    borderColor: '#38a169',
                    backgroundColor: 'rgba(56, 161, 105, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            categories: {
                labels: ['AI/ML', 'Blockchain', 'IoT', 'Quantum', 'Biotech', 'Clean Energy'],
                datasets: [{
                    data: [35, 25, 20, 15, 10, 5],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#38a169',
                        '#ed8936',
                        '#e53e3e',
                        '#3182ce'
                    ],
                    borderWidth: 0
                }]
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.startRealTimeUpdates();
        this.animateKPIs();
    }

    setupEventListeners() {
        // View toggle buttons
        const viewToggles = document.querySelectorAll('.view-toggle');
        viewToggles.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Chart period buttons
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchChartPeriod(e.target.dataset.period);
            });
        });

        // View all button
        const viewAllBtn = document.querySelector('.view-all-btn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                this.showAllApplications();
            });
        }

        // More options buttons
        const moreOptionsBtns = document.querySelectorAll('.more-options');
        moreOptionsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showApplicationOptions(e.currentTarget);
            });
        });

        // Create button
        const createBtn = document.querySelector('.create-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.createInnovation();
            });
        }

        // Sidebar navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.navigateToSection(e.currentTarget);
            });
        });
    }

    initializeCharts() {
        this.createTimelineChart();
        this.createCategoryChart();
    }

    createTimelineChart() {
        const ctx = document.getElementById('timelineChart');
        if (!ctx) return;

        this.charts.timeline = new Chart(ctx, {
            type: 'line',
            data: this.data.timeline,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                family: 'Inter',
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#2d3748',
                        bodyColor: '#4a5568',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 12,
                        displayColors: true,
                        padding: 16
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11,
                                weight: '500'
                            },
                            color: '#718096'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11,
                                weight: '500'
                            },
                            color: '#718096'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    point: {
                        radius: 6,
                        hoverRadius: 8,
                        backgroundColor: '#667eea',
                        borderColor: '#ffffff',
                        borderWidth: 3
                    }
                }
            }
        });
    }

    createCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        this.charts.categories = new Chart(ctx, {
            type: 'doughnut',
            data: this.data.categories,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                family: 'Inter',
                                size: 12,
                                weight: '500'
                            },
                            color: '#4a5568'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#2d3748',
                        bodyColor: '#4a5568',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 16,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                }
            }
        });
    }

    switchChartPeriod(period) {
        // Update active button
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');

        // Update chart data based on period
        let newData;
        switch (period) {
            case 'month':
                newData = {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Applications Filed',
                        data: [8, 12, 10, 15],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Patents Granted',
                        data: [5, 8, 6, 12],
                        borderColor: '#38a169',
                        backgroundColor: 'rgba(56, 161, 105, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                };
                break;
            case 'quarter':
                newData = {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [{
                        label: 'Applications Filed',
                        data: [46, 52, 48, 61],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Patents Granted',
                        data: [30, 35, 32, 40],
                        borderColor: '#38a169',
                        backgroundColor: 'rgba(56, 161, 105, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                };
                break;
            case 'year':
                newData = this.data.timeline;
                break;
        }

        if (this.charts.timeline) {
            this.charts.timeline.data = newData;
            this.charts.timeline.update('active');
        }
    }

    updateDataForPeriod(period) {
        // Simulate data update based on selected period
        const kpiValues = {
            '7d': { total: 247, pending: 89, granted: 158, success: 64 },
            '30d': { total: 247, pending: 89, granted: 158, success: 64 },
            '90d': { total: 312, pending: 124, granted: 188, success: 60 },
            '1y': { total: 1247, pending: 389, granted: 858, success: 69 }
        };

        const data = kpiValues[period] || kpiValues['30d'];
        
        // Animate KPI updates
        this.animateKPIUpdate('totalPatents', data.total);
        this.animateKPIUpdate('pendingApplications', data.pending);
        this.animateKPIUpdate('grantedPatents', data.granted);
        this.animateKPIUpdate('successRate', data.success + '%');
    }

    animateKPIUpdate(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const currentValue = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const targetValue = parseInt(newValue.toString().replace(/[^\d]/g, ''));
        const isPercentage = newValue.toString().includes('%');
        
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(currentValue + (targetValue - currentValue) * easeOutQuart);
            
            element.textContent = isPercentage ? current + '%' : current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    animateKPIs() {
        // Animate KPI cards on load
        const kpiCards = document.querySelectorAll('.kpi-card');
        kpiCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease-out';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }

    refreshData() {
        // Simulate API call
        setTimeout(() => {
            // Update some random data
            const randomChange = () => Math.floor(Math.random() * 10) - 5;
            
            this.animateKPIUpdate('totalPatents', 247 + randomChange());
            this.animateKPIUpdate('pendingApplications', 89 + randomChange());
            this.animateKPIUpdate('grantedPatents', 158 + randomChange());
            
            // Show success feedback
            this.showNotification('Data refreshed successfully!', 'success');
        }, 1000);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance of update
                this.simulateRealTimeUpdate();
            }
        }, 30000);
    }

    simulateRealTimeUpdate() {
        // Randomly update one KPI
        const kpis = ['totalPatents', 'pendingApplications', 'grantedPatents'];
        const randomKpi = kpis[Math.floor(Math.random() * kpis.length)];
        const currentValue = parseInt(document.getElementById(randomKpi).textContent.replace(/[^\d]/g, ''));
        const newValue = currentValue + (Math.random() > 0.5 ? 1 : -1);
        
        this.animateKPIUpdate(randomKpi, newValue);
        this.showNotification(`Updated ${randomKpi.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'info');
    }

    switchView(viewType) {
        // Update active view toggle
        document.querySelectorAll('.view-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewType}"]`).classList.add('active');

        // Update dashboard layout based on view
        const dashboardContent = document.querySelector('.dashboard-content');
        if (viewType === 'list') {
            dashboardContent.style.display = 'block';
            this.showNotification('Switched to list view', 'info');
        } else {
            dashboardContent.style.display = 'block';
            this.showNotification('Switched to grid view', 'info');
        }
    }

    createInnovation() {
        this.showNotification('Opening innovation creation form...', 'info');
        setTimeout(() => {
            alert('This would open the innovation creation form where you can add new patent ideas, descriptions, and metadata.');
        }, 500);
    }

    navigateToSection(navItem) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        navItem.classList.add('active');
        
        // Get the section name
        const sectionName = navItem.querySelector('span').textContent;
        this.showNotification(`Navigating to ${sectionName}...`, 'info');
    }

    showAllApplications() {
        this.showNotification('Opening full applications list...', 'info');
        // In a real application, this would navigate to a detailed view
        setTimeout(() => {
            alert('This would open a detailed applications management interface with full search, filtering, and management capabilities.');
        }, 500);
    }

    showApplicationOptions(button) {
        const applicationId = button.closest('.table-row').querySelector('.application-id').textContent;
        this.showNotification(`Opening options for ${applicationId}...`, 'info');
        setTimeout(() => {
            alert(`This would show a dropdown menu with options for application ${applicationId}:\n\n• View Details\n• Edit Application\n• Download Documents\n• Add Comments\n• Change Status\n• Delete Application`);
        }, 500);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PatentDashboard();
});

// Add some interactive enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to table rows
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'translateY(-2px)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.transform = 'translateY(0)';
        });
    });

    // Add click handlers for KPI cards
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            alert(`This would show detailed analytics for: ${title}`);
        });
    });

    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatentDashboard;
}
