import axios from 'axios';

const run = async () => {
    try {
        // Assuming backend is on port 4000 based on previous context
        console.log('Fetching /api/advanced-layout/for-you...');
        const res = await axios.get('http://localhost:4000/api/advanced-layout/for-you');
        console.log('Response Status:', res.status);
        console.log('Components:', JSON.stringify(res.data.components, null, 2));
    } catch (err: any) {
        console.error('Error fetching layout:', err.message);
        if (err.response) {
            console.error('Data:', err.response.data);
        }
    }
};

run();
