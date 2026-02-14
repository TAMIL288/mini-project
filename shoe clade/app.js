// Product Database
const products = [
    {
        id: 1,
        name: "Air Max 2024",
        brand: "nike",
        category: "sneakers",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        rating: 4.5,
        description: "Premium running shoes with advanced cushioning technology",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 2,
        name: "Ultraboost DNA",
        brand: "adidas",
        category: "sports",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
        rating: 4.8,
        description: "Energy-returning running shoes for ultimate performance",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 3,
        name: "Classic Leather",
        brand: "reebok",
        category: "casual",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
        rating: 4.3,
        description: "Timeless casual sneakers for everyday wear",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 4,
        name: "Suede Classic",
        brand: "puma",
        category: "casual",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=500",
        rating: 4.6,
        description: "Iconic suede sneakers with vintage appeal",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 5,
        name: "990v5",
        brand: "newbalance",
        category: "sports",
        price: 174.99,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
        rating: 4.7,
        description: "Premium comfort and stability for serious runners",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 6,
        name: "Oxford Classic",
        brand: "nike",
        category: "formal",
        price: 119.99,
        image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500",
        rating: 4.4,
        description: "Elegant oxford shoes for formal occasions",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 7,
        name: "Derby Luxe",
        brand: "adidas",
        category: "formal",
        price: 139.99,
        image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500",
        rating: 4.5,
        description: "Premium leather derby shoes for professionals",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 8,
        name: "Trail Runner Pro",
        brand: "nike",
        category: "sports",
        price: 159.99,
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500",
        rating: 4.6,
        description: "Rugged trail running shoes for outdoor adventures",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 9,
        name: "Chelsea Boot",
        brand: "puma",
        category: "boots",
        price: 169.99,
        image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500",
        rating: 4.7,
        description: "Stylish leather chelsea boots for all seasons",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 10,
        name: "Canvas Slip-On",
        brand: "reebok",
        category: "casual",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500",
        rating: 4.2,
        description: "Comfortable canvas slip-ons for relaxed style",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 11,
        name: "Basketball Pro",
        brand: "nike",
        category: "sports",
        price: 134.99,
        image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=500",
        rating: 4.8,
        description: "High-performance basketball shoes with ankle support",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 12,
        name: "Hiking Explorer",
        brand: "newbalance",
        category: "boots",
        price: 189.99,
        image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500",
        rating: 4.9,
        description: "Waterproof hiking boots for serious adventurers",
        sizes: [7, 8, 9, 10, 11, 12]
    }
];

// Application State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredProducts = [...products];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const productModal = document.getElementById('productModal');
const loginModal = document.getElementById('loginModal');
const closeCart = document.getElementById('closeCart');
const closeProduct = document.getElementById('closeProduct');
const closeLogin = document.getElementById('closeLogin');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const brandFilter = document.getElementById('brandFilter');
const priceFilter = document.getElementById('priceFilter');
const sortFilter = document.getElementById('sortFilter');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const userBtn = document.getElementById('userBtn');
const toast = document.getElementById('toast');
const contactForm = document.getElementById('contactForm');
const loginForm = document.getElementById('loginForm');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    attachEventListeners();
});

// Render Products
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '';
        document.getElementById('noResults').style.display = 'block';
        return;
    }
    
    document.getElementById('noResults').style.display = 'none';
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-brand">${product.brand.toUpperCase()}</div>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.rating})</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate Star Rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Show Product Detail
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const detailContent = document.getElementById('productDetailContent');
    detailContent.innerHTML = `
        <div class="product-detail-grid">
            <div>
                <img src="${product.image}" alt="${product.name}" class="product-detail-image">
            </div>
            <div class="product-detail-info">
                <div class="product-category">${product.category}</div>
                <h2>${product.name}</h2>
                <div class="product-brand">${product.brand.toUpperCase()}</div>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.rating})</span>
                </div>
                <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                <p>${product.description}</p>
                
                <div class="size-selector">
                    <h4>Select Size:</h4>
                    <div class="size-options">
                        ${product.sizes.map(size => 
                            `<button class="size-option" onclick="selectSize(this)">${size}</button>`
                        ).join('')}
                    </div>
                </div>
                
                <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" 
                        onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    productModal.classList.add('active');
}

// Select Size
function selectSize(btn) {
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
    btn.classList.add('selected');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showToast('Product added to cart!', 'success');
}

// Update Cart UI
function updateCartUI() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.brand.toUpperCase()}</p>
                <p class="product-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    saveCart();
    updateCartUI();
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showToast('Product removed from cart', 'error');
}

// Save Cart
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Filter Products
function filterProducts() {
    let filtered = [...products];
    
    // Search
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.brand.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Category
    const category = categoryFilter.value;
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // Brand
    const brand = brandFilter.value;
    if (brand !== 'all') {
        filtered = filtered.filter(p => p.brand === brand);
    }
    
    // Price
    const price = priceFilter.value;
    if (price !== 'all') {
        const [min, max] = price.split('-').map(Number);
        filtered = filtered.filter(p => p.price >= min && p.price <= (max || 999));
    }
    
    // Sort
    const sort = sortFilter.value;
    switch(sort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    filteredProducts = filtered;
    renderProducts();
}

// Show Toast
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Scroll to Products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Attach Event Listeners
function attachEventListeners() {
    // Cart Modal
    cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
    closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
    
    // Product Modal
    closeProduct.addEventListener('click', () => productModal.classList.remove('active'));
    
    // Login Modal
    userBtn.addEventListener('click', () => {
        if (currentUser) {
            showToast(`Welcome back, ${currentUser.name}!`);
        } else {
            loginModal.classList.add('active');
        }
    });
    closeLogin.addEventListener('click', () => loginModal.classList.remove('active'));
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
        if (e.target === productModal) productModal.classList.remove('active');
        if (e.target === loginModal) loginModal.classList.remove('active');
    });
    
    // Filters
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    brandFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    sortFilter.addEventListener('change', filterProducts);
    
    // Mobile Toggle
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Navigation Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            navMenu.classList.remove('active');
        });
    });
    
    // Contact Form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Message sent successfully!', 'success');
        contactForm.reset();
    });
    
    // Login Form
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        currentUser = { name: email.split('@')[0], email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loginModal.classList.remove('active');
        showToast(`Welcome, ${currentUser.name}!`, 'success');
        loginForm.reset();
    });
    
    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty!', 'error');
            return;
        }
        
        if (!currentUser) {
            cartModal.classList.remove('active');
            loginModal.classList.add('active');
            showToast('Please login to checkout', 'error');
            return;
        }
        
        showToast('Processing your order...', 'success');
        setTimeout(() => {
            cart = [];
            saveCart();
            updateCartUI();
            cartModal.classList.remove('active');
            showToast('Order placed successfully!', 'success');
        }, 2000);
    });
    
    // Newsletter
    document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Subscribed to newsletter!', 'success');
        e.target.reset();
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});
