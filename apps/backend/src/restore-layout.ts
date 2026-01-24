import mongoose from 'mongoose';
import { AdvancedLayout } from './models/advanced.layout.model';
import { connectMongo } from './config/mongo';

const restoreLayout = [
    {
        "id": "home_hero",
        "type": "hero_carousel",
        "priority": 10,
        "content": {
            "banners": [
                {
                    "imageUrl": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755958/5_lgi7sg.webp",
                    "actionUrl": "/bannerPages/furniture-big-sale"
                },
                {
                    "imageUrl": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755958/6_dhcaji.webp",
                    "actionUrl": "/common-category/electronics?name=Best Sellers&filters={\"search\":\"Best\"}"
                }
            ]
        }
    },
    {
        "id": "home_recent",
        "type": "Container",
        "style": {
            "paddingHorizontal": 16,
            "marginBottom": 16
        },
        "children": [
            {
                "type": "Text",
                "props": {
                    "text": "Still looking for these?"
                },
                "style": {
                    "fontSize": 16,
                    "fontWeight": "600",
                    "marginBottom": 12,
                    "color": "#4B5563"
                }
            },
            {
                "type": "ProductGrid",
                "props": {
                    "cardStyle": "horizontal"
                },
                "dataSource": {
                    "type": "DYNAMIC",
                    "query": {
                        "source": "browsing_history",
                        "limit": 6
                    }
                }
            }
        ]
    },
    {
        "id": "home_grocery",
        "type": "Container",
        "style": {
            "paddingVertical": 16,
            "backgroundColor": "#F0FDF4",
            "marginBottom": 24
        },
        "children": [
            {
                "type": "Text",
                "props": {
                    "text": "Grocery Essentials 🥦"
                },
                "style": {
                    "fontSize": 18,
                    "fontWeight": "bold",
                    "marginBottom": 12,
                    "paddingHorizontal": 16,
                    "color": "#166534"
                }
            },
            {
                "type": "ProductGrid",
                "props": {
                    "cardStyle": "horizontal"
                },
                "dataSource": {
                    "type": "DYNAMIC",
                    "query": {
                        "source": "products_generic",
                        "category": "grocery",
                        "limit": 8
                    }
                }
            }
        ]
    },
    {
        "id": "home_lightning",
        "type": "Gradient",
        "props": {
            "colors": [
                "#FFF0F5",
                "#FFE4E1",
                "#FDF2F8"
            ],
            "start": {
                "x": 0,
                "y": 0
            },
            "end": {
                "x": 1,
                "y": 1
            }
        },
        "style": {
            "paddingVertical": 24,
            "position": "relative",
            "overflow": "hidden",
            "marginBottom": 16
        },
        "children": [
            {
                "type": "Image",
                "props": {
                    "source": "https://cdn-icons-png.flaticon.com/512/616/616490.png"
                },
                "style": {
                    "position": "absolute",
                    "right": -20,
                    "top": -10,
                    "width": 150,
                    "height": 150,
                    "opacity": 0.05,
                    "tintColor": "#EF4444",
                    "transform": [
                        {
                            "rotate": "-15deg"
                        }
                    ]
                }
            },
            {
                "type": "Container",
                "style": {
                    "paddingHorizontal": 16,
                    "marginBottom": 16
                },
                "children": [
                    {
                        "type": "Text",
                        "props": {
                            "text": "Lightning deals"
                        },
                        "style": {
                            "fontSize": 20,
                            "fontWeight": "800",
                            "color": "#BE123C",
                            "marginBottom": 4
                        }
                    }
                ]
            },
            {
                "type": "ProductGrid",
                "props": {
                    "cardStyle": "lightning"
                },
                "dataSource": {
                    "type": "DYNAMIC",
                    "query": {
                        "source": "lightning_deals",
                        "limit": 6
                    }
                }
            }
        ]
    },
    {
        "id": "home_curated",
        "type": "curated_collections",
        "props": {
            "collections": [
                {
                    "title": "Discover your unique style",
                    "subtitle": "Elevate your fashion game with trendy picks",
                    "backgroundColor": "#FDF2E3",
                    "headerImage": "https://cdn-icons-png.flaticon.com/512/3050/3050253.png",
                    "items": [
                        {
                            "name": "Smart Gadgets",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755958/5_lgi7sg.webp",
                            "bgColor": "#FADCB8",
                            "actionUrl": "/common-category/695f88c75f463eeb3c42e764?name=Smart Gadgets"
                        },
                        {
                            "name": "Casual Wear",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755958/6_dhcaji.webp",
                            "bgColor": "#FADCB8",
                            "actionUrl": "/common-category/695f88c75f463eeb3c42e765?name=Casual Wear&filters={\"search\":\"Casual\"}"
                        },
                        {
                            "name": "Jewellery",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755959/7_mj3ql4.webp",
                            "bgColor": "#FADCB8",
                            "actionUrl": "/common-category/695f88c75f463eeb3c42e76e?name=Jewellery"
                        },
                        {
                            "name": "Bags & Accessories",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768755959/8_e5pa4z.webp",
                            "bgColor": "#FADCB8",
                            "actionUrl": "/common-category/6967c4f5b76df21b066b8538?name=Bags"
                        }
                    ]
                },
                {
                    "title": "Upgrade your Tech",
                    "subtitle": "Latest mobiles and accessories for you",
                    "backgroundColor": "#E3F2FD",
                    "headerImage": "https://cdn-icons-png.flaticon.com/512/644/644458.png",
                    "items": [
                        {
                            "name": "Smartphones",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768756606/9_cgqqvg.webp",
                            "bgColor": "#BBDEFB",
                            "actionUrl": "/common-category/695f88c75f463eeb3c42e764?name=Smartphones&filters={\"search\":\"Smartphone\"}"
                        },
                        {
                            "name": "Cases & Covers",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768756606/10_jc7vbz.webp",
                            "bgColor": "#BBDEFB",
                            "actionUrl": "/common-category/695f88c75f463eeb3c42e764?name=Cases&filters={\"search\":\"Cases\"}"
                        },
                        {
                            "name": "Headphones",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768756606/11_g5micx.webp",
                            "bgColor": "#BBDEFB",
                            "actionUrl": "/common-category/695f88c75f463eeb3c42e764?name=Headphones&filters={\"search\":\"Headphones\"}"
                        },
                        {
                            "name": "Smart Watches",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768756607/12_lzinfh.webp",
                            "bgColor": "#BBDEFB",
                            "actionUrl": "/common-category/6967c4f5b76df21b066b8537?name=Smart Watches"
                        }
                    ]
                },
                {
                    "title": "For a comfortable journey",
                    "subtitle": "Get all your travel essentials here",
                    "backgroundColor": "#F9FBE7",
                    "headerImage": "https://cdn-icons-png.flaticon.com/512/3125/3125713.png",
                    "items": [
                        {
                            "name": "Sunscreen",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768756881/13_gsqaos.webp",
                            "bgColor": "#F0F4C3",
                            "actionUrl": "/common-category/6967d82c85d7230e4eac11de?name=Sunscreen"
                        },
                        {
                            "name": "Travel Pillows",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768756882/14_pjit5s.webp",
                            "bgColor": "#F0F4C3",
                            "actionUrl": "/common-category/695ff7de3f61939001a0637e?name=Travel Pillows&filters={\"search\":\"Travel Pillow\"}"
                        },
                        {
                            "name": "Power Banks",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768756882/15_wz05mo.webp",
                            "bgColor": "#F0F4C3",
                            "actionUrl": "/common-category/695f88c75f463eeb3c42e764?name=Power Banks&filters={\"search\":\"Power Bank\"}"
                        },
                        {
                            "name": "T-Shirts",
                            "image": "https://res.cloudinary.com/deljcbcvu/image/upload/v1768756882/16_p3hide.webp",
                            "bgColor": "#F0F4C3",
                            "actionUrl": "/common-category/6967c4f5b76df21b066b8523?name=T-Shirts"
                        }
                    ]
                }
            ]
        }
    },
    {
        "id": "trending_near_you",
        "type": "Container",
        "style": {
            "paddingHorizontal": 16,
            "marginBottom": 24
        },
        "children": [
            {
                "type": "Text",
                "props": {
                    "text": "Trending near you"
                },
                "style": {
                    "fontSize": 18,
                    "fontWeight": "bold",
                    "marginBottom": 12,
                    "color": "#111827"
                }
            },
            {
                "type": "ProductGrid",
                "props": {
                    "cardStyle": "horizontal"
                },
                "dataSource": {
                    "type": "DYNAMIC",
                    "query": {
                        "source": "products_generic",
                        "isTrending": true,
                        "limit": 6
                    }
                }
            }
        ]
    },
    {
        "id": "home_kitchen_sale",
        "type": "grand_kitchen",
        "style": {
            "marginBottom": 16
        }
    },
    {
        "id": "home_50_off",
        "type": "fifty_percent_off",
        "style": {
            "marginBottom": 16
        }
    },
    {
        "id": "home_grid",
        "type": "Container",
        "style": {
            "paddingHorizontal": 16,
            "marginBottom": 100
        },
        "children": [
            {
                "type": "Text",
                "props": {
                    "text": "More For You"
                },
                "style": {
                    "fontSize": 18,
                    "fontWeight": "bold",
                    "marginBottom": 12
                }
            },
            {
                "type": "ProductGrid",
                "props": {
                    "cardStyle": "grid",
                    "columns": 2
                },
                "dataSource": {
                    "type": "DYNAMIC",
                    "query": {
                        "source": "products_generic",
                        "limit": 10
                    }
                }
            }
        ]
    }
];

const run = async () => {
    await connectMongo();
    console.log('Restoring 10-section layout for "for-you"...');

    // Upsert the layout: if it exists (empty or not), update it. If not, create it.
    const result = await AdvancedLayout.findOneAndUpdate(
        { slug: 'for-you' },
        {
            name: 'For You Top Section',
            slug: 'for-you',
            isActive: true,
            components: restoreLayout,
            $inc: { version: 1 }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Layout restored! Version: ${result.version}`);
    console.log(`Components count: ${result.components.length}`);
    process.exit(0);
};

run().catch(console.error);
