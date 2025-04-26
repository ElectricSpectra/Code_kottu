// UI.js - Manages user interface interactions and transitions

const UI = (function() {
  // Private variables
  let currentScreen = 'welcomeScreen';
  let notificationTimeout = null;
  
  // Private methods
  function setupScreenTransitions() {
    // Hide all screens initially except welcome screen
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
      if (screen.id !== 'welcomeScreen') {
        screen.classList.remove('active');
      }
    });
  }
  
  // Public methods
  return {
    init: function() {
      setupScreenTransitions();
    },
    
    showScreen: function(screenId) {
      const previousScreen = document.getElementById(currentScreen);
      const nextScreen = document.getElementById(screenId);
      
      if (!nextScreen) {
        console.error(`Screen with ID "${screenId}" not found.`);
        return;
      }
      
      // Remove active class from current screen
      previousScreen.classList.remove('active');
      previousScreen.classList.add('exiting');
      
      // Wait for exit animation to complete
      setTimeout(() => {
        previousScreen.classList.remove('exiting');
        
        // Add active class to new screen
        nextScreen.classList.add('entering');
        nextScreen.classList.add('active');
        
        // Wait for enter animation to complete
        setTimeout(() => {
          nextScreen.classList.remove('entering');
        }, 300);
        
        // Update current screen
        currentScreen = screenId;
      }, 300);
    },
    
    showNotification: function(message, type = 'info') {
      // Create notification element if it doesn't exist
      let notification = document.querySelector('.notification');
      
      if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
      }
      
      // Clear previous timeout
      if (notificationTimeout) {
        clearTimeout(notificationTimeout);
      }
      
      // Set notification content and type
      notification.textContent = message;
      notification.className = `notification ${type}`;
      
      // Show notification
      notification.classList.add('active');
      
      // Hide notification after 3 seconds
      notificationTimeout = setTimeout(() => {
        notification.classList.remove('active');
      }, 3000);
    },
    
    getCurrentScreen: function() {
      return currentScreen;
    },
    
    updateTitle: function(title) {
      document.title = title ? title : 'MathMind Quiz';
    },
    
    createMathElement: function(expression, isDisplay = false) {
      const element = document.createElement('div');
      element.className = 'math-element';
      
      if (isDisplay) {
        element.innerHTML = `\\[${expression}\\]`;
      } else {
        element.innerHTML = `\\(${expression}\\)`;
      }
      
      // Render math with MathJax
      if (window.MathJax) {
        MathJax.typesetPromise([element]);
      }
      
      return element;
    }
  };
})();