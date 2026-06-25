// Tab Switching Logic (Sign In Page)
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const selectedTab = document.getElementById('tab-' + tabId);
    if(selectedTab) {
        selectedTab.classList.add('active');
    }
}

// Password Visibility Toggle Logic
function togglePassword() {
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
}

// Signup Form Handler (Dashboard এর সাথে কানেক্ট করার লজিক)
function handleSignup(event) {
    event.preventDefault(); // পেজ রিলোড হওয়া বন্ধ করবে
    
    const form = event.target;
    
    // HTML-এ ID না থাকায় placeholder দিয়ে ইনপুট ডাটাগুলো ধরা হয়েছে
    const nameInput = form.querySelector('input[placeholder="Full Name"]');
    const emailInput = form.querySelector('input[placeholder="Email Address"]');
    const passwordInput = form.querySelector('input[placeholder="Password"]');
    
    if (nameInput && emailInput && passwordInput) {
        
        // ড্যাশবোর্ডে নাম দেখানো এবং লগ-ইন ভেরিফিকেশনের জন্য LocalStorage-এ ডাটা সেভ করা হচ্ছে
        localStorage.setItem('registeredUserName', nameInput.value);
        localStorage.setItem('registeredUserEmail', emailInput.value);
        localStorage.setItem('registeredUserPassword', passwordInput.value);
        
        alert("Registration Successful! Please sign in to continue.");
        
        // সাকসেসফুল রেজিস্ট্রেশনের পর সরাসরি Sign In পেজে নিয়ে যাবে
        window.location.href = '../Sign In Page/Signin_index.html'; 
        
    } else {
        alert("Sign Up Form Submitted Successfully!");
    }
}

// =========================================
// ✅ SIGN UP LOGIC (User & Owner)
// =========================================

// HTML এর onsubmit থেকে সরাসরি কল হওয়ার জন্য ফাংশনটিকে গ্লোবাল করা হলো
window.handleSignup = function(event) {
    event.preventDefault(); // পেজ রিলোড বন্ধ করবে
    
    const form = event.target;
    
    // Placeholder দিয়ে ডাটা রিসিভ করা
    const nameInput = form.querySelector('input[placeholder="Full Name"]');
    const emailInput = form.querySelector('input[placeholder="Email Address"]');
    const passwordInput = form.querySelector('input[placeholder="Password"]');
    
    if (nameInput && emailInput && passwordInput) {
        
        // LocalStorage এ ডাটা সেভ করা হচ্ছে
        localStorage.setItem('registeredUserName', nameInput.value);
        localStorage.setItem('registeredUserEmail', emailInput.value);
        localStorage.setItem('registeredUserPassword', passwordInput.value);
        
        alert("Registration Successful! Please sign in to continue.");
        
        // সেভ হওয়ার পর Sign In পেজে পাঠিয়ে দেবে
        window.location.href = '../Sign In Page/Signin_index.html'; 
        
    } else {
        alert("Sign Up Form Submitted Successfully!");
    }
};