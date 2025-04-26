// Analytics UI Module
const analyticsUI = {
    // Initialize analytics UI
    initialize() {
        this.setupChartDefaults();
        this.setupEventListeners();
        this.render();
    },

    // Set up Chart.js defaults
    setupChartDefaults() {
        Chart.defaults.color = '#e0e0e0';
        Chart.defaults.borderColor = '#404040';
        Chart.defaults.backgroundColor = '#2a2a2a';
        
        // Custom dark theme for charts
        const darkTheme = {
            backgroundColor: '#2a2a2a',
            borderColor: '#404040',
            pointBackgroundColor: '#606060',
            pointBorderColor: '#808080'
        };
        
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
        Chart.defaults.plugins.tooltip.bodyColor = '#e0e0e0';
        Chart.defaults.plugins.tooltip.borderColor = '#404040';
        Chart.defaults.plugins.tooltip.borderWidth = 1;
        
        Object.assign(Chart.defaults, darkTheme);
    },

    // Set up event listeners
    setupEventListeners() {
        document.getElementById('timePeriodSelect').addEventListener('change', () => this.updateTimePeriodAnalysis());
        document.getElementById('categorySelect').addEventListener('change', () => this.updateCategoryAnalysis());
        document.getElementById('difficultySelect').addEventListener('change', () => this.updateDifficultyAnalysis());
    },

    // Render analytics dashboard
    render() {
        const analyticsData = analytics.getAnalytics();
        
        this.renderOverview(analyticsData);
        this.renderEngagementMetrics(analyticsData.engagement);
        this.renderTimePeriodAnalysis(analyticsData.timePeriodAnalysis);
        this.renderInsights(analyticsData.insights);
        this.renderGoals(analyticsData.suggestedGoals);
        this.renderErrorAnalysis(analyticsData.errorPatterns);
        this.renderProgressCharts(analyticsData);
        this.renderSkillLevels(analyticsData.skillLevels);
        this.renderChallengeRecords(analyticsData.challengeRecords);
    },

    // Render overview section
    renderOverview(data) {
        const overviewHtml = `
            <div class="overview-section">
                <h2>Overview</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Questions</h3>
                        <p>${data.totalQuestions}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Accuracy</h3>
                        <p>${data.accuracy.toFixed(1)}%</p>
                    </div>
                    <div class="stat-card">
                        <h3>Average Time</h3>
                        <p>${data.averageTime.toFixed(1)}s</p>
                    </div>
                    <div class="stat-card">
                        <h3>Current Streak</h3>
                        <p>${data.streaks.current}</p>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('overview').innerHTML = overviewHtml;
    },

    // Render engagement metrics
    renderEngagementMetrics(engagement) {
        const engagementHtml = `
            <div class="engagement-section">
                <h2>Engagement</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Daily Streak</h3>
                        <p>${engagement.dailyStreak} days</p>
                    </div>
                    <div class="stat-card">
                        <h3>Weekly Activity</h3>
                        <p>${engagement.weeklyActivity} sessions</p>
                    </div>
                    <div class="stat-card">
                        <h3>Questions per Session</h3>
                        <p>${engagement.averageQuestionsPerSession.toFixed(1)}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Sessions</h3>
                        <p>${engagement.totalSessions}</p>
                    </div>
                </div>
                <div class="last-active">
                    Last active: ${new Date(engagement.lastActive).toLocaleDateString()}
                </div>
            </div>
        `;
        document.getElementById('engagement').innerHTML = engagementHtml;
    },

    // Render time period analysis
    renderTimePeriodAnalysis(timePeriodData) {
        const period = document.getElementById('timePeriodSelect').value || 'week';
        const data = timePeriodData[period];
        
        const timeProgressionChart = new Chart(
            document.getElementById('timeProgressionChart'),
            {
                type: 'line',
                data: {
                    labels: data.timeProgression.map(point => 
                        new Date(point.time).toLocaleDateString()
                    ),
                    datasets: [{
                        label: 'Average Response Time',
                        data: data.timeProgression.map(point => point.averageTime),
                        borderColor: '#4CAF50',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Response Time Progression'
                        }
                    }
                }
            }
        );
        
        const accuracyProgressionChart = new Chart(
            document.getElementById('accuracyProgressionChart'),
            {
                type: 'line',
                data: {
                    labels: data.accuracyProgression.map(point => 
                        new Date(point.time).toLocaleDateString()
                    ),
                    datasets: [{
                        label: 'Accuracy',
                        data: data.accuracyProgression.map(point => point.accuracy),
                        borderColor: '#2196F3',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Accuracy Progression'
                        }
                    }
                }
            }
        );
    },

    // Render insights
    renderInsights(insights) {
        const insightsHtml = `
            <div class="insights-section">
                <h2>Personalized Insights</h2>
                <div class="insights-list">
                    ${insights.map(insight => `
                        <div class="insight-card ${insight.type}">
                            <i class="fas fa-${this.getInsightIcon(insight.type)}"></i>
                            <p>${insight.message}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.getElementById('insights').innerHTML = insightsHtml;
    },

    // Get icon for insight type
    getInsightIcon(type) {
        switch(type) {
            case 'improvement': return 'arrow-up';
            case 'strength': return 'star';
            case 'progress': return 'chart-line';
            default: return 'info-circle';
        }
    },

    // Render goals
    renderGoals(goals) {
        const goalsHtml = `
            <div class="goals-section">
                <h2>Suggested Goals</h2>
                <div class="goals-list">
                    ${goals.map(goal => `
                        <div class="goal-card">
                            <div class="goal-progress">
                                <div class="progress-bar" style="width: ${(goal.current / goal.target * 100)}%"></div>
                            </div>
                            <p>${goal.message}</p>
                            <span class="progress-text">${goal.current.toFixed(1)} / ${goal.target.toFixed(1)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.getElementById('goals').innerHTML = goalsHtml;
    },

    // Render error analysis
    renderErrorAnalysis(errorPatterns) {
        const errorAnalysisHtml = `
            <div class="error-analysis-section">
                <h2>Error Analysis</h2>
                <div class="error-categories">
                    <h3>Common Mistakes</h3>
                    <div class="error-list">
                        ${errorPatterns.commonMistakes.map(mistake => `
                            <div class="error-card">
                                <p>Expected: ${mistake.expected}</p>
                                <p>Provided: ${mistake.provided}</p>
                                <p>Occurred ${mistake.count} times</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="error-breakdown">
                    ${this.renderErrorBreakdownCharts(errorPatterns)}
                </div>
            </div>
        `;
        document.getElementById('errorAnalysis').innerHTML = errorAnalysisHtml;
    },

    // Render error breakdown charts
    renderErrorBreakdownCharts(errorPatterns) {
        const categoryData = Object.entries(errorPatterns.byCategory).map(([category, data]) => ({
            label: category,
            value: data.count
        }));
        
        const difficultyData = Object.entries(errorPatterns.byDifficulty).map(([difficulty, data]) => ({
            label: difficulty,
            value: data.count
        }));
        
        new Chart(
            document.getElementById('errorCategoryChart'),
            {
                type: 'pie',
                data: {
                    labels: categoryData.map(d => d.label),
                    datasets: [{
                        data: categoryData.map(d => d.value),
                        backgroundColor: ['#FF5252', '#FF4081', '#7C4DFF', '#448AFF', '#64FFDA']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Errors by Category'
                        }
                    }
                }
            }
        );
        
        new Chart(
            document.getElementById('errorDifficultyChart'),
            {
                type: 'pie',
                data: {
                    labels: difficultyData.map(d => d.label),
                    datasets: [{
                        data: difficultyData.map(d => d.value),
                        backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Errors by Difficulty'
                        }
                    }
                }
            }
        );
    },

    // Render progress charts
    renderProgressCharts(data) {
        const categoryPerformance = Object.entries(data.categoryPerformance).map(([category, stats]) => ({
            category,
            accuracy: (stats.correct / stats.total * 100) || 0
        }));
        
        new Chart(
            document.getElementById('categoryPerformanceChart'),
            {
                type: 'bar',
                data: {
                    labels: categoryPerformance.map(c => c.category),
                    datasets: [{
                        label: 'Accuracy %',
                        data: categoryPerformance.map(c => c.accuracy),
                        backgroundColor: '#2196F3'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Category Performance'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            }
        );
    },

    // Render skill levels
    renderSkillLevels(skillLevels) {
        const skillLevelsHtml = `
            <div class="skill-levels-section">
                <h2>Skill Levels</h2>
                <div class="skills-grid">
                    ${Object.entries(skillLevels).map(([skill, level]) => `
                        <div class="skill-card">
                            <h3>${skill}</h3>
                            <div class="skill-meter">
                                <div class="skill-progress" style="width: ${level * 10}%"></div>
                            </div>
                            <p>Level ${Math.floor(level)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.getElementById('skillLevels').innerHTML = skillLevelsHtml;
    },

    // Render challenge records
    renderChallengeRecords(records) {
        const recordsHtml = `
            <div class="challenge-records-section">
                <h2>Challenge Records</h2>
                <div class="records-grid">
                    <div class="record-card">
                        <h3>Fastest Correct Answer</h3>
                        <p>${records.fastestCorrect === Infinity ? '-' : records.fastestCorrect.toFixed(2)}s</p>
                    </div>
                    <div class="record-card">
                        <h3>Highest Accuracy</h3>
                        <p>${records.highestAccuracy.toFixed(1)}%</p>
                    </div>
                    <div class="record-card">
                        <h3>Longest Streak</h3>
                        <p>${records.longestStreak}</p>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('challengeRecords').innerHTML = recordsHtml;
    },

    // Update time period analysis
    updateTimePeriodAnalysis() {
        const period = document.getElementById('timePeriodSelect').value;
        const analyticsData = analytics.getAnalytics();
        this.renderTimePeriodAnalysis(analyticsData.timePeriodAnalysis);
    },

    // Update category analysis
    updateCategoryAnalysis() {
        const category = document.getElementById('categorySelect').value;
        const analyticsData = analytics.getAnalytics();
        // Implementation of category-specific analysis update
    },

    // Update difficulty analysis
    updateDifficultyAnalysis() {
        const difficulty = document.getElementById('difficultySelect').value;
        const analyticsData = analytics.getAnalytics();
        // Implementation of difficulty-specific analysis update
    }
};

// Initialize analytics UI when the script loads
document.addEventListener('DOMContentLoaded', () => analyticsUI.initialize()); 