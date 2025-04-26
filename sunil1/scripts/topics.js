// Topics.js - Manages topic selection and difficulty

const TopicManager = (function() {
  // Private variables
  let selectedTopic = null;
  let selectedDifficulty = 'easy'; // Default difficulty
  
  // Private methods
  function setupTopicCards() {
    const topicCards = document.querySelectorAll('.topic-card');
    
    topicCards.forEach(card => {
      card.addEventListener('click', function() {
        // Remove selected class from all cards
        topicCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected class to clicked card
        this.classList.add('selected');
        
        // Update selected topic
        selectedTopic = this.dataset.topic;
      });
    });
  }
  
  function setupDifficultyButtons() {
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    
    difficultyButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        difficultyButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Update selected difficulty
        selectedDifficulty = this.dataset.difficulty;
      });
    });
  }
  
  // Public methods
  return {
    init: function() {
      setupTopicCards();
      setupDifficultyButtons();
    },
    
    getSelectedTopic: function() {
      return selectedTopic;
    },
    
    getSelectedDifficulty: function() {
      return selectedDifficulty;
    },
    
    setSelectedTopic: function(topic) {
      selectedTopic = topic;
      
      // Update UI
      const topicCards = document.querySelectorAll('.topic-card');
      topicCards.forEach(card => {
        if (card.dataset.topic === topic) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }
      });
    },
    
    setSelectedDifficulty: function(difficulty) {
      selectedDifficulty = difficulty;
      
      // Update UI
      const difficultyButtons = document.querySelectorAll('.difficulty-btn');
      difficultyButtons.forEach(button => {
        if (button.dataset.difficulty === difficulty) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    },
    
    getAllTopics: function() {
      return QuestionsManager.getTopics();
    },
    
    getAllDifficulties: function() {
      return QuestionsManager.getDifficulties();
    },
    
    getTopicName: function(topic) {
      return QuestionsManager.getTopicName(topic);
    },
    
    getDifficultyName: function(difficulty) {
      return QuestionsManager.getDifficultyName(difficulty);
    }
  };
})();