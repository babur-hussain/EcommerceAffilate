
const mongoose = require('mongoose');
require('dotenv').config();

const layoutSchema = new mongoose.Schema({
    pageSlug: String,
    name: String,
    isActive: Boolean,
    sections: Array
});

const PageLayout = mongoose.model('PageLayout', layoutSchema);

async function checkLayouts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const slugs = ['fashion', 'electronics', 'beauty', 'mega_deal'];

        for (const slug of slugs) {
            const layout = await PageLayout.findOne({ pageSlug: slug });
            if (layout) {
                console.log(`[FOUND] Layout for '${slug}' exists. Sections: ${layout.sections.length}`);
            } else {
                console.log(`[MISSING] Layout for '${slug}' NOT FOUND.`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

checkLayouts();
