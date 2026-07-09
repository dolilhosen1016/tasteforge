// =========================================
// ✅ INITIALIZE URL TAB
// =========================================
function initializeTab() {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab') || 'user';
    switchTab(tab);
}

// =========================================
// ✅ TAB SWITCHING LOGIC
// =========================================
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const tabElement = document.getElementById('tab-' + tabId);
    if(tabElement) {
        tabElement.classList.add('active');
    }
    
    const signupLink = document.getElementById('signupLink');
    if (signupLink) {
        if (tabId === 'user') {
                signupLink.href = '../sign_up_page/User_index.html';
        } else if (tabId === 'owner') {
                signupLink.href = '../sign_up_page/Owner_index.html';
        }
    }
};

// =========================================
// ✅ PASSWORD VISIBILITY TOGGLE
// =========================================
window.togglePassword = function() {
    const passwordInput = document.getElementById('passwordInput');
    const eyeIcon = document.getElementById('eye-icon');
    
    if (passwordInput && eyeIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            passwordInput.type = 'password';
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    }
};

// =========================================
// ✅ SECURE LOGIN & ROUTING LOGIC
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeTab();

    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.onsubmit = function(event) {
            event.preventDefault(); 
            
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = document.getElementById('passwordInput');
            
            if (emailInput && passwordInput) {
                const inputEmail = emailInput.value.trim();
                const inputPassword = passwordInput.value.trim();
                
                // Fetch Owner Data
                const savedOwnerEmail = localStorage.getItem('tasteForgeOwnerEmail');
                const savedOwnerPassword = localStorage.getItem('tasteForgeOwnerPassword');
                
                // Fetch User Data
                const savedUserEmail = localStorage.getItem('tasteForgeUserEmail');
                const savedUserPassword = localStorage.getItem('tasteForgeUserPassword');
                
                // 🔥 ADMIN VS USER ROUTING LOGIC 🔥
                if (inputEmail === savedOwnerEmail && inputPassword === savedOwnerPassword) {
                        window.location.href = '../owner_dashboard_page/index.html';
                } 
                else if (inputEmail === savedUserEmail && inputPassword === savedUserPassword) {
                        window.location.href = '../dashboard_page/index.html';
                } 
                else {
                    alert('Invalid Credentials! Please check your email and password, or Sign Up first.');
                }
            }
        };
    }
});