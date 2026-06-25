document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. DYNAMIC REGISTRATION/LOGIN INITIALIZATION
    // =========================================
    // LocalStorage থেকে নাম এবং ইমেইল নিয়ে আসা
    const storedName = localStorage.getItem('registeredUserName') || 'Dolil Hosen'; 
    const storedEmail = localStorage.getItem('registeredUserEmail') || 'guest@tasteforge.com'; 

    // নাম আপডেট করা (Header, Dropdown, Settings)
    document.getElementById('userNameDisplay').textContent = storedName.split(' ')[0];
    document.getElementById('dropdownName').textContent = storedName;
    
    const settingsNameInput = document.getElementById('settingsInputName');
    if(settingsNameInput) settingsNameInput.value = storedName;

    // ✅ FIXED: ইমেইল আপডেট করা (Dropdown & Settings)
    const dropdownEmail = document.getElementById('dropdownEmail');
    if(dropdownEmail) dropdownEmail.textContent = storedEmail;

    const settingsEmailInput = document.querySelector('.setting-group input[type="email"]');
    if(settingsEmailInput) settingsEmailInput.value = storedEmail;

    // Time-based Greeting
    const currentHour = new Date().getHours();
    let timeGreeting = 'Good Evening';
    if (currentHour < 12) timeGreeting = 'Good Morning';
    else if (currentHour < 18) timeGreeting = 'Good Afternoon';
    
    document.getElementById('greetingMsg').innerHTML = `${timeGreeting}, <span id="userNameDisplay" style="color: white;">${storedName.split(' ')[0]}</span> <span class="wave">👋</span>`;

    // =========================================
    // 2. FETCH JSON DATA FOR SAVED BUILDS
    // =========================================
    async function loadSavedBuilds() {
        const buildsContainer = document.getElementById('savedBuildsContainer');
        
        try {
            const response = await fetch('../Menu Page/data.json'); 
            if (!response.ok) throw new Error('JSON load failed');
            
            const menuData = await response.json();
            const selectedBuilds = menuData.filter(item => [2, 5, 9].includes(item.id));
            renderBuilds(selectedBuilds, buildsContainer);
            
        } catch (error) {
            console.log("Using fallback data for presentation mode...", error);
            const fallbackData = [
                { "id": 2, "name": "Midnight Craving Pizza", "category": "Cheat Day", "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80" },
                { "id": 5, "name": "Gym Fuel Platter", "category": "High Protein", "imageUrl": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=300&q=80" },
                { "id": 9, "name": "Double Smash Cheeseburger", "category": "Cheat Day", "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80" }
            ];
            renderBuilds(fallbackData, buildsContainer);
        }
    }

    function renderBuilds(builds, container) {
        container.innerHTML = ''; 
        builds.forEach(build => {
            const cardHTML = `
                <div class="build-card" onclick="window.location.href='../Menu Page/index.html'">
                    <img src="${build.imageUrl}" alt="${build.name}" class="build-img">
                    <button class="fav-btn"><i class="fa-solid fa-heart"></i></button>
                    <div class="build-info">
                        <h4>${build.name}</h4>
                        <p>${build.category}</p>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    loadSavedBuilds();

    // =========================================
    // 3. DYNAMIC LOYALTY POINTS & ORDER TRACKING
    // =========================================
    const orderListContainer = document.getElementById('orderListContainer');
    const orderViewAllBtn = document.getElementById('orderViewAllBtn');
    const totalOrdersCount = document.getElementById('totalOrdersCount');
    const loyaltyPointsDisplay = document.getElementById('loyaltyPointsDisplay');
    const pointsProgressFill = document.getElementById('pointsProgressFill');
    const nextRewardText = document.getElementById('nextRewardText');

    let orderHistory = JSON.parse(localStorage.getItem('tasteForgeOrders')) || [];

    let pointsPerMeal = 100; 
    let currentPoints = orderHistory.length * pointsPerMeal;
    let rewardMilestoneTarget = 500; 

    totalOrdersCount.textContent = orderHistory.length;
    loyaltyPointsDisplay.textContent = currentPoints;

    let progressPercentage = (currentPoints / rewardMilestoneTarget) * 100;
    if (progressPercentage > 100) progressPercentage = 100;
    pointsProgressFill.style.width = `${progressPercentage}%`;
    nextRewardText.textContent = `Next Reward: ${rewardMilestoneTarget} pts`;

    if (orderHistory.length === 0) {
        orderListContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-receipt"></i>
                <p>You haven't crafted any meals yet.</p>
                <a href="../Menu Page/index.html" class="btn primary-btn" style="margin-top: 10px;">Craft Your First Meal</a>
            </div>
        `;
        orderViewAllBtn.style.display = 'none';
    } else {
        let htmlContent = '';
        const recentOrders = orderHistory.slice().reverse().slice(0, 3); 
        
        recentOrders.forEach(order => {
            htmlContent += `
                <div class="order-row dash-card">
                    <div class="order-id">${order.id || '#TFP' + Math.floor(1000 + Math.random() * 9000)}</div>
                    <div class="order-date">${order.date || 'Today'}</div>
                    <div class="order-amount">$${parseFloat(order.amount).toFixed(2)}</div>
                    <div class="order-status"><span class="badge delivered">Completed</span></div>
                </div>
            `;
        });
        orderListContainer.innerHTML = htmlContent;
    }

    // =========================================
    // 4. ACTION DROPDOWNS (Man Icon & Notifications)
    // =========================================
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notiDot = document.getElementById('notiDot');

    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
        notificationDropdown.classList.remove('active'); 
    });

    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle('active');
        profileDropdown.classList.remove('active'); 
        
        if(notiDot) {
            notiDot.style.display = 'none';
        }
    });

    document.addEventListener('click', () => {
        profileDropdown.classList.remove('active');
        notificationDropdown.classList.remove('active');
    });

    // =========================================
    // 5. SETTINGS POP-UP MODAL CONTROLS
    // =========================================
    const sidebarSettingsBtn = document.getElementById('sidebarSettingsBtn');
    const profileSettingsBtn = document.getElementById('profileSettingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    const openSettingsModal = (e) => {
        e.preventDefault();
        e.stopPropagation();
        settingsModal.classList.add('active');
    };
    
    const closeSettingsModal = () => settingsModal.classList.remove('active');

    if(sidebarSettingsBtn) sidebarSettingsBtn.addEventListener('click', openSettingsModal);
    if(profileSettingsBtn) profileSettingsBtn.addEventListener('click', openSettingsModal);
    if(closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettingsModal);
    if(cancelSettingsBtn) cancelSettingsBtn.addEventListener('click', closeSettingsModal);
    
    if(saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            alert('Changes saved successfully!');
            closeSettingsModal();
        });
    }

    // =========================================
    // 6. REWARDS POP-UP MODAL CONTROLS
    // =========================================
    const sidebarRewardsBtn = document.getElementById('sidebarRewardsBtn');
    const rewardsModal = document.getElementById('rewardsModal');
    const closeRewardsBtn = document.getElementById('closeRewardsBtn');
    const modalRewardsPoints = document.getElementById('modalRewardsPoints');
    const rewardClaimButtons = document.querySelectorAll('.btn-claim-reward');

    if (sidebarRewardsBtn && rewardsModal) {
        sidebarRewardsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (modalRewardsPoints) {
                modalRewardsPoints.textContent = `${currentPoints} PTS`;
            }

            rewardClaimButtons.forEach(btn => {
                const cost = parseInt(btn.getAttribute('data-cost'));
                
                if (currentPoints >= cost) {
                    btn.classList.remove('locked');
                    btn.classList.add('unlocked');
                    btn.textContent = 'Claim';
                    btn.disabled = false;
                } else {
                    btn.classList.remove('unlocked');
                    btn.classList.add('locked');
                    btn.textContent = 'Locked';
                    btn.disabled = true;
                }
            });

            rewardsModal.classList.add('active');
        });

        if (closeRewardsBtn) {
            closeRewardsBtn.addEventListener('click', () => {
                rewardsModal.classList.remove('active');
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === rewardsModal) {
                rewardsModal.classList.remove('active');
            }
        });
    }

    rewardClaimButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (this.classList.contains('unlocked')) {
                alert('Success! Reward voucher unlocked. Coupon code added to your active notification dashboard tray.');
                
                this.classList.remove('unlocked');
                this.classList.add('claimed');
                this.textContent = 'Claimed';
                this.disabled = true;
            }
        });
    });

});