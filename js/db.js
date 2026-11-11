// js/db.js

// البيانات الافتراضية للمتجر
const defaultData = {
    settings: {
        storeName: "بوتيك السعادة",
        phone: "+966500000000",
        email: "support@happyboutique.com",
        whatsapp: "+966500000000",
        address: "الرياض، المملكة العربية السعودية"
    },
    categories: [
        { id: "1", name: "قضبان صناعية", image: "https://via.placeholder.com/100/000/fff?text=Dildo" },
        { id: "2", name: "السدادات", image: "https://via.placeholder.com/100/000/fff?text=Plug" },
        { id: "3", name: "الطقات والتأخير", image: "https://via.placeholder.com/100/000/fff?text=Ring" },
        { id: "4", name: "الزيوت والجل", image: "https://via.placeholder.com/100/000/fff?text=Oil" }
    ],
    products: [
        { id: "p1", name: "قضيب سيليكون واقعي", price: 399, oldPrice: 599, categoryId: "1", image: "https://via.placeholder.com/150/111/fff?text=Product", desc: "تصميم واقعي وخامات عالية الجودة", rating: 4.8, sales: 124 },
        { id: "p2", name: "مجموعة سدادات سيليكون", price: 289, oldPrice: 0, categoryId: "2", image: "https://via.placeholder.com/150/111/fff?text=Product", desc: "مجموعة متنوعة لتناسب جميع الأذواق", rating: 4.9, sales: 89 },
        { id: "p3", name: "حلقة تأخير مع اهتزاز", price: 249, oldPrice: 599, categoryId: "3", image: "https://via.placeholder.com/150/111/fff?text=Product", desc: "تزيد من المتعة وتطيل الأداء", rating: 4.6, sales: 102 }
    ],
    orders: [],
    // إحصائيات وهمية لليوم
    stats: {
        todaySales: 1450,
        todayOrders: 5,
        totalSales: 25400,
        visitors: 320
    }
};

// دالة جلب البيانات
function getStoreData() {
    let data = localStorage.getItem('happyBoutiqueDB');
    if (!data) {
        localStorage.setItem('happyBoutiqueDB', JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(data);
}

// دالة حفظ البيانات
function saveStoreData(data) {
    localStorage.setItem('happyBoutiqueDB', JSON.stringify(data));
}

// دالة توليد معرف عشوائي
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
