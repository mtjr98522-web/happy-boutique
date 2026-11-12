// js/admin.js
document.addEventListener("DOMContentLoaded", () => {
    // جلب البيانات من قاعدة البيانات
    let storeData = getStoreData();
    
    // 1. تعبئة البيانات في البطاقات
    document.getElementById('stat-products').innerText = storeData.products.length;
    // إحصائيات وهمية للمبيعات والطلبات (يمكنك ربطها بالطلبات الحقيقية لاحقاً)
    document.getElementById('stat-sales').innerHTML = "24,680 <span>ريال</span>";
    document.getElementById('stat-orders').innerText = "856";
    document.getElementById('stat-customers').innerText = "1,248";

    // 2. رسم المخطط البياني للمبيعات
    const ctxSales = document.getElementById('salesChart').getContext('2d');
    new Chart(ctxSales, {
        type: 'bar',
        data: {
            labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            datasets: [{
                label: 'المبيعات',
                data: [1500, 2200, 2800, 2600, 3100, 4000, 4800],
                backgroundColor: '#e91e63',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#333' }, ticks: { color: '#aaa' } },
                x: { grid: { display: false }, ticks: { color: '#aaa' } }
            }
        }
    });

    // 3. رسم المخطط الدائري لتوزيع الطلبات
    const ctxOrders = document.getElementById('ordersChart').getContext('2d');
    new Chart(ctxOrders, {
        type: 'doughnut',
        data: {
            labels: ['المنتجات النسائية', 'أدوات وجماليات', 'ألعاب', 'إكسسوارات'],
            datasets: [{
                data: [45, 20, 15, 20],
                backgroundColor: ['#e91e63', '#d4af37', '#9c27b0', '#607d8b'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: { legend: { position: 'bottom', labels: { color: '#aaa' } } }
        }
    });

    // 4. عرض أحدث الطلبات (بيانات تجريبية)
    const recentOrders = [
        { id: '#4587', name: 'أحمد محمد', price: '320 ر.س', status: 'قيد التوصيل', date: '2025-10-21' },
        { id: '#4586', name: 'سارة علي', price: '450 ر.س', status: 'تم التوصيل', date: '2025-10-21' },
        { id: '#4585', name: 'محمد عبدالله', price: '275 ر.س', status: 'قيد المعالجة', date: '2025-10-20' }
    ];

    const ordersBody = document.getElementById('recent-orders-body');
    recentOrders.forEach(order => {
        let statusClass = order.status === 'قيد التوصيل' ? 'status-shipped' : (order.status === 'تم التوصيل' ? 'status-delivered' : 'status-processing');
        ordersBody.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.name}</td>
                <td>${order.price}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>${order.date}</td>
            </tr>
        `;
    });

    // 5. عرض المنتجات الأكثر مبيعاً
    const bestSellersList = document.getElementById('best-sellers-list');
    const topProducts = storeData.products.slice(0, 5); // نأخذ أول 5 منتجات
    topProducts.forEach((prod, index) => {
        bestSellersList.innerHTML += `
            <li>
                <span class="rank">${index + 1}</span>
                <img src="${prod.image}" alt="">
                <div class="info">
                    <h4>${prod.name}</h4>
                    <p>${prod.price} ر.س</p>
                </div>
            </li>
        `;
    });

    // --- دوال التنقل بين الأقسام ---
    window.switchTab = function(tabId) {
        document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
        
        document.getElementById(`${tabId}-section`).classList.add('active');
        event.currentTarget.classList.add('active');

        // إذا فتحنا قسم المنتجات، نقوم بتحديث الجدول
        if(tabId === 'products') renderProductsTable();
        if(tabId === 'categories') renderCategoriesTable();
        if(tabId === 'settings') loadSettings();
    };

    // --- إدارة المنتجات ---
    window.renderProductsTable = function() {
        const tbody = document.querySelector('#products-table tbody');
        tbody.innerHTML = '';
        storeData.products.forEach(prod => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="${prod.image}" width="40" style="border-radius:5px;"></td>
                    <td>${prod.name}</td>
                    <td>${prod.price} ر.س</td>
                    <td>${prod.categoryId}</td>
                    <td>
                        <button style="background:none;border:none;color:#e91e63;cursor:pointer;" onclick="editProduct('${prod.id}')"><i class="fa-solid fa-pen"></i></button>
                        <button style="background:none;border:none;color:#e91e63;cursor:pointer;" onclick="deleteProduct('${prod.id}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    };

    // --- إدارة الأقسام ---
    window.renderCategoriesTable = function() {
        const tbody = document.querySelector('#categories-table tbody');
        tbody.innerHTML = '';
        storeData.categories.forEach(cat => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="${cat.image}" width="40" style="border-radius:50%;"></td>
                    <td>${cat.name}</td>
                    <td>
                        <button style="background:none;border:none;color:#e91e63;cursor:pointer;" onclick="editCategory('${cat.id}')"><i class="fa-solid fa-pen"></i></button>
                        <button style="background:none;border:none;color:#e91e63;cursor:pointer;" onclick="deleteCategory('${cat.id}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    };

    // --- الإعدادات ---
    window.loadSettings = function() {
        document.getElementById('set-name').value = storeData.settings.storeName;
        document.getElementById('set-phone').value = storeData.settings.phone;
        document.getElementById('set-email').value = storeData.settings.email;
    };

    // --- دوال النوافذ المنبثقة (المنتجات والأقسام) ---
    // (نفس الدوال الموجودة في الكود السابق الخاص بك)
    window.openProductModal = function() { document.getElementById('product-modal').style.display = 'flex'; };
    window.openCategoryModal = function() { document.getElementById('category-modal').style.display = 'flex'; };
    window.closeModal = function(id) { document.getElementById(id).style.display = 'none'; };
    
    // دالة حفظ المنتج
    window.saveProduct = function() {
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
        renderProductsTable();
        closeModal('product-modal');
    };

    // دالة حفظ القسم
    window.saveCategory = function() {
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
        renderCategoriesTable();
        closeModal('category-modal');
    };

    // حفظ الإعدادات
    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        storeData.settings.storeName = document.getElementById('set-name').value;
        storeData.settings.phone = document.getElementById('set-phone').value;
        storeData.settings.email = document.getElementById('set-email').value;
        saveStoreData(storeData);
        alert('تم حفظ الإعدادات بنجاح!');
    });

});
