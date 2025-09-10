// Responsive behavior for hamburger menu

document.addEventListener('DOMContentLoaded', function() {
  // Get the hamburger menu toggle button
  const hamburgerToggle = document.querySelector('.navbar-toggler');
  const hamburgerIcon = document.querySelector('.hamburger');
  
  if (hamburgerToggle && hamburgerIcon) {
    hamburgerToggle.addEventListener('click', function() {
      hamburgerIcon.classList.toggle('open');
    });
  }
  
  // Close the mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const navbarCollapse = document.querySelector('.navbar-collapse.show');
    // Make sure both elements exist before checking contains
    if (navbarCollapse && hamburgerToggle && 
        !navbarCollapse.contains(event.target) && 
        !hamburgerToggle.contains(event.target)) {
      hamburgerToggle.click();
    }
  });
  
  // Handle mobile tap areas for buttons
  const enhanceTapTargets = () => {
    if (window.innerWidth < 768) {
      document.querySelectorAll('.btn').forEach(btn => {
        if (btn.offsetHeight < 44) {
          btn.style.minHeight = '44px';
        }
      });
    }
  };
  
  // Run on load and resize
  enhanceTapTargets();
  window.addEventListener('resize', enhanceTapTargets);
});