// URL চেক করে সঠিক ট্যাব (User/Owner) অ্যাকটিভ করা
function initializeTab() {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab') || 'user';
    switchTab(tab);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTab();

    // =========================================
    // ✅ 100% WORKING LOGIN LOGIC
    // =========================================
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        // HTML এর ইনলাইন onsubmit কে ওভাররাইড করা হলো
        loginForm.onsubmit = function(event) {
            event.preventDefault(); 
            
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = document.getElementById('passwordInput');
            
            if (emailInput && passwordInput) {
                const inputEmail = emailInput.value;
                const inputPassword = passwordInput.value;
                
                // Sign Up পেজ থেকে সেভ হওয়া ডাটা চেক করা
                const savedEmail = localStorage.getItem('registeredUserEmail');
                const savedPassword = localStorage.getItem('registeredUserPassword');
                
                if (inputEmail === savedEmail && inputPassword === savedPassword) {
                    // ডাটা মিলে গেলে সোজা ড্যাশবোর্ডে!
                    window.location.href = '../Dashboard Page/index.html';
                } else {
                    alert('Invalid Credentials! Please check your email and password, or Sign Up first.');
                }
            }
        };
    }
});

// Tab Switching Logic
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
            signupLink.href = '../Sign Up Page/User_index.html';
        } else if (tabId === 'owner') {
            signupLink.href = '../Sign Up Page/Owner_index.html';
        }
    }
};

// Password Visibility Toggle Logic
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