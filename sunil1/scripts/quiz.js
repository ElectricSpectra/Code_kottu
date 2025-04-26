// Quiz.js - Manages the quiz functionality

const QuizManager = (function() {
  // Private variables
  let currentQuiz = {
    topic: '',
    difficulty: '',
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    startTime: null,
    endTime: null,
    totalTime: 0,
    isActive: false,
    currentDifficultyLevel: 1 // 0: easy, 1: medium, 2: advanced
  };
  
  let timerInterval = null;
  const difficultyLevels = ['easy', 'medium', 'advanced'];
  
  // Private methods
  function startTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    currentQuiz.startTime = new Date();
    const timerDisplay = document.getElementById('timerDisplay');
    
    timerInterval = setInterval(() => {
      const currentTime = new Date();
      const elapsedSeconds = Math.floor((currentTime - currentQuiz.startTime) / 1000);
      const minutes = Math.floor(elapsedSeconds / 60);
      const seconds = elapsedSeconds % 60;
      
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      // Add warning class when time is running low
      if (currentQuiz.difficulty === 'advanced' && elapsedSeconds > 120) {
        document.querySelector('.quiz-timer').classList.add('warning');
      } else if (currentQuiz.difficulty === 'medium' && elapsedSeconds > 60) {
        document.querySelector('.quiz-timer').classList.add('warning');
      } else if (currentQuiz.difficulty === 'easy' && elapsedSeconds > 30) {
        document.querySelector('.quiz-timer').classList.add('warning');
      }
    }, 1000);
  }
  
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    currentQuiz.endTime = new Date();
    currentQuiz.totalTime = Math.floor((currentQuiz.endTime - currentQuiz.startTime) / 1000);
  }
  
  function adjustDifficulty(isCorrect) {
    if (isCorrect && currentQuiz.currentDifficultyLevel < 2) {
      currentQuiz.currentDifficultyLevel++;
    } else if (!isCorrect && currentQuiz.currentDifficultyLevel > 0) {
      currentQuiz.currentDifficultyLevel--;
    }
    
    // Update the current difficulty
    currentQuiz.difficulty = difficultyLevels[currentQuiz.currentDifficultyLevel];
    
    // Update difficulty display
    document.getElementById('quizDifficulty').textContent = QuestionsManager.getDifficultyName(currentQuiz.difficulty);
  }
  
  function getNextQuestion() {
    // Get questions for the current difficulty level
    const questions = QuestionsManager.getQuestions(currentQuiz.topic, currentQuiz.difficulty);
    if (questions && questions.length > 0) {
      // Randomly select a question
      const randomIndex = Math.floor(Math.random() * questions.length);
      return questions[randomIndex];
    }
    return null;
  }
  
  function displayQuestion(index) {
    // Get the next question based on current difficulty
    const question = index === 0 ? currentQuiz.questions[0] : getNextQuestion();
    if (!question) return;
    
    // Update questions array
    currentQuiz.questions[index] = question;
    
    const questionText = document.getElementById('questionText');
    const questionMath = document.getElementById('questionMath');
    const optionsContainer = document.getElementById('optionsContainer');
    const progressFill = document.querySelector('.progress-fill');
    const questionCounter = document.getElementById('questionCounter');
    const hintContent = document.getElementById('hintContent');
    const feedbackContainer = document.getElementById('feedbackContainer');
    
    // Reset state
    questionText.textContent = question.text;
    questionMath.innerHTML = ''; // Clear previous math
    optionsContainer.innerHTML = '';
    hintContent.classList.remove('active');
    feedbackContainer.classList.remove('active');
    document.getElementById('nextQuestionBtn').disabled = true;
    document.querySelector('.quiz-timer').classList.remove('warning');
    document.getElementById('showHintBtn').style.display = 'block';
    
    // Update progress
    const progress = ((index + 1) / currentQuiz.questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    questionCounter.textContent = `Question ${index + 1}/${currentQuiz.questions.length}`;
    
    // Display math if needed
    if (question.mathExpression) {
      questionMath.innerHTML = `\\[${question.mathExpression}\\]`;
      // Render math with MathJax
      if (window.MathJax) {
        MathJax.typesetPromise([questionMath]);
      }
    }
    
    // Create options
    question.options.forEach((option, i) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option-item';
      optionElement.dataset.index = i;
      
      if (option.mathExpression) {
        optionElement.innerHTML = `<div class="option-text">${String.fromCharCode(65 + i)}. </div><div class="option-math">\\(${option.mathExpression}\\)</div>`;
      } else {
        optionElement.innerHTML = `<div class="option-text">${String.fromCharCode(65 + i)}. ${option.text}</div>`;
      }
      
      optionElement.addEventListener('click', function() {
        selectAnswer(this.dataset.index);
      });
      
      optionsContainer.appendChild(optionElement);
    });
    
    // Render math in options if needed
    if (window.MathJax) {
      MathJax.typesetPromise([optionsContainer]);
    }
    
    // Update quiz info
    document.getElementById('quizTopic').textContent = currentQuiz.topic;
    document.getElementById('quizDifficulty').textContent = QuestionsManager.getDifficultyName(currentQuiz.difficulty);
  }
  
  function selectAnswer(optionIndex) {
    // Prevent selecting answer if feedback is shown
    if (document.getElementById('feedbackContainer').classList.contains('active')) {
      return;
    }
    
    const currentQuestion = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    const options = document.querySelectorAll('.option-item');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    
    // Remove selected class from all options
    options.forEach(option => {
      option.classList.remove('selected');
      option.classList.add('disabled');
    });
    
    // Mark selected option
    const selectedOption = options[optionIndex];
    selectedOption.classList.add('selected');
    
    // Save answer
    currentQuiz.answers[currentQuiz.currentQuestionIndex] = parseInt(optionIndex);
    
    // Check if answer is correct
    const isCorrect = parseInt(optionIndex) === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      currentQuiz.score++;
      selectedOption.classList.add('correct');
    } else {
      selectedOption.classList.add('incorrect');
      options[currentQuestion.correctAnswer].classList.add('correct');
    }
    
    // Adjust difficulty based on answer
    adjustDifficulty(isCorrect);
    
    // Show feedback
    showFeedback(isCorrect, currentQuestion);
    
    // Enable next button
    nextQuestionBtn.disabled = false;
  }
  
  function showFeedback(isCorrect, question) {
    const feedbackContainer = document.getElementById('feedbackContainer');
    const feedbackContent = document.getElementById('feedbackContent');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackText = document.getElementById('feedbackText');
    const feedbackFormula = document.getElementById('feedbackFormula');
    
    // Set feedback content
    if (isCorrect) {
      feedbackContent.className = 'feedback-content correct';
      feedbackIcon.innerHTML = '✓';
      feedbackTitle.textContent = 'Correct!';
      feedbackTitle.className = 'feedback-title correct';
      feedbackText.textContent = question.explanation || 'Great job!';
    } else {
      feedbackContent.className = 'feedback-content incorrect';
      feedbackIcon.innerHTML = '✗';
      feedbackTitle.textContent = 'Incorrect';
      feedbackTitle.className = 'feedback-title incorrect';
      feedbackText.textContent = question.explanation || 'The correct answer is: ' + 
        (question.options[question.correctAnswer].text || String.fromCharCode(65 + question.correctAnswer));
    }
    
    // Add formula if exists
    if (question.solutionFormula) {
      feedbackFormula.innerHTML = `\\[${question.solutionFormula}\\]`;
      feedbackFormula.style.display = 'block';
      // Render math with MathJax
      if (window.MathJax) {
        MathJax.typesetPromise([feedbackFormula]);
      }
    } else {
      feedbackFormula.style.display = 'none';
    }
    
    // Show feedback
    feedbackContainer.classList.add('active');
  }
  
  function showResults() {
    const scorePercentage = document.getElementById('scorePercentage');
    const scoreValue = document.getElementById('scoreValue');
    const correctAnswers = document.getElementById('correctAnswers');
    const incorrectAnswers = document.getElementById('incorrectAnswers');
    const totalTime = document.getElementById('totalTime');
    const scoreCircle = document.querySelector('.score-circle');
    
    // Calculate score
    const percentage = Math.round((currentQuiz.score / currentQuiz.questions.length) * 100);
    
    // Set score details
    scorePercentage.textContent = `${percentage}%`;
    scoreValue.textContent = `${currentQuiz.score}/${currentQuiz.questions.length}`;
    correctAnswers.textContent = currentQuiz.score;
    incorrectAnswers.textContent = currentQuiz.questions.length - currentQuiz.score;
    
    // Format and display total time
    const minutes = Math.floor(currentQuiz.totalTime / 60);
    const seconds = currentQuiz.totalTime % 60;
    totalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Style score circle based on percentage
    scoreCircle.className = 'score-circle';
    scoreCircle.style.setProperty('--score-height', `${percentage}%`);
    
    if (percentage >= 80) {
      scoreCircle.classList.add('good');
    } else if (percentage >= 60) {
      scoreCircle.classList.add('average');
    } else {
      scoreCircle.classList.add('poor');
    }
    
    // Add animation
    scoreCircle.classList.add('animate-score-fill');
    
    // Save quiz to history
    StorageManager.saveQuizToHistory({
      topic: currentQuiz.topic,
      difficulty: currentQuiz.difficulty,
      score: currentQuiz.score,
      totalQuestions: currentQuiz.questions.length,
      percentage: percentage,
      date: new Date().toISOString(),
      time: currentQuiz.totalTime
    });
    
    // Clear saved quiz state
    StorageManager.clearSavedQuiz();
    
    // Show results screen
    UI.showScreen('resultsScreen');
  }
  
  // Public methods
  return {
    init: function() {
      // Initialize quiz state
      this.resetQuiz();
    },
    
    resetQuiz: function() {
      currentQuiz = {
        topic: '',
        difficulty: '',
        questions: [],
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        startTime: null,
        endTime: null,
        totalTime: 0,
        isActive: false,
        currentDifficultyLevel: 1
      };
      
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    },
    
    startQuiz: function(topic, difficulty) {
      // Reset quiz state
      this.resetQuiz();
      
      // Set quiz properties
      currentQuiz.topic = topic;
      currentQuiz.difficulty = difficulty;
      
      // Set initial difficulty level
      currentQuiz.currentDifficultyLevel = difficultyLevels.indexOf(difficulty);
      
      // Get first question
      const questions = QuestionsManager.getQuestions(topic, difficulty);
      
      // If no questions available, show error and return
      if (!questions || questions.length === 0) {
        UI.showNotification('No questions available for this topic and difficulty', 'error');
        return;
      }
      
      // Initialize with first question
      currentQuiz.questions = [questions[Math.floor(Math.random() * questions.length)]];
      
      // Initialize answers array (we'll add more slots as needed)
      currentQuiz.answers = new Array(10).fill(null);
      
      // Set quiz as active
      currentQuiz.isActive = true;
      
      // Show quiz screen
      UI.showScreen('quizScreen');
      
      // Display first question
      displayQuestion(0);
      
      // Start timer
      startTimer();
      
      // Save initial state
      this.saveCurrentState();
    },
    
    resumeQuiz: function(savedQuiz) {
      // Restore quiz state from saved quiz
      currentQuiz = savedQuiz;
      currentQuiz.startTime = new Date(currentQuiz.startTime);
      if (currentQuiz.endTime) {
        currentQuiz.endTime = new Date(currentQuiz.endTime);
      }
      
      // Set quiz as active
      currentQuiz.isActive = true;
      
      // Show quiz screen
      UI.showScreen('quizScreen');
      
      // Display current question
      displayQuestion(currentQuiz.currentQuestionIndex);
      
      // Restore answered questions
      const options = document.querySelectorAll('.option-item');
      const currentAnswer = currentQuiz.answers[currentQuiz.currentQuestionIndex];
      
      if (currentAnswer !== null) {
        // Simulate clicking the answer
        selectAnswer(currentAnswer);
      }
      
      // Resume timer
      startTimer();
    },
    
    nextQuestion: function() {
      if (currentQuiz.currentQuestionIndex < 9) { // Limit to 10 questions
        // Move to next question
        currentQuiz.currentQuestionIndex++;
        
        // Display next question
        displayQuestion(currentQuiz.currentQuestionIndex);
        
        // Save current state
        this.saveCurrentState();
      } else {
        // End the quiz
        this.endQuiz();
      }
    },
    
    showHint: function() {
      const currentQuestion = currentQuiz.questions[currentQuiz.currentQuestionIndex];
      const hintContent = document.getElementById('hintContent');
      const hintText = document.getElementById('hintText');
      const hintFormula = document.getElementById('hintFormula');
      
      // Show hint text if available
      if (currentQuestion.hint) {
        hintText.textContent = currentQuestion.hint;
      } else {
        hintText.textContent = 'No hint available for this question.';
      }
      
      // Show hint formula if available
      if (currentQuestion.hintFormula) {
        hintFormula.innerHTML = `\\[${currentQuestion.hintFormula}\\]`;
        hintFormula.style.display = 'block';
        
        // Render math with MathJax
        if (window.MathJax) {
          MathJax.typesetPromise([hintFormula]);
        }
      } else {
        hintFormula.style.display = 'none';
      }
      
      // Show hint container
      hintContent.classList.add('active');
      
      // Hide hint button
      document.getElementById('showHintBtn').style.display = 'none';
    },
    
    endQuiz: function(isQuit = false) {
      // Stop timer
      stopTimer();
      
      // Set quiz as inactive
      currentQuiz.isActive = false;
      
      if (isQuit) {
        // Clear saved quiz state
        StorageManager.clearSavedQuiz();
        
        // Return to topic selection
        UI.showScreen('topicScreen');
      } else {
        // Show results
        showResults();
      }
    },
    
    retryQuiz: function() {
      const topic = currentQuiz.topic;
      const difficulty = currentQuiz.difficulty;
      
      // Start a new quiz with the same topic and difficulty
      this.startQuiz(topic, difficulty);
    },
    
    reviewQuestions: function() {
      const reviewContainer = document.getElementById('reviewContainer');
      
      // Clear previous content
      reviewContainer.innerHTML = '';
      
      // Add review items for each question
      currentQuiz.questions.forEach((question, index) => {
        if (!question) return; // Skip if question is null
        
        const userAnswer = currentQuiz.answers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        let reviewContent = `
          <div class="review-question-number">Question ${index + 1}</div>
          <div class="review-question">
            <h4>${question.text}</h4>
          `;
        
        if (question.mathExpression) {
          reviewContent += `<div class="review-math">\\[${question.mathExpression}\\]</div>`;
        }
        
        reviewContent += `
          </div>
          <div class="review-status ${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? 'Correct' : 'Incorrect'}
          </div>
          <div class="review-answers">
        `;
        
        if (userAnswer !== null) {
          const userAnswerText = question.options[userAnswer].text || `Option ${String.fromCharCode(65 + userAnswer)}`;
          reviewContent += `
            <span class="review-answer-label">Your Answer:</span>
            <div class="review-answer review-user-answer">
              ${userAnswerText}
            </div>
          `;
        }
        
        const correctAnswerText = question.options[question.correctAnswer].text || 
            `Option ${String.fromCharCode(65 + question.correctAnswer)}`;
        
        reviewContent += `
            <span class="review-answer-label">Correct Answer:</span>
            <div class="review-answer review-correct-answer">
              ${correctAnswerText}
            </div>
          </div>
        `;
        
        if (question.explanation) {
          reviewContent += `
            <div class="review-explanation">
              <h4>Explanation:</h4>
              <p>${question.explanation}</p>
            </div>
          `;
        }
        
        reviewItem.innerHTML = reviewContent;
        reviewContainer.appendChild(reviewItem);
      });
      
      // Render math expressions if needed
      if (window.MathJax) {
        MathJax.typesetPromise([reviewContainer]);
      }
      
      // Show review screen
      UI.showScreen('reviewScreen');
    },
    
    isQuizActive: function() {
      return currentQuiz.isActive;
    },
    
    saveCurrentState: function() {
      if (currentQuiz.isActive) {
        StorageManager.saveQuizState(currentQuiz);
      }
    },
    
    getCurrentTopic: function() {
      return currentQuiz.topic;
    },
    
    getCurrentDifficulty: function() {
      return currentQuiz.difficulty;
    }
  };
})();