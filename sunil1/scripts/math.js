// Math.js - Handles math-specific functionality and rendering

const MathHelper = (function() {
  // Private variables
  const mathJaxConfig = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']]
    },
    svg: {
      fontCache: 'global'
    }
  };
  
  // Private methods
  function setupMathJax() {
    // Check if MathJax is loaded
    if (window.MathJax) {
      console.log('MathJax already loaded');
      return;
    }
    
    // If not, add a script tag to load MathJax
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    
    document.head.appendChild(script);
    
    // Add a window.MathJax configuration
    window.MathJax = mathJaxConfig;
  }
  
  // Public methods
  return {
    init: function() {
      setupMathJax();
    },
    
    renderMath: function(element) {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([element]).catch(err => {
          console.error('Error rendering math:', err);
        });
      } else {
        console.warn('MathJax not loaded or typesetPromise not available');
      }
    },
    
    renderAllMath: function() {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch(err => {
          console.error('Error rendering all math:', err);
        });
      } else {
        console.warn('MathJax not loaded or typesetPromise not available');
      }
    },
    
    formatMathExpression: function(expression) {
      // Remove extra whitespace and format expression
      return expression.trim().replace(/\s+/g, ' ');
    }
  };
})();

// Initialize MathHelper when document is loaded
document.addEventListener('DOMContentLoaded', function() {
  MathHelper.init();
});