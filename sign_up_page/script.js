// =========================================
// ✅ TAB SWITCHING LOGIC
// =========================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const selectedTab = document.getElementById('tab-' + tabId);
    if(selectedTab) {
        selectedTab.classList.add('active');
    }
}

// =========================================
// ✅ PASSWORD VISIBILITY TOGGLE
// =========================================
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

// =========================================
// ✅ SIGN UP LOGIC (100% Bug Free Version)
// =========================================
window.handleSignup = function(event) {
    event.preventDefault(); 
    
    const form = event.target;
    
    // 🔥 FIXED: একদম স্পেসিফিক placeholder দিয়ে ডাটা ধরা হয়েছে
    const nameInput = form.querySelector('input[placeholder="Full Name"]');
    const emailInput = form.querySelector('input[placeholder="Email Address"]');
    const passwordInput = form.querySelector('input[placeholder="Password"]');
    
    const secretKeyInput = form.querySelector('input[placeholder="Secret Access Key"]');
    
    // 1. OWNER SIGNUP FLOW 
    if (secretKeyInput) {
        if (secretKeyInput.value !== "TF_OWNER_61016") {
            alert("❌ Unauthorized Access! Invalid Secret Access Key.");
            return;
        }
        if (nameInput && emailInput && passwordInput) {
            localStorage.setItem('tasteForgeOwnerName', nameInput.value.trim());
            localStorage.setItem('tasteForgeOwnerEmail', emailInput.value.trim());
            localStorage.setItem('tasteForgeOwnerPassword', passwordInput.value.trim());
            
            alert("Owner Registration Successful! Please sign in to continue.");
            window.location.href = '../sign_in_page/Signin_index.html'; 
        }
    } 
    // 2. USER SIGNUP FLOW 
    else {
        if (nameInput && emailInput && passwordInput) {
            localStorage.setItem('tasteForgeUserName', nameInput.value.trim());
            localStorage.setItem('tasteForgeUserEmail', emailInput.value.trim());
            localStorage.setItem('tasteForgeUserPassword', passwordInput.value.trim());
            
            alert("User Registration Successful! Please sign in to continue.");
            window.location.href = '../sign_in_page/sign_in_index.html'; 
        }
    }
};