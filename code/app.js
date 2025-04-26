// Game state
let gameState = {
    playerName: '',
    difficulty: 'easy',
    operations: ['addition', 'subtraction', 'multiplication'],
    questionCount: 10,
    timePerQuestion: 15,
    currentQuestion: 0,
    score: 0,
    questions: [],
    timer: null,
    gameStats: {
        startTime: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        totalTime: 0
    }
};

// Utility functions
const utils = {
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    getDifficultyRange(difficulty) {
        switch(difficulty) {
            case 'easy': return { min: 1, max: 10 };
            case 'medium': return { min: 1, max: 50 };
            case 'hard': return { min: 1, max: 100 };
            default: return { min: 1, max: 10 };
        }
    },
    
    calculateScore(isCorrect, timeTaken, difficulty) {
        if (!isCorrect) return 0;
        
        const baseScore = 10;
        const difficultyMultiplier = {
            'easy': 1,
            'medium': 1.5,
            'hard': 2
        };
        
        const timeBonus = Math.max(0, 5 * (1 - timeTaken / gameState.timePerQuestion));
        return Math.round((baseScore + timeBonus) * difficultyMultiplier[difficulty]);
    },
    
    formatTime(seconds) {
        return seconds.toFixed(1);
    }
};

// Question generation
const questionGenerator = {
    generateQuestion(difficulty, operation) {
        const range = utils.getDifficultyRange(difficulty);
        let num1, num2, answer, operator;
        
        switch(operation) {
            case 'addition':
                num1 = utils.getRandomInt(range.min, range.max);
                num2 = utils.getRandomInt(range.min, range.max);
                answer = num1 + num2;
                operator = '+';
                break;
                
            case 'subtraction':
                if (difficulty === 'easy') {
                    num1 = utils.getRandomInt(range.min, range.max);
                    num2 = utils.getRandomInt(range.min, num1);
                } else {
                    num1 = utils.getRandomInt(range.min, range.max);
                    num2 = utils.getRandomInt(range.min, range.max);
                }
                answer = num1 - num2;
                operator = '-';
                break;
                
            case 'multiplication':
                const multRange = difficulty === 'hard' ? 12 : (difficulty === 'medium' ? 10 : 5);
                num1 = utils.getRandomInt(1, multRange);
                num2 = utils.getRandomInt(1, multRange);
                answer = num1 * num2;
                operator = '×';
                break;
        }
        
        return { num1, num2, operator, answer, operation };
    },
    
    generateQuestionSet() {
        const questions = [];
        for (let i = 0; i < gameState.questionCount; i++) {
            const operation = gameState.operations[Math.floor(Math.random() * gameState.operations.length)];
            questions.push(this.generateQuestion(gameState.difficulty, operation));
        }
        return questions;
    }
};

// Timer management
const timer = {
    interval: null,
    timeLeft: 0,
    
    start(duration, onComplete) {
        this.stop();
        this.timeLeft = duration;
        
        const timerElement = document.getElementById('timer');
        const progressElement = document.querySelector('.timer-progress');
        
        this.interval = setInterval(() => {
            this.timeLeft--;
            
            if (timerElement) {
                timerElement.textContent = this.timeLeft;
            }
            
            if (progressElement) {
                const percentage = (this.timeLeft / duration) * 100;
                progressElement.style.width = `${percentage}%`;
                
                if (this.timeLeft <= 5) {
                    progressElement.style.backgroundColor = 'var(--error-color)';
                }
            }
            
            if (this.timeLeft <= 0) {
                this.stop();
                if (onComplete) onComplete();
            }
        }, 1000);
        
        // Initial update
        if (timerElement) timerElement.textContent = this.timeLeft;
        if (progressElement) {
            progressElement.style.width = '100%';
            progressElement.style.backgroundColor = 'var(--primary-color)';
        }
    },
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    getTimeElapsed(duration) {
        return duration - this.timeLeft;
    }
};

// Storage management
const storage = {
    saveScore(scoreData) {
        const scores = this.getScores();
        scores.push({
            ...scoreData,
            timestamp: Date.now()
        });
        
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('mathMindsScores', JSON.stringify(scores));
    },
    
    getScores() {
        const scores = localStorage.getItem('mathMindsScores');
        return scores ? JSON.parse(scores) : [];
    },
    
    getTopScores(limit = 5, difficulty = 'all') {
        const scores = this.getScores();
        const filteredScores = difficulty === 'all' 
            ? scores 
            : scores.filter(score => score.difficulty === difficulty);
        return filteredScores.slice(0, limit);
    }
};

// Game management
const game = {
    initialize() {
        // Setup event listeners
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('submit-answer').addEventListener('click', () => this.submitAnswer());
        document.getElementById('answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitAnswer();
        });
        document.getElementById('play-again').addEventListener('click', () => this.showScreen('welcome-screen'));
        document.getElementById('view-leaderboard').addEventListener('click', () => {
            leaderboard.updateLeaderboard();
            this.showScreen('leaderboard-screen');
        });
        document.getElementById('back-to-home').addEventListener('click', () => this.showScreen('welcome-screen'));
        
        // Setup difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                gameState.difficulty = button.dataset.difficulty;
            });
        });
        
        // Setup range inputs
        document.getElementById('question-count').addEventListener('input', (e) => {
            document.getElementById('question-count-value').textContent = e.target.value;
            gameState.questionCount = parseInt(e.target.value);
        });
        
        document.getElementById('time-per-question').addEventListener('input', (e) => {
            document.getElementById('time-per-question-value').textContent = e.target.value;
            gameState.timePerQuestion = parseInt(e.target.value);
        });
        
        // Initialize leaderboard
        leaderboard.initialize();
    },
    
    startGame() {
        // Validate player name
        const playerName = document.getElementById('player-name').value.trim();
        if (!playerName) {
            const input = document.getElementById('player-name');
            input.classList.add('animate-shake');
            setTimeout(() => input.classList.remove('animate-shake'), 500);
            return;
        }
        
        // Get selected operations
        const operations = Array.from(document.querySelectorAll('.operation-checkbox input:checked'))
            .map(cb => cb.value);
        
        if (operations.length === 0) {
            alert('Please select at least one operation');
            return;
        }
        
        // Update game state
        gameState = {
            ...gameState,
            playerName,
            operations,
            currentQuestion: 0,
            score: 0,
            questions: [],
            gameStats: {
                startTime: Date.now(),
                correctAnswers: 0,
                incorrectAnswers: 0,
                totalTime: 0
            }
        };
        
        // Generate questions
        gameState.questions = questionGenerator.generateQuestionSet();
        
        // Show game screen
        this.showScreen('game-screen');
        
        // Display first question
        this.displayQuestion();
        
        // Start timer
        timer.start(gameState.timePerQuestion, () => this.handleTimeUp());
        
        // Focus on answer input
        document.getElementById('answer').focus();
    },
    
    displayQuestion() {
        const question = gameState.questions[gameState.currentQuestion];
        
        document.getElementById('current-question').textContent = gameState.currentQuestion + 1;
        document.getElementById('total-questions').textContent = gameState.questions.length;
        document.getElementById('score').textContent = gameState.score;
        
        document.getElementById('number1').textContent = question.num1;
        document.getElementById('operator').textContent = question.operator;
        document.getElementById('number2').textContent = question.num2;
        
        document.getElementById('answer').value = '';
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
    },
    
    submitAnswer() {
        const answerInput = document.getElementById('answer');
        const userAnswer = answerInput.value.trim();
        
        if (!userAnswer || isNaN(userAnswer)) {
            answerInput.classList.add('animate-shake');
            setTimeout(() => answerInput.classList.remove('animate-shake'), 500);
            return;
        }
        
        const question = gameState.questions[gameState.currentQuestion];
        const isCorrect = parseInt(userAnswer) === question.answer;
        const timeTaken = timer.getTimeElapsed(gameState.timePerQuestion);
        
        this.showFeedback(isCorrect, question.answer);
        
        if (isCorrect) {
            gameState.score += utils.calculateScore(true, timeTaken, gameState.difficulty);
            gameState.gameStats.correctAnswers++;
        } else {
            gameState.gameStats.incorrectAnswers++;
        }
        
        timer.stop();
        
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    },
    
    handleTimeUp() {
        const question = gameState.questions[gameState.currentQuestion];
        this.showFeedback(false, question.answer);
        gameState.gameStats.incorrectAnswers++;
        
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    },
    
    showFeedback(isCorrect, correctAnswer) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = isCorrect ? 'Correct!' : `Incorrect! The answer is ${correctAnswer}`;
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    },
    
    nextQuestion() {
        gameState.currentQuestion++;
        
        if (gameState.currentQuestion >= gameState.questions.length) {
            this.endGame();
            return;
        }
        
        this.displayQuestion();
        timer.start(gameState.timePerQuestion, () => this.handleTimeUp());
        document.getElementById('answer').focus();
    },
    
    endGame() {
        gameState.gameStats.totalTime = (Date.now() - gameState.gameStats.startTime) / 1000;
        
        // Update results screen
        document.getElementById('final-score').textContent = gameState.score;
        document.getElementById('correct-answers').textContent = gameState.gameStats.correctAnswers;
        document.getElementById('incorrect-answers').textContent = gameState.gameStats.incorrectAnswers;
        document.getElementById('average-time').textContent = 
            utils.formatTime(gameState.gameStats.totalTime / gameState.questions.length);
        
        // Save score
        storage.saveScore({
            playerName: gameState.playerName,
            score: gameState.score,
            difficulty: gameState.difficulty,
            correctAnswers: gameState.gameStats.correctAnswers,
            totalQuestions: gameState.questions.length,
            averageTime: gameState.gameStats.totalTime / gameState.questions.length
        });
        
        this.showScreen('results-screen');
    },
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        document.getElementById(screenId).style.display = 'block';
    }
};

// Leaderboard management
const leaderboard = {
    initialize() {
        document.getElementById('leaderboard-difficulty').addEventListener('change', () => {
            this.updateLeaderboard();
        });
    },
    
    updateLeaderboard() {
        const difficulty = document.getElementById('leaderboard-difficulty').value;
        const scores = storage.getTopScores(5, difficulty);
        const container = document.getElementById('leaderboard-entries');
        
        container.innerHTML = '';
        
        if (scores.length === 0) {
            container.innerHTML = `
                <div class="leaderboard-entry" style="text-align: center;">
                    <div style="grid-column: 1 / -1">No scores yet! Be the first to play.</div>
                </div>
            `;
            return;
        }
        
        scores.forEach((score, index) => {
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry';
            
            entry.innerHTML = `
                <div class="rank">${this.getRankDisplay(index + 1)}</div>
                <div class="name">${score.playerName}</div>
                <div class="score">${score.score}</div>
                <div class="difficulty">${score.difficulty}</div>
            `;
            
            container.appendChild(entry);
        });
    },
    
    getRankDisplay(rank) {
        switch(rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return rank;
        }
    }
};

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    game.initialize();
});