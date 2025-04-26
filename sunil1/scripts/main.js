// Main.js - Application initialization and main logic

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the UI and application state
  UI.init();
  QuizManager.init();
  TopicManager.init();
  StorageManager.init();
  
  // Setup event listeners for main navigation buttons
  setupEventListeners();
  
  // Check if there's any saved state to restore
  checkForSavedState();
});

function setupEventListeners() {
  // Welcome screen
  document.getElementById('startQuizBtn').addEventListener('click', () => {
    UI.showScreen('topicScreen');
  });
  
  // Topic selection screen
  document.getElementById('backToWelcomeBtn').addEventListener('click', () => {
    UI.showScreen('welcomeScreen');
  });
  
  document.getElementById('startSelectedQuizBtn').addEventListener('click', () => {
    const selectedTopic = TopicManager.getSelectedTopic();
    const selectedDifficulty = TopicManager.getSelectedDifficulty();
    
    if (selectedTopic && selectedDifficulty) {
      QuizManager.startQuiz(selectedTopic, selectedDifficulty);
    } else {
      UI.showNotification('Please select a topic and difficulty level', 'error');
    }
  });
  
  // Quiz screen
  document.getElementById('showHintBtn').addEventListener('click', () => {
    QuizManager.showHint();
  });
  
  document.getElementById('nextQuestionBtn').addEventListener('click', () => {
    QuizManager.nextQuestion();
  });
  
  document.getElementById('quitQuizBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
      QuizManager.endQuiz(true);
    }
  });
  
  // Results screen
  document.getElementById('reviewQuestionsBtn').addEventListener('click', () => {
    QuizManager.reviewQuestions();
  });
  
  document.getElementById('retryQuizBtn').addEventListener('click', () => {
    QuizManager.retryQuiz();
  });
  
  document.getElementById('newQuizBtn').addEventListener('click', () => {
    UI.showScreen('topicScreen');
  });
  
  // History screen
  document.getElementById('historyBtn').addEventListener('click', () => {
    StorageManager.loadHistory();
    UI.showScreen('historyScreen');
  });
  
  document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      StorageManager.clearHistory();
      UI.showScreen('welcomeScreen');
    }
  });
  
  document.getElementById('backFromHistoryBtn').addEventListener('click', () => {
    UI.showScreen('welcomeScreen');
  });
  
  // Review screen
  document.getElementById('backToResultsBtn').addEventListener('click', () => {
    UI.showScreen('resultsScreen');
  });
}

function checkForSavedState() {
  // Check if there's an ongoing quiz
  const savedQuiz = StorageManager.getSavedQuiz();
  
  if (savedQuiz) {
    // Ask the user if they want to continue the saved quiz
    if (confirm('You have an unfinished quiz. Would you like to continue?')) {
      QuizManager.resumeQuiz(savedQuiz);
    } else {
      StorageManager.clearSavedQuiz();
    }
  }
}

// Handle window beforeunload event to save current quiz state
window.addEventListener('beforeunload', function(e) {
  if (QuizManager.isQuizActive()) {
    QuizManager.saveCurrentState();
    
    // Modern browsers will ignore this and show their own message
    const confirmationMessage = 'You have an unfinished quiz. Are you sure you want to leave?';
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  }
});