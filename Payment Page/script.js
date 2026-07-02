document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. INITIALIZE PAYMENT DATA
    // =========================================
    let localCart = JSON.parse(localStorage.getItem('tasteForgeCartItems')) || [];
    const checkoutTotalEl = document.getElementById('checkoutTotal');
    let totalAmount = 0;

    // কার্ট থেকে টোটাল হিসাব করা
    if (localCart.length > 0) {
        localCart.forEach(item => {
            totalAmount += parseFloat(item.price || item.totalPrice || 0);
        });
    }
    if (checkoutTotalEl) {
        checkoutTotalEl.innerText = totalAmount.toFixed(2);
    }

    // =========================================
    // 2. TOAST NOTIFICATION LOGIC
    // =========================================
    const toast = document.getElementById('toastMessage');
    
    // HTML থেকে onclick="showToast()" কল হবে
    window.showToast = function() {
        if (!toast) return;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // =========================================
    // 3. CONFIRM ORDER LOGIC
    // =========================================
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    const paymentSection = document.getElementById('paymentSection');
    const confirmationSection = document.getElementById('confirmationSection');
    
    // Receipt Display Elements
    const displayOrderId = document.getElementById('displayOrderId');
    const displayQueue = document.getElementById('displayQueue');

    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', () => {
            if (localCart.length === 0) {
                alert("Your cart is empty! Please add items before checkout.");
                window.location.href = '../Menu Page/index.html';
                return;
            }

            confirmPaymentBtn.innerText = "Processing...";
            
            setTimeout(() => {
                // ১. জেনারেট Order ID এবং Queue Number
                const newOrderId = '#TFP' + Math.floor(1000 + Math.random() * 9000);
                const queueNumber = Math.floor(1 + Math.random() * 50); // 1 to 50 সিরিয়াল

                // ২. ড্যাশবোর্ডের জন্য অর্ডার হিস্ট্রিতে সেভ করা
                let orderHistory = JSON.parse(localStorage.getItem('tasteForgeOrders')) || [];
                localCart.forEach(item => {
                    orderHistory.push({
                        id: newOrderId,
                        date: new Date().toLocaleDateString(),
                        amount: item.price,
                        name: item.name,
                        status: 'Pending' // ওনারের ড্যাশবোর্ডের জন্য কাজে লাগবে
                    });
                });
                localStorage.setItem('tasteForgeOrders', JSON.stringify(orderHistory));

                // ৩. UI তে ডেটা বসানো
                if(displayOrderId) displayOrderId.innerText = newOrderId;
                if(displayQueue) displayQueue.innerText = queueNumber;

                // ৪. কার্ট ক্লিয়ার করা
                localStorage.removeItem('tasteForgeCartItems');

                // ৫. পেমেন্ট পেজ হাইড করে কনফার্মেশন পেজ দেখানো
                if(paymentSection) paymentSection.style.display = 'none';
                if(confirmationSection) confirmationSection.style.display = 'block';

            }, 1200); // একটু রিয়েলিস্টিক ডিলে
        });
    }

    // =========================================
    // 4. DOWNLOAD RECEIPT (PRINT LOGIC)
    // =========================================
    const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
    
    if (downloadReceiptBtn) {
        downloadReceiptBtn.addEventListener('click', () => {
            // ব্রাউজারের ডিফল্ট প্রিন্ট পপ-আপ ওপেন করবে (PDF সেভ করা যায়)
            window.print(); 
        });
    }

});