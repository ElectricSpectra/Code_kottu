// Analytics Module
const analytics = {
    // Store user statistics
    userStats: {
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        currentStreak: 0,
        highestStreak: 0,
        averageScore: 0,
        totalTimeTaken: 0,
        sessionStartTime: 0,
        totalSessions: 0,
        totalTimeSpent: 0,
        lastSessionDate: null,
        sessionHistory: [],
        categoryPerformance: {},
        difficultyPerformance: {
            easy: { total: 0, correct: 0 },
            medium: { total: 0, correct: 0 },
            hard: { total: 0, correct: 0 }
        },
        timeHistory: [],
        scoreHistory: [],
        milestones: new Set(),
        errorHistory: [],
        personalGoals: [],
        skillLevels: {
            addition: 1,
            subtraction: 1,
            multiplication: 1
        },
        challengeRecords: {
            fastestCorrect: Infinity,
            highestAccuracy: 0,
            longestStreak: 0
        }
    },

    // Initialize analytics
    initialize() {
        this.loadStats();
        this.initializeCategories();
        this.startNewSession();
    },

    // Load saved statistics
    loadStats() {
        const savedStats = localStorage.getItem('mathMindsAnalytics');
        if (savedStats) {
            this.userStats = JSON.parse(savedStats);
            this.userStats.milestones = new Set(this.userStats.milestones);
        }
    },

    // Save current statistics
    saveStats() {
        const statsToSave = {
            ...this.userStats,
            milestones: Array.from(this.userStats.milestones)
        };
        localStorage.setItem('mathMindsAnalytics', JSON.stringify(statsToSave));
    },

    // Initialize category tracking
    initializeCategories() {
        const categories = ['addition', 'subtraction', 'multiplication'];
        categories.forEach(category => {
            if (!this.userStats.categoryPerformance[category]) {
                this.userStats.categoryPerformance[category] = {
                    total: 0,
                    correct: 0,
                    averageTime: 0
                };
            }
        });
    },

    // Start a new session
    startNewSession() {
        const now = Date.now();
        this.userStats.sessionStartTime = now;
        
        if (this.userStats.lastSessionDate) {
            const daysSinceLastSession = (now - this.userStats.lastSessionDate) / (1000 * 60 * 60 * 24);
            if (daysSinceLastSession >= 1) {
                this.userStats.totalSessions++;
            }
        } else {
            this.userStats.totalSessions = 1;
        }
        
        this.userStats.lastSessionDate = now;
        this.saveStats();
    },

    // Record answer with enhanced tracking
    recordAnswer(questionData, isCorrect, timeTaken) {
        // Update basic stats
        this.userStats.totalQuestions++;
        
        if (isCorrect) {
            this.userStats.correctAnswers++;
            this.userStats.currentStreak++;
            
            if (this.userStats.currentStreak > this.userStats.highestStreak) {
                this.userStats.highestStreak = this.userStats.currentStreak;
                this.userStats.challengeRecords.longestStreak = this.userStats.highestStreak;
            }
            
            // Update fastest correct answer record
            if (timeTaken < this.userStats.challengeRecords.fastestCorrect) {
                this.userStats.challengeRecords.fastestCorrect = timeTaken;
            }
        } else {
            this.userStats.incorrectAnswers++;
            this.userStats.currentStreak = 0;
            
            // Record error for analysis
            this.userStats.errorHistory.push({
                timestamp: Date.now(),
                question: questionData,
                userAnswer: questionData.userAnswer,
                correctAnswer: questionData.answer,
                timeTaken
            });
        }

        // Update category performance
        const category = questionData.operation;
        this.userStats.categoryPerformance[category].total++;
        if (isCorrect) {
            this.userStats.categoryPerformance[category].correct++;
            
            // Update skill level
            if (this.calculateCategoryAccuracy(category) > 80) {
                this.userStats.skillLevels[category] = Math.min(10, this.userStats.skillLevels[category] + 0.1);
            }
        }
        
        // Update time and accuracy tracking
        this.updateTimeAndAccuracyStats(questionData, isCorrect, timeTaken);
        
        // Update session history
        this.updateSessionHistory(questionData, isCorrect, timeTaken);
        
        // Check and update goals
        this.checkGoals();
        
        // Save stats
        this.saveStats();
    },

    // Update time and accuracy statistics
    updateTimeAndAccuracyStats(questionData, isCorrect, timeTaken) {
        const category = questionData.operation;
        const currentTotal = this.userStats.categoryPerformance[category].averageTime * 
            (this.userStats.categoryPerformance[category].total - 1);
        
        this.userStats.categoryPerformance[category].averageTime = 
            (currentTotal + timeTaken) / this.userStats.categoryPerformance[category].total;

        this.userStats.difficultyPerformance[questionData.difficulty].total++;
        if (isCorrect) {
            this.userStats.difficultyPerformance[questionData.difficulty].correct++;
        }

        this.userStats.timeHistory.push({
            timestamp: Date.now(),
            time: timeTaken,
            isCorrect,
            category,
            difficulty: questionData.difficulty
        });
        
        this.userStats.scoreHistory.push({
            timestamp: Date.now(),
            score: questionData.score,
            difficulty: questionData.difficulty,
            category
        });

        this.userStats.totalTimeTaken += timeTaken;
        
        // Update accuracy record
        const currentAccuracy = (this.userStats.correctAnswers / this.userStats.totalQuestions) * 100;
        if (currentAccuracy > this.userStats.challengeRecords.highestAccuracy) {
            this.userStats.challengeRecords.highestAccuracy = currentAccuracy;
        }
    },

    // Update session history
    updateSessionHistory(questionData, isCorrect, timeTaken) {
        const currentSession = {
            date: new Date().toISOString().split('T')[0],
            questions: 1,
            correct: isCorrect ? 1 : 0,
            totalTime: timeTaken,
            categories: {
                [questionData.operation]: {
                    total: 1,
                    correct: isCorrect ? 1 : 0
                }
            }
        };

        const lastSession = this.userStats.sessionHistory[this.userStats.sessionHistory.length - 1];
        
        if (lastSession && lastSession.date === currentSession.date) {
            lastSession.questions++;
            lastSession.correct += isCorrect ? 1 : 0;
            lastSession.totalTime += timeTaken;
            
            if (!lastSession.categories[questionData.operation]) {
                lastSession.categories[questionData.operation] = {
                    total: 0,
                    correct: 0
                };
            }
            lastSession.categories[questionData.operation].total++;
            lastSession.categories[questionData.operation].correct += isCorrect ? 1 : 0;
        } else {
            this.userStats.sessionHistory.push(currentSession);
        }
    },

    // Get performance insights
    getInsights() {
        const insights = [];
        const categoryPerf = this.getCategoryPerformance();
        
        // Find weakest and strongest categories
        let weakestCategory = null;
        let strongestCategory = null;
        let minAccuracy = 100;
        let maxAccuracy = 0;
        
        for (const [category, data] of Object.entries(categoryPerf)) {
            if (data.total >= 5) { // Only consider categories with enough attempts
                if (data.accuracy < minAccuracy) {
                    minAccuracy = data.accuracy;
                    weakestCategory = category;
                }
                if (data.accuracy > maxAccuracy) {
                    maxAccuracy = data.accuracy;
                    strongestCategory = category;
                }
            }
        }
        
        if (weakestCategory) {
            insights.push({
                type: 'improvement',
                message: `Try to focus more on ${weakestCategory} questions, as this is currently your challenging area.`
            });
        }
        
        if (strongestCategory) {
            insights.push({
                type: 'strength',
                message: `Great work with ${strongestCategory}! You're showing strong performance in this area.`
            });
        }
        
        // Analyze time trends
        const recentTimes = this.userStats.timeHistory.slice(-10);
        const avgRecentTime = recentTimes.reduce((sum, entry) => sum + entry.time, 0) / recentTimes.length;
        const overallAvgTime = this.calculateAverageTime();
        
        if (avgRecentTime < overallAvgTime) {
            insights.push({
                type: 'progress',
                message: 'Your response time is improving! Keep up the good work!'
            });
        }
        
        // Check consistency
        const recentAccuracy = this.calculateRecentAccuracy(10);
        const overallAccuracy = this.calculateAccuracy();
        
        if (recentAccuracy > overallAccuracy + 5) {
            insights.push({
                type: 'progress',
                message: 'Your recent accuracy has improved significantly. You\'re making great progress!'
            });
        }
        
        return insights;
    },

    // Get suggested goals
    getSuggestedGoals() {
        const goals = [];
        const categoryPerf = this.getCategoryPerformance();
        
        // Accuracy goals
        for (const [category, data] of Object.entries(categoryPerf)) {
            if (data.total >= 5 && data.accuracy < 90) {
                const targetAccuracy = Math.min(95, Math.ceil(data.accuracy + 5));
                goals.push({
                    type: 'accuracy',
                    category,
                    current: data.accuracy,
                    target: targetAccuracy,
                    message: `Improve ${category} accuracy from ${Math.floor(data.accuracy)}% to ${targetAccuracy}%`
                });
            }
        }
        
        // Speed goals
        const avgTime = this.calculateAverageTime();
        if (avgTime > 5) {
            goals.push({
                type: 'speed',
                current: avgTime,
                target: Math.max(3, avgTime - 1),
                message: `Reduce average response time from ${avgTime.toFixed(1)}s to ${Math.max(3, avgTime - 1).toFixed(1)}s`
            });
        }
        
        // Streak goals
        const nextStreakGoal = Math.ceil(this.userStats.highestStreak / 5) * 5 + 5;
        goals.push({
            type: 'streak',
            current: this.userStats.highestStreak,
            target: nextStreakGoal,
            message: `Achieve a streak of ${nextStreakGoal} correct answers`
        });
        
        return goals;
    },

    // Get error patterns
    getErrorPatterns() {
        const patterns = {
            byCategory: {},
            byDifficulty: {},
            commonMistakes: []
        };
        
        // Analyze last 50 errors
        const recentErrors = this.userStats.errorHistory.slice(-50);
        
        recentErrors.forEach(error => {
            // Category analysis
            if (!patterns.byCategory[error.question.operation]) {
                patterns.byCategory[error.question.operation] = {
                    count: 0,
                    examples: []
                };
            }
            patterns.byCategory[error.question.operation].count++;
            if (patterns.byCategory[error.question.operation].examples.length < 3) {
                patterns.byCategory[error.question.operation].examples.push(error);
            }
            
            // Difficulty analysis
            if (!patterns.byDifficulty[error.question.difficulty]) {
                patterns.byDifficulty[error.question.difficulty] = {
                    count: 0,
                    examples: []
                };
            }
            patterns.byDifficulty[error.question.difficulty].count++;
            if (patterns.byDifficulty[error.question.difficulty].examples.length < 3) {
                patterns.byDifficulty[error.question.difficulty].examples.push(error);
            }
            
            // Common mistakes analysis
            const mistake = {
                expected: error.correctAnswer,
                provided: error.userAnswer,
                count: 1
            };
            
            const existingMistake = patterns.commonMistakes.find(m => 
                m.expected === mistake.expected && m.provided === mistake.provided
            );
            
            if (existingMistake) {
                existingMistake.count++;
            } else if (patterns.commonMistakes.length < 5) {
                patterns.commonMistakes.push(mistake);
            }
        });
        
        return patterns;
    },

    // Get engagement metrics
    getEngagementMetrics() {
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        const weekInMs = 7 * dayInMs;
        
        // Calculate daily streak
        let dailyStreak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        for (let i = this.userStats.sessionHistory.length - 1; i >= 0; i--) {
            const sessionDate = new Date(this.userStats.sessionHistory[i].date);
            const daysDiff = Math.floor((currentDate - sessionDate) / dayInMs);
            
            if (daysDiff === dailyStreak) {
                dailyStreak++;
                currentDate = sessionDate;
            } else {
                break;
            }
        }
        
        // Calculate weekly activity
        const weeklyActivity = this.userStats.sessionHistory
            .filter(session => new Date(session.date) > new Date(now - weekInMs))
            .length;
        
        return {
            totalSessions: this.userStats.totalSessions,
            dailyStreak,
            weeklyActivity,
            averageQuestionsPerSession: this.userStats.totalQuestions / this.userStats.totalSessions,
            totalTimeSpent: this.userStats.totalTimeSpent,
            lastActive: this.userStats.lastSessionDate
        };
    },

    // Get time period analysis
    getTimePeriodAnalysis(period = 'week') {
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        let timeFrame;
        
        switch(period) {
            case 'day':
                timeFrame = dayInMs;
                break;
            case 'week':
                timeFrame = 7 * dayInMs;
                break;
            case 'month':
                timeFrame = 30 * dayInMs;
                break;
            default:
                timeFrame = 7 * dayInMs;
        }
        
        const periodData = {
            questions: 0,
            correct: 0,
            totalTime: 0,
            categoryBreakdown: {},
            difficultyBreakdown: {},
            timeProgression: [],
            accuracyProgression: []
        };
        
        // Filter data for the selected period
        const relevantHistory = this.userStats.sessionHistory.filter(session => 
            new Date(session.date) > new Date(now - timeFrame)
        );
        
        relevantHistory.forEach(session => {
            periodData.questions += session.questions;
            periodData.correct += session.correct;
            periodData.totalTime += session.totalTime;
            
            // Category breakdown
            Object.entries(session.categories).forEach(([category, data]) => {
                if (!periodData.categoryBreakdown[category]) {
                    periodData.categoryBreakdown[category] = {
                        total: 0,
                        correct: 0
                    };
                }
                periodData.categoryBreakdown[category].total += data.total;
                periodData.categoryBreakdown[category].correct += data.correct;
            });
        });
        
        // Calculate progression data
        const progressionPoints = 7;
        const interval = timeFrame / progressionPoints;
        
        for (let i = 0; i < progressionPoints; i++) {
            const pointTime = now - (timeFrame - (i * interval));
            const pointData = this.getStatsAtTime(pointTime);
            
            periodData.timeProgression.push({
                time: pointTime,
                averageTime: pointData.averageTime
            });
            
            periodData.accuracyProgression.push({
                time: pointTime,
                accuracy: pointData.accuracy
            });
        }
        
        return periodData;
    },

    // Helper function to get stats at a specific point in time
    getStatsAtTime(timestamp) {
        const relevantTimeHistory = this.userStats.timeHistory.filter(entry => 
            entry.timestamp <= timestamp
        );
        
        const relevantScoreHistory = this.userStats.scoreHistory.filter(entry =>
            entry.timestamp <= timestamp
        );
        
        return {
            averageTime: relevantTimeHistory.length > 0
                ? relevantTimeHistory.reduce((sum, entry) => sum + entry.time, 0) / relevantTimeHistory.length
                : 0,
            accuracy: relevantTimeHistory.length > 0
                ? (relevantTimeHistory.filter(entry => entry.isCorrect).length / relevantTimeHistory.length) * 100
                : 0,
            averageScore: relevantScoreHistory.length > 0
                ? relevantScoreHistory.reduce((sum, entry) => sum + entry.score, 0) / relevantScoreHistory.length
                : 0
        };
    },

    // Get all analytics data
    getAnalytics() {
        return {
            totalQuestions: this.userStats.totalQuestions,
            accuracy: this.calculateAccuracy(),
            averageScore: this.userStats.averageScore,
            averageTime: this.calculateAverageTime(),
            categoryPerformance: this.getCategoryPerformance(),
            difficultyPerformance: this.getDifficultyPerformance(),
            streaks: {
                current: this.userStats.currentStreak,
                highest: this.userStats.highestStreak
            },
            milestones: Array.from(this.userStats.milestones),
            timeHistory: this.userStats.timeHistory,
            scoreHistory: this.userStats.scoreHistory,
            insights: this.getInsights(),
            suggestedGoals: this.getSuggestedGoals(),
            errorPatterns: this.getErrorPatterns(),
            engagement: this.getEngagementMetrics(),
            timePeriodAnalysis: {
                day: this.getTimePeriodAnalysis('day'),
                week: this.getTimePeriodAnalysis('week'),
                month: this.getTimePeriodAnalysis('month')
            },
            skillLevels: this.userStats.skillLevels,
            challengeRecords: this.userStats.challengeRecords
        };
    },

    // Calculate accuracy percentage
    calculateAccuracy() {
        if (this.userStats.totalQuestions === 0) return 0;
        return (this.userStats.correctAnswers / this.userStats.totalQuestions) * 100;
    },

    // Calculate average time per question
    calculateAverageTime() {
        if (this.userStats.totalQuestions === 0) return 0;
        return this.userStats.totalTimeTaken / this.userStats.totalQuestions;
    },

    // Get category performance data
    getCategoryPerformance() {
        const performance = {};
        for (const [category, data] of Object.entries(this.userStats.categoryPerformance)) {
            performance[category] = {
                accuracy: data.total === 0 ? 0 : (data.correct / data.total) * 100,
                averageTime: data.averageTime,
                total: data.total
            };
        }
        return performance;
    },

    // Get difficulty performance data
    getDifficultyPerformance() {
        const performance = {};
        for (const [difficulty, data] of Object.entries(this.userStats.difficultyPerformance)) {
            performance[difficulty] = {
                accuracy: data.total === 0 ? 0 : (data.correct / data.total) * 100,
                total: data.total
            };
        }
        return performance;
    },

    // Check and award milestones
    checkMilestones() {
        const milestones = {
            questions: [10, 50, 100, 500, 1000],
            streak: [5, 10, 25, 50, 100],
            accuracy: [50, 75, 90, 95, 99]
        };

        // Question count milestones
        milestones.questions.forEach(count => {
            if (this.userStats.totalQuestions >= count) {
                this.userStats.milestones.add(`${count}_questions`);
            }
        });

        // Streak milestones
        milestones.streak.forEach(streak => {
            if (this.userStats.highestStreak >= streak) {
                this.userStats.milestones.add(`${streak}_streak`);
            }
        });

        // Accuracy milestones
        const accuracy = (this.userStats.correctAnswers / this.userStats.totalQuestions) * 100;
        milestones.accuracy.forEach(threshold => {
            if (accuracy >= threshold && this.userStats.totalQuestions >= 10) {
                this.userStats.milestones.add(`${threshold}_accuracy`);
            }
        });
    },

    // Check and update goals
    checkGoals() {
        // Implementation of checkGoals method
    },

    // Calculate category accuracy
    calculateCategoryAccuracy(category) {
        if (this.userStats.categoryPerformance[category].total === 0) return 0;
        return (this.userStats.categoryPerformance[category].correct / this.userStats.categoryPerformance[category].total) * 100;
    },

    // Calculate recent accuracy
    calculateRecentAccuracy(period) {
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        let timeFrame;
        
        switch(period) {
            case 'day':
                timeFrame = dayInMs;
                break;
            case 'week':
                timeFrame = 7 * dayInMs;
                break;
            case 'month':
                timeFrame = 30 * dayInMs;
                break;
            default:
                timeFrame = 7 * dayInMs;
        }
        
        const relevantHistory = this.userStats.sessionHistory.filter(session => 
            new Date(session.date) > new Date(now - timeFrame)
        );
        
        const totalQuestions = relevantHistory.reduce((sum, session) => sum + session.questions, 0);
        const correctAnswers = relevantHistory.reduce((sum, session) => sum + session.correct, 0);
        
        if (totalQuestions === 0) return 0;
        return (correctAnswers / totalQuestions) * 100;
    }
};

// Initialize analytics when the script loads
analytics.initialize(); 