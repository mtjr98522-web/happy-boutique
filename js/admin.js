// js/admin.js

// دالة جلب بيانات المدير (مع إنشاء حساب افتراضي إذا لم يكن موجوداً)
function getAdminCredentials() {
    let data = getStoreData();
    if (!data.adminCredentials) {
        data.adminCredentials = { username: "admin", password: "123456" };
        saveStoreData(data);
    }
    return data.adminCredentials;
}

// 1. نظام الحماية (تسجيل الدخول)
window.checkLogin = function() {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    const creds = getAdminCredentials();

    if (user === creds.username && pass === creds.password) {
        // نجاح الدخول
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-app').style.display = 'block';
        initDashboard();
    } else {
        // فشل الدخول
        document.getElementById('login-error').style.display = 'block';
    }
}

window.logout = function() {
    sessionStorage.removeItem('isAdminLoggedIn');
    location.reload(); 
}

// التحقق عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-app').style.display = 'block';
        initDashboard();
    }
});

// 2. تهيئة لوحة التحكم
function initDashboard() {
    let storeData = getStoreData();
    
    document.getElementById('stat-products').innerText = storeData.products.length;
    document.getElementById('stat-sales').innerHTML = "0 <span>ريال</span>";
    document.getElementById('stat-orders').innerText = "0";
    document.getElementById('stat-customers').innerText = "0";

    // رسم المخطط البياني (مبيعات صفرية)
    const ctxSales = document.getElementById('salesChart').getContext('2d');
    new Chart(ctxSales, {
        type: 'bar',
        data: {
            labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            datasets: [{ label: 'المبيعات', data: [0, 0, 0, 0, 0, 0, 0], backgroundColor: '#333', borderRadius: 5 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#333' }, ticks: { color: '#aaa' }, beginAtZero: true }, x: { grid: { display: false }, ticks: { color: '#aaa' } } } }
    });

    // المخطط الدائري
    const ctxOrders = document.getElementById('ordersChart').getContext('2d');
    new Chart(ctxOrders, {
        type: 'doughnut',
        data: { labels: ['لا توجد طلبات'], datasets: [{ data: [1], backgroundColor: ['#333'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }
    });

    renderAdminTables(storeData);
    loadProfileData(); // تحميل بيانات المدير في الحقول
}

// دالة مساعدة لتحديث الجداول
function renderAdminTables(storeData) {
    const prodTable = document.querySelector('#products-table tbody');
    if(prodTable) {
        prodTable.innerHTML = storeData.products.map(prod => `
            <tr>
                <td><img src="${prod.image}" style="width: 40px; border-radius: 5px;"></td>
                <td>${prod.name}</td>
                <td>${prod.price} ر.س</td>
                <td>
                    <button style="background:none;border:none;color:#e91e63;cursor:pointer;" onclick="editProduct('${prod.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button style="background:none;border:none;color:#e91e63;cursor:pointer;" onclick="deleteProduct('${prod.id}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    const catTable = document.querySelector('#categories-table tbody');
    if(catTable) {
        catTable.innerHTML = storeData.categories.map(cat => `
            <tr>
                <td><img src="${cat.image}" style="width: 40px; border-radius: 50%;"></td>
                <td>${cat.name}</td>
                <td>
                    <button style="background:none;border:none;color:#e91e63;cursor:pointer;" onclick="editCategory('${cat.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button style="background:none;border:none;color:#e91e63;cursor:pointer;" onclick="deleteCategory('${cat.id}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    const select = document.getElementById('prod-category');
    if(select) select.innerHTML = storeData.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    if(document.getElementById('set-name')) {
        document.getElementById('set-name').value = storeData.settings.storeName;
        document.getElementById('set-phone').value = storeData.settings.phone;
        document.getElementById('set-email').value = storeData.settings.email;
    }
}

// 3. التنقل بين التبويبات
window.switchTab = function(tabId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
    
    document.getElementById(`${tabId}-section`).classList.add('active');
    if(event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    // إذا فتحنا قسم حساب المدير، نقوم بتحديث الحقول
    if(tabId === 'profile') loadProfileData();
};

// 4. دوال المنتجات والأقسام
window.openProductModal = function() { document.getElementById('product-modal').style.display = 'flex'; };
window.openCategoryModal = function() { document.getElementById('category-modal').style.display = 'flex'; };
window.closeModal = function(id) { document.getElementById(id).style.display = 'none'; };

window.saveProduct = function() {
    let storeData = getStoreData();
    const id = document.getElementById('prod-id').value;
    const name = document.getElementById('prod-name').value;
    const price = document.getElementById('prod-price').value;
    const image = document.getElementById('prod-image').value;
    const cat = document.getElementById('prod-category').value;

    if (!name || !price || !image) return alert('يرجى ملء الحقول');

    if (id) {
        const index = storeData.products.findIndex(p => p.id === id);
        storeData.products[index] = { ...storeData.products[index], name, price, image, categoryId: cat };
    } else {
        storeData.products.push({ id: generateId(), name, price, image, categoryId: cat, rating: 5, sales: 0 });
    }
    saveStoreData(storeData);
    renderAdminTables(storeData);
    closeModal('product-modal');
};

window.saveCategory = function() {
    let storeData = getStoreData();
    const id = document.getElementById('cat-id').value;
    const name = document.getElementById('cat-name').value;
    const image = document.getElementById('cat-image').value;
    if (!name || !image) return alert('ملء الحقول');
    
    if (id) {
        const index = storeData.categories.findIndex(c => c.id === id);
        storeData.categories[index] = { id, name, image };
    } else {
        storeData.categories.push({ id: generateId(), name, image });
    }
    saveStoreData(storeData);
    renderAdminTables(storeData);
    closeModal('category-modal');
};

// 5. حفظ الإعدادات
document.getElementById('settings-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    let storeData = getStoreData();
    storeData.settings.storeName = document.getElementById('set-name').value;
    storeData.settings.phone = document.getElementById('set-phone').value;
    storeData.settings.email = document.getElementById('set-email').value;
    saveStoreData(storeData);
    alert('تم حفظ الإعدادات بنجاح!');
});

// 6. إدارة حساب المدير (جديد)
function loadProfileData() {
    const creds = getAdminCredentials();
    const userField = document.getElementById('prof-username');
    const passField = document.getElementById('prof-password');
    if(userField) userField.value = creds.username;
    if(passField) passField.value = creds.password;
}

document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    let storeData = getStoreData();
    const newUser = document.getElementById('prof-username').value;
    const newPass = document.getElementById('prof-password').value;

    if(!newUser || !newPass) return alert('يرجى ملء جميع الحقول');

    storeData.adminCredentials = { username: newUser, password: newPass };
    saveStoreData(storeData);
    alert('تم تحديث بيانات الدخول بنجاح! يرجى استخدامها في المرة القادمة.');
});
