// Game state management
const gameState = {
    playerName: '',
    difficulty: '',
    operations: [],
    questionCount: 10,
    timePerQuestion: 20,
    currentQuestion: 0,
    score: 0,
    questions: [],
    answers: [],
    startTime: null,
    timer: null,
    timerProgress: null,
    explanationTimer: null,
    retryCount: 0,
    originalQuestions: null  // To store original questions for retry
};

// Analytics state management
const analyticsState = {
    sessions: [],
    currentSession: null,
    skillLevels: {
        addition: 0,
        subtraction: 0,
        multiplication: 0,
        division: 0
    },
    errorPatterns: {},
    progressHistory: [],
    goals: []
};

// Screen management
const screens = {
    home: document.getElementById('home-screen'),
    setup: document.getElementById('setup-screen'),
    game: document.getElementById('game-screen'),
    analytics: document.getElementById('analytics-screen'),
    leaderboard: document.getElementById('leaderboard-screen')
};

// Show specific screen and hide others
function showScreen(screenId) {
    Object.values(screens).forEach(screen => {
        screen.style.display = 'none';
    });
    screens[screenId].style.display = 'block';
}

// Game initialization
function initializeGame() {
    // Clean existing leaderboard data
    cleanLeaderboardData();

    // Event listeners for home screen
    document.getElementById('start-game').addEventListener('click', () => showScreen('setup'));
    document.getElementById('show-analytics').addEventListener('click', () => {
        initializeAnalytics();
        showScreen('analytics');
    });
    document.getElementById('show-leaderboard').addEventListener('click', () => {
        initializeLeaderboard();
        showScreen('leaderboard');
    });

    // Event listeners for setup screen
    document.getElementById('player-name').addEventListener('input', validateSetup);
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', selectDifficulty);
    });
    document.querySelectorAll('.operation-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', validateSetup);
    });
    document.getElementById('question-count').addEventListener('input', updateQuestionCount);
    document.getElementById('time-per-question').addEventListener('input', updateTimePerQuestion);
    document.getElementById('start-quiz').addEventListener('click', startGame);

    // Event listeners for game screen
    document.getElementById('answer-form').addEventListener('submit', submitAnswer);

    // Load saved analytics data
    loadAnalyticsData();
}

// Setup validation and game start
function validateSetup() {
    const playerName = document.getElementById('player-name').value.trim();
    const operations = Array.from(document.querySelectorAll('.operation-checkbox:checked')).map(cb => cb.value);
    const startButton = document.getElementById('start-quiz');
    
    startButton.disabled = !playerName || !gameState.difficulty || operations.length === 0;
}

function selectDifficulty(event) {
    const buttons = document.querySelectorAll('.difficulty-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    gameState.difficulty = event.currentTarget.dataset.difficulty;
    validateSetup();
}

function updateQuestionCount(event) {
    gameState.questionCount = parseInt(event.target.value);
    document.getElementById('question-count-value').textContent = event.target.value;
}

function updateTimePerQuestion(event) {
    gameState.timePerQuestion = parseInt(event.target.value);
    document.getElementById('time-per-question-value').textContent = event.target.value;
}

// Game logic
function startGame() {
    // Generate new questions only on first attempt or when starting fresh
    if (!gameState.originalQuestions || gameState.retryCount === 0) {
        gameState.playerName = document.getElementById('player-name').value.trim();
        gameState.operations = Array.from(document.querySelectorAll('.operation-checkbox:checked')).map(cb => cb.value);
        gameState.difficulty = document.querySelector('.difficulty-btn.active').dataset.difficulty;
        gameState.questionCount = parseInt(document.getElementById('question-count').value);
        gameState.timePerQuestion = parseInt(document.getElementById('time-per-question').value);
        gameState.originalQuestions = generateQuestions();
        gameState.retryCount = 0;
    }
    
    // Reset current game state
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.answers = [];
    gameState.startTime = Date.now();
    gameState.questions = JSON.parse(JSON.stringify(gameState.originalQuestions)); // Deep copy for retry
    
    // Restore game screen to its original state
    const gameScreen = document.getElementById('game-screen');
    gameScreen.innerHTML = `
        <div class="game-header">
            <div id="question-number">Question 1 of ${gameState.questionCount}</div>
            <div class="score">Score: <span id="score-value">0/${gameState.questionCount}</span></div>
        </div>

        <div class="timer">
            <div class="timer-bar">
                <div class="timer-progress"></div>
            </div>
            <div class="timer-text">20s</div>
        </div>

        <div class="question-container">
            <div id="question-text" class="question"></div>
            <form id="answer-form" class="answer-form">
                <input type="number" id="answer" required>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            <div class="feedback"></div>
            <div class="explanation-container" style="display: none;">
                <div class="explanation-header">
                    <i class="explanation-icon">💡</i>
                    <span>Solution Explanation</span>
                </div>
                <div class="explanation-content"></div>
                <div class="explanation-controls">
                    <div class="auto-next-container">
                        <button id="next-with-timer" class="btn btn-primary">
                            Next Question (<span id="next-timer">30</span>s)
                        </button>
                        <button id="disable-timer" class="btn btn-secondary">
                            Disable Auto-Next
                        </button>
                    </div>
                    <button id="next-question" class="btn btn-primary" style="display: none;">
                        Next Question
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Reattach event listener for answer submission
    document.getElementById('answer-form').addEventListener('submit', submitAnswer);
    
    // Start new analytics session
    startNewSession();
    
    showScreen('game');
    displayQuestion();
}

function generateQuestions() {
    const questions = [];
    const difficultyRanges = {
        easy: { min: 1, max: 10 },
        medium: { min: 10, max: 50 },
        hard: { min: 50, max: 100 }
    };
    const range = difficultyRanges[gameState.difficulty];

    for (let i = 0; i < gameState.questionCount; i++) {
        const operation = gameState.operations[Math.floor(Math.random() * gameState.operations.length)];
        let num1, num2, answer;

        switch (operation) {
            case 'addition':
                num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
                num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
                answer = num1 + num2;
                break;
            case 'subtraction':
                num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
                break;
            case 'multiplication':
                num1 = Math.floor(Math.random() * (Math.sqrt(range.max) - range.min + 1)) + range.min;
                num2 = Math.floor(Math.random() * (Math.sqrt(range.max) - range.min + 1)) + range.min;
                answer = num1 * num2;
                break;
            case 'division':
                num2 = Math.floor(Math.random() * (Math.sqrt(range.max) - range.min + 1)) + range.min;
                answer = Math.floor(Math.random() * (Math.sqrt(range.max) - range.min + 1)) + range.min;
                num1 = num2 * answer;
                break;
        }
        
        questions.push({
            num1,
            num2,
            operation,
            answer,
            timeStarted: null,
            timeSpent: 0
        });
    }

    return questions;
}

function displayQuestion() {
    const question = gameState.questions[gameState.currentQuestion];
    const operationSymbols = {
        addition: '+',
        subtraction: '-',
        multiplication: '×',
        division: '÷'
    };

    document.getElementById('question-number').textContent = `Question ${gameState.currentQuestion + 1} of ${gameState.questionCount}`;
    document.getElementById('score-value').textContent = `${gameState.score}/${gameState.questionCount}`;
    document.getElementById('question-text').textContent = `${question.num1} ${operationSymbols[question.operation]} ${question.num2} = ?`;
    
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
    
    // Clear feedback message
    const feedback = document.querySelector('.feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';
    
    // Hide explanation from previous question
    document.querySelector('.explanation-container').style.display = 'none';
    
    // Reset and start timer
    question.timeStarted = Date.now();
    startTimer();
}

function startTimer() {
    if (gameState.timer) clearInterval(gameState.timer);
    if (gameState.timerProgress) clearInterval(gameState.timerProgress);

    const timerBar = document.querySelector('.timer-progress');
    const timerText = document.querySelector('.timer-text');
    let timeLeft = gameState.timePerQuestion;

    timerBar.style.width = '100%';
    timerText.textContent = `${timeLeft}s`;

    gameState.timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            handleTimeout();
        }
    }, 1000);

    gameState.timerProgress = setInterval(() => {
        const progress = (timeLeft / gameState.timePerQuestion) * 100;
        timerBar.style.width = `${progress}%`;
    }, 50);
}

function handleTimeout() {
    clearInterval(gameState.timer);
    clearInterval(gameState.timerProgress);
    submitAnswer(null, true);
}

function generateExplanation(question, userAnswer) {
    const operationSymbols = {
        addition: '+',
        subtraction: '-',
        multiplication: '×',
        division: '÷'
    };
    
    const symbol = operationSymbols[question.operation];
    let animationHtml = '';
    
    // Different animation styles based on difficulty
    switch (gameState.difficulty) {
        case 'easy':
            animationHtml = generateEasyAnimation(question);
            break;
        case 'medium':
            animationHtml = generateMediumAnimation(question);
            break;
        case 'hard':
            animationHtml = generateHardAnimation(question);
            break;
    }

    return `
        ${animationHtml}
        <div class="explanation-text">
            ${generateTextExplanation(question)}
        </div>
    `;
}

function generateTextExplanation(question) {
    switch (question.operation) {
        case 'addition':
            return `To add ${question.num1} and ${question.num2}, we count up ${question.num2} times from ${question.num1}.`;
        case 'subtraction':
            return `To subtract ${question.num2} from ${question.num1}, we count down ${question.num2} times from ${question.num1}.`;
        case 'multiplication':
            return `To multiply ${question.num1} by ${question.num2}, we add ${question.num1} to itself ${question.num2} times.`;
        case 'division':
            return `To divide ${question.num1} by ${question.num2}, we see how many groups of ${question.num2} make ${question.num1}.`;
    }
}

function generateEasyAnimation(question) {
    // Simple step-by-step animation for easy mode
    switch (question.operation) {
        case 'addition':
            return `
                <div class="animation-container">
                    <div class="number-block">${question.num1}</div>
                    <div class="operator">+</div>
                    <div class="number-block">${question.num2}</div>
                    <div class="equals">=</div>
                    <div class="result">${question.answer}</div>
                </div>
                <div class="step-blocks">
                    ${Array.from({length: question.num2}, (_, i) => 
                        `<div class="step-block" style="transition-delay: ${i * 0.1}s">+1</div>`
                    ).join('')}
                </div>
            `;
        // ... similar patterns for other operations
    }
}

function generateMediumAnimation(question) {
    // More detailed animation for medium mode
    switch (question.operation) {
        case 'addition':
            return `
                <div class="animation-container medium">
                    <div class="number-group">
                        <div class="number-block">${question.num1}</div>
                        <div class="number-detail">
                            ${Math.floor(question.num1/10) > 0 ? 
                                `<span class="digit">${Math.floor(question.num1/10)}0</span> + ` : ''}
                            <span class="digit">${question.num1 % 10}</span>
                        </div>
                    </div>
                    <div class="operator">+</div>
                    <div class="number-group">
                        <div class="number-block">${question.num2}</div>
                        <div class="number-detail">
                            ${Math.floor(question.num2/10) > 0 ? 
                                `<span class="digit">${Math.floor(question.num2/10)}0</span> + ` : ''}
                            <span class="digit">${question.num2 % 10}</span>
                        </div>
                    </div>
                    <div class="equals">=</div>
                    <div class="result">${question.answer}</div>
                </div>
            `;
        // ... similar patterns for other operations
    }
}

function generateHardAnimation(question) {
    // Complex animation for hard mode
    switch (question.operation) {
        case 'addition':
            return `
                <div class="animation-container hard">
                    <div class="number-system">
                        <div class="place-values">
                            <span>Hundreds</span>
                            <span>Tens</span>
                            <span>Ones</span>
                        </div>
                        <div class="number-group">
                            <div class="number-block">${question.num1}</div>
                            <div class="number-breakdown">
                                <span>${Math.floor(question.num1/100)}</span>
                                <span>${Math.floor((question.num1%100)/10)}</span>
                                <span>${question.num1%10}</span>
                            </div>
                        </div>
                        <div class="operator">+</div>
                        <div class="number-group">
                            <div class="number-block">${question.num2}</div>
                            <div class="number-breakdown">
                                <span>${Math.floor(question.num2/100)}</span>
                                <span>${Math.floor((question.num2%100)/10)}</span>
                                <span>${question.num2%10}</span>
                            </div>
                        </div>
                        <div class="equals">=</div>
                        <div class="result">${question.answer}</div>
                    </div>
                </div>
            `;
        // ... similar patterns for other operations
    }
}

function showExplanation(question, userAnswer) {
    const explanationContainer = document.querySelector('.explanation-container');
    const explanationContent = document.querySelector('.explanation-content');
    
    explanationContent.innerHTML = generateExplanation(question, userAnswer);
    explanationContainer.style.display = 'block';

    // Trigger animations
    setTimeout(() => {
        explanationContainer.querySelectorAll('.step-block').forEach(block => {
            block.classList.add('show');
        });
        explanationContainer.querySelector('.result').classList.add('show');
    }, 100);

    // Initialize explanation controls
    initializeExplanationControls();
}

function initializeExplanationControls() {
    const nextWithTimer = document.getElementById('next-with-timer');
    const disableTimer = document.getElementById('disable-timer');
    const nextQuestion = document.getElementById('next-question');
    const timerDisplay = document.getElementById('next-timer');
    
    // Reset buttons state
    nextWithTimer.style.display = 'block';
    nextWithTimer.classList.add('active');
    disableTimer.style.display = 'block';
    nextQuestion.style.display = 'none';
    
    let timeLeft = 30;
    timerDisplay.textContent = timeLeft;
    
    // Clear any existing timers
    if (gameState.explanationTimer) {
        clearInterval(gameState.explanationTimer);
    }
    
    // Start the timer
    gameState.explanationTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(gameState.explanationTimer);
            moveToNextQuestion();
        }
    }, 1000);
    
    // Add event listeners
    nextWithTimer.onclick = () => {
        clearInterval(gameState.explanationTimer);
        moveToNextQuestion();
    };
    
    disableTimer.onclick = () => {
        clearInterval(gameState.explanationTimer);
        nextWithTimer.style.display = 'none';
        disableTimer.style.display = 'none';
        nextQuestion.style.display = 'block';
    };
    
    nextQuestion.onclick = () => {
        moveToNextQuestion();
    };
}

function moveToNextQuestion() {
    // Clear any existing timers
    if (gameState.explanationTimer) {
        clearInterval(gameState.explanationTimer);
    }
    
    gameState.currentQuestion++;
    if (gameState.currentQuestion < gameState.questionCount) {
        displayQuestion();
    } else {
        endGame();
    }
}

function submitAnswer(event, timeout = false) {
    if (event) event.preventDefault();
    
    clearInterval(gameState.timer);
    clearInterval(gameState.timerProgress);

    const question = gameState.questions[gameState.currentQuestion];
    const userAnswer = timeout ? null : parseInt(document.getElementById('answer').value);
    const timeSpent = (Date.now() - question.timeStarted) / 1000;
    const isCorrect = !timeout && userAnswer === question.answer;

    // Record answer in game state
    gameState.answers.push({
        question: gameState.currentQuestion + 1,
        operation: question.operation,
        expected: question.answer,
        provided: userAnswer,
        isCorrect,
        timeSpent
    });

    // Update analytics
    updateAnalytics({
        operation: question.operation,
        difficulty: gameState.difficulty,
        isCorrect,
        timeSpent,
        expected: question.answer,
        provided: userAnswer
    });

    // Update score and feedback
    if (isCorrect && gameState.score < gameState.questionCount) {
        gameState.score++;
        showFeedback('Correct!', 'correct');
    } else if (!isCorrect) {
        showFeedback(`Incorrect. The answer was ${question.answer}`, 'incorrect');
    }

    // Show explanation with controls
    showExplanation(question, userAnswer);
}

function showFeedback(message, type) {
    const feedback = document.querySelector('.feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

function endGame() {
    const totalTime = (Date.now() - gameState.startTime) / 1000;
    const accuracy = (gameState.score / gameState.questionCount) * 100;
    const averageTime = totalTime / gameState.questionCount;

    // Create session data
    const sessionData = {
        startTime: gameState.startTime,
        endTime: Date.now(),
        playerName: gameState.playerName,
        difficulty: gameState.difficulty,
        operations: gameState.operations,
        answers: gameState.answers,
        finalScore: gameState.score,
        accuracy: accuracy,
        averageTime: averageTime,
        attemptNumber: gameState.retryCount + 1
    };

    // Add session to analytics state
    analyticsState.sessions.push(sessionData);
    analyticsState.currentSession = sessionData;
    
    // Save to leaderboard
    saveToLeaderboard({
        playerName: gameState.playerName,
        score: gameState.score,
        accuracy,
        averageTime,
        difficulty: gameState.difficulty,
        date: new Date().toISOString(),
        attemptNumber: gameState.retryCount + 1
    });

    // Save analytics data
    saveAnalyticsData();

    // Show end game screen with retry option
    showEndGameScreen();
}

function showEndGameScreen() {
    const container = document.createElement('div');
    container.className = 'end-game-container';
    container.innerHTML = `
        <h2>Quiz Complete!</h2>
        <div class="end-game-stats">
            <p>Score: ${gameState.score}/${gameState.questionCount}</p>
            <p>Accuracy: ${((gameState.score / gameState.questionCount) * 100).toFixed(1)}%</p>
            <p>Attempt: ${gameState.retryCount + 1}/3</p>
        </div>
        <div class="end-game-buttons">
            ${gameState.retryCount < 2 ? `
                <button id="retry-quiz" class="btn btn-primary">Retry Quiz</button>
            ` : ''}
            <button id="view-analytics" class="btn btn-secondary">View Analytics</button>
            <button id="return-home" class="btn btn-secondary">Return to Home</button>
        </div>
    `;

    // Replace game screen content
    const gameScreen = document.getElementById('game-screen');
    gameScreen.innerHTML = '';
    gameScreen.appendChild(container);

    // Add event listeners
    if (gameState.retryCount < 2) {
        document.getElementById('retry-quiz').addEventListener('click', () => {
            gameState.retryCount++;
            startGame();
        });
    }

    document.getElementById('view-analytics').addEventListener('click', () => {
        initializeAnalytics();
        showScreen('analytics');
    });

    document.getElementById('return-home').addEventListener('click', () => {
        resetGame();
        showScreen('home');
    });
}

function resetGame() {
    gameState.originalQuestions = null;
    gameState.retryCount = 0;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.questions = [];
    gameState.answers = [];
    gameState.startTime = null;
    
    // Clear form inputs
    document.getElementById('player-name').value = '';
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.operation-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('question-count').value = 10;
    document.getElementById('time-per-question').value = 20;
    document.getElementById('question-count-value').textContent = '10';
    document.getElementById('time-per-question-value').textContent = '20';
    document.getElementById('start-quiz').disabled = true;
}

// Analytics management
function startNewSession() {
    analyticsState.currentSession = {
        startTime: Date.now(),
        playerName: gameState.playerName,
        difficulty: gameState.difficulty,
        operations: gameState.operations,
        answers: [],
        skillProgress: {},
        endTime: null,
        finalScore: null,
        accuracy: null,
        averageTime: null
    };
}

function updateAnalytics(data) {
    // Update current session
    analyticsState.currentSession.answers.push(data);

    // Update skill levels
    const skillChange = data.isCorrect ? 1 : -1;
    analyticsState.skillLevels[data.operation] = Math.max(0, Math.min(100,
        analyticsState.skillLevels[data.operation] + skillChange
    ));

    // Update error patterns
    if (!data.isCorrect) {
        const errorKey = `${data.operation}-${data.difficulty}`;
        analyticsState.errorPatterns[errorKey] = analyticsState.errorPatterns[errorKey] || [];
        analyticsState.errorPatterns[errorKey].push({
            expected: data.expected,
            provided: data.provided,
            timeSpent: data.timeSpent
        });
    }

    // Save analytics data
    saveAnalyticsData();
}

function initializeAnalytics() {
    // Update user selection dropdown
    const userSelect = document.getElementById('user-select');
    const users = [...new Set(analyticsState.sessions.map(s => s.playerName))];
    
    userSelect.innerHTML = '<option value="">Select a user</option>' +
        users.map(user => `<option value="${user}">${user}</option>`).join('');
    
    // Add event listener for user selection
    userSelect.addEventListener('change', (e) => {
        const selectedUser = e.target.value;
        if (selectedUser) {
            displayUserAnalytics(selectedUser);
        } else {
            clearAnalytics();
        }
    });

    // If there's a current session, select that user
    if (analyticsState.currentSession) {
        userSelect.value = analyticsState.currentSession.playerName;
        displayUserAnalytics(analyticsState.currentSession.playerName);
    }
}

function displayUserAnalytics(userName) {
    // Get user sessions
    const userSessions = analyticsState.sessions.filter(s => s.playerName === userName);
    
    if (userSessions.length === 0) {
        clearAnalytics();
        return;
    }

    // Calculate statistics
    const stats = calculateUserStats(userSessions);
    
    // Update statistics display
    document.getElementById('total-questions').textContent = stats.totalQuestions;
    document.getElementById('average-accuracy').textContent = `${stats.averageAccuracy.toFixed(1)}%`;
    document.getElementById('average-time').textContent = `${stats.averageTime.toFixed(1)}s`;
    document.getElementById('total-sessions').textContent = stats.totalSessions;

    // Update charts
    updatePerformanceChart(userSessions);
    updateSkillsChart(userSessions);
}

function calculateUserStats(sessions) {
    const totalSessions = sessions.length;
    const totalQuestions = sessions.reduce((sum, session) => sum + session.answers.length, 0);
    const totalAccuracy = sessions.reduce((sum, session) => sum + session.accuracy, 0);
    const totalTime = sessions.reduce((sum, session) => sum + session.averageTime, 0);

    return {
        totalQuestions,
        averageAccuracy: totalAccuracy / totalSessions,
        averageTime: totalTime / totalSessions,
        totalSessions
    };
}

function updatePerformanceChart(sessions) {
    const ctx = document.getElementById('performance-chart').getContext('2d');
    
    // Clear existing chart if it exists
    if (window.performanceChart) {
        window.performanceChart.destroy();
    }

    const labels = sessions.map((_, i) => `Session ${i + 1}`);
    const accuracyData = sessions.map(s => s.accuracy);
    const timeData = sessions.map(s => s.averageTime);

    window.performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Accuracy (%)',
                data: accuracyData,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.3,
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#fff',
                pointHoverBackgroundColor: '#4CAF50',
                pointBorderColor: '#4CAF50',
                pointBorderWidth: 2
            }, {
                label: 'Avg. Time (s)',
                data: timeData,
                borderColor: '#FF4081',
                backgroundColor: 'rgba(255, 64, 129, 0.1)',
                tension: 0.3,
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#fff',
                pointHoverBackgroundColor: '#FF4081',
                pointBorderColor: '#FF4081',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Performance Trends',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 6,
                    titleFont: {
                        weight: 'bold'
                    },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(1) + (context.dataset.label.includes('%') ? '%' : 's');
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + (this.chart.data.datasets[0].label.includes('%') ? '%' : 's');
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                line: {
                    borderJoinStyle: 'round'
                }
            },
            layout: {
                padding: {
                    top: 10,
                    right: 20,
                    bottom: 10,
                    left: 10
                }
            }
        }
    });
}

function updateSkillsChart(sessions) {
    const ctx = document.getElementById('skills-chart').getContext('2d');
    
    // Clear existing chart if it exists
    if (window.skillsChart) {
        window.skillsChart.destroy();
    }

    // Calculate skill levels from sessions
    const skillLevels = {
        addition: 0,
        subtraction: 0,
        multiplication: 0,
        division: 0
    };

    let operationCounts = {
        addition: 0,
        subtraction: 0,
        multiplication: 0,
        division: 0
    };

    sessions.forEach(session => {
        session.answers.forEach(answer => {
            skillLevels[answer.operation] += answer.isCorrect ? 1 : 0;
            operationCounts[answer.operation]++;
        });
    });

    // Convert to percentages
    Object.keys(skillLevels).forEach(operation => {
        if (operationCounts[operation] > 0) {
            skillLevels[operation] = (skillLevels[operation] / operationCounts[operation]) * 100;
        }
    });

    window.skillsChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(skillLevels),
            datasets: [{
                label: 'Skill Levels',
                data: Object.values(skillLevels),
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                borderColor: '#4CAF50',
                pointBackgroundColor: '#4CAF50'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Skill Distribution'
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function clearAnalytics() {
    // Clear statistics
    document.getElementById('total-questions').textContent = '0';
    document.getElementById('average-accuracy').textContent = '0%';
    document.getElementById('average-time').textContent = '0s';
    document.getElementById('total-sessions').textContent = '0';

    // Clear charts
    if (window.performanceChart) {
        window.performanceChart.destroy();
    }
    if (window.skillsChart) {
        window.skillsChart.destroy();
    }
}

// Leaderboard management
function initializeLeaderboard() {
    const leaderboard = getLeaderboard();
    const tbody = document.querySelector('#leaderboard-table tbody');
    tbody.innerHTML = '';

    leaderboard.sort((a, b) => b.score - a.score).slice(0, 10).forEach((entry, index) => {
        const row = document.createElement('tr');
        row.className = 'leaderboard-entry';
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.playerName}</td>
            <td>${entry.score}/${entry.questionCount}</td>
            <td>${entry.accuracy.toFixed(1)}%</td>
            <td>${entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}</td>
            <td>${new Date(entry.date).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Local storage management
function loadAnalyticsData() {
    const saved = localStorage.getItem('mathQuizAnalytics');
    if (saved) {
        const data = JSON.parse(saved);
        analyticsState.sessions = data.sessions || [];
        analyticsState.skillLevels = data.skillLevels || {
            addition: 0,
            subtraction: 0,
            multiplication: 0,
            division: 0
        };
        analyticsState.errorPatterns = data.errorPatterns || {};
    }
}

function saveAnalyticsData() {
    localStorage.setItem('mathQuizAnalytics', JSON.stringify({
        sessions: analyticsState.sessions,
        skillLevels: analyticsState.skillLevels,
        errorPatterns: analyticsState.errorPatterns
    }));
}

function getLeaderboard() {
    const saved = localStorage.getItem('mathQuizLeaderboard');
    return saved ? JSON.parse(saved) : [];
}

function saveToLeaderboard(entry) {
    const leaderboard = getLeaderboard();
    // Ensure score cannot exceed question count
    entry.score = Math.min(entry.score, gameState.questionCount);
    entry.questionCount = gameState.questionCount;
    leaderboard.push(entry);
    localStorage.setItem('mathQuizLeaderboard', JSON.stringify(leaderboard));
}

// Add a function to clean existing leaderboard data
function cleanLeaderboardData() {
    const leaderboard = getLeaderboard();
    const cleanedLeaderboard = leaderboard.map(entry => ({
        ...entry,
        score: Math.min(entry.score || 0, entry.questionCount || 5),  // Default to 5 if questionCount is missing
        questionCount: entry.questionCount || 5  // Default to 5 if questionCount is missing
    }));
    localStorage.setItem('mathQuizLeaderboard', JSON.stringify(cleanedLeaderboard));
}

// Initialize the application
document.addEventListener('DOMContentLoaded', initializeGame);
