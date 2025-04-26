// Storage.js - Manages data storage for quiz history and state

const StorageManager = (function() {
  // Private variables
  const STORAGE_KEYS = {
    HISTORY: 'mathQuiz_history',
    CURRENT_QUIZ: 'mathQuiz_currentQuiz'
  };
  
  // Private methods
  function saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }
  
  function getFromLocalStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return null;
    }
  }
  
  function removeFromLocalStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
  
  // Public methods
  return {
    init: function() {
      // Check if localStorage is available
      if (!this.isStorageAvailable()) {
        UI.showNotification('Local storage is not available. Your progress and history will not be saved.', 'warning');
      }
    },
    
    isStorageAvailable: function() {
      try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    },
    
    saveQuizToHistory: function(quizData) {
      if (!this.isStorageAvailable()) return false;
      
      // Get existing history
      let history = this.getHistory();
      
      // If history doesn't exist, create an empty array
      if (!history) {
        history = [];
      }
      
      // Add current quiz to history
      history.push(quizData);
      
      // Save updated history
      return saveToLocalStorage(STORAGE_KEYS.HISTORY, history);
    },
    
    getHistory: function() {
      if (!this.isStorageAvailable()) return [];
      
      return getFromLocalStorage(STORAGE_KEYS.HISTORY) || [];
    },
    
    clearHistory: function() {
      if (!this.isStorageAvailable()) return false;
      
      return removeFromLocalStorage(STORAGE_KEYS.HISTORY);
    },
    
    saveQuizState: function(quizState) {
      if (!this.isStorageAvailable()) return false;
      
      return saveToLocalStorage(STORAGE_KEYS.CURRENT_QUIZ, quizState);
    },
    
    getSavedQuiz: function() {
      if (!this.isStorageAvailable()) return null;
      
      return getFromLocalStorage(STORAGE_KEYS.CURRENT_QUIZ);
    },
    
    clearSavedQuiz: function() {
      if (!this.isStorageAvailable()) return false;
      
      return removeFromLocalStorage(STORAGE_KEYS.CURRENT_QUIZ);
    },
    
    loadHistory: function() {
      if (!this.isStorageAvailable()) return;
      
      const history = this.getHistory();
      const historyContainer = document.getElementById('historyContainer');
      
      // Clear previous content
      historyContainer.innerHTML = '';
      
      if (history.length === 0) {
        historyContainer.innerHTML = '<div class="empty-state">No quiz history available</div>';
        return;
      }
      
      // Sort history by date (newest first)
      history.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Add history items
      history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const scoreClass = item.percentage >= 80 ? 'good' : (item.percentage >= 60 ? 'average' : 'poor');
        
        // Format the date
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        // Format the time (mm:ss)
        const minutes = Math.floor(item.time / 60);
        const seconds = item.time % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        historyItem.innerHTML = `
          <div class="history-info">
            <div class="history-topic">${QuestionsManager.getTopicName(item.topic)} - ${QuestionsManager.getDifficultyName(item.difficulty)}</div>
            <div class="history-details">
              <div class="history-detail-item">
                <span class="history-detail-label">Date:</span>
                <span class="history-detail-value">${formattedDate}</span>
              </div>
              <div class="history-detail-item">
                <span class="history-detail-label">Time:</span>
                <span class="history-detail-value">${formattedTime}</span>
              </div>
              <div class="history-detail-item">
                <span class="history-detail-label">Score:</span>
                <span class="history-detail-value">${item.score}/${item.totalQuestions}</span>
              </div>
            </div>
          </div>
          <div class="history-score ${scoreClass}">${item.percentage}%</div>
        `;
        
        historyContainer.appendChild(historyItem);
      });
    }
  };
})();