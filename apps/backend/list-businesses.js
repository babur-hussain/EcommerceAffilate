const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function listBusinesses() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const businesses = await mongoose.connection.db.collection('businesses').find({}).limit(5).toArray();

        console.log('\nAvailable Businesses:');
        businesses.forEach(b => {
            console.log(`ID: ${b._id}, Name: ${b.businessIdentity?.tradeName || 'Unnamed'}`);
        });

        if (businesses.length === 0) {
            console.log('No businesses found in the database.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

listBusinesses();
