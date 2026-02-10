const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

const businessId = "696f93fcf288b99a36271ab3"; // User provided seller ID

const categories = [
    {
        id: "697095953758a7d8f76fa8bd",
        name: "Dairy, Bread & Eggs"
    },
    {
        id: "697095953758a7d8f76fa8cc",
        name: "Staples, Oil & Masala"
    },
    {
        id: "697095953758a7d8f76fa8ea",
        name: "Snacks & Munchies"
    },
    {
        id: "697095953758a7d8f76fa912",
        name: "Beverages"
    },
    {
        id: "697095c1266f3a88165e3d22",
        name: "Personal Care"
    },
    {
        id: "697095c1266f3a88165e3d3b",
        name: "Cleaning & Household"
    },
    {
        id: "697095c1266f3a88165e3d4f",
        name: "Baby Care"
    },
    {
        id: "697095c1266f3a88165e3d59",
        name: "Kitchen & Dining"
    },
    {
        id: "697095c1266f3a88165e3d63",
        name: "Pet Care"
    },
    {
        id: "697095c1266f3a88165e3d6d",
        name: "Meat, Fish & Poultry"
    },
    {
        id: "697095c1266f3a88165e3d77",
        name: "Gourmet & World Food"
    }
];

const productsData = [
    /* ===== Dairy, Bread & Eggs (30 Products) ===== */
    { title: "Amul Gold Full Cream Milk", brand: "Amul", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Milk", packSize: "1 L", mrp: 66, sellingPrice: 64, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mother Dairy Full Cream Milk", brand: "Mother Dairy", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Milk", packSize: "1 L", mrp: 65, sellingPrice: 63, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amul Taaza Toned Milk", brand: "Amul", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Milk", packSize: "1 L", mrp: 54, sellingPrice: 52, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nandini Toned Milk", brand: "Nandini", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Milk", packSize: "1 L", mrp: 50, sellingPrice: 48, isVeg: true, stockQty: 100, status: "active" },
    { title: "Country Delight Cow Milk", brand: "Country Delight", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Milk", packSize: "1 L", mrp: 74, sellingPrice: 72, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amul Masti Dahi", brand: "Amul", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Curd & Yogurt", packSize: "400 g", mrp: 35, sellingPrice: 34, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mother Dairy Classic Dahi", brand: "Mother Dairy", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Curd & Yogurt", packSize: "400 g", mrp: 36, sellingPrice: 35, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nestle a+ Dahi", brand: "Nestle", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Curd & Yogurt", packSize: "400 g", mrp: 40, sellingPrice: 38, isVeg: true, stockQty: 100, status: "active" },
    { title: "Epigamia Greek Yogurt Plain", brand: "Epigamia", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Curd & Yogurt", packSize: "90 g", mrp: 45, sellingPrice: 42, isVeg: true, stockQty: 100, status: "active" },
    { title: "Milky Mist Natural Curd", brand: "Milky Mist", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Curd & Yogurt", packSize: "400 g", mrp: 38, sellingPrice: 36, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amul Processed Cheese Block", brand: "Amul", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Cheese", packSize: "200 g", mrp: 125, sellingPrice: 120, isVeg: true, stockQty: 100, status: "active" },
    { title: "Britannia Cheese Slices", brand: "Britannia", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Cheese", packSize: "200 g", mrp: 135, sellingPrice: 130, isVeg: true, stockQty: 100, status: "active" },
    { title: "Go Cheese Slices", brand: "Go", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Cheese", packSize: "200 g", mrp: 140, sellingPrice: 135, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amul Mozzarella Cheese", brand: "Amul", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Cheese", packSize: "200 g", mrp: 110, sellingPrice: 105, isVeg: true, stockQty: 100, status: "active" },
    { title: "Milky Mist Cheddar Cheese", brand: "Milky Mist", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Cheese", packSize: "200 g", mrp: 130, sellingPrice: 125, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amul Butter Pasteurised", brand: "Amul", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Butter & Cream", packSize: "100 g", mrp: 60, sellingPrice: 58, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mother Dairy Table Butter", brand: "Mother Dairy", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Butter & Cream", packSize: "100 g", mrp: 58, sellingPrice: 56, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amul Fresh Cream", brand: "Amul", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Butter & Cream", packSize: "250 ml", mrp: 70, sellingPrice: 68, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nestle a+ Fresh Cream", brand: "Nestle", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Butter & Cream", packSize: "200 ml", mrp: 68, sellingPrice: 66, isVeg: true, stockQty: 100, status: "active" },
    { title: "Govardhan Unsalted Butter", brand: "Govardhan", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Butter & Cream", packSize: "100 g", mrp: 62, sellingPrice: 60, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amul Fresh Paneer", brand: "Amul", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Paneer & Tofu", packSize: "200 g", mrp: 90, sellingPrice: 88, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mother Dairy Paneer", brand: "Mother Dairy", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Paneer & Tofu", packSize: "200 g", mrp: 95, sellingPrice: 92, isVeg: true, stockQty: 100, status: "active" },
    { title: "Milky Mist Paneer", brand: "Milky Mist", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Paneer & Tofu", packSize: "200 g", mrp: 98, sellingPrice: 95, isVeg: true, stockQty: 100, status: "active" },
    { title: "Urban Platter Firm Tofu", brand: "Urban Platter", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Paneer & Tofu", packSize: "200 g", mrp: 140, sellingPrice: 135, isVeg: true, stockQty: 100, status: "active" },
    { title: "NutraHi Soy Tofu", brand: "NutraHi", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Paneer & Tofu", packSize: "200 g", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    { title: "Suguna Farm Fresh Eggs", brand: "Suguna", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Eggs", packSize: "6 pcs", mrp: 48, sellingPrice: 46, isVeg: false, stockQty: 100, status: "active" },
    { title: "Godrej Real Good Eggs", brand: "Godrej", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Eggs", packSize: "6 pcs", mrp: 50, sellingPrice: 48, isVeg: false, stockQty: 100, status: "active" },
    { title: "Eggoz Nutrition Eggs", brand: "Eggoz", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Eggs", packSize: "6 pcs", mrp: 52, sellingPrice: 50, isVeg: false, stockQty: 100, status: "active" },
    { title: "Skylark White Eggs", brand: "Skylark", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Eggs", packSize: "6 pcs", mrp: 49, sellingPrice: 47, isVeg: false, stockQty: 100, status: "active" },
    { title: "Henfruit Brown Eggs", brand: "Henfruit", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Eggs", packSize: "6 pcs", mrp: 55, sellingPrice: 53, isVeg: false, stockQty: 100, status: "active" },

    /* Bread & Buns */
    { title: "Britannia 100% Whole Wheat Bread", brand: "Britannia", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Bread & Buns", packSize: "400 g", mrp: 50, sellingPrice: 45, isVeg: true, stockQty: 100, status: "active" },
    { title: "Modern Milk Bread", brand: "Modern", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Bread & Buns", packSize: "400 g", mrp: 40, sellingPrice: 38, isVeg: true, stockQty: 100, status: "active" },
    { title: "English Oven Sandwich Bread", brand: "English Oven", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Bread & Buns", packSize: "400 g", mrp: 45, sellingPrice: 42, isVeg: true, stockQty: 100, status: "active" },
    { title: "Harvest Gold White Bread", brand: "Harvest Gold", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Bread & Buns", packSize: "400 g", mrp: 35, sellingPrice: 32, isVeg: true, stockQty: 100, status: "active" },
    { title: "Perfect Bread Brown Bread", brand: "Perfect Bread", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Bread & Buns", packSize: "400 g", mrp: 45, sellingPrice: 40, isVeg: true, stockQty: 100, status: "active" },
    { title: "Britannia Fruit Bun", brand: "Britannia", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Bread & Buns", packSize: "150 g", mrp: 25, sellingPrice: 22, isVeg: true, stockQty: 100, status: "active" },
    { title: "English Oven Burger Buns", brand: "English Oven", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Bread & Buns", packSize: "4 pcs", mrp: 40, sellingPrice: 38, isVeg: true, stockQty: 100, status: "active" },
    { title: "Harvest Gold Pav Buns", brand: "Harvest Gold", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Bread & Buns", packSize: "300 g", mrp: 35, sellingPrice: 30, isVeg: true, stockQty: 100, status: "active" },
    { title: "The Bake Shop Garlic Bread", brand: "The Bake Shop", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Bread & Buns", packSize: "250 g", mrp: 80, sellingPrice: 75, isVeg: true, stockQty: 100, status: "active" },
    { title: "Modern Multigrain Bread", brand: "Modern", categoryId: "697095953758a7d8f76fa8bd", subCategory: "Bread & Buns", packSize: "400 g", mrp: 55, sellingPrice: 50, isVeg: true, stockQty: 100, status: "active" },

    /* ===== Staples, Oil & Masala (75 Products) ===== */
    /* Atta & Flours */
    { title: "Aashirvaad Superior MP Atta", brand: "Aashirvaad", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Atta & Flours", packSize: "5 kg", mrp: 275, sellingPrice: 265, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pillsbury Chakki Fresh Atta", brand: "Pillsbury", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Atta & Flours", packSize: "5 kg", mrp: 270, sellingPrice: 260, isVeg: true, stockQty: 100, status: "active" },
    { title: "Fortune Chakki Fresh Atta", brand: "Fortune", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Atta & Flours", packSize: "5 kg", mrp: 260, sellingPrice: 250, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nature Fresh Sampoorna Atta", brand: "Nature Fresh", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Atta & Flours", packSize: "5 kg", mrp: 255, sellingPrice: 245, isVeg: true, stockQty: 100, status: "active" },
    { title: "24 Mantra Organic Whole Wheat Atta", brand: "24 Mantra", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Atta & Flours", packSize: "5 kg", mrp: 340, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    /* Rice & Rice Products */
    { title: "India Gate Classic Basmati Rice", brand: "India Gate", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Rice & Rice Products", packSize: "5 kg", mrp: 650, sellingPrice: 620, isVeg: true, stockQty: 100, status: "active" },
    { title: "Daawat Rozana Super Basmati Rice", brand: "Daawat", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Rice & Rice Products", packSize: "5 kg", mrp: 520, sellingPrice: 495, isVeg: true, stockQty: 100, status: "active" },
    { title: "Fortune Sona Masoori Rice", brand: "Fortune", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Rice & Rice Products", packSize: "5 kg", mrp: 360, sellingPrice: 345, isVeg: true, stockQty: 100, status: "active" },
    { title: "Kohinoor Charminar Basmati Rice", brand: "Kohinoor", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Rice & Rice Products", packSize: "5 kg", mrp: 700, sellingPrice: 670, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Brown Rice", brand: "Patanjali", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Rice & Rice Products", packSize: "1 kg", mrp: 90, sellingPrice: 85, isVeg: true, stockQty: 100, status: "active" },
    /* Dals & Pulses */
    { title: "Tata Sampann Toor Dal", brand: "Tata Sampann", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Dals & Pulses", packSize: "1 kg", mrp: 190, sellingPrice: 180, isVeg: true, stockQty: 100, status: "active" },
    { title: "Aashirvaad Masoor Dal", brand: "Aashirvaad", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Dals & Pulses", packSize: "1 kg", mrp: 125, sellingPrice: 118, isVeg: true, stockQty: 100, status: "active" },
    { title: "Fortune Chana Dal", brand: "Fortune", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Dals & Pulses", packSize: "1 kg", mrp: 95, sellingPrice: 90, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tata Sampann Moong Dal", brand: "Tata Sampann", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Dals & Pulses", packSize: "1 kg", mrp: 160, sellingPrice: 150, isVeg: true, stockQty: 100, status: "active" },
    { title: "24 Mantra Organic Urad Dal", brand: "24 Mantra", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Dals & Pulses", packSize: "1 kg", mrp: 210, sellingPrice: 200, isVeg: true, stockQty: 100, status: "active" },
    /* Edible Oils & Ghee */
    { title: "Fortune Sunlite Refined Sunflower Oil", brand: "Fortune", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Edible Oils & Ghee", packSize: "1 L", mrp: 160, sellingPrice: 152, isVeg: true, stockQty: 100, status: "active" },
    { title: "Saffola Gold Pro Healthy Oil", brand: "Saffola", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Edible Oils & Ghee", packSize: "1 L", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    { title: "Dhara Kachi Ghani Mustard Oil", brand: "Dhara", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Edible Oils & Ghee", packSize: "1 L", mrp: 170, sellingPrice: 160, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amul Pure Cow Ghee", brand: "Amul", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Edible Oils & Ghee", packSize: "1 L", mrp: 640, sellingPrice: 620, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Cow Ghee", brand: "Patanjali", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Edible Oils & Ghee", packSize: "1 L", mrp: 620, sellingPrice: 600, isVeg: true, stockQty: 100, status: "active" },
    /* Salt, Sugar & Jaggery */
    { title: "Tata Salt Iodized", brand: "Tata", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Salt, Sugar & Jaggery", packSize: "1 kg", mrp: 28, sellingPrice: 26, isVeg: true, stockQty: 100, status: "active" },
    { title: "Aashirvaad Nature's Super Sugar", brand: "Aashirvaad", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Salt, Sugar & Jaggery", packSize: "1 kg", mrp: 50, sellingPrice: 48, isVeg: true, stockQty: 100, status: "active" },
    { title: "Trust Classic Sugar", brand: "Trust", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Salt, Sugar & Jaggery", packSize: "1 kg", mrp: 48, sellingPrice: 46, isVeg: true, stockQty: 100, status: "active" },
    { title: "24 Mantra Organic Jaggery Powder", brand: "24 Mantra", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Salt, Sugar & Jaggery", packSize: "1 kg", mrp: 110, sellingPrice: 105, isVeg: true, stockQty: 100, status: "active" },
    { title: "Organic India Natural Jaggery", brand: "Organic India", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Salt, Sugar & Jaggery", packSize: "1 kg", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    /* Spices & Masalas */
    { title: "Everest Tikhalal Red Chilli Powder", brand: "Everest", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Spices & Masalas", packSize: "200 g", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    { title: "MDH Deggi Mirch", brand: "MDH", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Spices & Masalas", packSize: "200 g", mrp: 130, sellingPrice: 125, isVeg: true, stockQty: 100, status: "active" },
    { title: "Catch Turmeric Powder", brand: "Catch", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Spices & Masalas", packSize: "200 g", mrp: 95, sellingPrice: 90, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tata Sampann Coriander Powder", brand: "Tata Sampann", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Spices & Masalas", packSize: "200 g", mrp: 85, sellingPrice: 82, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Garam Masala", brand: "Patanjali", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Spices & Masalas", packSize: "100 g", mrp: 60, sellingPrice: 58, isVeg: true, stockQty: 100, status: "active" },
    /* Dry Fruits & Nuts */
    { title: "Tata Sampann Almonds", brand: "Tata Sampann", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Dry Fruits & Nuts", packSize: "200 g", mrp: 220, sellingPrice: 210, isVeg: true, stockQty: 100, status: "active" },
    { title: "Happilo Premium Cashews", brand: "Happilo", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Dry Fruits & Nuts", packSize: "200 g", mrp: 260, sellingPrice: 250, isVeg: true, stockQty: 100, status: "active" },
    { title: "Rostaa Pistachios", brand: "Rostaa", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Dry Fruits & Nuts", packSize: "200 g", mrp: 320, sellingPrice: 305, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nutraj Raisins", brand: "Nutraj", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Dry Fruits & Nuts", packSize: "250 g", mrp: 150, sellingPrice: 140, isVeg: true, stockQty: 100, status: "active" },
    { title: "24 Mantra Organic Walnuts", brand: "24 Mantra", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Dry Fruits & Nuts", packSize: "200 g", mrp: 340, sellingPrice: 325, isVeg: true, stockQty: 100, status: "active" },
    /* Whole Spices */
    { title: "Everest Cumin Seeds", brand: "Everest", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Whole Spices", packSize: "100 g", mrp: 70, sellingPrice: 68, isVeg: true, stockQty: 100, status: "active" },
    { title: "MDH Black Pepper Whole", brand: "MDH", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Whole Spices", packSize: "50 g", mrp: 95, sellingPrice: 92, isVeg: true, stockQty: 100, status: "active" },
    { title: "Catch Green Cardamom", brand: "Catch", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Whole Spices", packSize: "50 g", mrp: 210, sellingPrice: 200, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tata Sampann Cloves", brand: "Tata Sampann", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Whole Spices", packSize: "50 g", mrp: 85, sellingPrice: 82, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Cinnamon Sticks", brand: "Patanjali", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Whole Spices", packSize: "50 g", mrp: 60, sellingPrice: 58, isVeg: true, stockQty: 100, status: "active" },
    /* Powdered Spices */
    { title: "Everest Turmeric Powder", brand: "Everest", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Powdered Spices", packSize: "200 g", mrp: 90, sellingPrice: 86, isVeg: true, stockQty: 100, status: "active" },
    { title: "MDH Coriander Powder", brand: "MDH", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Powdered Spices", packSize: "200 g", mrp: 85, sellingPrice: 82, isVeg: true, stockQty: 100, status: "active" },
    { title: "Catch Black Pepper Powder", brand: "Catch", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Powdered Spices", packSize: "100 g", mrp: 130, sellingPrice: 125, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tata Sampann Chilli Powder", brand: "Tata Sampann", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Powdered Spices", packSize: "200 g", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    { title: "24 Mantra Organic Turmeric Powder", brand: "24 Mantra", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Powdered Spices", packSize: "200 g", mrp: 140, sellingPrice: 135, isVeg: true, stockQty: 100, status: "active" },
    /* Cooking Pastes */
    { title: "Ching’s Ginger Garlic Paste", brand: "Ching’s", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Cooking Pastes", packSize: "200 g", mrp: 65, sellingPrice: 62, isVeg: true, stockQty: 100, status: "active" },
    { title: "Dabur Hommade Ginger Garlic Paste", brand: "Dabur", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Cooking Pastes", packSize: "200 g", mrp: 70, sellingPrice: 68, isVeg: true, stockQty: 100, status: "active" },
    { title: "Smith & Jones Ginger Paste", brand: "Smith & Jones", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Cooking Pastes", packSize: "200 g", mrp: 60, sellingPrice: 58, isVeg: true, stockQty: 100, status: "active" },
    { title: "Weikfield Ginger Garlic Paste", brand: "Weikfield", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Cooking Pastes", packSize: "200 g", mrp: 68, sellingPrice: 65, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Ginger Garlic Paste", brand: "Patanjali", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Cooking Pastes", packSize: "200 g", mrp: 55, sellingPrice: 53, isVeg: true, stockQty: 100, status: "active" },
    /* Blended Masalas */
    { title: "MDH Garam Masala", brand: "MDH", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Blended Masalas", packSize: "100 g", mrp: 95, sellingPrice: 90, isVeg: true, stockQty: 100, status: "active" },
    { title: "Everest Meat Masala", brand: "Everest", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Blended Masalas", packSize: "100 g", mrp: 105, sellingPrice: 100, isVeg: true, stockQty: 100, status: "active" },
    { title: "Catch Kitchen King Masala", brand: "Catch", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Blended Masalas", packSize: "100 g", mrp: 90, sellingPrice: 86, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tata Sampann Sambhar Masala", brand: "Tata Sampann", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Blended Masalas", packSize: "100 g", mrp: 85, sellingPrice: 82, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Chhole Masala", brand: "Patanjali", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Blended Masalas", packSize: "100 g", mrp: 60, sellingPrice: 58, isVeg: true, stockQty: 100, status: "active" },
    /* Soya Products */
    { title: "Nutrela Soya Chunks", brand: "Nutrela", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Soya Products", packSize: "200 g", mrp: 60, sellingPrice: 58, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nutrela Soya Granules", brand: "Nutrela", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Soya Products", packSize: "200 g", mrp: 55, sellingPrice: 53, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Soya Chunks", brand: "Patanjali", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Soya Products", packSize: "200 g", mrp: 58, sellingPrice: 56, isVeg: true, stockQty: 100, status: "active" },
    { title: "Fortune Soya Chunks", brand: "Fortune", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Soya Products", packSize: "200 g", mrp: 62, sellingPrice: 60, isVeg: true, stockQty: 100, status: "active" },
    { title: "Urban Platter Soya Flour", brand: "Urban Platter", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Soya Products", packSize: "500 g", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    /* Grains & Millets */
    { title: "Tata Sampann Jowar Flour", brand: "Tata Sampann", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Grains & Millets", packSize: "1 kg", mrp: 90, sellingPrice: 86, isVeg: true, stockQty: 100, status: "active" },
    { title: "24 Mantra Organic Ragi Flour", brand: "24 Mantra", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Grains & Millets", packSize: "1 kg", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    { title: "Slurrp Farm Millet Mix", brand: "Slurrp Farm", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Grains & Millets", packSize: "500 g", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Bajra Flour", brand: "Patanjali", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Grains & Millets", packSize: "1 kg", mrp: 65, sellingPrice: 62, isVeg: true, stockQty: 100, status: "active" },
    { title: "Organic Tattva Foxtail Millet", brand: "Organic Tattva", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Grains & Millets", packSize: "1 kg", mrp: 160, sellingPrice: 150, isVeg: true, stockQty: 100, status: "active" },
    /* Poha & Puffed Rice */
    { title: "Tata Sampann Thick Poha", brand: "Tata Sampann", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Poha & Puffed Rice", packSize: "500 g", mrp: 45, sellingPrice: 42, isVeg: true, stockQty: 100, status: "active" },
    { title: "24 Mantra Organic Poha", brand: "24 Mantra", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Poha & Puffed Rice", packSize: "500 g", mrp: 70, sellingPrice: 65, isVeg: true, stockQty: 100, status: "active" },
    { title: "Manna Thick Poha", brand: "Manna", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Poha & Puffed Rice", packSize: "500 g", mrp: 48, sellingPrice: 45, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ambika Flattened Rice Poha", brand: "Ambika", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Poha & Puffed Rice", packSize: "500 g", mrp: 40, sellingPrice: 38, isVeg: true, stockQty: 100, status: "active" },
    { title: "Loose Puffed Rice (Murmura)", brand: "Local", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Poha & Puffed Rice", packSize: "500 g", mrp: 30, sellingPrice: 28, isVeg: true, stockQty: 100, status: "active" },
    /* Vermicelli */
    { title: "Bambino Roasted Vermicelli", brand: "Bambino", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Vermicelli", packSize: "400 g", mrp: 55, sellingPrice: 52, isVeg: true, stockQty: 100, status: "active" },
    { title: "MTR Vermicelli", brand: "MTR", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Vermicelli", packSize: "400 g", mrp: 60, sellingPrice: 56, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Sewai", brand: "Patanjali", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Vermicelli", packSize: "400 g", mrp: 45, sellingPrice: 42, isVeg: true, stockQty: 100, status: "active" },
    { title: "Anil Vermicelli", brand: "Anil", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Vermicelli", packSize: "400 g", mrp: 50, sellingPrice: 47, isVeg: true, stockQty: 100, status: "active" },
    { title: "Double Horse Roasted Vermicelli", brand: "Double Horse", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Vermicelli", packSize: "400 g", mrp: 58, sellingPrice: 55, isVeg: true, stockQty: 100, status: "active" },
    /* Organic Atta & Flours */
    { title: "Organic Tattva Wheat Atta", brand: "Organic Tattva", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Organic Atta & Flours", packSize: "5 kg", mrp: 360, sellingPrice: 345, isVeg: true, stockQty: 100, status: "active" },
    { title: "Natureland Organics Wheat Atta", brand: "Natureland", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Organic Atta & Flours", packSize: "5 kg", mrp: 350, sellingPrice: 335, isVeg: true, stockQty: 100, status: "active" },
    { title: "Organic India Whole Wheat Atta", brand: "Organic India", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Organic Atta & Flours", packSize: "5 kg", mrp: 370, sellingPrice: 355, isVeg: true, stockQty: 100, status: "active" },
    { title: "Just Organik Wheat Atta", brand: "Just Organik", categoryId: "697095953758a7d8f76fa8cc", subCategory: "Organic Atta & Flours", packSize: "5 kg", mrp: 365, sellingPrice: 350, isVeg: true, stockQty: 100, status: "active" },

    /* ===== Snacks & Munchies (70 Products) ===== */
    /* Chips & Crisps */
    { title: "Lay’s Classic Salted Chips", brand: "Lay’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Chips & Crisps", packSize: "52 g", mrp: 20, sellingPrice: 18, isVeg: true, stockQty: 100, status: "active" },
    { title: "Lay’s Magic Masala Chips", brand: "Lay’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Chips & Crisps", packSize: "52 g", mrp: 20, sellingPrice: 18, isVeg: true, stockQty: 100, status: "active" },
    { title: "Bingo Mad Angles Achaari Masti", brand: "Bingo", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Chips & Crisps", packSize: "60 g", mrp: 20, sellingPrice: 18, isVeg: true, stockQty: 100, status: "active" },
    { title: "Uncle Chipps Spicy Treat", brand: "Uncle Chipps", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Chips & Crisps", packSize: "50 g", mrp: 20, sellingPrice: 18, isVeg: true, stockQty: 100, status: "active" },
    { title: "Too Yumm Multigrain Chips", brand: "Too Yumm", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Chips & Crisps", packSize: "50 g", mrp: 25, sellingPrice: 23, isVeg: true, stockQty: 100, status: "active" },
    /* Nachos */
    { title: "Doritos Nacho Cheese", brand: "Doritos", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Nachos", packSize: "60 g", mrp: 30, sellingPrice: 28, isVeg: true, stockQty: 100, status: "active" },
    { title: "Doritos Sweet Chilli", brand: "Doritos", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Nachos", packSize: "60 g", mrp: 30, sellingPrice: 28, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cornitos Peri Peri Nachos", brand: "Cornitos", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Nachos", packSize: "60 g", mrp: 35, sellingPrice: 33, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cornitos Cheese & Herbs Nachos", brand: "Cornitos", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Nachos", packSize: "60 g", mrp: 35, sellingPrice: 33, isVeg: true, stockQty: 100, status: "active" },
    { title: "TagZ Gourmet Nachos", brand: "TagZ", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Nachos", packSize: "75 g", mrp: 60, sellingPrice: 55, isVeg: true, stockQty: 100, status: "active" },
    /* Popcorn */
    { title: "ACT II Classic Salted Popcorn", brand: "ACT II", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Popcorn", packSize: "99 g", mrp: 20, sellingPrice: 18, isVeg: true, stockQty: 100, status: "active" },
    { title: "ACT II Butter Lovers Popcorn", brand: "ACT II", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Popcorn", packSize: "99 g", mrp: 20, sellingPrice: 18, isVeg: true, stockQty: 100, status: "active" },
    { title: "4700BC Himalayan Salt Popcorn", brand: "4700BC", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Popcorn", packSize: "55 g", mrp: 50, sellingPrice: 45, isVeg: true, stockQty: 100, status: "active" },
    { title: "4700BC Cheese Popcorn", brand: "4700BC", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Popcorn", packSize: "55 g", mrp: 50, sellingPrice: 45, isVeg: true, stockQty: 100, status: "active" },
    { title: "ACT II Ready to Eat Caramel Popcorn", brand: "ACT II", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Popcorn", packSize: "60 g", mrp: 35, sellingPrice: 32, isVeg: true, stockQty: 100, status: "active" },
    /* Biscuits & Cookies */
    { title: "Parle-G Original Biscuits", brand: "Parle", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Biscuits & Cookies", packSize: "250 g", mrp: 30, sellingPrice: 28, isVeg: true, stockQty: 100, status: "active" },
    { title: "Britannia Good Day Butter", brand: "Britannia", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Biscuits & Cookies", packSize: "200 g", mrp: 40, sellingPrice: 38, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sunfeast Dark Fantasy Choco Fills", brand: "Sunfeast", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Biscuits & Cookies", packSize: "75 g", mrp: 35, sellingPrice: 33, isVeg: true, stockQty: 100, status: "active" },
    { title: "Oreo Original Cream Biscuits", brand: "Oreo", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Biscuits & Cookies", packSize: "120 g", mrp: 30, sellingPrice: 28, isVeg: true, stockQty: 100, status: "active" },
    { title: "Hide & Seek Fab Chocolate Cookies", brand: "Hide & Seek", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Biscuits & Cookies", packSize: "150 g", mrp: 45, sellingPrice: 42, isVeg: true, stockQty: 100, status: "active" },
    /* Rusks & Wafers */
    { title: "Britannia Little Hearts Rusk", brand: "Britannia", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Rusks & Wafers", packSize: "200 g", mrp: 40, sellingPrice: 38, isVeg: true, stockQty: 100, status: "active" },
    { title: "Parle Monaco Wafers", brand: "Parle", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Rusks & Wafers", packSize: "150 g", mrp: 30, sellingPrice: 28, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tango Cream Wafers Strawberry", brand: "Tango", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Rusks & Wafers", packSize: "100 g", mrp: 35, sellingPrice: 32, isVeg: true, stockQty: 100, status: "active" },
    { title: "Priya Gold Milk Rusk", brand: "Priya Gold", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Rusks & Wafers", packSize: "200 g", mrp: 38, sellingPrice: 35, isVeg: true, stockQty: 100, status: "active" },
    { title: "Anmol Cream Wafers Chocolate", brand: "Anmol", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Rusks & Wafers", packSize: "100 g", mrp: 30, sellingPrice: 28, isVeg: true, stockQty: 100, status: "active" },
    /* Namkeen & Savouries */
    { title: "Haldiram’s Aloo Bhujia", brand: "Haldiram’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Namkeen & Savouries", packSize: "200 g", mrp: 55, sellingPrice: 52, isVeg: true, stockQty: 100, status: "active" },
    { title: "Bikano Bikaneri Bhujia", brand: "Bikano", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Namkeen & Savouries", packSize: "200 g", mrp: 50, sellingPrice: 48, isVeg: true, stockQty: 100, status: "active" },
    { title: "Balaji Wafers Sev Mamra", brand: "Balaji", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Namkeen & Savouries", packSize: "200 g", mrp: 45, sellingPrice: 42, isVeg: true, stockQty: 100, status: "active" },
    { title: "Prataap Snacks Yellow Chana Dal", brand: "Prataap", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Namkeen & Savouries", packSize: "200 g", mrp: 48, sellingPrice: 45, isVeg: true, stockQty: 100, status: "active" },
    { title: "Haldiram’s Khatta Meetha", brand: "Haldiram’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Namkeen & Savouries", packSize: "200 g", mrp: 55, sellingPrice: 52, isVeg: true, stockQty: 100, status: "active" },
    /* Chocolates & Candies */
    { title: "Cadbury Dairy Milk Chocolate", brand: "Cadbury", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Chocolates & Candies", packSize: "45 g", mrp: 40, sellingPrice: 38, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cadbury 5 Star Chocolate", brand: "Cadbury", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Chocolates & Candies", packSize: "40 g", mrp: 30, sellingPrice: 28, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nestle KitKat Chocolate", brand: "Nestle", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Chocolates & Candies", packSize: "41.5 g", mrp: 35, sellingPrice: 33, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nestle Munch Chocolate", brand: "Nestle", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Chocolates & Candies", packSize: "32 g", mrp: 25, sellingPrice: 23, isVeg: true, stockQty: 100, status: "active" },
    { title: "Parle Melody Chocolaty Candy", brand: "Parle", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Chocolates & Candies", packSize: "195 g", mrp: 50, sellingPrice: 48, isVeg: true, stockQty: 100, status: "active" },
    /* Indian Sweets */
    { title: "Haldiram’s Soan Papdi", brand: "Haldiram’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Indian Sweets", packSize: "250 g", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    { title: "Bikano Rasgulla", brand: "Bikano", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Indian Sweets", packSize: "500 g", mrp: 220, sellingPrice: 210, isVeg: true, stockQty: 100, status: "active" },
    { title: "Haldiram’s Gulab Jamun", brand: "Haldiram’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Indian Sweets", packSize: "500 g", mrp: 210, sellingPrice: 200, isVeg: true, stockQty: 100, status: "active" },
    { title: "Bikano Kaju Katli", brand: "Bikano", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Indian Sweets", packSize: "200 g", mrp: 320, sellingPrice: 305, isVeg: true, stockQty: 100, status: "active" },
    { title: "Haldiram’s Motichoor Ladoo", brand: "Haldiram’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Indian Sweets", packSize: "250 g", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    /* Healthy Snacks */
    { title: "Yoga Bar Multigrain Energy Bar", brand: "Yoga Bar", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Healthy Snacks", packSize: "50 g", mrp: 45, sellingPrice: 42, isVeg: true, stockQty: 100, status: "active" },
    { title: "RiteBite Max Protein Bar", brand: "RiteBite", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Healthy Snacks", packSize: "50 g", mrp: 60, sellingPrice: 56, isVeg: true, stockQty: 100, status: "active" },
    { title: "Too Yumm Veggie Stix", brand: "Too Yumm", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Healthy Snacks", packSize: "55 g", mrp: 30, sellingPrice: 28, isVeg: true, stockQty: 100, status: "active" },
    { title: "Slurrp Farm Millet Puffs", brand: "Slurrp Farm", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Healthy Snacks", packSize: "60 g", mrp: 80, sellingPrice: 75, isVeg: true, stockQty: 100, status: "active" },
    { title: "Open Secret Nutty Cookies", brand: "Open Secret", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Healthy Snacks", packSize: "150 g", mrp: 150, sellingPrice: 140, isVeg: true, stockQty: 100, status: "active" },
    /* Pasta & Macaroni */
    { title: "Maggi Pazzta Cheese Macaroni", brand: "Maggi", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Pasta & Macaroni", packSize: "65 g", mrp: 25, sellingPrice: 23, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sunfeast Yippee Pasta Treat", brand: "Sunfeast", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Pasta & Macaroni", packSize: "70 g", mrp: 25, sellingPrice: 23, isVeg: true, stockQty: 100, status: "active" },
    { title: "Bambino Macaroni", brand: "Bambino", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Pasta & Macaroni", packSize: "400 g", mrp: 90, sellingPrice: 85, isVeg: true, stockQty: 100, status: "active" },
    { title: "Weikfield Penne Pasta", brand: "Weikfield", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Pasta & Macaroni", packSize: "500 g", mrp: 110, sellingPrice: 105, isVeg: true, stockQty: 100, status: "active" },
    { title: "Del Monte Fusilli Pasta", brand: "Del Monte", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Pasta & Macaroni", packSize: "500 g", mrp: 125, sellingPrice: 118, isVeg: true, stockQty: 100, status: "active" },
    /* Noodles & Vermicelli */
    { title: "Maggi 2-Minute Noodles", brand: "Maggi", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Noodles & Vermicelli", packSize: "70 g", mrp: 14, sellingPrice: 13, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sunfeast Yippee Magic Masala", brand: "Sunfeast", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Noodles & Vermicelli", packSize: "70 g", mrp: 15, sellingPrice: 14, isVeg: true, stockQty: 100, status: "active" },
    { title: "Top Ramen Curry Noodles", brand: "Top Ramen", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Noodles & Vermicelli", packSize: "70 g", mrp: 15, sellingPrice: 14, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ching’s Secret Hakka Noodles", brand: "Ching’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Noodles & Vermicelli", packSize: "150 g", mrp: 35, sellingPrice: 33, isVeg: true, stockQty: 100, status: "active" },
    { title: "Bambino Vermicelli", brand: "Bambino", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Noodles & Vermicelli", packSize: "400 g", mrp: 55, sellingPrice: 52, isVeg: true, stockQty: 100, status: "active" },
    /* Instant Noodles */
    { title: "Maggi Masala Instant Noodles", brand: "Maggi", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Instant Noodles", packSize: "70 g", mrp: 14, sellingPrice: 13, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sunfeast Yippee Instant Noodles", brand: "Sunfeast", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Instant Noodles", packSize: "70 g", mrp: 15, sellingPrice: 14, isVeg: true, stockQty: 100, status: "active" },
    { title: "Top Ramen Masala Noodles", brand: "Top Ramen", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Instant Noodles", packSize: "70 g", mrp: 15, sellingPrice: 14, isVeg: true, stockQty: 100, status: "active" },
    { title: "Wai Wai Instant Noodles", brand: "Wai Wai", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Instant Noodles", packSize: "75 g", mrp: 20, sellingPrice: 18, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ching’s Hot Garlic Instant Noodles", brand: "Ching’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Instant Noodles", packSize: "60 g", mrp: 25, sellingPrice: 23, isVeg: true, stockQty: 100, status: "active" },
    /* Soup & Soup Mixes */
    { title: "Knorr Sweet Corn Veg Soup", brand: "Knorr", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Soup & Soup Mixes", packSize: "43 g", mrp: 55, sellingPrice: 52, isVeg: true, stockQty: 100, status: "active" },
    { title: "Knorr Hot & Sour Veg Soup", brand: "Knorr", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Soup & Soup Mixes", packSize: "43 g", mrp: 55, sellingPrice: 52, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ching’s Secret Manchow Soup", brand: "Ching’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Soup & Soup Mixes", packSize: "55 g", mrp: 65, sellingPrice: 62, isVeg: true, stockQty: 100, status: "active" },
    { title: "Maggi Veg Atta Soup", brand: "Maggi", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Soup & Soup Mixes", packSize: "45 g", mrp: 50, sellingPrice: 47, isVeg: true, stockQty: 100, status: "active" },
    { title: "Wai Wai Cup Soup Veg", brand: "Wai Wai", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Soup & Soup Mixes", packSize: "60 g", mrp: 45, sellingPrice: 42, isVeg: true, stockQty: 100, status: "active" },
    /* Breakfast Cereals */
    { title: "Kellogg’s Corn Flakes Original", brand: "Kellogg’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Breakfast Cereals", packSize: "250 g", mrp: 115, sellingPrice: 110, isVeg: true, stockQty: 100, status: "active" },
    { title: "Kellogg’s Chocos", brand: "Kellogg’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Breakfast Cereals", packSize: "250 g", mrp: 135, sellingPrice: 128, isVeg: true, stockQty: 100, status: "active" },
    { title: "Bagrry’s Original Muesli", brand: "Bagrry’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Breakfast Cereals", packSize: "500 g", mrp: 275, sellingPrice: 265, isVeg: true, stockQty: 100, status: "active" },
    { title: "Saffola Oats Classic", brand: "Saffola", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Breakfast Cereals", packSize: "500 g", mrp: 190, sellingPrice: 180, isVeg: true, stockQty: 100, status: "active" },
    { title: "Quaker Oats", brand: "Quaker", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Breakfast Cereals", packSize: "500 g", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    /* Energy Bars */
    { title: "Yoga Bar Dark Chocolate Energy Bar", brand: "Yoga Bar", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Energy Bars", packSize: "50 g", mrp: 45, sellingPrice: 42, isVeg: true, stockQty: 100, status: "active" },
    { title: "RiteBite Max Protein Bar", brand: "RiteBite", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Energy Bars", packSize: "50 g", mrp: 60, sellingPrice: 56, isVeg: true, stockQty: 100, status: "active" },
    { title: "Fast&Up Energy Bar", brand: "Fast&Up", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Energy Bars", packSize: "45 g", mrp: 55, sellingPrice: 52, isVeg: true, stockQty: 100, status: "active" },
    { title: "MuscleBlaze Protein Bar", brand: "MuscleBlaze", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Energy Bars", packSize: "50 g", mrp: 70, sellingPrice: 65, isVeg: true, stockQty: 100, status: "active" },
    { title: "Max Protein Peanut Butter Bar", brand: "RiteBite", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Energy Bars", packSize: "50 g", mrp: 65, sellingPrice: 60, isVeg: true, stockQty: 100, status: "active" },
    /* Frozen Snacks */
    { title: "McCain French Fries", brand: "McCain", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Frozen Snacks", packSize: "750 g", mrp: 220, sellingPrice: 210, isVeg: true, stockQty: 100, status: "active" },
    { title: "McCain Aloo Tikki", brand: "McCain", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Frozen Snacks", packSize: "420 g", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    { title: "ITC Master Chef Veg Nuggets", brand: "ITC Master Chef", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Frozen Snacks", packSize: "400 g", mrp: 190, sellingPrice: 180, isVeg: true, stockQty: 100, status: "active" },
    { title: "Godrej Yummiez Veg Burger Patty", brand: "Godrej Yummiez", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Frozen Snacks", packSize: "360 g", mrp: 170, sellingPrice: 160, isVeg: true, stockQty: 100, status: "active" },
    { title: "Prasuma Veg Momos", brand: "Prasuma", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Frozen Snacks", packSize: "240 g", mrp: 160, sellingPrice: 150, isVeg: true, stockQty: 100, status: "active" },
    /* Ketchup & Sauces */
    { title: "Kissan Fresh Tomato Ketchup", brand: "Kissan", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Ketchup & Sauces", packSize: "500 g", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    { title: "Maggi Hot & Sweet Sauce", brand: "Maggi", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Ketchup & Sauces", packSize: "500 g", mrp: 130, sellingPrice: 125, isVeg: true, stockQty: 100, status: "active" },
    { title: "Heinz Tomato Ketchup", brand: "Heinz", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Ketchup & Sauces", packSize: "570 g", mrp: 150, sellingPrice: 145, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ching’s Schezwan Sauce", brand: "Ching’s", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Ketchup & Sauces", packSize: "250 g", mrp: 95, sellingPrice: 90, isVeg: true, stockQty: 100, status: "active" },
    { title: "Veeba Cheese & Jalapeno Dip", brand: "Veeba", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Ketchup & Sauces", packSize: "300 g", mrp: 140, sellingPrice: 135, isVeg: true, stockQty: 100, status: "active" },
    /* Jams & Spreads */
    { title: "Kissan Mixed Fruit Jam", brand: "Kissan", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Jams & Spreads", packSize: "500 g", mrp: 140, sellingPrice: 135, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sundrop Peanut Butter Crunchy", brand: "Sundrop", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Jams & Spreads", packSize: "462 g", mrp: 150, sellingPrice: 145, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pintola All Natural Peanut Butter", brand: "Pintola", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Jams & Spreads", packSize: "350 g", mrp: 200, sellingPrice: 190, isVeg: true, stockQty: 100, status: "active" },
    { title: "Dr. Oetker FunFoods Mayonnaise", brand: "FunFoods", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Jams & Spreads", packSize: "250 g", mrp: 95, sellingPrice: 90, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nutella Hazelnut Spread", brand: "Nutella", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Jams & Spreads", packSize: "350 g", mrp: 380, sellingPrice: 365, isVeg: true, stockQty: 100, status: "active" },
    /* Pickles & Chutneys */
    { title: "Mother’s Recipe Mango Pickle", brand: "Mother’s Recipe", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Pickles & Chutneys", packSize: "500 g", mrp: 160, sellingPrice: 150, isVeg: true, stockQty: 100, status: "active" },
    { title: "Priya Gongura Pickle", brand: "Priya", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Pickles & Chutneys", packSize: "300 g", mrp: 140, sellingPrice: 135, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Mixed Pickle", brand: "Patanjali", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Pickles & Chutneys", packSize: "500 g", mrp: 110, sellingPrice: 105, isVeg: true, stockQty: 100, status: "active" },
    { title: "Chitale Bandhu Mango Pickle", brand: "Chitale Bandhu", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Pickles & Chutneys", packSize: "400 g", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    { title: "Urban Platter Mint Chutney", brand: "Urban Platter", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Pickles & Chutneys", packSize: "200 g", mrp: 150, sellingPrice: 140, isVeg: true, stockQty: 100, status: "active" },
    /* Honey */
    { title: "Dabur Pure Honey", brand: "Dabur", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Honey", packSize: "500 g", mrp: 240, sellingPrice: 230, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Honey", brand: "Patanjali", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Honey", packSize: "500 g", mrp: 220, sellingPrice: 210, isVeg: true, stockQty: 100, status: "active" },
    { title: "Zandu Pure Honey", brand: "Zandu", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Honey", packSize: "500 g", mrp: 250, sellingPrice: 240, isVeg: true, stockQty: 100, status: "active" },
    { title: "Apis Himalaya Honey", brand: "Apis", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Honey", packSize: "500 g", mrp: 260, sellingPrice: 250, isVeg: true, stockQty: 100, status: "active" },
    { title: "Organic India Forest Honey", brand: "Organic India", categoryId: "697095953758a7d8f76fa8ea", subCategory: "Honey", packSize: "500 g", mrp: 320, sellingPrice: 305, isVeg: true, stockQty: 100, status: "active" },

    /* ===== Beverages (60 Products) ===== */
    /* Tea */
    { title: "Tata Tea Gold", brand: "Tata Tea", categoryId: "697095953758a7d8f76fa912", subCategory: "Tea", packSize: "500 g", mrp: 275, sellingPrice: 265, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tata Tea Premium", brand: "Tata Tea", categoryId: "697095953758a7d8f76fa912", subCategory: "Tea", packSize: "500 g", mrp: 260, sellingPrice: 250, isVeg: true, stockQty: 100, status: "active" },
    { title: "Red Label Natural Care Tea", brand: "Red Label", categoryId: "697095953758a7d8f76fa912", subCategory: "Tea", packSize: "500 g", mrp: 290, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    { title: "Taj Mahal Tea", brand: "Taj Mahal", categoryId: "697095953758a7d8f76fa912", subCategory: "Tea", packSize: "500 g", mrp: 315, sellingPrice: 300, isVeg: true, stockQty: 100, status: "active" },
    { title: "Wagh Bakri Premium Leaf Tea", brand: "Wagh Bakri", categoryId: "697095953758a7d8f76fa912", subCategory: "Tea", packSize: "500 g", mrp: 320, sellingPrice: 305, isVeg: true, stockQty: 100, status: "active" },
    /* Coffee */
    { title: "Nescafe Classic Instant Coffee", brand: "Nescafe", categoryId: "697095953758a7d8f76fa912", subCategory: "Coffee", packSize: "100 g", mrp: 325, sellingPrice: 310, isVeg: true, stockQty: 100, status: "active" },
    { title: "Bru Instant Coffee", brand: "Bru", categoryId: "697095953758a7d8f76fa912", subCategory: "Coffee", packSize: "100 g", mrp: 300, sellingPrice: 285, isVeg: true, stockQty: 100, status: "active" },
    { title: "Continental Xtra Instant Coffee", brand: "Continental", categoryId: "697095953758a7d8f76fa912", subCategory: "Coffee", packSize: "100 g", mrp: 280, sellingPrice: 270, isVeg: true, stockQty: 100, status: "active" },
    { title: "Davidoff Rich Aroma Coffee", brand: "Davidoff", categoryId: "697095953758a7d8f76fa912", subCategory: "Coffee", packSize: "100 g", mrp: 520, sellingPrice: 500, isVeg: true, stockQty: 100, status: "active" },
    { title: "Blue Tokai Ground Coffee", brand: "Blue Tokai", categoryId: "697095953758a7d8f76fa912", subCategory: "Coffee", packSize: "250 g", mrp: 550, sellingPrice: 530, isVeg: true, stockQty: 100, status: "active" },
    /* Fruit Juices */
    { title: "Tropicana 100% Orange Juice", brand: "Tropicana", categoryId: "697095953758a7d8f76fa912", subCategory: "Fruit Juices", packSize: "1 L", mrp: 130, sellingPrice: 125, isVeg: true, stockQty: 100, status: "active" },
    { title: "Real Mixed Fruit Juice", brand: "Real", categoryId: "697095953758a7d8f76fa912", subCategory: "Fruit Juices", packSize: "1 L", mrp: 125, sellingPrice: 120, isVeg: true, stockQty: 100, status: "active" },
    { title: "B Natural Apple Juice", brand: "B Natural", categoryId: "697095953758a7d8f76fa912", subCategory: "Fruit Juices", packSize: "1 L", mrp: 135, sellingPrice: 128, isVeg: true, stockQty: 100, status: "active" },
    { title: "Paper Boat Aamras", brand: "Paper Boat", categoryId: "697095953758a7d8f76fa912", subCategory: "Fruit Juices", packSize: "1 L", mrp: 140, sellingPrice: 135, isVeg: true, stockQty: 100, status: "active" },
    { title: "Minute Maid Pulpy Orange", brand: "Minute Maid", categoryId: "697095953758a7d8f76fa912", subCategory: "Fruit Juices", packSize: "1 L", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    /* Energy Drinks */
    { title: "Red Bull Energy Drink", brand: "Red Bull", categoryId: "697095953758a7d8f76fa912", subCategory: "Energy Drinks", packSize: "250 ml", mrp: 125, sellingPrice: 120, isVeg: true, stockQty: 100, status: "active" },
    { title: "Monster Energy Drink", brand: "Monster", categoryId: "697095953758a7d8f76fa912", subCategory: "Energy Drinks", packSize: "350 ml", mrp: 150, sellingPrice: 145, isVeg: true, stockQty: 100, status: "active" },
    { title: "Fast&Up Energy Drink", brand: "Fast&Up", categoryId: "697095953758a7d8f76fa912", subCategory: "Energy Drinks", packSize: "250 ml", mrp: 110, sellingPrice: 105, isVeg: true, stockQty: 100, status: "active" },
    { title: "Gatorade Lemon Energy Drink", brand: "Gatorade", categoryId: "697095953758a7d8f76fa912", subCategory: "Energy Drinks", packSize: "500 ml", mrp: 80, sellingPrice: 75, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sting Energy Drink", brand: "Sting", categoryId: "697095953758a7d8f76fa912", subCategory: "Energy Drinks", packSize: "250 ml", mrp: 20, sellingPrice: 18, isVeg: true, stockQty: 100, status: "active" },
    /* Health Drinks */
    { title: "Horlicks Health & Nutrition Drink", brand: "Horlicks", categoryId: "697095953758a7d8f76fa912", subCategory: "Health Drinks", packSize: "500 g", mrp: 265, sellingPrice: 255, isVeg: true, stockQty: 100, status: "active" },
    { title: "Bournvita Chocolate Health Drink", brand: "Bournvita", categoryId: "697095953758a7d8f76fa912", subCategory: "Health Drinks", packSize: "500 g", mrp: 285, sellingPrice: 270, isVeg: true, stockQty: 100, status: "active" },
    { title: "Complan Royale Chocolate", brand: "Complan", categoryId: "697095953758a7d8f76fa912", subCategory: "Health Drinks", packSize: "500 g", mrp: 290, sellingPrice: 275, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ensure Nutrition Powder", brand: "Ensure", categoryId: "697095953758a7d8f76fa912", subCategory: "Health Drinks", packSize: "400 g", mrp: 720, sellingPrice: 695, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pediasure Complete Nutrition", brand: "Pediasure", categoryId: "697095953758a7d8f76fa912", subCategory: "Health Drinks", packSize: "400 g", mrp: 720, sellingPrice: 690, isVeg: true, stockQty: 100, status: "active" },
    /* Water */
    { title: "Bisleri Packaged Drinking Water", brand: "Bisleri", categoryId: "697095953758a7d8f76fa912", subCategory: "Water", packSize: "1 L", mrp: 20, sellingPrice: 18, isVeg: true, stockQty: 100, status: "active" },
    { title: "Aquafina Drinking Water", brand: "Aquafina", categoryId: "697095953758a7d8f76fa912", subCategory: "Water", packSize: "1 L", mrp: 20, sellingPrice: 18, isVeg: true, stockQty: 100, status: "active" },
    { title: "Kinley Drinking Water", brand: "Kinley", categoryId: "697095953758a7d8f76fa912", subCategory: "Water", packSize: "1 L", mrp: 20, sellingPrice: 18, isVeg: true, stockQty: 100, status: "active" },
    { title: "Rail Neer Drinking Water", brand: "Rail Neer", categoryId: "697095953758a7d8f76fa912", subCategory: "Water", packSize: "1 L", mrp: 15, sellingPrice: 15, isVeg: true, stockQty: 100, status: "active" },
    { title: "Vedica Himalayan Water", brand: "Vedica", categoryId: "697095953758a7d8f76fa912", subCategory: "Water", packSize: "1 L", mrp: 80, sellingPrice: 75, isVeg: true, stockQty: 100, status: "active" },
    /* Soda & Mixers */
    { title: "Schweppes Tonic Water", brand: "Schweppes", categoryId: "697095953758a7d8f76fa912", subCategory: "Soda & Mixers", packSize: "300 ml", mrp: 60, sellingPrice: 55, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sprite Soda", brand: "Sprite", categoryId: "697095953758a7d8f76fa912", subCategory: "Soda & Mixers", packSize: "750 ml", mrp: 40, sellingPrice: 38, isVeg: true, stockQty: 100, status: "active" },
    { title: "Kinley Club Soda", brand: "Kinley", categoryId: "697095953758a7d8f76fa912", subCategory: "Soda & Mixers", packSize: "750 ml", mrp: 35, sellingPrice: 33, isVeg: true, stockQty: 100, status: "active" },
    { title: "Catch Ginger Ale", brand: "Catch", categoryId: "697095953758a7d8f76fa912", subCategory: "Soda & Mixers", packSize: "300 ml", mrp: 55, sellingPrice: 52, isVeg: true, stockQty: 100, status: "active" },
    { title: "Svami Indian Tonic Water", brand: "Svami", categoryId: "697095953758a7d8f76fa912", subCategory: "Soda & Mixers", packSize: "250 ml", mrp: 75, sellingPrice: 70, isVeg: true, stockQty: 100, status: "active" },
    /* Syrups & Concentrates */
    { title: "Rasna Orange Drink Mix", brand: "Rasna", categoryId: "697095953758a7d8f76fa912", subCategory: "Syrups & Concentrates", packSize: "500 g", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mapro Strawberry Crush", brand: "Mapro", categoryId: "697095953758a7d8f76fa912", subCategory: "Syrups & Concentrates", packSize: "750 ml", mrp: 260, sellingPrice: 250, isVeg: true, stockQty: 100, status: "active" },
    { title: "Hershey’s Chocolate Syrup", brand: "Hershey’s", categoryId: "697095953758a7d8f76fa912", subCategory: "Syrups & Concentrates", packSize: "650 g", mrp: 260, sellingPrice: 250, isVeg: true, stockQty: 100, status: "active" },
    { title: "Kissan Lemon Squash", brand: "Kissan", categoryId: "697095953758a7d8f76fa912", subCategory: "Syrups & Concentrates", packSize: "750 ml", mrp: 150, sellingPrice: 145, isVeg: true, stockQty: 100, status: "active" },
    { title: "Monin Vanilla Syrup", brand: "Monin", categoryId: "697095953758a7d8f76fa912", subCategory: "Syrups & Concentrates", packSize: "250 ml", mrp: 550, sellingPrice: 525, isVeg: true, stockQty: 100, status: "active" },
    /* Organic Tea */
    { title: "Organic India Classic Black Tea", brand: "Organic India", categoryId: "697095953758a7d8f76fa912", subCategory: "Organic Tea", packSize: "250 g", mrp: 320, sellingPrice: 305, isVeg: true, stockQty: 100, status: "active" },
    { title: "24 Mantra Organic Darjeeling Tea", brand: "24 Mantra", categoryId: "697095953758a7d8f76fa912", subCategory: "Organic Tea", packSize: "200 g", mrp: 350, sellingPrice: 335, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tata Tea Organic Green Leaf", brand: "Tata Tea", categoryId: "697095953758a7d8f76fa912", subCategory: "Organic Tea", packSize: "250 g", mrp: 290, sellingPrice: 275, isVeg: true, stockQty: 100, status: "active" },
    { title: "Vahdam Organic Assam Tea", brand: "Vahdam", categoryId: "697095953758a7d8f76fa912", subCategory: "Organic Tea", packSize: "200 g", mrp: 420, sellingPrice: 400, isVeg: true, stockQty: 100, status: "active" },
    { title: "Teabox Organic Breakfast Tea", brand: "Teabox", categoryId: "697095953758a7d8f76fa912", subCategory: "Organic Tea", packSize: "200 g", mrp: 450, sellingPrice: 430, isVeg: true, stockQty: 100, status: "active" },
    /* Green Tea */
    { title: "Lipton Pure & Light Green Tea", brand: "Lipton", categoryId: "697095953758a7d8f76fa912", subCategory: "Green Tea", packSize: "100 g", mrp: 260, sellingPrice: 245, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tetley Green Tea", brand: "Tetley", categoryId: "697095953758a7d8f76fa912", subCategory: "Green Tea", packSize: "100 g", mrp: 275, sellingPrice: 260, isVeg: true, stockQty: 100, status: "active" },
    { title: "Twinings Green Tea", brand: "Twinings", categoryId: "697095953758a7d8f76fa912", subCategory: "Green Tea", packSize: "50 g", mrp: 480, sellingPrice: 460, isVeg: true, stockQty: 100, status: "active" },
    { title: "Organic India Tulsi Green Tea", brand: "Organic India", categoryId: "697095953758a7d8f76fa912", subCategory: "Green Tea", packSize: "100 g", mrp: 290, sellingPrice: 275, isVeg: true, stockQty: 100, status: "active" },
    { title: "Vahdam Himalayan Green Tea", brand: "Vahdam", categoryId: "697095953758a7d8f76fa912", subCategory: "Green Tea", packSize: "100 g", mrp: 390, sellingPrice: 370, isVeg: true, stockQty: 100, status: "active" },
    /* Herbal Tea */
    { title: "Organic India Tulsi Original Herbal Tea", brand: "Organic India", categoryId: "697095953758a7d8f76fa912", subCategory: "Herbal Tea", packSize: "100 g", mrp: 260, sellingPrice: 245, isVeg: true, stockQty: 100, status: "active" },
    { title: "Twinings Chamomile Herbal Tea", brand: "Twinings", categoryId: "697095953758a7d8f76fa912", subCategory: "Herbal Tea", packSize: "50 g", mrp: 520, sellingPrice: 500, isVeg: true, stockQty: 100, status: "active" },
    { title: "Lipton Herbal Infusion Lemon", brand: "Lipton", categoryId: "697095953758a7d8f76fa912", subCategory: "Herbal Tea", packSize: "50 g", mrp: 300, sellingPrice: 285, isVeg: true, stockQty: 100, status: "active" },
    { title: "Teabox Herbal Detox Tea", brand: "Teabox", categoryId: "697095953758a7d8f76fa912", subCategory: "Herbal Tea", packSize: "100 g", mrp: 480, sellingPrice: 460, isVeg: true, stockQty: 100, status: "active" },
    { title: "Vahdam Turmeric Ginger Herbal Tea", brand: "Vahdam", categoryId: "697095953758a7d8f76fa912", subCategory: "Herbal Tea", packSize: "100 g", mrp: 390, sellingPrice: 370, isVeg: true, stockQty: 100, status: "active" },
    /* Ground Coffee */
    { title: "Blue Tokai Vienna Roast Ground Coffee", brand: "Blue Tokai", categoryId: "697095953758a7d8f76fa912", subCategory: "Ground Coffee", packSize: "250 g", mrp: 550, sellingPrice: 525, isVeg: true, stockQty: 100, status: "active" },
    /* Instant Coffee */
    { title: "Nescafe Gold Instant Coffee", brand: "Nescafe", categoryId: "697095953758a7d8f76fa912", subCategory: "Instant Coffee", packSize: "100 g", mrp: 550, sellingPrice: 525, isVeg: true, stockQty: 100, status: "active" },
    /* Cold Coffee */
    { title: "Nescafe Latte Cold Coffee", brand: "Nescafe", categoryId: "697095953758a7d8f76fa912", subCategory: "Cold Coffee", packSize: "200 ml", mrp: 60, sellingPrice: 55, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sunfeast Cold Coffee Drink", brand: "Sunfeast", categoryId: "697095953758a7d8f76fa912", subCategory: "Cold Coffee", packSize: "200 ml", mrp: 50, sellingPrice: 47, isVeg: true, stockQty: 100, status: "active" },

    /* ===== Personal Care (55 Products) ===== */
    /* Bath & Body */
    { title: "Dove Cream Beauty Bathing Bar", brand: "Dove", categoryId: "697095c1266f3a88165e3d22", subCategory: "Bath & Body", packSize: "100 g", mrp: 60, sellingPrice: 55, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pears Pure & Gentle Soap", brand: "Pears", categoryId: "697095c1266f3a88165e3d22", subCategory: "Bath & Body", packSize: "125 g", mrp: 75, sellingPrice: 70, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nivea Refreshing Body Wash", brand: "Nivea", categoryId: "697095c1266f3a88165e3d22", subCategory: "Bath & Body", packSize: "250 ml", mrp: 199, sellingPrice: 189, isVeg: true, stockQty: 100, status: "active" },
    { title: "Lux Soft Touch Body Wash", brand: "Lux", categoryId: "697095c1266f3a88165e3d22", subCategory: "Bath & Body", packSize: "245 ml", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    { title: "Fiama Gel Bar Soap", brand: "Fiama", categoryId: "697095c1266f3a88165e3d22", subCategory: "Bath & Body", packSize: "125 g", mrp: 70, sellingPrice: 65, isVeg: true, stockQty: 100, status: "active" },
    /* Hair Care */
    { title: "Dove Intense Repair Shampoo", brand: "Dove", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Care", packSize: "340 ml", mrp: 340, sellingPrice: 320, isVeg: true, stockQty: 100, status: "active" },
    { title: "Clinic Plus Strong & Long Shampoo", brand: "Clinic Plus", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Care", packSize: "340 ml", mrp: 230, sellingPrice: 220, isVeg: true, stockQty: 100, status: "active" },
    { title: "Head & Shoulders Cool Menthol Shampoo", brand: "Head & Shoulders", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Care", packSize: "340 ml", mrp: 350, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    { title: "WOW Onion Black Seed Shampoo", brand: "WOW", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Care", packSize: "300 ml", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mamaearth Onion Hair Fall Shampoo", brand: "Mamaearth", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Care", packSize: "250 ml", mrp: 349, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    /* Skin Care */
    { title: "Pond’s Pure White Face Cream", brand: "Pond’s", categoryId: "697095c1266f3a88165e3d22", subCategory: "Skin Care", packSize: "50 g", mrp: 225, sellingPrice: 215, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nivea Soft Moisturizing Cream", brand: "Nivea", categoryId: "697095c1266f3a88165e3d22", subCategory: "Skin Care", packSize: "100 ml", mrp: 275, sellingPrice: 260, isVeg: true, stockQty: 100, status: "active" },
    { title: "Lakme Peach Milk Moisturizer", brand: "Lakme", categoryId: "697095c1266f3a88165e3d22", subCategory: "Skin Care", packSize: "120 ml", mrp: 220, sellingPrice: 210, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cetaphil Moisturising Cream", brand: "Cetaphil", categoryId: "697095c1266f3a88165e3d22", subCategory: "Skin Care", packSize: "80 g", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mamaearth Ubtan Face Cream", brand: "Mamaearth", categoryId: "697095c1266f3a88165e3d22", subCategory: "Skin Care", packSize: "50 g", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    /* Face Wash */
    { title: "Pond’s Pure White Face Wash", brand: "Pond’s", categoryId: "697095c1266f3a88165e3d22", subCategory: "Face Wash", packSize: "100 g", mrp: 199, sellingPrice: 189, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nivea Men Oil Control Face Wash", brand: "Nivea", categoryId: "697095c1266f3a88165e3d22", subCategory: "Face Wash", packSize: "100 g", mrp: 210, sellingPrice: 199, isVeg: true, stockQty: 100, status: "active" },
    { title: "Himalaya Neem Face Wash", brand: "Himalaya", categoryId: "697095c1266f3a88165e3d22", subCategory: "Face Wash", packSize: "100 ml", mrp: 170, sellingPrice: 160, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mamaearth Vitamin C Face Wash", brand: "Mamaearth", categoryId: "697095c1266f3a88165e3d22", subCategory: "Face Wash", packSize: "100 ml", mrp: 259, sellingPrice: 245, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cetaphil Gentle Skin Cleanser", brand: "Cetaphil", categoryId: "697095c1266f3a88165e3d22", subCategory: "Face Wash", packSize: "125 ml", mrp: 349, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    /* Shower Gel */
    { title: "Nivea Men Active Clean Shower Gel", brand: "Nivea", categoryId: "697095c1266f3a88165e3d22", subCategory: "Shower Gel", packSize: "250 ml", mrp: 245, sellingPrice: 230, isVeg: true, stockQty: 100, status: "active" },
    { title: "Fiama Blackcurrant Shower Gel", brand: "Fiama", categoryId: "697095c1266f3a88165e3d22", subCategory: "Shower Gel", packSize: "250 ml", mrp: 220, sellingPrice: 210, isVeg: true, stockQty: 100, status: "active" },
    { title: "Palmolive Aroma Therapy Shower Gel", brand: "Palmolive", categoryId: "697095c1266f3a88165e3d22", subCategory: "Shower Gel", packSize: "250 ml", mrp: 199, sellingPrice: 189, isVeg: true, stockQty: 100, status: "active" },
    { title: "Lux Velvet Touch Shower Gel", brand: "Lux", categoryId: "697095c1266f3a88165e3d22", subCategory: "Shower Gel", packSize: "245 ml", mrp: 210, sellingPrice: 199, isVeg: true, stockQty: 100, status: "active" },
    { title: "St. Ives Sea Salt Body Wash", brand: "St. Ives", categoryId: "697095c1266f3a88165e3d22", subCategory: "Shower Gel", packSize: "400 ml", mrp: 699, sellingPrice: 670, isVeg: true, stockQty: 100, status: "active" },
    /* Soaps */
    { title: "Lux International Creamy Perfection Soap", brand: "Lux", categoryId: "697095c1266f3a88165e3d22", subCategory: "Soaps", packSize: "100 g", mrp: 45, sellingPrice: 42, isVeg: true, stockQty: 100, status: "active" },
    { title: "Lifebuoy Total Germ Protection Soap", brand: "Lifebuoy", categoryId: "697095c1266f3a88165e3d22", subCategory: "Soaps", packSize: "125 g", mrp: 40, sellingPrice: 38, isVeg: true, stockQty: 100, status: "active" },
    { title: "Dettol Original Bathing Soap", brand: "Dettol", categoryId: "697095c1266f3a88165e3d22", subCategory: "Soaps", packSize: "125 g", mrp: 55, sellingPrice: 52, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pears Soft & Fresh Soap", brand: "Pears", categoryId: "697095c1266f3a88165e3d22", subCategory: "Soaps", packSize: "125 g", mrp: 75, sellingPrice: 70, isVeg: true, stockQty: 100, status: "active" },
    { title: "Medimix Ayurvedic Soap", brand: "Medimix", categoryId: "697095c1266f3a88165e3d22", subCategory: "Soaps", packSize: "125 g", mrp: 60, sellingPrice: 57, isVeg: true, stockQty: 100, status: "active" },
    /* Shampoo */
    { title: "Pantene Pro-V Hair Fall Control Shampoo", brand: "Pantene", categoryId: "697095c1266f3a88165e3d22", subCategory: "Shampoo", packSize: "340 ml", mrp: 350, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tresemme Keratin Smooth Shampoo", brand: "Tresemme", categoryId: "697095c1266f3a88165e3d22", subCategory: "Shampoo", packSize: "340 ml", mrp: 360, sellingPrice: 340, isVeg: true, stockQty: 100, status: "active" },
    { title: "Loreal Paris Total Repair 5 Shampoo", brand: "L’Oreal", categoryId: "697095c1266f3a88165e3d22", subCategory: "Shampoo", packSize: "340 ml", mrp: 380, sellingPrice: 360, isVeg: true, stockQty: 100, status: "active" },
    { title: "Biotique Bio Kelp Shampoo", brand: "Biotique", categoryId: "697095c1266f3a88165e3d22", subCategory: "Shampoo", packSize: "340 ml", mrp: 330, sellingPrice: 315, isVeg: true, stockQty: 100, status: "active" },
    { title: "Khadi Natural Amla & Bhringraj Shampoo", brand: "Khadi Natural", categoryId: "697095c1266f3a88165e3d22", subCategory: "Shampoo", packSize: "210 ml", mrp: 250, sellingPrice: 235, isVeg: true, stockQty: 100, status: "active" },
    /* Conditioner */
    { title: "Dove Intense Repair Conditioner", brand: "Dove", categoryId: "697095c1266f3a88165e3d22", subCategory: "Conditioner", packSize: "175 ml", mrp: 230, sellingPrice: 220, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tresemme Keratin Smooth Conditioner", brand: "Tresemme", categoryId: "697095c1266f3a88165e3d22", subCategory: "Conditioner", packSize: "190 ml", mrp: 260, sellingPrice: 245, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pantene Pro-V Hair Fall Control Conditioner", brand: "Pantene", categoryId: "697095c1266f3a88165e3d22", subCategory: "Conditioner", packSize: "180 ml", mrp: 240, sellingPrice: 225, isVeg: true, stockQty: 100, status: "active" },
    { title: "WOW Onion Black Seed Conditioner", brand: "WOW", categoryId: "697095c1266f3a88165e3d22", subCategory: "Conditioner", packSize: "200 ml", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mamaearth Onion Conditioner", brand: "Mamaearth", categoryId: "697095c1266f3a88165e3d22", subCategory: "Conditioner", packSize: "250 ml", mrp: 349, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    /* Hair Oil */
    { title: "Parachute 100% Pure Coconut Oil", brand: "Parachute", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Oil", packSize: "250 ml", mrp: 140, sellingPrice: 135, isVeg: true, stockQty: 100, status: "active" },
    { title: "Bajaj Almond Drops Hair Oil", brand: "Bajaj", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Oil", packSize: "300 ml", mrp: 170, sellingPrice: 160, isVeg: true, stockQty: 100, status: "active" },
    { title: "Indulekha Bringha Hair Oil", brand: "Indulekha", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Oil", packSize: "100 ml", mrp: 432, sellingPrice: 410, isVeg: true, stockQty: 100, status: "active" },
    { title: "Dabur Amla Hair Oil", brand: "Dabur", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Oil", packSize: "275 ml", mrp: 150, sellingPrice: 145, isVeg: true, stockQty: 100, status: "active" },
    { title: "Khadi Natural Amla & Bhringraj Hair Oil", brand: "Khadi Natural", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Oil", packSize: "210 ml", mrp: 350, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    /* Hair Color */
    { title: "Garnier Color Naturals Hair Color", brand: "Garnier", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Color", packSize: "70 ml", mrp: 199, sellingPrice: 189, isVeg: true, stockQty: 100, status: "active" },
    { title: "L’Oreal Paris Excellence Creme", brand: "L’Oreal", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Color", packSize: "72 ml", mrp: 625, sellingPrice: 600, isVeg: true, stockQty: 100, status: "active" },
    { title: "Godrej Expert Rich Creme Hair Color", brand: "Godrej", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Color", packSize: "60 g", mrp: 45, sellingPrice: 42, isVeg: true, stockQty: 100, status: "active" },
    { title: "BBlunt Salon Secret Hair Color", brand: "BBlunt", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Color", packSize: "100 g", mrp: 495, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "Indica Easy Hair Color", brand: "Indica", categoryId: "697095c1266f3a88165e3d22", subCategory: "Hair Color", packSize: "20 g", mrp: 30, sellingPrice: 28, isVeg: true, stockQty: 100, status: "active" },
    /* Toothpaste */
    { title: "Colgate Strong Teeth Toothpaste", brand: "Colgate", categoryId: "697095c1266f3a88165e3d22", subCategory: "Toothpaste", packSize: "200 g", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pepsodent Germicheck Toothpaste", brand: "Pepsodent", categoryId: "697095c1266f3a88165e3d22", subCategory: "Toothpaste", packSize: "200 g", mrp: 115, sellingPrice: 110, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sensodyne Sensitive Toothpaste", brand: "Sensodyne", categoryId: "697095c1266f3a88165e3d22", subCategory: "Toothpaste", packSize: "75 g", mrp: 110, sellingPrice: 105, isVeg: true, stockQty: 100, status: "active" },
    { title: "Dabur Red Toothpaste", brand: "Dabur", categoryId: "697095c1266f3a88165e3d22", subCategory: "Toothpaste", packSize: "200 g", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Dant Kanti Toothpaste", brand: "Patanjali", categoryId: "697095c1266f3a88165e3d22", subCategory: "Toothpaste", packSize: "200 g", mrp: 95, sellingPrice: 90, isVeg: true, stockQty: 100, status: "active" },

    /* ===== Cleaning & Household (35 Products) ===== */
    /* Detergents & Bars */
    { title: "Surf Excel Easy Wash Detergent Powder", brand: "Surf Excel", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Detergents & Bars", packSize: "1 kg", mrp: 230, sellingPrice: 220, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ariel Matic Top Load Detergent", brand: "Ariel", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Detergents & Bars", packSize: "2 kg", mrp: 420, sellingPrice: 400, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tide Plus Double Power Detergent", brand: "Tide", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Detergents & Bars", packSize: "1 kg", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    { title: "Rin Advanced Detergent Powder", brand: "Rin", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Detergents & Bars", packSize: "1 kg", mrp: 165, sellingPrice: 155, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ghadi Detergent Powder", brand: "Ghadi", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Detergents & Bars", packSize: "1 kg", mrp: 155, sellingPrice: 145, isVeg: true, stockQty: 100, status: "active" },
    /* Dishwashing */
    { title: "Vim Dishwash Liquid Lemon", brand: "Vim", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Dishwashing", packSize: "500 ml", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    { title: "Vim Dishwash Bar", brand: "Vim", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Dishwashing", packSize: "300 g", mrp: 30, sellingPrice: 28, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pril Active Lime Dishwash Liquid", brand: "Pril", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Dishwashing", packSize: "425 ml", mrp: 110, sellingPrice: 105, isVeg: true, stockQty: 100, status: "active" },
    { title: "Giffy Dishwash Liquid", brand: "Giffy", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Dishwashing", packSize: "500 ml", mrp: 99, sellingPrice: 95, isVeg: true, stockQty: 100, status: "active" },
    { title: "Exo Dishwash Bar", brand: "Exo", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Dishwashing", packSize: "500 g", mrp: 55, sellingPrice: 52, isVeg: true, stockQty: 100, status: "active" },
    /* Toilet Cleaners */
    { title: "Harpic Power Plus Toilet Cleaner", brand: "Harpic", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Toilet Cleaners", packSize: "500 ml", mrp: 190, sellingPrice: 180, isVeg: true, stockQty: 100, status: "active" },
    { title: "Lizol Citrus Toilet Cleaner", brand: "Lizol", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Toilet Cleaners", packSize: "500 ml", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    { title: "Domex Disinfectant Toilet Cleaner", brand: "Domex", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Toilet Cleaners", packSize: "500 ml", mrp: 160, sellingPrice: 150, isVeg: true, stockQty: 100, status: "active" },
    { title: "Harpic Floral Toilet Cleaner", brand: "Harpic", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Toilet Cleaners", packSize: "500 ml", mrp: 185, sellingPrice: 175, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Toilet Cleaner", brand: "Patanjali", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Toilet Cleaners", packSize: "500 ml", mrp: 150, sellingPrice: 140, isVeg: true, stockQty: 100, status: "active" },
    /* Floor Cleaners */
    { title: "Lizol Citrus Floor Cleaner", brand: "Lizol", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Floor Cleaners", packSize: "1 L", mrp: 210, sellingPrice: 200, isVeg: true, stockQty: 100, status: "active" },
    { title: "Harpic Disinfectant Floor Cleaner", brand: "Harpic", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Floor Cleaners", packSize: "1 L", mrp: 220, sellingPrice: 210, isVeg: true, stockQty: 100, status: "active" },
    { title: "Colin Floor Cleaner", brand: "Colin", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Floor Cleaners", packSize: "1 L", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Herbal Floor Cleaner", brand: "Patanjali", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Floor Cleaners", packSize: "1 L", mrp: 160, sellingPrice: 150, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mr Muscle Floor Cleaner", brand: "Mr Muscle", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Floor Cleaners", packSize: "1 L", mrp: 230, sellingPrice: 220, isVeg: true, stockQty: 100, status: "active" },
    /* Glass Cleaners */
    { title: "Colin Glass & Surface Cleaner", brand: "Colin", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Glass Cleaners", packSize: "500 ml", mrp: 120, sellingPrice: 115, isVeg: true, stockQty: 100, status: "active" },
    { title: "Wipro Safewash Glass Cleaner", brand: "Wipro", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Glass Cleaners", packSize: "500 ml", mrp: 125, sellingPrice: 120, isVeg: true, stockQty: 100, status: "active" },
    { title: "Scotch-Brite Glass Cleaner", brand: "Scotch-Brite", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Glass Cleaners", packSize: "500 ml", mrp: 130, sellingPrice: 125, isVeg: true, stockQty: 100, status: "active" },
    { title: "IFB Essential Glass Cleaner", brand: "IFB", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Glass Cleaners", packSize: "500 ml", mrp: 140, sellingPrice: 135, isVeg: true, stockQty: 100, status: "active" },
    { title: "Astonish Glass Cleaner", brand: "Astonish", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Glass Cleaners", packSize: "750 ml", mrp: 220, sellingPrice: 210, isVeg: true, stockQty: 100, status: "active" },
    /* Kitchen Cleaners */
    { title: "Mr Muscle Kitchen Cleaner", brand: "Mr Muscle", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Kitchen Cleaners", packSize: "500 ml", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cif Cream Kitchen Cleaner", brand: "Cif", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Kitchen Cleaners", packSize: "500 ml", mrp: 170, sellingPrice: 160, isVeg: true, stockQty: 100, status: "active" },
    { title: "Vim Kitchen Cleaner", brand: "Vim", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Kitchen Cleaners", packSize: "500 ml", mrp: 160, sellingPrice: 150, isVeg: true, stockQty: 100, status: "active" },
    { title: "Patanjali Kitchen Cleaner", brand: "Patanjali", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Kitchen Cleaners", packSize: "500 ml", mrp: 140, sellingPrice: 130, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ezee Kitchen Cleaner Spray", brand: "Ezee", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Kitchen Cleaners", packSize: "500 ml", mrp: 150, sellingPrice: 145, isVeg: true, stockQty: 100, status: "active" },
    /* Fabric Care */
    { title: "Comfort Blue Fabric Conditioner", brand: "Comfort", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Fabric Care", packSize: "860 ml", mrp: 240, sellingPrice: 230, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ezee Liquid Detergent", brand: "Ezee", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Fabric Care", packSize: "500 ml", mrp: 110, sellingPrice: 105, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ujala Supreme Liquid", brand: "Ujala", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Fabric Care", packSize: "250 ml", mrp: 95, sellingPrice: 90, isVeg: true, stockQty: 100, status: "active" },
    { title: "Comfort Morning Fresh Fabric Conditioner", brand: "Comfort", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Fabric Care", packSize: "860 ml", mrp: 250, sellingPrice: 240, isVeg: true, stockQty: 100, status: "active" },
    { title: "Godrej Fab Fabric Conditioner", brand: "Godrej Fab", categoryId: "697095c1266f3a88165e3d3b", subCategory: "Fabric Care", packSize: "1 L", mrp: 260, sellingPrice: 250, isVeg: true, stockQty: 100, status: "active" },

    /* ===== Baby Care (50 Products) ===== */
    /* Diapers & Wipes */
    { title: "Pampers Baby Dry Pants", brand: "Pampers", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Diapers & Wipes", packSize: "L – 44 pcs", mrp: 899, sellingPrice: 860, isVeg: true, stockQty: 100, status: "active" },
    { title: "Huggies Wonder Pants", brand: "Huggies", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Diapers & Wipes", packSize: "M – 42 pcs", mrp: 899, sellingPrice: 865, isVeg: true, stockQty: 100, status: "active" },
    { title: "MamyPoko Pants Extra Absorb", brand: "MamyPoko", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Diapers & Wipes", packSize: "XL – 38 pcs", mrp: 999, sellingPrice: 960, isVeg: true, stockQty: 100, status: "active" },
    { title: "Johnson’s Baby Wipes", brand: "Johnson’s", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Diapers & Wipes", packSize: "72 wipes", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mee Mee Gentle Baby Wipes", brand: "Mee Mee", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Diapers & Wipes", packSize: "72 wipes", mrp: 189, sellingPrice: 175, isVeg: true, stockQty: 100, status: "active" },
    /* Baby Food */
    { title: "Cerelac Wheat Apple Baby Cereal", brand: "Nestle", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Food", packSize: "300 g", mrp: 285, sellingPrice: 270, isVeg: true, stockQty: 100, status: "active" },
    { title: "Dexolac Stage 2 Follow-up Formula", brand: "Dexolac", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Food", packSize: "400 g", mrp: 520, sellingPrice: 500, isVeg: true, stockQty: 100, status: "active" },
    { title: "Nestum Rice & Vegetable Cereal", brand: "Nestle", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Food", packSize: "300 g", mrp: 250, sellingPrice: 235, isVeg: true, stockQty: 100, status: "active" },
    { title: "Slurrp Farm Ragi Banana Cereal", brand: "Slurrp Farm", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Food", packSize: "250 g", mrp: 349, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    { title: "Early Foods Multigrain Baby Cereal", brand: "Early Foods", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Food", packSize: "250 g", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    /* Baby Skincare */
    { title: "Johnson’s Baby Cream", brand: "Johnson’s", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Skincare", packSize: "100 g", mrp: 165, sellingPrice: 155, isVeg: true, stockQty: 100, status: "active" },
    { title: "Himalaya Baby Cream", brand: "Himalaya", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Skincare", packSize: "100 ml", mrp: 160, sellingPrice: 150, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sebamed Baby Protective Facial Cream", brand: "Sebamed", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Skincare", packSize: "50 ml", mrp: 525, sellingPrice: 500, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mamaearth Moisturizing Baby Lotion", brand: "Mamaearth", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Skincare", packSize: "200 ml", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cetaphil Baby Daily Lotion", brand: "Cetaphil", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Skincare", packSize: "200 ml", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    /* Baby Bath */
    { title: "Johnson’s Baby Top to Toe Wash", brand: "Johnson’s", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Bath", packSize: "200 ml", mrp: 199, sellingPrice: 189, isVeg: true, stockQty: 100, status: "active" },
    { title: "Himalaya Gentle Baby Wash", brand: "Himalaya", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Bath", packSize: "200 ml", mrp: 185, sellingPrice: 175, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sebamed Baby Wash Extra Soft", brand: "Sebamed", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Bath", packSize: "200 ml", mrp: 525, sellingPrice: 500, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mamaearth Milky Soft Baby Wash", brand: "Mamaearth", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Bath", packSize: "400 ml", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Chicco Baby Moments Bath Shampoo", brand: "Chicco", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Bath", packSize: "200 ml", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    /* Baby Oil */
    { title: "Johnson’s Baby Oil", brand: "Johnson’s", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Oil", packSize: "200 ml", mrp: 170, sellingPrice: 160, isVeg: true, stockQty: 100, status: "active" },
    { title: "Himalaya Baby Massage Oil", brand: "Himalaya", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Oil", packSize: "200 ml", mrp: 190, sellingPrice: 180, isVeg: true, stockQty: 100, status: "active" },
    { title: "Dabur Lal Tail Baby Massage Oil", brand: "Dabur", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Oil", packSize: "200 ml", mrp: 175, sellingPrice: 165, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sebamed Baby Massage Oil", brand: "Sebamed", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Oil", packSize: "150 ml", mrp: 575, sellingPrice: 550, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mamaearth Soothing Baby Oil", brand: "Mamaearth", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Oil", packSize: "200 ml", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    /* Baby Powder */
    { title: "Johnson’s Baby Powder", brand: "Johnson’s", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Powder", packSize: "200 g", mrp: 170, sellingPrice: 160, isVeg: true, stockQty: 100, status: "active" },
    { title: "Himalaya Baby Powder", brand: "Himalaya", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Powder", packSize: "200 g", mrp: 165, sellingPrice: 155, isVeg: true, stockQty: 100, status: "active" },
    { title: "Chicco Baby Moments Talcum Powder", brand: "Chicco", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Powder", packSize: "150 g", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mee Mee Baby Powder", brand: "Mee Mee", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Powder", packSize: "200 g", mrp: 150, sellingPrice: 140, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sebamed Baby Powder", brand: "Sebamed", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Powder", packSize: "200 g", mrp: 475, sellingPrice: 450, isVeg: true, stockQty: 100, status: "active" },
    /* Baby Accessories */
    { title: "Mee Mee Baby Nail Clipper", brand: "Mee Mee", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Accessories", packSize: "1 unit", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Chicco Baby Grooming Kit", brand: "Chicco", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Accessories", packSize: "1 set", mrp: 599, sellingPrice: 570, isVeg: true, stockQty: 100, status: "active" },
    { title: "Philips Avent Baby Nail Trimmer", brand: "Philips Avent", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Accessories", packSize: "1 unit", mrp: 799, sellingPrice: 760, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mee Mee Baby Comb & Brush Set", brand: "Mee Mee", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Accessories", packSize: "1 set", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Farlin Baby Safety Scissors", brand: "Farlin", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Accessories", packSize: "1 unit", mrp: 249, sellingPrice: 235, isVeg: true, stockQty: 100, status: "active" },
    /* Feeding Bottles */
    { title: "Philips Avent Feeding Bottle", brand: "Philips Avent", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Feeding Bottles", packSize: "125 ml", mrp: 475, sellingPrice: 450, isVeg: true, stockQty: 100, status: "active" },
    { title: "Chicco Natural Feeling Feeding Bottle", brand: "Chicco", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Feeding Bottles", packSize: "150 ml", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mee Mee Premium Feeding Bottle", brand: "Mee Mee", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Feeding Bottles", packSize: "150 ml", mrp: 249, sellingPrice: 235, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pigeon Peristaltic Feeding Bottle", brand: "Pigeon", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Feeding Bottles", packSize: "120 ml", mrp: 325, sellingPrice: 310, isVeg: true, stockQty: 100, status: "active" },
    { title: "Dr. Brown’s Natural Flow Bottle", brand: "Dr. Brown’s", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Feeding Bottles", packSize: "120 ml", mrp: 599, sellingPrice: 570, isVeg: true, stockQty: 100, status: "active" },
    /* Baby Oral Care */
    { title: "Chicco Baby Toothpaste Strawberry", brand: "Chicco", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Oral Care", packSize: "50 g", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mamaearth Kids Toothpaste", brand: "Mamaearth", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Oral Care", packSize: "50 g", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mee Mee Baby Toothbrush", brand: "Mee Mee", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Oral Care", packSize: "1 unit", mrp: 149, sellingPrice: 140, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pigeon Training Toothbrush Set", brand: "Pigeon", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Oral Care", packSize: "3 pcs", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Dr. Brown’s Baby Toothbrush", brand: "Dr. Brown’s", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Oral Care", packSize: "1 unit", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    /* Baby Detergents */
    { title: "Ujala Baby Laundry Liquid", brand: "Ujala", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Detergents", packSize: "500 ml", mrp: 220, sellingPrice: 210, isVeg: true, stockQty: 100, status: "active" },
    { title: "Mee Mee Baby Laundry Detergent", brand: "Mee Mee", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Detergents", packSize: "500 ml", mrp: 249, sellingPrice: 235, isVeg: true, stockQty: 100, status: "active" },
    { title: "Chicco Baby Laundry Detergent", brand: "Chicco", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Detergents", packSize: "1 L", mrp: 499, sellingPrice: 475, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pigeon Baby Laundry Liquid", brand: "Pigeon", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Detergents", packSize: "500 ml", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Godrej Ezee Baby Liquid Detergent", brand: "Godrej Ezee", categoryId: "697095c1266f3a88165e3d4f", subCategory: "Baby Detergents", packSize: "500 ml", mrp: 230, sellingPrice: 220, isVeg: true, stockQty: 100, status: "active" },

    /* ===== Kitchen & Dining (50 Products) ===== */
    /* Cookware */
    { title: "Prestige Omega Deluxe Granite Fry Pan", brand: "Prestige", categoryId: "697095c1266f3a88165e3d59", subCategory: "Cookware", packSize: "24 cm", mrp: 1599, sellingPrice: 1499, isVeg: true, stockQty: 100, status: "active" },
    { title: "Hawkins Futura Non Stick Tawa", brand: "Hawkins", categoryId: "697095c1266f3a88165e3d59", subCategory: "Cookware", packSize: "26 cm", mrp: 1850, sellingPrice: 1750, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pigeon Aluminium Pressure Cooker", brand: "Pigeon", categoryId: "697095c1266f3a88165e3d59", subCategory: "Cookware", packSize: "3 L", mrp: 1799, sellingPrice: 1650, isVeg: true, stockQty: 100, status: "active" },
    { title: "Butterfly Stainless Steel Kadai", brand: "Butterfly", categoryId: "697095c1266f3a88165e3d59", subCategory: "Cookware", packSize: "24 cm", mrp: 1299, sellingPrice: 1199, isVeg: true, stockQty: 100, status: "active" },
    { title: "Vinod Platinum Triply Fry Pan", brand: "Vinod", categoryId: "697095c1266f3a88165e3d59", subCategory: "Cookware", packSize: "22 cm", mrp: 1999, sellingPrice: 1850, isVeg: true, stockQty: 100, status: "active" },
    /* Storage & Containers */
    { title: "Milton Air Tight Container Set", brand: "Milton", categoryId: "697095c1266f3a88165e3d59", subCategory: "Storage & Containers", packSize: "6 pcs", mrp: 899, sellingPrice: 850, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cello Plastic Storage Container", brand: "Cello", categoryId: "697095c1266f3a88165e3d59", subCategory: "Storage & Containers", packSize: "3 pcs", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tupperware Modular Mate Container", brand: "Tupperware", categoryId: "697095c1266f3a88165e3d59", subCategory: "Storage & Containers", packSize: "2 L", mrp: 699, sellingPrice: 660, isVeg: true, stockQty: 100, status: "active" },
    { title: "Lock & Lock Air Tight Container", brand: "Lock & Lock", categoryId: "697095c1266f3a88165e3d59", subCategory: "Storage & Containers", packSize: "1.5 L", mrp: 650, sellingPrice: 620, isVeg: true, stockQty: 100, status: "active" },
    { title: "Signoraware Storage Container Set", brand: "Signoraware", categoryId: "697095c1266f3a88165e3d59", subCategory: "Storage & Containers", packSize: "5 pcs", mrp: 750, sellingPrice: 710, isVeg: true, stockQty: 100, status: "active" },
    /* Bottles & Flasks */
    { title: "Milton Thermosteel Water Bottle", brand: "Milton", categoryId: "697095c1266f3a88165e3d59", subCategory: "Bottles & Flasks", packSize: "1 L", mrp: 1199, sellingPrice: 1099, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cello Puro Stainless Steel Bottle", brand: "Cello", categoryId: "697095c1266f3a88165e3d59", subCategory: "Bottles & Flasks", packSize: "900 ml", mrp: 699, sellingPrice: 650, isVeg: true, stockQty: 100, status: "active" },
    { title: "Borosi Glass Water Bottle", brand: "Borosi", categoryId: "697095c1266f3a88165e3d59", subCategory: "Bottles & Flasks", packSize: "1 L", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cello Thermoseal Flask", brand: "Cello", categoryId: "697095c1266f3a88165e3d59", subCategory: "Bottles & Flasks", packSize: "1 L", mrp: 999, sellingPrice: 950, isVeg: true, stockQty: 100, status: "active" },
    { title: "Milton Kool Insulated Bottle", brand: "Milton", categoryId: "697095c1266f3a88165e3d59", subCategory: "Bottles & Flasks", packSize: "900 ml", mrp: 850, sellingPrice: 800, isVeg: true, stockQty: 100, status: "active" },
    /* Tiffin Boxes */
    { title: "Milton Executive Lunch Box", brand: "Milton", categoryId: "697095c1266f3a88165e3d59", subCategory: "Tiffin Boxes", packSize: "3 containers", mrp: 799, sellingPrice: 750, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cello Max Fresh Lunch Box", brand: "Cello", categoryId: "697095c1266f3a88165e3d59", subCategory: "Tiffin Boxes", packSize: "4 containers", mrp: 699, sellingPrice: 660, isVeg: true, stockQty: 100, status: "active" },
    { title: "Signoraware Stainless Steel Lunch Box", brand: "Signoraware", categoryId: "697095c1266f3a88165e3d59", subCategory: "Tiffin Boxes", packSize: "3 containers", mrp: 899, sellingPrice: 850, isVeg: true, stockQty: 100, status: "active" },
    { title: "Milton Thermoware Lunch Box", brand: "Milton", categoryId: "697095c1266f3a88165e3d59", subCategory: "Tiffin Boxes", packSize: "3 containers", mrp: 1299, sellingPrice: 1199, isVeg: true, stockQty: 100, status: "active" },
    { title: "Jaypee Plus Lunch Box", brand: "Jaypee", categoryId: "697095c1266f3a88165e3d59", subCategory: "Tiffin Boxes", packSize: "3 containers", mrp: 599, sellingPrice: 560, isVeg: true, stockQty: 100, status: "active" },
    /* Dining & Serving */
    { title: "Corelle Vitrelle Dinner Set", brand: "Corelle", categoryId: "697095c1266f3a88165e3d59", subCategory: "Dining & Serving", packSize: "16 pcs", mrp: 5499, sellingPrice: 5199, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cello Opalware Dinner Set", brand: "Cello", categoryId: "697095c1266f3a88165e3d59", subCategory: "Dining & Serving", packSize: "18 pcs", mrp: 2499, sellingPrice: 2350, isVeg: true, stockQty: 100, status: "active" },
    { title: "La Opala Dinner Plate Set", brand: "La Opala", categoryId: "697095c1266f3a88165e3d59", subCategory: "Dining & Serving", packSize: "6 pcs", mrp: 1299, sellingPrice: 1200, isVeg: true, stockQty: 100, status: "active" },
    { title: "Borosil Glass Serving Bowl Set", brand: "Borosil", categoryId: "697095c1266f3a88165e3d59", subCategory: "Dining & Serving", packSize: "3 pcs", mrp: 899, sellingPrice: 850, isVeg: true, stockQty: 100, status: "active" },
    { title: "Milton Steel Serving Tray", brand: "Milton", categoryId: "697095c1266f3a88165e3d59", subCategory: "Dining & Serving", packSize: "1 unit", mrp: 599, sellingPrice: 560, isVeg: true, stockQty: 100, status: "active" },
    /* Cutlery */
    { title: "Vinod Stainless Steel Spoon Set", brand: "Vinod", categoryId: "697095c1266f3a88165e3d59", subCategory: "Cutlery", packSize: "6 pcs", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "Milton Stainless Steel Fork Set", brand: "Milton", categoryId: "697095c1266f3a88165e3d59", subCategory: "Cutlery", packSize: "6 pcs", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Cello Stainless Steel Knife Set", brand: "Cello", categoryId: "697095c1266f3a88165e3d59", subCategory: "Cutlery", packSize: "6 pcs", mrp: 349, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amazon Solimo Cutlery Set", brand: "Amazon Solimo", categoryId: "697095c1266f3a88165e3d59", subCategory: "Cutlery", packSize: "24 pcs", mrp: 999, sellingPrice: 950, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tramontina Stainless Steel Cutlery", brand: "Tramontina", categoryId: "697095c1266f3a88165e3d59", subCategory: "Cutlery", packSize: "12 pcs", mrp: 1299, sellingPrice: 1200, isVeg: true, stockQty: 100, status: "active" },
    /* Kitchen Tools */
    { title: "Prestige Stainless Steel Ladle Set", brand: "Prestige", categoryId: "697095c1266f3a88165e3d59", subCategory: "Kitchen Tools", packSize: "5 pcs", mrp: 699, sellingPrice: 660, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pigeon Kitchen Tool Set", brand: "Pigeon", categoryId: "697095c1266f3a88165e3d59", subCategory: "Kitchen Tools", packSize: "6 pcs", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "Solimo Silicone Spatula Set", brand: "Solimo", categoryId: "697095c1266f3a88165e3d59", subCategory: "Kitchen Tools", packSize: "4 pcs", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "IKEA Koncis Garlic Press", brand: "IKEA", categoryId: "697095c1266f3a88165e3d59", subCategory: "Kitchen Tools", packSize: "1 unit", mrp: 349, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    { title: "Borosil Measuring Cup Set", brand: "Borosil", categoryId: "697095c1266f3a88165e3d59", subCategory: "Kitchen Tools", packSize: "4 pcs", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    /* Bakeware */
    { title: "Prestige Non Stick Baking Tray", brand: "Prestige", categoryId: "697095c1266f3a88165e3d59", subCategory: "Bakeware", packSize: "30 cm", mrp: 899, sellingPrice: 850, isVeg: true, stockQty: 100, status: "active" },
    { title: "Borosil Glass Baking Dish", brand: "Borosil", categoryId: "697095c1266f3a88165e3d59", subCategory: "Bakeware", packSize: "2 L", mrp: 1099, sellingPrice: 1020, isVeg: true, stockQty: 100, status: "active" },
    { title: "Wilton Muffin Tray", brand: "Wilton", categoryId: "697095c1266f3a88165e3d59", subCategory: "Bakeware", packSize: "12 cups", mrp: 1299, sellingPrice: 1200, isVeg: true, stockQty: 100, status: "active" },
    { title: "Chef’s Basket Silicone Baking Mat", brand: "Chef’s Basket", categoryId: "697095c1266f3a88165e3d59", subCategory: "Bakeware", packSize: "1 unit", mrp: 699, sellingPrice: 660, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amazon Solimo Cake Mould", brand: "Amazon Solimo", categoryId: "697095c1266f3a88165e3d59", subCategory: "Bakeware", packSize: "9 inch", mrp: 599, sellingPrice: 560, isVeg: true, stockQty: 100, status: "active" },
    /* Gas Stoves */
    { title: "Prestige Marvel Plus Gas Stove", brand: "Prestige", categoryId: "697095c1266f3a88165e3d59", subCategory: "Gas Stoves", packSize: "2 burner", mrp: 2999, sellingPrice: 2799, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sunflame Crystal Gas Stove", brand: "Sunflame", categoryId: "697095c1266f3a88165e3d59", subCategory: "Gas Stoves", packSize: "3 burner", mrp: 5499, sellingPrice: 5200, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pigeon Blackline Gas Stove", brand: "Pigeon", categoryId: "697095c1266f3a88165e3d59", subCategory: "Gas Stoves", packSize: "2 burner", mrp: 2699, sellingPrice: 2500, isVeg: true, stockQty: 100, status: "active" },
    { title: "Butterfly Smart Glass Gas Stove", brand: "Butterfly", categoryId: "697095c1266f3a88165e3d59", subCategory: "Gas Stoves", packSize: "3 burner", mrp: 5799, sellingPrice: 5500, isVeg: true, stockQty: 100, status: "active" },
    { title: "Elica Flexi Gas Stove", brand: "Elica", categoryId: "697095c1266f3a88165e3d59", subCategory: "Gas Stoves", packSize: "4 burner", mrp: 8999, sellingPrice: 8500, isVeg: true, stockQty: 100, status: "active" },
    /* Pressure Cookers */
    { title: "Hawkins Classic Pressure Cooker", brand: "Hawkins", categoryId: "697095c1266f3a88165e3d59", subCategory: "Pressure Cookers", packSize: "3 L", mrp: 1899, sellingPrice: 1750, isVeg: true, stockQty: 100, status: "active" },
    { title: "Prestige Popular Aluminium Cooker", brand: "Prestige", categoryId: "697095c1266f3a88165e3d59", subCategory: "Pressure Cookers", packSize: "5 L", mrp: 2199, sellingPrice: 2050, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pigeon by Stovekraft Cooker", brand: "Pigeon", categoryId: "697095c1266f3a88165e3d59", subCategory: "Pressure Cookers", packSize: "3 L", mrp: 1699, sellingPrice: 1550, isVeg: true, stockQty: 100, status: "active" },
    { title: "Butterfly Rapid Pressure Cooker", brand: "Butterfly", categoryId: "697095c1266f3a88165e3d59", subCategory: "Pressure Cookers", packSize: "4 L", mrp: 1999, sellingPrice: 1850, isVeg: true, stockQty: 100, status: "active" },
    { title: "Prestige Deluxe Alpha Cooker", brand: "Prestige", categoryId: "697095c1266f3a88165e3d59", subCategory: "Pressure Cookers", packSize: "3 L", mrp: 2299, sellingPrice: 2150, isVeg: true, stockQty: 100, status: "active" },

    /* ===== Pet Care (40+ Products) ===== */
    /* Dog Food */
    { title: "Pedigree Adult Dry Dog Food Chicken & Veg", brand: "Pedigree", categoryId: "697095c1266f3a88165e3d63", subCategory: "Dog Food", packSize: "3 kg", mrp: 899, sellingPrice: 860, isVeg: false, stockQty: 100, status: "active" },
    { title: "Drools Adult Dog Food Chicken", brand: "Drools", categoryId: "697095c1266f3a88165e3d63", subCategory: "Dog Food", packSize: "3 kg", mrp: 799, sellingPrice: 760, isVeg: false, stockQty: 100, status: "active" },
    { title: "Royal Canin Maxi Adult Dog Food", brand: "Royal Canin", categoryId: "697095c1266f3a88165e3d63", subCategory: "Dog Food", packSize: "4 kg", mrp: 3299, sellingPrice: 3150, isVeg: false, stockQty: 100, status: "active" },
    { title: "Purepet Chicken & Veg Dog Food", brand: "Purepet", categoryId: "697095c1266f3a88165e3d63", subCategory: "Dog Food", packSize: "3 kg", mrp: 699, sellingPrice: 660, isVeg: false, stockQty: 100, status: "active" },
    { title: "Chappi Adult Dog Food", brand: "Chappi", categoryId: "697095c1266f3a88165e3d63", subCategory: "Dog Food", packSize: "2.8 kg", mrp: 629, sellingPrice: 600, isVeg: false, stockQty: 100, status: "active" },
    /* Cat Food */
    { title: "Whiskas Adult Cat Food Ocean Fish", brand: "Whiskas", categoryId: "697095c1266f3a88165e3d63", subCategory: "Cat Food", packSize: "1.2 kg", mrp: 549, sellingPrice: 525, isVeg: false, stockQty: 100, status: "active" },
    { title: "Me-O Adult Dry Cat Food", brand: "Me-O", categoryId: "697095c1266f3a88165e3d63", subCategory: "Cat Food", packSize: "1.1 kg", mrp: 499, sellingPrice: 475, isVeg: false, stockQty: 100, status: "active" },
    { title: "Royal Canin Persian Adult Cat Food", brand: "Royal Canin", categoryId: "697095c1266f3a88165e3d63", subCategory: "Cat Food", packSize: "2 kg", mrp: 2199, sellingPrice: 2100, isVeg: false, stockQty: 100, status: "active" },
    { title: "Drools Dry Cat Food Ocean Fish", brand: "Drools", categoryId: "697095c1266f3a88165e3d63", subCategory: "Cat Food", packSize: "1.2 kg", mrp: 499, sellingPrice: 470, isVeg: false, stockQty: 100, status: "active" },
    { title: "Purepet Adult Cat Food", brand: "Purepet", categoryId: "697095c1266f3a88165e3d63", subCategory: "Cat Food", packSize: "1 kg", mrp: 399, sellingPrice: 380, isVeg: false, stockQty: 100, status: "active" },
    /* Pet Accessories */
    { title: "Pets Company Dog Collar", brand: "Pets Company", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Accessories", packSize: "Medium", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    { title: "Heads Up For Tails Dog Leash", brand: "HUFT", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Accessories", packSize: "1 unit", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "Savic Plastic Pet Bowl", brand: "Savic", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Accessories", packSize: "500 ml", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amazon Basics Pet Feeding Bowl", brand: "Amazon Basics", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Accessories", packSize: "1 unit", mrp: 349, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    { title: "Trixie Dog Harness", brand: "Trixie", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Accessories", packSize: "Medium", mrp: 899, sellingPrice: 850, isVeg: true, stockQty: 100, status: "active" },
    /* Pet Grooming */
    { title: "Wahl Dog Shampoo Oatmeal Formula", brand: "Wahl", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Grooming", packSize: "500 ml", mrp: 599, sellingPrice: 570, isVeg: true, stockQty: 100, status: "active" },
    { title: "Pet Head Puppy Fun Shampoo", brand: "Pet Head", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Grooming", packSize: "475 ml", mrp: 699, sellingPrice: 660, isVeg: true, stockQty: 100, status: "active" },
    { title: "Himalaya Erina EP Tick & Flea Shampoo", brand: "Himalaya", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Grooming", packSize: "200 ml", mrp: 210, sellingPrice: 200, isVeg: true, stockQty: 100, status: "active" },
    { title: "Captain Zack Barking Up The Tree Shampoo", brand: "Captain Zack", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Grooming", packSize: "200 ml", mrp: 349, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    { title: "Petlogix Dog Conditioner", brand: "Petlogix", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Grooming", packSize: "200 ml", mrp: 299, sellingPrice: 285, isVeg: true, stockQty: 100, status: "active" },
    /* Pet Toys */
    { title: "KONG Classic Rubber Dog Toy", brand: "KONG", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Toys", packSize: "Medium", mrp: 899, sellingPrice: 850, isVeg: true, stockQty: 100, status: "active" },
    { title: "Trixie Rope Dog Toy", brand: "Trixie", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Toys", packSize: "1 unit", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    { title: "SmartyKat Catnip Toy", brand: "SmartyKat", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Toys", packSize: "2 pcs", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amazon Basics Dog Chew Toy", brand: "Amazon Basics", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Toys", packSize: "1 unit", mrp: 349, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    { title: "HUFT Squeaky Dog Toy", brand: "HUFT", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Toys", packSize: "1 unit", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    /* Fish Food */
    { title: "Taiyo Pluss Discovery Fish Food", brand: "Taiyo", categoryId: "697095c1266f3a88165e3d63", subCategory: "Fish Food", packSize: "100 g", mrp: 150, sellingPrice: 140, isVeg: true, stockQty: 100, status: "active" },
    { title: "Optimum Micro Pellet Fish Food", brand: "Optimum", categoryId: "697095c1266f3a88165e3d63", subCategory: "Fish Food", packSize: "50 g", mrp: 120, sellingPrice: 110, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sera Goldy Fish Food", brand: "Sera", categoryId: "697095c1266f3a88165e3d63", subCategory: "Fish Food", packSize: "250 ml", mrp: 450, sellingPrice: 430, isVeg: true, stockQty: 100, status: "active" },
    { title: "Hikari Tropical Micro Pellets", brand: "Hikari", categoryId: "697095c1266f3a88165e3d63", subCategory: "Fish Food", packSize: "45 g", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Boltz Freeze Dried Fish Food", brand: "Boltz", categoryId: "697095c1266f3a88165e3d63", subCategory: "Fish Food", packSize: "20 g", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    /* Bird Food */
    { title: "Vitapol Budgie Food", brand: "Vitapol", categoryId: "697095c1266f3a88165e3d63", subCategory: "Bird Food", packSize: "500 g", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    { title: "Boltz Parrot Food Mix", brand: "Boltz", categoryId: "697095c1266f3a88165e3d63", subCategory: "Bird Food", packSize: "1 kg", mrp: 450, sellingPrice: 430, isVeg: true, stockQty: 100, status: "active" },
    { title: "Versele-Laga Canary Food", brand: "Versele-Laga", categoryId: "697095c1266f3a88165e3d63", subCategory: "Bird Food", packSize: "500 g", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "Petslife Bird Seed Mix", brand: "Petslife", categoryId: "697095c1266f3a88165e3d63", subCategory: "Bird Food", packSize: "800 g", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "ZuPreem FruitBlend Bird Food", brand: "ZuPreem", categoryId: "697095c1266f3a88165e3d63", subCategory: "Bird Food", packSize: "1 kg", mrp: 999, sellingPrice: 950, isVeg: true, stockQty: 100, status: "active" },
    /* Small Animal Food */
    { title: "Vitapol Rabbit Food", brand: "Vitapol", categoryId: "697095c1266f3a88165e3d63", subCategory: "Small Animal Food", packSize: "1 kg", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "Boltz Hamster Food", brand: "Boltz", categoryId: "697095c1266f3a88165e3d63", subCategory: "Small Animal Food", packSize: "500 g", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    { title: "Versele-Laga Guinea Pig Food", brand: "Versele-Laga", categoryId: "697095c1266f3a88165e3d63", subCategory: "Small Animal Food", packSize: "800 g", mrp: 799, sellingPrice: 760, isVeg: true, stockQty: 100, status: "active" },
    { title: "Petslife Rabbit Pellet Food", brand: "Petslife", categoryId: "697095c1266f3a88165e3d63", subCategory: "Small Animal Food", packSize: "1 kg", mrp: 450, sellingPrice: 430, isVeg: true, stockQty: 100, status: "active" },
    { title: "ZuPreem Nature’s Promise Small Animal Food", brand: "ZuPreem", categoryId: "697095c1266f3a88165e3d63", subCategory: "Small Animal Food", packSize: "680 g", mrp: 899, sellingPrice: 850, isVeg: true, stockQty: 100, status: "active" },
    /* Pet Hygiene & Pet Health */
    { title: "Captain Zack Tick & Flea Spray", brand: "Captain Zack", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Hygiene", packSize: "100 ml", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Himalaya Erina EP Powder", brand: "Himalaya", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Hygiene", packSize: "100 g", mrp: 180, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    { title: "Beaphar Tick & Flea Shampoo", brand: "Beaphar", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Hygiene", packSize: "200 ml", mrp: 599, sellingPrice: 570, isVeg: true, stockQty: 100, status: "active" },
    { title: "Drools Absolute Calcium Tablet", brand: "Drools", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Health", packSize: "110 tablets", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    { title: "Himalaya Immunol Pet Supplement", brand: "Himalaya", categoryId: "697095c1266f3a88165e3d63", subCategory: "Pet Health", packSize: "200 ml", mrp: 325, sellingPrice: 310, isVeg: true, stockQty: 100, status: "active" },

    /* ===== Meat, Fish & Poultry (40+ Products) ===== */
    /* Fresh Chicken */
    { title: "Licious Fresh Chicken Curry Cut", brand: "Licious", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Chicken", packSize: "500 g", mrp: 299, sellingPrice: 285, isVeg: false, stockQty: 100, status: "active" },
    { title: "FreshToHome Chicken Curry Cut", brand: "FreshToHome", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Chicken", packSize: "500 g", mrp: 289, sellingPrice: 275, isVeg: false, stockQty: 100, status: "active" },
    { title: "ZappFresh Chicken Breast Boneless", brand: "ZappFresh", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Chicken", packSize: "450 g", mrp: 349, sellingPrice: 330, isVeg: false, stockQty: 100, status: "active" },
    { title: "Licious Chicken Drumsticks", brand: "Licious", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Chicken", packSize: "500 g", mrp: 329, sellingPrice: 315, isVeg: false, stockQty: 100, status: "active" },
    { title: "FreshToHome Country Chicken", brand: "FreshToHome", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Chicken", packSize: "700 g", mrp: 599, sellingPrice: 570, isVeg: false, stockQty: 100, status: "active" },
    /* Fresh Mutton */
    { title: "Licious Goat Curry Cut", brand: "Licious", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Mutton", packSize: "500 g", mrp: 749, sellingPrice: 720, isVeg: false, stockQty: 100, status: "active" },
    { title: "FreshToHome Goat Boneless", brand: "FreshToHome", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Mutton", packSize: "500 g", mrp: 799, sellingPrice: 770, isVeg: false, stockQty: 100, status: "active" },
    { title: "ZappFresh Lamb Curry Cut", brand: "ZappFresh", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Mutton", packSize: "500 g", mrp: 769, sellingPrice: 740, isVeg: false, stockQty: 100, status: "active" },
    { title: "Licious Lamb Shoulder Cut", brand: "Licious", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Mutton", packSize: "500 g", mrp: 829, sellingPrice: 800, isVeg: false, stockQty: 100, status: "active" },
    { title: "FreshToHome Goat Mince", brand: "FreshToHome", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Mutton", packSize: "450 g", mrp: 699, sellingPrice: 670, isVeg: false, stockQty: 100, status: "active" },
    /* Fresh Fish */
    { title: "Licious Rohu Fish Curry Cut", brand: "Licious", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Fish", packSize: "500 g", mrp: 349, sellingPrice: 330, isVeg: false, stockQty: 100, status: "active" },
    { title: "FreshToHome Seer Fish Slices", brand: "FreshToHome", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Fish", packSize: "500 g", mrp: 799, sellingPrice: 770, isVeg: false, stockQty: 100, status: "active" },
    { title: "Licious Basa Fillet", brand: "Licious", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Fish", packSize: "400 g", mrp: 399, sellingPrice: 380, isVeg: false, stockQty: 100, status: "active" },
    { title: "FreshToHome Pomfret Silver", brand: "FreshToHome", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Fish", packSize: "450 g", mrp: 899, sellingPrice: 860, isVeg: false, stockQty: 100, status: "active" },
    { title: "ZappFresh Catla Fish Cut", brand: "ZappFresh", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Fresh Fish", packSize: "500 g", mrp: 329, sellingPrice: 310, isVeg: false, stockQty: 100, status: "active" },
    /* Prawns & Crabs */
    { title: "Licious Jumbo Prawns", brand: "Licious", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Prawns & Crabs", packSize: "300 g", mrp: 499, sellingPrice: 475, isVeg: false, stockQty: 100, status: "active" },
    { title: "FreshToHome Tiger Prawns", brand: "FreshToHome", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Prawns & Crabs", packSize: "300 g", mrp: 549, sellingPrice: 520, isVeg: false, stockQty: 100, status: "active" },
    { title: "Licious Blue Crab", brand: "Licious", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Prawns & Crabs", packSize: "500 g", mrp: 699, sellingPrice: 670, isVeg: false, stockQty: 100, status: "active" },
    { title: "FreshToHome Mud Crab", brand: "FreshToHome", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Prawns & Crabs", packSize: "600 g", mrp: 899, sellingPrice: 860, isVeg: false, stockQty: 100, status: "active" },
    { title: "ZappFresh Medium Prawns", brand: "ZappFresh", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Prawns & Crabs", packSize: "300 g", mrp: 449, sellingPrice: 425, isVeg: false, stockQty: 100, status: "active" },
    /* Eggs (Non-Veg) */
    { title: "Keggs Farm Fresh Eggs", brand: "Keggs", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Eggs (Non-Veg)", packSize: "12 pcs", mrp: 95, sellingPrice: 90, isVeg: false, stockQty: 100, status: "active" },
    { title: "Eggoz Nutrition Eggs", brand: "Eggoz", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Eggs (Non-Veg)", packSize: "12 pcs", mrp: 110, sellingPrice: 105, isVeg: false, stockQty: 100, status: "active" },
    { title: "Fresho Brown Eggs", brand: "Fresho", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Eggs (Non-Veg)", packSize: "6 pcs", mrp: 70, sellingPrice: 65, isVeg: false, stockQty: 100, status: "active" },
    { title: "Licious Free Range Eggs", brand: "Licious", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Eggs (Non-Veg)", packSize: "6 pcs", mrp: 99, sellingPrice: 95, isVeg: false, stockQty: 100, status: "active" },
    { title: "Eggoz Country Eggs", brand: "Eggoz", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Eggs (Non-Veg)", packSize: "6 pcs", mrp: 120, sellingPrice: 115, isVeg: false, stockQty: 100, status: "active" },
    /* Frozen Meat */
    { title: "Prasuma Frozen Chicken Momos", brand: "Prasuma", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Frozen Meat", packSize: "250 g", mrp: 299, sellingPrice: 280, isVeg: false, stockQty: 100, status: "active" },
    { title: "ITC Master Chef Chicken Nuggets", brand: "ITC", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Frozen Meat", packSize: "400 g", mrp: 350, sellingPrice: 330, isVeg: false, stockQty: 100, status: "active" },
    { title: "Yummiez Chicken Sausages", brand: "Yummiez", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Frozen Meat", packSize: "500 g", mrp: 425, sellingPrice: 400, isVeg: false, stockQty: 100, status: "active" },
    { title: "Godrej Real Good Chicken Seekh Kebab", brand: "Godrej", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Frozen Meat", packSize: "300 g", mrp: 349, sellingPrice: 330, isVeg: false, stockQty: 100, status: "active" },
    { title: "Sumeru Chicken Spring Rolls", brand: "Sumeru", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Frozen Meat", packSize: "250 g", mrp: 275, sellingPrice: 260, isVeg: false, stockQty: 100, status: "active" },
    /* Dried Fish */
    { title: "Anjal Dry Fish (Sun Dried)", brand: "Coastal Catch", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Dried Fish", packSize: "200 g", mrp: 399, sellingPrice: 380, isVeg: false, stockQty: 100, status: "active" },
    { title: "Dry Bombil Fish", brand: "Konkan Delight", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Dried Fish", packSize: "250 g", mrp: 349, sellingPrice: 330, isVeg: false, stockQty: 100, status: "active" },
    { title: "Dry Prawns (Kolambi)", brand: "Malvan Gold", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Dried Fish", packSize: "150 g", mrp: 449, sellingPrice: 425, isVeg: false, stockQty: 100, status: "active" },
    { title: "Dry Anchovies (Natholi)", brand: "Coastal Catch", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Dried Fish", packSize: "200 g", mrp: 299, sellingPrice: 280, isVeg: false, stockQty: 100, status: "active" },
    { title: "Dry Bombay Duck Premium", brand: "Malvan Gold", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Dried Fish", packSize: "250 g", mrp: 399, sellingPrice: 380, isVeg: false, stockQty: 100, status: "active" },
    /* Marinades */
    { title: "Licious Peri Peri Chicken Marinade", brand: "Licious", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Marinades", packSize: "100 g", mrp: 99, sellingPrice: 95, isVeg: false, stockQty: 100, status: "active" },
    { title: "Prasuma Tandoori Chicken Marinade", brand: "Prasuma", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Marinades", packSize: "150 g", mrp: 120, sellingPrice: 115, isVeg: false, stockQty: 100, status: "active" },
    { title: "Del Monte Barbecue Marinade", brand: "Del Monte", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Marinades", packSize: "250 g", mrp: 199, sellingPrice: 185, isVeg: false, stockQty: 100, status: "active" },
    { title: "Wingreens Farms Peri Peri Marinade", brand: "Wingreens", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Marinades", packSize: "200 g", mrp: 225, sellingPrice: 210, isVeg: false, stockQty: 100, status: "active" },
    { title: "Weikfield Tandoori Marinade", brand: "Weikfield", categoryId: "697095c1266f3a88165e3d6d", subCategory: "Marinades", packSize: "200 g", mrp: 189, sellingPrice: 175, isVeg: false, stockQty: 100, status: "active" },

    /* ===== Gourmet & World Food (50+ Products) ===== */
    /* Oils & Vinegar */
    { title: "Figaro Extra Virgin Olive Oil", brand: "Figaro", categoryId: "697095c1266f3a88165e3d77", subCategory: "Oils & Vinegar", packSize: "500 ml", mrp: 899, sellingPrice: 860, isVeg: true, stockQty: 100, status: "active" },
    { title: "Borges Extra Light Olive Oil", brand: "Borges", categoryId: "697095c1266f3a88165e3d77", subCategory: "Oils & Vinegar", packSize: "1 L", mrp: 1599, sellingPrice: 1520, isVeg: true, stockQty: 100, status: "active" },
    { title: "Leonardi Balsamic Vinegar of Modena", brand: "Leonardi", categoryId: "697095c1266f3a88165e3d77", subCategory: "Oils & Vinegar", packSize: "250 ml", mrp: 699, sellingPrice: 660, isVeg: true, stockQty: 100, status: "active" },
    { title: "Colavita Extra Virgin Olive Oil", brand: "Colavita", categoryId: "697095c1266f3a88165e3d77", subCategory: "Oils & Vinegar", packSize: "500 ml", mrp: 999, sellingPrice: 950, isVeg: true, stockQty: 100, status: "active" },
    { title: "De Nigris Apple Cider Vinegar", brand: "De Nigris", categoryId: "697095c1266f3a88165e3d77", subCategory: "Oils & Vinegar", packSize: "500 ml", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    /* Dairy & Cheese */
    { title: "Galbani Mozzarella Cheese Block", brand: "Galbani", categoryId: "697095c1266f3a88165e3d77", subCategory: "Dairy & Cheese", packSize: "200 g", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Britannia Cheddar Cheese", brand: "Britannia", categoryId: "697095c1266f3a88165e3d77", subCategory: "Dairy & Cheese", packSize: "200 g", mrp: 349, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    { title: "President Emmental Cheese", brand: "President", categoryId: "697095c1266f3a88165e3d77", subCategory: "Dairy & Cheese", packSize: "150 g", mrp: 549, sellingPrice: 520, isVeg: true, stockQty: 100, status: "active" },
    { title: "Go Cheese Gouda Cheese Slices", brand: "Go Cheese", categoryId: "697095c1266f3a88165e3d77", subCategory: "Dairy & Cheese", packSize: "180 g", mrp: 325, sellingPrice: 310, isVeg: true, stockQty: 100, status: "active" },
    { title: "Amul Emmental Cheese", brand: "Amul", categoryId: "697095c1266f3a88165e3d77", subCategory: "Dairy & Cheese", packSize: "200 g", mrp: 475, sellingPrice: 450, isVeg: true, stockQty: 100, status: "active" },
    /* Snacks */
    { title: "Pringles Original Potato Chips", brand: "Pringles", categoryId: "697095c1266f3a88165e3d77", subCategory: "Snacks", packSize: "107 g", mrp: 179, sellingPrice: 170, isVeg: true, stockQty: 100, status: "active" },
    { title: "Doritos Nacho Cheese", brand: "Doritos", categoryId: "697095c1266f3a88165e3d77", subCategory: "Snacks", packSize: "150 g", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Ritz Original Crackers", brand: "Ritz", categoryId: "697095c1266f3a88165e3d77", subCategory: "Snacks", packSize: "200 g", mrp: 249, sellingPrice: 235, isVeg: true, stockQty: 100, status: "active" },
    { title: "Lays Gourmet Truffle Chips", brand: "Lays", categoryId: "697095c1266f3a88165e3d77", subCategory: "Snacks", packSize: "125 g", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tyrrells Sea Salt Crisps", brand: "Tyrrells", categoryId: "697095c1266f3a88165e3d77", subCategory: "Snacks", packSize: "150 g", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    /* Pasta & Sauces */
    { title: "Barilla Penne Rigate Pasta", brand: "Barilla", categoryId: "697095c1266f3a88165e3d77", subCategory: "Pasta & Sauces", packSize: "500 g", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Del Monte Spaghetti Pasta", brand: "Del Monte", categoryId: "697095c1266f3a88165e3d77", subCategory: "Pasta & Sauces", packSize: "500 g", mrp: 175, sellingPrice: 165, isVeg: true, stockQty: 100, status: "active" },
    { title: "Barilla Basilico Pasta Sauce", brand: "Barilla", categoryId: "697095c1266f3a88165e3d77", subCategory: "Pasta & Sauces", packSize: "400 g", mrp: 349, sellingPrice: 330, isVeg: true, stockQty: 100, status: "active" },
    { title: "Sacla Pesto Genovese Sauce", brand: "Sacla", categoryId: "697095c1266f3a88165e3d77", subCategory: "Pasta & Sauces", packSize: "190 g", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Knorr Arrabbiata Pasta Sauce", brand: "Knorr", categoryId: "697095c1266f3a88165e3d77", subCategory: "Pasta & Sauces", packSize: "325 g", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    /* Cereals & Granola */
    { title: "Kellogg’s Special K Original", brand: "Kellogg’s", categoryId: "697095c1266f3a88165e3d77", subCategory: "Cereals & Granola", packSize: "500 g", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Bagrry’s Crunchy Muesli Fruits & Nuts", brand: "Bagrry’s", categoryId: "697095c1266f3a88165e3d77", subCategory: "Cereals & Granola", packSize: "500 g", mrp: 450, sellingPrice: 425, isVeg: true, stockQty: 100, status: "active" },
    { title: "Yoga Bar Dark Chocolate Granola", brand: "Yoga Bar", categoryId: "697095c1266f3a88165e3d77", subCategory: "Cereals & Granola", packSize: "400 g", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "True Elements Whole Oat Granola", brand: "True Elements", categoryId: "697095c1266f3a88165e3d77", subCategory: "Cereals & Granola", packSize: "500 g", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "McCain Oat Crunch Granola", brand: "McCain", categoryId: "697095c1266f3a88165e3d77", subCategory: "Cereals & Granola", packSize: "375 g", mrp: 375, sellingPrice: 355, isVeg: true, stockQty: 100, status: "active" },
    /* Chocolates & Biscuits */
    { title: "Ferrero Rocher Chocolate Box", brand: "Ferrero Rocher", categoryId: "697095c1266f3a88165e3d77", subCategory: "Chocolates & Biscuits", packSize: "16 pcs", mrp: 799, sellingPrice: 760, isVeg: true, stockQty: 100, status: "active" },
    { title: "Lindt Excellence Dark Chocolate 70%", brand: "Lindt", categoryId: "697095c1266f3a88165e3d77", subCategory: "Chocolates & Biscuits", packSize: "100 g", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tim Tam Original Chocolate Biscuits", brand: "Tim Tam", categoryId: "697095c1266f3a88165e3d77", subCategory: "Chocolates & Biscuits", packSize: "200 g", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    { title: "Toblerone Milk Chocolate", brand: "Toblerone", categoryId: "697095c1266f3a88165e3d77", subCategory: "Chocolates & Biscuits", packSize: "100 g", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    { title: "McVitie’s Digestive Biscuits", brand: "McVitie’s", categoryId: "697095c1266f3a88165e3d77", subCategory: "Chocolates & Biscuits", packSize: "400 g", mrp: 249, sellingPrice: 235, isVeg: true, stockQty: 100, status: "active" },
    /* Sauces & Condiments */
    { title: "Heinz Yellow Mustard Sauce", brand: "Heinz", categoryId: "697095c1266f3a88165e3d77", subCategory: "Sauces & Condiments", packSize: "220 g", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Lee Kum Kee Soy Sauce", brand: "Lee Kum Kee", categoryId: "697095c1266f3a88165e3d77", subCategory: "Sauces & Condiments", packSize: "500 ml", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    { title: "Tabasco Original Red Sauce", brand: "Tabasco", categoryId: "697095c1266f3a88165e3d77", subCategory: "Sauces & Condiments", packSize: "60 ml", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Kikkoman Naturally Brewed Soy Sauce", brand: "Kikkoman", categoryId: "697095c1266f3a88165e3d77", subCategory: "Sauces & Condiments", packSize: "250 ml", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "French’s Classic Worcestershire Sauce", brand: "French’s", categoryId: "697095c1266f3a88165e3d77", subCategory: "Sauces & Condiments", packSize: "295 ml", mrp: 299, sellingPrice: 280, isVeg: true, stockQty: 100, status: "active" },
    /* Beverages */
    { title: "San Pellegrino Sparkling Water", brand: "San Pellegrino", categoryId: "697095c1266f3a88165e3d77", subCategory: "Beverages", packSize: "750 ml", mrp: 249, sellingPrice: 235, isVeg: true, stockQty: 100, status: "active" },
    { title: "Perrier Natural Sparkling Water", brand: "Perrier", categoryId: "697095c1266f3a88165e3d77", subCategory: "Beverages", packSize: "330 ml", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "Monin Vanilla Syrup", brand: "Monin", categoryId: "697095c1266f3a88165e3d77", subCategory: "Beverages", packSize: "250 ml", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "Twinings English Breakfast Tea", brand: "Twinings", categoryId: "697095c1266f3a88165e3d77", subCategory: "Beverages", packSize: "100 g", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Davidoff Rich Aroma Coffee", brand: "Davidoff", categoryId: "697095c1266f3a88165e3d77", subCategory: "Beverages", packSize: "100 g", mrp: 549, sellingPrice: 520, isVeg: true, stockQty: 100, status: "active" },
    /* Baking Needs */
    { title: "Weikfield Baking Powder", brand: "Weikfield", categoryId: "697095c1266f3a88165e3d77", subCategory: "Baking Needs", packSize: "100 g", mrp: 85, sellingPrice: 80, isVeg: true, stockQty: 100, status: "active" },
    { title: "Hershey’s Cocoa Powder", brand: "Hershey’s", categoryId: "697095c1266f3a88165e3d77", subCategory: "Baking Needs", packSize: "200 g", mrp: 399, sellingPrice: 380, isVeg: true, stockQty: 100, status: "active" },
    { title: "Urban Platter Baking Chocolate Chips", brand: "Urban Platter", categoryId: "697095c1266f3a88165e3d77", subCategory: "Baking Needs", packSize: "250 g", mrp: 499, sellingPrice: 470, isVeg: true, stockQty: 100, status: "active" },
    { title: "Blue Bird Baking Soda", brand: "Blue Bird", categoryId: "697095c1266f3a88165e3d77", subCategory: "Baking Needs", packSize: "100 g", mrp: 75, sellingPrice: 70, isVeg: true, stockQty: 100, status: "active" },
    { title: "Dr. Oetker Vanilla Essence", brand: "Dr. Oetker", categoryId: "697095c1266f3a88165e3d77", subCategory: "Baking Needs", packSize: "20 ml", mrp: 110, sellingPrice: 105, isVeg: true, stockQty: 100, status: "active" },
    /* Canned Food */
    { title: "Del Monte Sweet Corn Kernels", brand: "Del Monte", categoryId: "697095c1266f3a88165e3d77", subCategory: "Canned Food", packSize: "400 g", mrp: 175, sellingPrice: 165, isVeg: true, stockQty: 100, status: "active" },
    { title: "American Garden Baked Beans", brand: "American Garden", categoryId: "697095c1266f3a88165e3d77", subCategory: "Canned Food", packSize: "420 g", mrp: 199, sellingPrice: 185, isVeg: true, stockQty: 100, status: "active" },
    { title: "La Costeña Black Beans", brand: "La Costeña", categoryId: "697095c1266f3a88165e3d77", subCategory: "Canned Food", packSize: "560 g", mrp: 249, sellingPrice: 235, isVeg: true, stockQty: 100, status: "active" },
    { title: "Del Monte Pineapple Slices", brand: "Del Monte", categoryId: "697095c1266f3a88165e3d77", subCategory: "Canned Food", packSize: "435 g", mrp: 225, sellingPrice: 210, isVeg: true, stockQty: 100, status: "active" },
    { title: "Heinz Tomato Soup Can", brand: "Heinz", categoryId: "697095c1266f3a88165e3d77", subCategory: "Canned Food", packSize: "400 g", mrp: 175, sellingPrice: 165, isVeg: true, stockQty: 100, status: "active" }
];

async function seedProducts() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("❌ MONGODB_URI is not defined in .env");
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db("ecommerce"); // Ensure we use the correct DB name from URI or hardcode it if needed, but client.db() usually defaults to URI's db
        const categoriesCollection = db.collection("categories");
        const productsCollection = db.collection("products");
        const groceryProductsCollection = db.collection("grocery_products");
        const brandsCollection = db.collection("brands");

        // 1. Resolve Brands
        const uniqueBrandNames = [...new Set(productsData.map(p => p.brand))];
        const brandMap = {};

        for (const brandName of uniqueBrandNames) {
            let brand = await brandsCollection.findOne({ name: brandName, businessId: new ObjectId(businessId) });
            if (!brand) {
                console.log(`ℹ️ Creating brand: ${brandName}`);
                const res = await brandsCollection.insertOne({
                    name: brandName,
                    businessId: new ObjectId(businessId),
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                brandMap[brandName] = res.insertedId;
            } else {
                brandMap[brandName] = brand._id;
            }
        }


        // 1.5 Upsert Groups (Level 1) & Resolve IDs
        console.log("ℹ️ Upserting Groups (Level 1)...");
        const groupMap = new Map(); // OldGroupID -> RealGroupID
        const groupNameMap = new Map(); // OldGroupID -> GroupName

        for (const cat of categories) {
            const slug = cat.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
            let finalId;
            const existingCat = await categoriesCollection.findOne({ slug: slug });

            if (existingCat) {
                console.log(`ℹ️ Group '${cat.name}' exists. ID: ${existingCat._id}`);
                finalId = existingCat._id;
                await categoriesCollection.updateOne({ _id: finalId }, { $set: { parentCategory: new ObjectId("697095953758a7d8f76fa88c"), level: 1 } });
            } else {
                console.log(`ℹ️ Creating new group '${cat.name}'`);
                finalId = new ObjectId(cat.id);
                await categoriesCollection.updateOne(
                    { _id: finalId },
                    {
                        $set: {
                            name: cat.name,
                            parentCategory: new ObjectId("697095953758a7d8f76fa88c"), // Fixed Parent: Grocery
                            slug: slug,
                            image: "",
                            isActive: true,
                            level: 1 // Group level
                        }
                    },
                    { upsert: true }
                );
            }
            groupMap.set(cat.id, finalId.toString());
            groupNameMap.set(cat.id, cat.name);
        }

        // 1.6 Upsert Sub-Categories (Level 2)
        console.log("ℹ️ Upserting Sub-Categories (Level 2)...");
        const subCategoryMap = new Map(); // Key: "GroupID_SubCatName" -> RealSubCatID

        // Extract unique subcategories
        const uniqueSubCats = new Set();
        productsData.forEach(p => {
            if (p.subCategory) {
                uniqueSubCats.add(`${p.categoryId}|${p.subCategory}`);
            }
        });

        const GROCERY_PARENT_ID = new ObjectId("697095953758a7d8f76fa88c");

        for (const entry of uniqueSubCats) {
            const [groupId, subCatName] = entry.split('|');
            const realGroupId = groupMap.get(groupId); // This is the GROUP ID (e.g. Dairy...)
            const groupName = groupNameMap.get(groupId); // This is the GROUP NAME

            if (!realGroupId) continue;

            const subCatSlug = subCatName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

            let subCatId;
            // Check existence by slug OR (Name + Group) to avoid duplicates
            // Note: We use Group Name or Parent=Grocery to check uniqueness efficiently
            const existingSub = await categoriesCollection.findOne({
                $or: [
                    { slug: subCatSlug },
                    { name: subCatName, parentCategory: GROCERY_PARENT_ID }
                ]
            });

            if (existingSub) {
                subCatId = existingSub._id;
                // CORRECT LOGIC: Sub-Category should be child of GROCERY, and have 'group' field
                const updates = {
                    parentCategory: GROCERY_PARENT_ID,
                    group: groupName,
                    level: 2
                };
                await categoriesCollection.updateOne({ _id: subCatId }, { $set: updates });

            } else {
                subCatId = new ObjectId();
                await categoriesCollection.insertOne({
                    _id: subCatId,
                    name: subCatName,
                    parentCategory: GROCERY_PARENT_ID, // Link to GROCERY, not the Group ID
                    group: groupName,                  // Use group field for UI grouping
                    slug: subCatSlug,
                    image: "",
                    isActive: true,
                    level: 2
                });
            }
            subCategoryMap.set(`${groupId}|${subCatName}`, subCatId);
        }

        // 2. Map Products to Model
        const productsToInsert = productsData.map(p => {
            const group = categories.find(c => c.id === p.categoryId);
            const realGroupId = groupMap.get(p.categoryId);

            // Resolve SubCategory ID
            const subCatKey = `${p.categoryId}|${p.subCategory}`;
            const subCatId = subCategoryMap.get(subCatKey);

            // If subCatId exists, use it. Otherwise fall back to Group ID (should not happen if subCategory is present)
            const finalCategoryId = subCatId ? subCatId : (realGroupId ? new ObjectId(realGroupId) : new ObjectId(p.categoryId));
            const finalCategoryName = subCatId ? p.subCategory : (group ? group.name : "Unknown");

            const slug = p.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
            return {
                title: p.title,
                slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
                description: `${p.title} - ${p.packSize}. Fresh and high quality.`,
                shortDescription: p.packSize,
                price: p.sellingPrice,
                mrp: p.mrp,
                category: finalCategoryName, // Leaf Category Name
                categoryId: finalCategoryId, // Leaf Category ID
                brand: p.brand,
                brandId: brandMap[p.brand],
                businessId: new ObjectId(businessId),
                image: "",
                images: [],
                stock: p.stockQty,
                isActive: true,
                approvalStatus: 'approved',
                isApproved: true,
                isVeg: p.isVeg,
                filterableAttributes: {
                    "packSize": p.packSize,
                    "isVeg": p.isVeg,
                    "subCategory": p.subCategory
                },
                createdAt: new Date(),
                updatedAt: new Date(),
                rating: 4.5,
                ratingCount: 10,
                views: 0,
                clicks: 0,
                lowStockThreshold: 10,
                isCodAvailable: true,
                isCodAvailable: true,
                processingTime: { value: 1, unit: 'days' },

                // --- Grocery Specific Fields (Dummy Data for Compatibility) ---
                foodType: p.isVeg ? "Veg" : "Non-Veg",
                manufacturer: {
                    name: p.brand + " Manufacturing Unit", // Dummy
                    address: "Industrial Area, Mumbai, Maharashtra" // Dummy
                },
                countryOfOrigin: "India",
                shelfLife: {
                    value: 6,
                    unit: "Months"
                },
                fssaiLicense: "10012345678901", // Dummy 14 digit

                nutrition: { // Correct schema field
                    servingSize: "100g",
                    servingsPerPack: p.packSize ? parseInt(p.packSize) : 1, // Rough guess
                    energy: 100
                },
                returnable: false, // Groceries usually not returnable
                returnWindow: 0,
                // Add more if needed from product.model.ts
            };
        });

        // 3. Clear existing products for these categories and business
        const categoryIds = categories.map(c => new ObjectId(c.id));
        const existingCount = await productsCollection.countDocuments({
            categoryId: { $in: categoryIds },
            businessId: new ObjectId(businessId)
        });

        /*
        if (existingCount > 0) {
            console.log(`ℹ️ Cleaning up ${existingCount} existing products...`);
            await productsCollection.deleteMany({
                categoryId: { $in: categoryIds },
                businessId: new ObjectId(businessId)
            });
        }
        */

        // 3.1 Clear existing grocery products
        const existingGroceryCount = await groceryProductsCollection.countDocuments({
            categoryId: { $in: categoryIds },
            businessId: new ObjectId(businessId)
        });

        /*
        if (existingGroceryCount > 0) {
            console.log(`ℹ️ Cleaning up ${existingGroceryCount} existing grocery products...`);
            await groceryProductsCollection.deleteMany({
                categoryId: { $in: categoryIds },
                businessId: new ObjectId(businessId)
            });
        }
        */

        // 4. Insert Products
        // 4. Insert Products
        // 4. Insert Products
        // const result = await productsCollection.insertMany(productsToInsert);
        // console.log(`✅ Successfully seeded ${result.insertedCount} products for multiple categories`);

        // 4.1 Insert into Grocery Products
        // Clone products to avoid mutability issues if needed, but here re-inserting is fine as they are raw objects
        // However, insertMany modifies objects with _id. The underlying driver might complain if we re-insert checks with _id.
        // Actually, if we use the same array 'productsToInsert', the objects already have _id from the previous insert.
        // If we want to keep same IDs (which is good), we just need to ensure we handle potential duplicates if cleanup wasn't perfect, but we cleared it.
        // Let's force update the _id if needed, or better, just insert.

        try {
            const groceryResult = await groceryProductsCollection.insertMany(productsToInsert);
            console.log(`✅ Successfully seeded ${groceryResult.insertedCount} products into 'grocery_products' collection`);
        } catch (err) {
            console.error("⚠️ Error seeding grocery_products (might be duplicates):", err);
        }

    } catch (error) {
        console.error("❌ Error seeding products:", error);

    } finally {
        await client.close();
        console.log("✅ MongoDB connection closed");
    }
}

seedProducts().catch(console.error);
