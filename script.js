document.addEventListener('DOMContentLoaded', () => {
   // Select elements
    const startBtn = document.getElementById('startBtn');
    const loginBtn = document.getElementById('loginBtn');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Add interactivity to the Primary Button
    startBtn.addEventListener('click', () => {
        console.log('Guest building process initiated...');
        // In a real app, this would route to the builder page
    });

    // Add interactivity to the Secondary Button
    loginBtn.addEventListener('click', () => {
        console.log('Opening authentication modal...');
        // Trigger modal or redirect to login page
    });

    // Handle Active State for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior for the demo
            
            // Remove active class from all links
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to the clicked link
            this.classList.add('active');
        });
    });
});
