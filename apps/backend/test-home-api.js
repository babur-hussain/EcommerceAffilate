const axios = require('axios');

async function testHomeAPI() {
    const baseURL = 'http://192.168.29.193:4000';

    try {
        console.log('🔍 Testing Home & Kitchen API endpoints...\n');

        // Test 1: Get category by slug
        console.log('1. Testing: GET /api/categories/home-kitchen');
        try {
            const categoryResponse = await axios.get(`${baseURL}/api/categories/home-kitchen`);
            console.log('✅ Category found:', categoryResponse.data.name);
            console.log('   Has posters:', categoryResponse.data.posters?.length || 0);
        } catch (error) {
            console.log('❌ Error:', error.response?.status, error.response?.data || error.message);
        }

        // Test 2: Get subcategories
        console.log('\n2. Testing: GET /api/categories/home-kitchen/subcategories');
        try {
            const subcategoriesResponse = await axios.get(`${baseURL}/api/categories/home-kitchen/subcategories`);
            console.log('✅ Subcategories found:', subcategoriesResponse.data.length);
            if (subcategoriesResponse.data.length > 0) {
                console.log('   First subcategory:', subcategoriesResponse.data[0].name);
                console.log('   Has image:', !!subcategoriesResponse.data[0].image);
                console.log('   isActive:', subcategoriesResponse.data[0].isActive);
            }
        } catch (error) {
            console.log('❌ Error:', error.response?.status, error.response?.data || error.message);
        }

        // Test 3: Get all categories with parentCategory query
        console.log('\n3. Testing: GET /api/categories?parentCategory=695ff7de3f61939001a0637e');
        try {
            const queryResponse = await axios.get(`${baseURL}/api/categories?parentCategory=695ff7de3f61939001a0637e`);
            console.log('✅ Categories found:', queryResponse.data.length);
        } catch (error) {
            console.log('❌ Error:', error.response?.status, error.response?.data || error.message);
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

testHomeAPI();
