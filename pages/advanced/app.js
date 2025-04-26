// Game state
let gameState = {
    playerName: '',
    difficulty: 'easy',
    topics: ['linear-equations', 'quadratic-equations', 'areas', 'volumes'],
    questionCount: 10,
    timePerQuestion: 30,
    currentQuestion: 1,
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    hintsUsed: 0,
    timer: null,
    timerProgress: null,
    timerInterval: null,
    currentQuestionData: null
};

// DOM Elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    game: document.getElementById('game-screen'),
    results: document.getElementById('results-screen'),
    leaderboard: document.getElementById('leaderboard-screen')
};

// Difficulty settings
const difficultySettings = {
    easy: {
        linearEquations: { minCoeff: 1, maxCoeff: 5, minConst: -10, maxConst: 10 },
        quadraticEquations: { minCoeff: 1, maxCoeff: 3, minConst: -5, maxConst: 5 },
        areas: { minSide: 2, maxSide: 10 },
        volumes: { minSide: 2, maxSide: 5 }
    },
    medium: {
        linearEquations: { minCoeff: 1, maxCoeff: 10, minConst: -20, maxConst: 20 },
        quadraticEquations: { minCoeff: 1, maxCoeff: 5, minConst: -10, maxConst: 10 },
        areas: { minSide: 5, maxSide: 15 },
        volumes: { minSide: 3, maxSide: 8 }
    },
    hard: {
        linearEquations: { minCoeff: 1, maxCoeff: 15, minConst: -30, maxConst: 30 },
        quadraticEquations: { minCoeff: 1, maxCoeff: 7, minConst: -15, maxConst: 15 },
        areas: { minSide: 8, maxSide: 20 },
        volumes: { minSide: 5, maxSide: 12 }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Player name input
    const playerNameInput = document.getElementById('player-name');
    playerNameInput.addEventListener('input', (e) => {
        gameState.playerName = e.target.value;
    });

    // Topic selection
    document.querySelectorAll('.topic-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const topic = checkbox.value;
            if (checkbox.checked) {
                if (!gameState.topics.includes(topic)) {
                    gameState.topics.push(topic);
                }
            } else {
                const index = gameState.topics.indexOf(topic);
                if (index > -1) {
                    gameState.topics.splice(index, 1);
                }
            }
        });
    });

    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.difficulty = btn.dataset.difficulty;
        });
    });

    // Question count slider
    const questionCountSlider = document.getElementById('question-count');
    const questionCountValue = document.getElementById('question-count-value');
    questionCountSlider.addEventListener('input', () => {
        const value = questionCountSlider.value;
        questionCountValue.textContent = value;
        gameState.questionCount = parseInt(value);
    });

    // Time per question slider
    const timePerQuestionSlider = document.getElementById('time-per-question');
    const timePerQuestionValue = document.getElementById('time-per-question-value');
    timePerQuestionSlider.addEventListener('input', () => {
        const value = timePerQuestionSlider.value;
        timePerQuestionValue.textContent = value;
        gameState.timePerQuestion = parseInt(value);
    });

    // Start game button
    document.getElementById('start-game').addEventListener('click', startGame);

    // Submit answer button
    document.getElementById('submit-answer').addEventListener('click', checkAnswer);

    // Show hint button
    document.getElementById('show-hint').addEventListener('click', showHint);

    // Play again button
    document.getElementById('play-again').addEventListener('click', () => {
        showScreen('welcome');
    });

    // View leaderboard button
    document.getElementById('view-leaderboard').addEventListener('click', showLeaderboard);

    // Back to home button
    document.getElementById('back-to-home').addEventListener('click', () => {
        showScreen('welcome');
    });

    // Leaderboard difficulty filter
    document.getElementById('leaderboard-difficulty').addEventListener('change', (e) => {
        loadLeaderboard(e.target.value);
    });

    // Handle Enter key in answer input
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && document.getElementById('answer-fields').querySelector('input')) {
            checkAnswer();
        }
    });
});

// Show a specific screen
function showScreen(screenId) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenId].classList.add('active');
}

// Start the game
function startGame() {
    if (!gameState.playerName) {
        alert('Please enter your name!');
        return;
    }

    if (gameState.topics.length === 0) {
        alert('Please select at least one topic!');
        return;
    }

    // Reset game state
    gameState.currentQuestion = 1;
    gameState.score = 0;
    gameState.correctAnswers = 0;
    gameState.incorrectAnswers = 0;
    gameState.hintsUsed = 0;

    // Update UI
    document.getElementById('current-question').textContent = gameState.currentQuestion;
    document.getElementById('total-questions').textContent = gameState.questionCount;
    document.getElementById('score').textContent = '0';

    // Show game screen
    showScreen('game');

    // Generate first question
    generateQuestion();
}

// Generate a random question
function generateQuestion() {
    // Select a random topic from the selected topics
    const topic = gameState.topics[Math.floor(Math.random() * gameState.topics.length)];
    const settings = difficultySettings[gameState.difficulty][topic];
    
    let questionData;
    
    switch(topic) {
        case 'linear-equations':
            questionData = generateLinearEquation(settings);
            break;
        case 'quadratic-equations':
            questionData = generateQuadraticEquation(settings);
            break;
        case 'areas':
            questionData = generateAreaQuestion(settings);
            break;
        case 'volumes':
            questionData = generateVolumeQuestion(settings);
            break;
    }
    
    // Store question data
    gameState.currentQuestionData = questionData;
    
    // Update UI
    document.getElementById('question-text').textContent = questionData.question;
    
    // Clear previous figure
    const figureContainer = document.getElementById('figure-container');
    figureContainer.innerHTML = '';
    
    // Add figure if available
    if (questionData.figure) {
        const figureImg = document.createElement('img');
        figureImg.src = questionData.figure;
        figureImg.alt = questionData.figureAlt || 'Figure for the question';
        figureContainer.appendChild(figureImg);
    }
    
    // Create answer fields
    const answerFields = document.getElementById('answer-fields');
    answerFields.innerHTML = '';
    
    if (Array.isArray(questionData.answers)) {
        questionData.answers.forEach((answer, index) => {
            const answerField = document.createElement('div');
            answerField.className = 'answer-field';
            
            const label = document.createElement('label');
            label.textContent = answer.label || `Answer ${index + 1}:`;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.placeholder = 'Enter your answer';
            
            answerField.appendChild(label);
            answerField.appendChild(input);
            answerFields.appendChild(answerField);
        });
    } else {
        const answerField = document.createElement('div');
        answerField.className = 'answer-field';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.step = 'any';
        input.placeholder = 'Enter your answer';
        
        answerField.appendChild(input);
        answerFields.appendChild(answerField);
    }
    
    // Reset hint
    document.getElementById('hint-content').classList.add('hidden');
    
    // Start timer
    startTimer();
}

// Generate a linear equation question
function generateLinearEquation(settings) {
    const a = Math.floor(Math.random() * (settings.maxCoeff - settings.minCoeff + 1)) + settings.minCoeff;
    const b = Math.floor(Math.random() * (settings.maxConst - settings.minConst + 1)) + settings.minConst;
    
    // Format: ax + b = c
    const c = a * Math.floor(Math.random() * 10) + b;
    
    const question = `Solve for x: ${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`;
    const answer = (c - b) / a;
    
    return {
        topic: 'linear-equations',
        question: question,
        answers: [{ value: answer, label: 'x =' }],
        hint: {
            text: 'To solve a linear equation, isolate the variable by performing the same operation on both sides.',
            formula: 'ax + b = c\nx = (c - b) / a'
        }
    };
}

// Generate a quadratic equation question
function generateQuadraticEquation(settings) {
    // For simplicity, we'll use the form ax² + bx + c = 0 with integer solutions
    const x1 = Math.floor(Math.random() * 5) - 2; // One solution between -2 and 2
    const x2 = Math.floor(Math.random() * 5) - 2; // Another solution between -2 and 2
    
    // Expand (x - x1)(x - x2) = 0 to get ax² + bx + c = 0
    const a = 1;
    const b = -(x1 + x2);
    const c = x1 * x2;
    
    let question;
    if (b === 0) {
        question = `Solve for x: x² ${c >= 0 ? '+' : ''} ${c} = 0`;
    } else {
        question = `Solve for x: x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c} = 0`;
    }
    
    return {
        topic: 'quadratic-equations',
        question: question,
        answers: [
            { value: Math.min(x1, x2), label: 'x₁ =' },
            { value: Math.max(x1, x2), label: 'x₂ =' }
        ],
        hint: {
            text: 'For a quadratic equation ax² + bx + c = 0, you can use the quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)',
            formula: 'x = (-b ± √(b² - 4ac)) / (2a)'
        }
    };
}

// Generate an area question
function generateAreaQuestion(settings) {
    const shapes = [
        {
            name: 'rectangle',
            generate: () => {
                const width = Math.floor(Math.random() * (settings.maxSide - settings.minSide + 1)) + settings.minSide;
                const height = Math.floor(Math.random() * (settings.maxSide - settings.minSide + 1)) + settings.minSide;
                const area = width * height;
                
                return {
                    question: `Find the area of a rectangle with width ${width} units and height ${height} units.`,
                    answers: [{ value: area, label: 'Area =' }],
                    hint: {
                        text: 'The area of a rectangle is calculated by multiplying its width by its height.',
                        formula: 'Area = width × height'
                    },
                    figure: `data:image/svg+xml,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
                            <rect x="50" y="25" width="100" height="100" fill="none" stroke="black" stroke-width="2"/>
                            <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" font-size="14">${width} × ${height}</text>
                            <text x="50" y="20" text-anchor="middle" font-size="12">width</text>
                            <text x="150" y="140" text-anchor="middle" font-size="12">height</text>
                        </svg>
                    `)}`,
                    figureAlt: 'Rectangle with width and height labeled'
                };
            }
        },
        {
            name: 'triangle',
            generate: () => {
                const base = Math.floor(Math.random() * (settings.maxSide - settings.minSide + 1)) + settings.minSide;
                const height = Math.floor(Math.random() * (settings.maxSide - settings.minSide + 1)) + settings.minSide;
                const area = 0.5 * base * height;
                
                return {
                    question: `Find the area of a triangle with base ${base} units and height ${height} units.`,
                    answers: [{ value: area, label: 'Area =' }],
                    hint: {
                        text: 'The area of a triangle is calculated by multiplying its base by its height and dividing by 2.',
                        formula: 'Area = (base × height) / 2'
                    },
                    figure: `data:image/svg+xml,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
                            <polygon points="50,125 150,125 100,25" fill="none" stroke="black" stroke-width="2"/>
                            <line x1="50" y1="125" x2="150" y2="125" stroke="black" stroke-width="2"/>
                            <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" font-size="14">${base} × ${height}</text>
                            <text x="100" y="140" text-anchor="middle" font-size="12">base</text>
                            <text x="110" y="75" text-anchor="start" font-size="12">height</text>
                        </svg>
                    `)}`,
                    figureAlt: 'Triangle with base and height labeled'
                };
            }
        },
        {
            name: 'circle',
            generate: () => {
                const radius = Math.floor(Math.random() * (settings.maxSide - settings.minSide + 1)) + settings.minSide;
                const area = Math.PI * radius * radius;
                
                return {
                    question: `Find the area of a circle with radius ${radius} units. (Round to 2 decimal places)`,
                    answers: [{ value: Math.round(area * 100) / 100, label: 'Area =' }],
                    hint: {
                        text: 'The area of a circle is calculated using the formula πr², where r is the radius.',
                        formula: 'Area = π × r²'
                    },
                    figure: `data:image/svg+xml,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
                            <circle cx="100" cy="75" r="50" fill="none" stroke="black" stroke-width="2"/>
                            <line x1="100" y1="75" x2="150" y2="75" stroke="black" stroke-width="2"/>
                            <text x="125" y="70" text-anchor="middle" font-size="12">r = ${radius}</text>
                        </svg>
                    `)}`,
                    figureAlt: 'Circle with radius labeled'
                };
            }
        }
    ];
    
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return shape.generate();
}

// Generate a volume question
function generateVolumeQuestion(settings) {
    const shapes = [
        {
            name: 'cube',
            generate: () => {
                const side = Math.floor(Math.random() * (settings.maxSide - settings.minSide + 1)) + settings.minSide;
                const volume = side * side * side;
                
                return {
                    question: `Find the volume of a cube with side length ${side} units.`,
                    answers: [{ value: volume, label: 'Volume =' }],
                    hint: {
                        text: 'The volume of a cube is calculated by cubing its side length.',
                        formula: 'Volume = side³'
                    },
                    figure: `data:image/svg+xml,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
                            <polygon points="50,50 100,25 150,50 100,75" fill="none" stroke="black" stroke-width="2"/>
                            <polygon points="50,100 100,75 150,100 100,125" fill="none" stroke="black" stroke-width="2"/>
                            <line x1="50" y1="50" x2="50" y2="100" stroke="black" stroke-width="2"/>
                            <line x1="150" y1="50" x2="150" y2="100" stroke="black" stroke-width="2"/>
                            <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" font-size="14">${side}</text>
                        </svg>
                    `)}`,
                    figureAlt: 'Cube with side length labeled'
                };
            }
        },
        {
            name: 'rectangular prism',
            generate: () => {
                const length = Math.floor(Math.random() * (settings.maxSide - settings.minSide + 1)) + settings.minSide;
                const width = Math.floor(Math.random() * (settings.maxSide - settings.minSide + 1)) + settings.minSide;
                const height = Math.floor(Math.random() * (settings.maxSide - settings.minSide + 1)) + settings.minSide;
                const volume = length * width * height;
                
                return {
                    question: `Find the volume of a rectangular prism with length ${length} units, width ${width} units, and height ${height} units.`,
                    answers: [{ value: volume, label: 'Volume =' }],
                    hint: {
                        text: 'The volume of a rectangular prism is calculated by multiplying its length, width, and height.',
                        formula: 'Volume = length × width × height'
                    },
                    figure: `data:image/svg+xml,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
                            <polygon points="50,50 100,25 150,50 100,75" fill="none" stroke="black" stroke-width="2"/>
                            <polygon points="50,100 100,75 150,100 100,125" fill="none" stroke="black" stroke-width="2"/>
                            <line x1="50" y1="50" x2="50" y2="100" stroke="black" stroke-width="2"/>
                            <line x1="150" y1="50" x2="150" y2="100" stroke="black" stroke-width="2"/>
                            <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" font-size="14">${length} × ${width} × ${height}</text>
                        </svg>
                    `)}`,
                    figureAlt: 'Rectangular prism with dimensions labeled'
                };
            }
        },
        {
            name: 'cylinder',
            generate: () => {
                const radius = Math.floor(Math.random() * (settings.maxSide - settings.minSide + 1)) + settings.minSide;
                const height = Math.floor(Math.random() * (settings.maxSide - settings.minSide + 1)) + settings.minSide;
                const volume = Math.PI * radius * radius * height;
                
                return {
                    question: `Find the volume of a cylinder with radius ${radius} units and height ${height} units. (Round to 2 decimal places)`,
                    answers: [{ value: Math.round(volume * 100) / 100, label: 'Volume =' }],
                    hint: {
                        text: 'The volume of a cylinder is calculated using the formula πr²h, where r is the radius and h is the height.',
                        formula: 'Volume = π × r² × h'
                    },
                    figure: `data:image/svg+xml,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
                            <ellipse cx="100" cy="50" rx="40" ry="10" fill="none" stroke="black" stroke-width="2"/>
                            <ellipse cx="100" cy="100" rx="40" ry="10" fill="none" stroke="black" stroke-width="2"/>
                            <line x1="60" y1="50" x2="60" y2="100" stroke="black" stroke-width="2"/>
                            <line x1="140" y1="50" x2="140" y2="100" stroke="black" stroke-width="2"/>
                            <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" font-size="14">r = ${radius}, h = ${height}</text>
                        </svg>
                    `)}`,
                    figureAlt: 'Cylinder with radius and height labeled'
                };
            }
        }
    ];
    
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return shape.generate();
}

// Show hint
function showHint() {
    const hintContent = document.getElementById('hint-content');
    const hintText = document.getElementById('hint-text');
    const hintFormula = document.getElementById('hint-formula');
    
    hintText.textContent = gameState.currentQuestionData.hint.text;
    hintFormula.textContent = gameState.currentQuestionData.hint.formula;
    
    hintContent.classList.remove('hidden');
    gameState.hintsUsed++;
}

// Start the timer
function startTimer() {
    const timerElement = document.getElementById('timer');
    const timerProgressElement = document.querySelector('.timer-progress');
    
    let timeLeft = gameState.timePerQuestion;
    timerElement.textContent = timeLeft;
    timerProgressElement.style.width = '100%';
    
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    const startTime = Date.now();
    
    gameState.timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timeLeft = gameState.timePerQuestion - elapsedTime;
        
        if (timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            handleTimeout();
        } else {
            timerElement.textContent = timeLeft;
            const progressPercent = (timeLeft / gameState.timePerQuestion) * 100;
            timerProgressElement.style.width = `${progressPercent}%`;
        }
    }, 100);
}

// Handle timeout
function handleTimeout() {
    gameState.incorrectAnswers++;
    document.getElementById('feedback').textContent = `Time's up!`;
    document.getElementById('feedback').className = 'feedback incorrect';
    
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

// Check answer
function checkAnswer() {
    clearInterval(gameState.timerInterval);
    
    const answerFields = document.getElementById('answer-fields');
    const inputs = answerFields.querySelectorAll('input');
    const feedbackElement = document.getElementById('feedback');
    
    let allCorrect = true;
    let userAnswers = [];
    
    inputs.forEach((input, index) => {
        const userAnswer = parseFloat(input.value);
        userAnswers.push(userAnswer);
        
        if (isNaN(userAnswer)) {
            allCorrect = false;
        }
    });
    
    if (userAnswers.length === 0) {
        feedbackElement.textContent = 'Please enter an answer!';
        feedbackElement.className = 'feedback incorrect';
        return;
    }
    
    if (!allCorrect) {
        feedbackElement.textContent = 'Please enter valid numbers!';
        feedbackElement.className = 'feedback incorrect';
        return;
    }
    
    // Check if all answers are correct
    const correctAnswers = gameState.currentQuestionData.answers.map(a => a.value);
    
    if (userAnswers.length !== correctAnswers.length) {
        feedbackElement.textContent = 'Please provide all required answers!';
        feedbackElement.className = 'feedback incorrect';
        return;
    }
    
    // Check if answers match (with some tolerance for floating point)
    const tolerance = 0.01;
    allCorrect = userAnswers.every((answer, index) => {
        return Math.abs(answer - correctAnswers[index]) < tolerance;
    });
    
    if (allCorrect) {
        gameState.score += 10;
        gameState.correctAnswers++;
        feedbackElement.textContent = 'Correct!';
        feedbackElement.className = 'feedback correct';
    } else {
        gameState.incorrectAnswers++;
        feedbackElement.textContent = 'Incorrect!';
        feedbackElement.className = 'feedback incorrect';
    }
    
    document.getElementById('score').textContent = gameState.score;
    
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

// Move to next question
function nextQuestion() {
    gameState.currentQuestion++;
    
    if (gameState.currentQuestion > gameState.questionCount) {
        endGame();
    } else {
        document.getElementById('current-question').textContent = gameState.currentQuestion;
        generateQuestion();
    }
}

// End the game
function endGame() {
    // Calculate final score
    const finalScore = gameState.score;
    
    // Update results screen
    document.getElementById('final-score').textContent = finalScore;
    document.getElementById('correct-answers').textContent = gameState.correctAnswers;
    document.getElementById('incorrect-answers').textContent = gameState.incorrectAnswers;
    document.getElementById('hints-used').textContent = gameState.hintsUsed;
    
    // Save score to leaderboard
    saveScore(finalScore);
    
    // Show results screen
    showScreen('results');
}

// Save score to leaderboard
function saveScore(score) {
    const leaderboard = JSON.parse(localStorage.getItem('mathMindsAdvancedLeaderboard') || '[]');
    
    leaderboard.push({
        name: gameState.playerName,
        score: score,
        difficulty: gameState.difficulty,
        date: new Date().toISOString()
    });
    
    // Sort by score (descending)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 10
    const topScores = leaderboard.slice(0, 10);
    
    localStorage.setItem('mathMindsAdvancedLeaderboard', JSON.stringify(topScores));
}

// Show leaderboard
function showLeaderboard() {
    loadLeaderboard('all');
    showScreen('leaderboard');
}

// Load leaderboard with optional difficulty filter
function loadLeaderboard(difficulty = 'all') {
    const leaderboard = JSON.parse(localStorage.getItem('mathMindsAdvancedLeaderboard') || '[]');
    const leaderboardEntries = document.getElementById('leaderboard-entries');
    
    // Clear existing entries
    leaderboardEntries.innerHTML = '';
    
    // Filter by difficulty if needed
    const filteredLeaderboard = difficulty === 'all' 
        ? leaderboard 
        : leaderboard.filter(entry => entry.difficulty === difficulty);
    
    // Create entries
    filteredLeaderboard.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.className = 'leaderboard-entry';
        
        entryElement.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="name">${entry.name}</div>
            <div class="score">${entry.score}</div>
            <div class="difficulty">${entry.difficulty}</div>
        `;
        
        leaderboardEntries.appendChild(entryElement);
    });
    
    // Show message if no entries
    if (filteredLeaderboard.length === 0) {
        leaderboardEntries.innerHTML = '<div class="no-entries">No scores yet. Be the first!</div>';
    }
} 