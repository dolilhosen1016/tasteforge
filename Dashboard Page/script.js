document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. DYNAMIC REGISTRATION/LOGIN INITIALIZATION
    // =========================================
    // LocalStorage থেকে নাম এবং ইমেইল নিয়ে আসা
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
    async function loadSavedBuildsDashboard() {
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
        if (!container) return;
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

    loadSavedBuildsDashboard();

    // =========================================
    // 3. DYNAMIC LOYALTY POINTS TRACKING
    // =========================================
    const orderListContainer = document.getElementById('orderListContainer');
    const orderViewAllBtn = document.getElementById('orderViewAllBtn');
    const totalOrdersCount = document.getElementById('totalOrdersCount');
    const loyaltyPointsDisplay = document.getElementById('loyaltyPointsDisplay');
    const pointsProgressFill = document.getElementById('pointsProgressFill');
    const nextRewardText = document.getElementById('nextRewardText');

    // ✅ শুধুমাত্র কনফার্ম হওয়া অর্ডারের হিস্ট্রি থেকে কাউন্ট হবে
    let orderHistory = JSON.parse(localStorage.getItem('tasteForgeOrders')) || [];
    
    let totalItemsCrafted = orderHistory.length; 
    let pointsPerMeal = 100; // প্রতি অর্ডারে ১০০ পয়েন্ট
    let currentPoints = totalItemsCrafted * pointsPerMeal;
    let rewardMilestoneTarget = 500; 

    if (totalOrdersCount) totalOrdersCount.textContent = totalItemsCrafted;
    if (loyaltyPointsDisplay) loyaltyPointsDisplay.textContent = currentPoints;

    let progressPercentage = (currentPoints / rewardMilestoneTarget) * 100;
    if (progressPercentage > 100) progressPercentage = 100;
    if (pointsProgressFill) pointsProgressFill.style.width = `${progressPercentage}%`;
    if (nextRewardText) nextRewardText.textContent = `Next Reward: ${rewardMilestoneTarget} pts`;

    if (orderListContainer) {
        if (orderHistory.length === 0) {
            orderListContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-receipt"></i>
                    <p>You haven't crafted any meals yet.</p>
                    <a href="../Menu Page/index.html" class="btn primary-btn" style="margin-top: 10px;">Craft Your First Meal</a>
                </div>
            `;
            if (orderViewAllBtn) orderViewAllBtn.style.display = 'none';
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
    }

    // =========================================
    // 4. ACTION DROPDOWNS (Man Icon & Notifications)
    // =========================================
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notiDot = document.getElementById('notiDot');

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
            if (notificationDropdown) notificationDropdown.classList.remove('active'); 
        });
    }

    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('active');
            if (profileDropdown) profileDropdown.classList.remove('active'); 
            
            if(notiDot) {
                notiDot.style.display = 'none';
            }
        });
    }

    document.addEventListener('click', () => {
        if (profileDropdown) profileDropdown.classList.remove('active');
        if (notificationDropdown) notificationDropdown.classList.remove('active');
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

    if (settingsModal) {
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

    // =========================================
    // 7. 💾 LOAD SAVED BUILDS LOGIC
    // =========================================
    const userSavedBuildsContainer = document.getElementById('savedBuildsContainer'); 

    function loadUserSavedBuilds() {
        if (!userSavedBuildsContainer) return;

        let savedBuilds = JSON.parse(localStorage.getItem('tasteForgeSavedBuilds')) || [];

        if (savedBuilds.length === 0) {
            userSavedBuildsContainer.innerHTML = `
                <p style="color: #8e8e93; font-size: 1rem; grid-column: 1 / -1;">You haven't saved any custom builds yet.</p>
            `;
            return;
        }

        userSavedBuildsContainer.innerHTML = ''; 

        savedBuilds.forEach((build, index) => {
            userSavedBuildsContainer.innerHTML += `
                <div class="dash-card" style="background: #1c1c1e; padding: 20px; border-radius: 16px; border: 1px solid #2a2a2a;">
                    <h3 style="color: #fff; margin-bottom: 5px;">${build.name}</h3>
                    <p style="color: #8e8e93; font-size: 0.85rem; margin-bottom: 15px;">Saved on: ${build.savedDate}</p>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="color: var(--accent-lime, #c8fb2e); font-weight: bold; font-size: 1.2rem;">$${build.totalPrice.toFixed(2)}</span>
                        <span style="color: #fff; font-size: 0.9rem;">${build.totalCalories} kcal</span>
                    </div>

                    <div style="display: flex; gap: 10px;">
                        <button onclick="orderSavedBuild(${index})" style="flex: 1; background: var(--accent-lime, #c8fb2e); color: #000; padding: 10px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Order Now</button>
                        <button onclick="deleteSavedBuild(${index})" style="background: rgba(255, 71, 87, 0.1); color: #ff4757; padding: 10px 15px; border: none; border-radius: 8px; cursor: pointer;"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
        });
    }

    // কার্টে অ্যাড করার ফাংশন
    window.orderSavedBuild = function(index) {
        let savedBuilds = JSON.parse(localStorage.getItem('tasteForgeSavedBuilds')) || [];
        let localCart = JSON.parse(localStorage.getItem('tasteForgeCartItems')) || [];
        
        localCart.push(savedBuilds[index]);
        localStorage.setItem('tasteForgeCartItems', JSON.stringify(localCart));
        
        alert("✨ Masterpiece added to your basket!");
    };

    // ডিলিট করার ফাংশন
    window.deleteSavedBuild = function(index) {
        if(confirm("Are you sure you want to delete this build?")) {
            let savedBuilds = JSON.parse(localStorage.getItem('tasteForgeSavedBuilds')) || [];
            savedBuilds.splice(index, 1);
            localStorage.setItem('tasteForgeSavedBuilds', JSON.stringify(savedBuilds));
            loadUserSavedBuilds(); 
        }
    };

    loadUserSavedBuilds();

    // =========================================
    // 8. LEFT SIDEBAR TAB LOGIC (DASHBOARD VS SAVED BUILDS)
    // =========================================
    
    // বাটনগুলো সিলেক্ট করা
    const tabSavedBtn = document.getElementById('sidebarSavedBtn');
    const tabDashBtn = document.querySelector('.sidebar-nav .nav-item:first-child'); 
    
    // সেকশনগুলো সিলেক্ট করা
    const sectionOverview = document.querySelector('.overview-cards');
    const sectionOrders = document.querySelector('.recent-orders-section');
    const sectionSavedBuilds = document.querySelector('.saved-builds-section'); 

    // ১. পেজ লোড হলে Saved Builds সেকশনটা লুকানো থাকবে
    if(sectionSavedBuilds) {
        sectionSavedBuilds.style.display = 'none';
    }

    // ২. Left Side "Saved Builds" বাটনে ক্লিক করলে:
    if (tabSavedBtn) {
        tabSavedBtn.onclick = function(e) {
            e.preventDefault();
            
            // ড্যাশবোর্ডের অন্য জিনিস হাইড করে শুধু Saved Builds দেখানো
            if(sectionOverview) sectionOverview.style.display = 'none';
            if(sectionOrders) sectionOrders.style.display = 'none';
            if(sectionSavedBuilds) sectionSavedBuilds.style.display = 'block';
            
            // এক্টিভ কালার চেঞ্জ করা
            if(tabDashBtn) tabDashBtn.classList.remove('active');
            tabSavedBtn.classList.add('active');
            
            // ডেটা লোড করা
            if (typeof loadUserSavedBuilds === "function") {
                loadUserSavedBuilds(); 
            }
        };
    }

    // ৩. Left Side "Dashboard" বাটনে ক্লিক করলে আবার আগের অবস্থায় ফেরা:
    if (tabDashBtn) {
        tabDashBtn.onclick = function(e) {
            e.preventDefault();
            
            // ✅ FIXED: 'flex' এবং 'block' এর জায়গায় '' (ফাঁকা) দিলে তোমার style.css এর অরিজিনাল গ্রিড ডিজাইনটা কাজ করবে!
            if(sectionOverview) sectionOverview.style.display = ''; 
            if(sectionOrders) sectionOrders.style.display = '';
            if(sectionSavedBuilds) sectionSavedBuilds.style.display = 'none';
            
            // এক্টিভ কালার চেঞ্জ করা
            tabSavedBtn.classList.remove('active');
            tabDashBtn.classList.add('active');
        };
    }
});