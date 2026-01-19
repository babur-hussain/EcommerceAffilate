const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '../.env' });

// ============================================================================
// BOOKS LAYOUT
// ============================================================================
const booksLayout = {
    pageSlug: 'books',
    name: 'Books Page',
    isActive: true,
    sections: [
        {
            id: 'book_banners',
            type: 'fashion_banners',
            priority: 10,
            content: {
                banners: [
                    { imageUrl: 'https://loremflickr.com/1000/400/library,books?lock=301', actionUrl: '/category/fiction' },
                    { imageUrl: 'https://loremflickr.com/1000/400/reading,coffee?lock=302', actionUrl: '/category/non-fiction' },
                    { imageUrl: 'https://loremflickr.com/1000/400/bookstore?lock=303', actionUrl: '/category/best-sellers' }
                ]
            }
        },
        {
            id: 'book_subcats',
            type: 'book_subcategories',
            priority: 20,
            content: {
                dataSource: { endpoint: '/api/categories/books/subcategories', params: {} }
            }
        },
        {
            id: 'book_music',
            type: 'book_music_genres',
            priority: 30,
            content: {
                title: 'Music Genres',
                items: [
                    { name: 'Lo-Fi', subtitle: 'Beats to study', image: 'https://loremflickr.com/300/400/lofi,art?lock=311', gradientColors: ['#FF9A9E', '#FECFEF'], accentColor: '#FFF', actionUrl: '/music/lo-fi' },
                    { name: 'Classical', subtitle: 'Focus & Calm', image: 'https://loremflickr.com/300/400/violin?lock=312', gradientColors: ['#a18cd1', '#fbc2eb'], accentColor: '#FFF', actionUrl: '/music/classical' },
                    { name: 'Jazz', subtitle: 'Smooth vibes', image: 'https://loremflickr.com/300/400/saxophone?lock=313', gradientColors: ['#84fab0', '#8fd3f4'], accentColor: '#FFF', actionUrl: '/music/jazz' }
                ]
            }
        },
        {
            id: 'book_genres',
            type: 'book_genres',
            priority: 40,
            content: {
                title: 'Book Genres',
                items: [
                    { name: 'Thriller', subtitle: 'Edge of seat', image: 'https://loremflickr.com/300/400/mystery,book?lock=321', gradientColors: ['#434343', '#000000'], accentColor: '#FF0000', actionUrl: '/category/thriller' },
                    { name: 'Romance', subtitle: 'Love stories', image: 'https://loremflickr.com/300/400/romance,book?lock=322', gradientColors: ['#ff9a9e', '#fecfef'], accentColor: '#FFF', actionUrl: '/category/romance' },
                    { name: 'Sci-Fi', subtitle: 'Future worlds', image: 'https://loremflickr.com/300/400/space,art?lock=323', gradientColors: ['#0f0c29', '#302b63'], accentColor: '#00FFFF', actionUrl: '/category/sci-fi' }
                ]
            }
        },
        {
            id: 'book_brands',
            type: 'book_superstar_brands',
            priority: 50,
            content: {
                title: 'Superstar Brands',
                items: [
                    { logo: 'https://loremflickr.com/200/200/penguin,logo?lock=331', actionUrl: '/publisher/penguin' },
                    { logo: 'https://loremflickr.com/200/200/harper,logo?lock=332', actionUrl: '/publisher/harper-collins' },
                    { logo: 'https://loremflickr.com/200/200/scholastic,logo?lock=333', actionUrl: '/publisher/scholastic' },
                    { logo: 'https://loremflickr.com/200/200/marvel,logo?lock=334', actionUrl: '/publisher/marvel' },
                    { logo: 'https://loremflickr.com/200/200/dc,logo?lock=335', actionUrl: '/publisher/dc' }
                ]
            }
        },
        {
            id: 'book_authors',
            type: 'book_authors_best',
            priority: 60,
            content: {
                title: 'Authors Best Work',
                items: [
                    { image: 'https://loremflickr.com/300/400/author,man?lock=341', bgColor: '#FFEBEE', actionUrl: '/author/stephen-king' },
                    { image: 'https://loremflickr.com/300/400/author,woman?lock=342', bgColor: '#E3F2FD', actionUrl: '/author/jk-rowling' },
                    { image: 'https://loremflickr.com/300/400/writer?lock=343', bgColor: '#E0F2F1', actionUrl: '/author/dan-brown' }
                ]
            }
        },
        {
            id: 'book_budget',
            type: 'book_budget_carnival',
            priority: 70,
            content: {
                title: 'Budget Carnival',
                items: [
                    { name: 'Under ₹199', image: 'https://loremflickr.com/300/400/books,pile?lock=351', priceTag: 'Store', tagColor: '#F44336', actionUrl: '/store/under-199' },
                    { name: 'Under ₹299', image: 'https://loremflickr.com/300/400/reading?lock=352', priceTag: 'Store', tagColor: '#2196F3', actionUrl: '/store/under-299' },
                    { name: 'Under ₹499', image: 'https://loremflickr.com/300/400/library?lock=353', priceTag: 'Store', tagColor: '#4CAF50', actionUrl: '/store/under-499' }
                ]
            }
        },
        {
            id: 'book_grid',
            type: 'book_product_grid',
            priority: 80,
            content: {
                dataSource: { endpoint: '/api/products', params: { category: 'Books', limit: 10 } }
            }
        }
    ]
};

async function seedBooksLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('pagelayouts');

        await collection.deleteOne({ pageSlug: 'books' });
        await collection.insertOne(booksLayout);

        console.log("✅ Books Layout Seeded Successfully");

    } catch (err) {
        console.error("❌ Error seeding books layout:", err);
    } finally {
        await client.close();
    }
}

seedBooksLayout();
