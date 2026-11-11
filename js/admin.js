// js/admin.js
let storeData = getStoreData();

document.addEventListener("DOMContentLoaded", () => {
    renderStats();
    renderProductsTable();
    renderCategoriesTable();
    loadSettings();
    populateCategorySelect();
});

// التنقل بين التبويبات
function showAdminTab(tabId) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- الإحصائيات ---
function renderStats() {
    const container = document.getElementById('stats-container');
    const stats = storeData.stats;
    container.innerHTML = `
        <div class="stat-card">
            <i class="fa-solid fa-sack-dollar"></i>
            <h3>${stats.todaySales} ر.س</h3>
            <p>مبيعات اليوم</p>
        </div>
        <div class="stat-card">
            <i class="fa-solid fa-cart-shopping"></i>
            <h3>${stats.todayOrders}</h3>
            <p>طلبات اليوم</p>
        </div>
        <div class="stat-card">
            <i class="fa-solid fa-chart-line"></i>
            <h3>${stats.totalSales} ر.س</h3>
            <p>إجمالي المبيعات</p>
        </div>
        <div class="stat-card">
            <i class="fa-solid fa-users"></i>
            <h3>${stats.visitors}</h3>
            <p>زوار اليوم</p>
        </div>
    `;
}

// --- المنتجات ---
function renderProductsTable() {
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = '';
    storeData.products.forEach(prod => {
        const cat = storeData.categories.find(c => c.id === prod.categoryId);
        tbody.innerHTML += `
            <tr>
                <td><img src="${prod.image}" alt=""></td>
                <td>${prod.name}</td>
                <td>${prod.price} ر.س</td>
                <td>${cat ? cat.name : 'غير محدد'}</td>
                <td>
                    <button class="action-btn" onclick="editProduct('${prod.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn" onclick="deleteProduct('${prod.id}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function openProductModal() {
    document.getElementById('prod-id').value = '';
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-oldprice').value = '';
    document.getElementById('prod-image').value = '';
    document.getElementById('prod-desc').value = '';
    document.getElementById('prod-modal-title').innerText = 'إضافة منتج جديد';
    document.getElementById('product-modal').style.display = 'flex';
}

function editProduct(id) {
    const prod = storeData.products.find(p => p.id === id);
    if (!prod) return;
    document.getElementById('prod-id').value = prod.id;
    document.getElementById('prod-name').value = prod.name;
    document.getElementById('prod-price').value = prod.price;
    document.getElementById('prod-oldprice').value = prod.oldPrice;
    document.getElementById('prod-category').value = prod.categoryId;
    document.getElementById('prod-image').value = prod.image;
    document.getElementById('prod-desc').value = prod.desc;
    document.getElementById('prod-modal-title').innerText = 'تعديل المنتج';
    document.getElementById('product-modal').style.display = 'flex';
}

function saveProduct() {
    const id = document.getElementById('prod-id').value;
    const name = document.getElementById('prod-name').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const oldPrice = parseFloat(document.getElementById('prod-oldprice').value) || 0;
    const categoryId = document.getElementById('prod-category').value;
    const image = document.getElementById('prod-image').value;
    const desc = document.getElementById('prod-desc').value;

    if (!name || !price || !image) return alert('يرجى ملء الحقول الأساسية');

    if (id) {
        // تعديل
        const index = storeData.products.findIndex(p => p.id === id);
        storeData.products[index] = { ...storeData.products[index], name, price, oldPrice, categoryId, image, desc };
    } else {
        // إضافة
        storeData.products.push({
            id: generateId(),
            name, price, oldPrice, categoryId, image, desc,
            rating: 5.0, sales: 0
        });
    }
    saveStoreData(storeData);
    renderProductsTable();
    closeModal('product-modal');
}

function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        storeData.products = storeData.products.filter(p => p.id !== id);
        saveStoreData(storeData);
        renderProductsTable();
    }
}

// --- الأقسام ---
function renderCategoriesTable() {
    const tbody = document.querySelector('#categories-table tbody');
    tbody.innerHTML = '';
    storeData.categories.forEach(cat => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${cat.image}" alt=""></td>
                <td>${cat.name}</td>
                <td>
                    <button class="action-btn" onclick="editCategory('${cat.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn" onclick="deleteCategory('${cat.id}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    populateCategorySelect();
}

function populateCategorySelect() {
    const select = document.getElementById('prod-category');
    select.innerHTML = '';
    storeData.categories.forEach(cat => {
        select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });
}

function openCategoryModal() {
    document.getElementById('cat-id').value = '';
    document.getElementById('cat-name').value = '';
    document.getElementById('cat-image').value = '';
    document.getElementById('category-modal').style.display = 'flex';
}

function editCategory(id) {
    const cat = storeData.categories.find(c => c.id === id);
    document.getElementById('cat-id').value = cat.id;
    document.getElementById('cat-name').value = cat.name;
    document.getElementById('cat-image').value = cat.image;
    document.getElementById('category-modal').style.display = 'flex';
}

function saveCategory() {
    const id = document.getElementById('cat-id').value;
    const name = document.getElementById('cat-name').value;
    const image = document.getElementById('cat-image').value;

    if (!name || !image) return alert('يرجى ملء الحقول');

    if (id) {
        const index = storeData.categories.findIndex(c => c.id === id);
        storeData.categories[index] = { id, name, image };
    } else {
        storeData.categories.push({ id: generateId(), name, image });
    }
    saveStoreData(storeData);
    renderCategoriesTable();
    closeModal('category-modal');
}

function deleteCategory(id) {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف المنتجات المرتبطة به.')) {
        storeData.categories = storeData.categories.filter(c => c.id !== id);
        storeData.products = storeData.products.filter(p => p.categoryId !== id);
        saveStoreData(storeData);
        renderCategoriesTable();
        renderProductsTable();
    }
}

// --- الإعدادات ---
function loadSettings() {
    document.getElementById('set-name').value = storeData.settings.storeName;
    document.getElementById('set-phone').value = storeData.settings.phone;
    document.getElementById('set-email').value = storeData.settings.email;
    document.getElementById('set-whatsapp').value = storeData.settings.whatsapp;
}

document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    storeData.settings.storeName = document.getElementById('set-name').value;
    storeData.settings.phone = document.getElementById('set-phone').value;
    storeData.settings.email = document.getElementById('set-email').value;
    storeData.settings.whatsapp = document.getElementById('set-whatsapp').value;
    saveStoreData(storeData);
    alert('تم حفظ الإعدادات بنجاح!');
});

// إغلاق المودال
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
