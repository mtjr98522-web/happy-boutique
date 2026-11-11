// js/main.js
document.addEventListener("DOMContentLoaded", () => {
    const data = getStoreData();

    // تحديث اسم المتجر
    document.getElementById('store-name-display').innerText = data.settings.storeName;

    // عرض الأقسام
    const catContainer = document.getElementById('categories-container');
    catContainer.innerHTML = '';
    data.categories.forEach(cat => {
        catContainer.innerHTML += `
            <div style="text-align: center;">
                <div style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid #d4af37; margin: 0 auto 5px; overflow: hidden; box-shadow: 0 0 10px rgba(212,175,55,0.3);">
                    <img src="${cat.image}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <span style="font-size: 12px; color: #fff;">${cat.name}</span>
            </div>
        `;
    });

    // عرض المنتجات
    const prodContainer = document.getElementById('products-container');
    prodContainer.innerHTML = '';
    data.products.forEach(prod => {
        prodContainer.innerHTML += `
            <div class="product-card" style="background: #151515; border: 1px solid #333; border-radius: 10px; overflow: hidden;">
                <div style="height: 150px; position: relative;">
                    <img src="${prod.image}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 10px;">
                    <h4 style="font-size: 14px; margin-bottom: 5px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${prod.name}</h4>
                    <div style="font-size: 12px; color: #d4af37; margin-bottom: 5px;"><i class="fa-solid fa-star"></i> ${prod.rating} (${prod.sales})</div>
                    <div style="margin-bottom: 10px;">
                        <span style="color: #e91e63; font-weight: bold;">${prod.price} ر.س</span>
                        ${prod.oldPrice ? `<span style="color: #888; text-decoration: line-through; font-size: 12px; margin-right: 5px;">${prod.oldPrice} ر.س</span>` : ''}
                    </div>
                    <button style="width: 100%; background: #e91e63; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer;">اطلب الآن</button>
                </div>
            </div>
        `;
    });
});
