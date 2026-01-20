const fetch = require('node-fetch');

async function checkCategories() {
    try {
        const response = await fetch('http://localhost:4000/api/categories?parentCategory=null');
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

checkCategories();
