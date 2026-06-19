const grid = document.getElementById('menuGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

let allMeals = [];
let cart = [];

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        allMeals = await response.json();
        renderCards(allMeals);
    } catch (error) {
        console.error("Error loading JSON data:", error);
        if (grid) {
            grid.innerHTML = '<p style="color: #ff4757; text-align: center; width: 100%; font-weight: bold;">Error loading data. Make sure you are using a local server (like Live Server).</p>';
        }
    }
}

// Render Cards Function
function renderCards(meals) {
    if (!grid) return;
    grid.innerHTML = ''; 
    meals.forEach(meal => {
        const cardHTML = `
            <div class="card" style="cursor: pointer;" onclick="openMealModal(${meal.id})">
                <img src="${meal.imageUrl}" alt="${meal.name}" class="card-img" loading="lazy">
                
                <button class="heart-btn" onclick="event.stopPropagation();">🤍</button>
                
                <h3 class="card-title">${meal.name}</h3>
                <p class="card-desc">${meal.description}</p>
                <div class="card-meta">
                    <span>${meal.calories} Cal</span>
                    <span class="price">$${meal.price.toFixed(2)}</span>
                </div>
                
                <button class="add-btn" onclick="event.stopPropagation(); addToCart(${meal.id}, event)">Add to Cart</button>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });
}

// Category Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const category = e.target.getAttribute('data-category');
        if (category === 'All') {
            renderCards(allMeals);
        } else {
            const filteredMeals = allMeals.filter(meal => meal.category === category);
            renderCards(filteredMeals);
        }
    });
});

// Live Search
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const searchedMeals = allMeals.filter(meal => 
            meal.name.toLowerCase().includes(searchTerm) || 
            meal.description.toLowerCase().includes(searchTerm)
        );
        renderCards(searchedMeals);
    });
}

// --- CART FUNCTIONALITY ---
const cartModal = document.getElementById('cartModal');
const topCartBtn = document.getElementById('topCartBtn');
const closeModalBtn = document.getElementById('closeCartModal'); // FIXED HERE
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalEl = document.getElementById('cartTotal');

// Add Item to Cart
window.addToCart = function(id, event) {
    const meal = allMeals.find(m => m.id === id);
    if (meal) {
        cart.push(meal);
        
        // Button animation
        const btn = event.target;
        btn.innerText = "Added!";
        btn.style.backgroundColor = "#fff";
        setTimeout(() => {
            btn.innerText = "Add to Cart";
            btn.style.backgroundColor = "var(--accent-lime)";
        }, 1000);
    }
};

// Open Popup
if (topCartBtn) {
    topCartBtn.addEventListener('click', () => {
        updateCartUI();
        cartModal.classList.add('show');
    });
}

// Close Popup
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        cartModal.classList.remove('show');
    });
}

// Update Cart UI
function updateCartUI() {
    if (!cartItemsContainer || !cartTotalEl) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        cartTotalEl.innerText = '0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <div>
                    <span>$${item.price.toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${index})">X</button>
                </div>
            </div>
        `;
    });

    cartTotalEl.innerText = total.toFixed(2);
}

// Remove Item from Cart
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

// --- MEAL DETAILS POPUP FUNCTIONALITY ---
const mealModal = document.getElementById('mealModal');
const closeMealModal = document.getElementById('closeMealModal');
const mealModalBody = document.getElementById('mealModalBody');

window.openMealModal = function(id) {
    const meal = allMeals.find(m => m.id === id);
    if(meal && mealModalBody) {
        mealModalBody.innerHTML = `
            <img src="${meal.imageUrl}" alt="${meal.name}" class="meal-modal-img">
            <span class="meal-modal-category">${meal.category}</span>
            <h2 class="meal-modal-title">${meal.name}</h2>
            <p class="meal-modal-desc">${meal.description}<br><br>🔥 <strong>${meal.calories} Calories</strong></p>
            <div class="meal-modal-price">$${meal.price.toFixed(2)}</div>
            <button class="add-btn" onclick="addToCart(${meal.id}, event); setTimeout(() => mealModal.classList.remove('show'), 600);">Add to Cart</button>
        `;
        mealModal.classList.add('show');
    }
};

if (closeMealModal) {
    closeMealModal.addEventListener('click', () => {
        mealModal.classList.remove('show');
    });
}

// Close Modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('show');
    }
    if (e.target === mealModal) {
        mealModal.classList.remove('show');
    }
});

// Initialize by fetching JSON
document.addEventListener('DOMContentLoaded', loadData);