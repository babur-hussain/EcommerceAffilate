
import mongoose from 'mongoose';
import { AdvancedLayout } from '../models/advanced.layout.model';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://baburhussain:Babur123@ecommerceaffilate.mozlczh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=EcommerceAffilate";

const premiumLayout = {
    name: 'For You Top Section',
    slug: 'for-you',
    description: 'Top section with Lightning Deals and History (Premium Design)',
    isActive: true,
    components: [
        {
            id: "lightning_section",
            type: "Gradient",
            props: {
                colors: ['#FFF0F5', '#FFE4E1', '#FDF2F8'],
                start: { x: 0, y: 0 },
                end: { x: 1, y: 1 }
            },
            style: {
                paddingVertical: 24,
                position: "relative",
                overflow: "hidden",
                marginBottom: 16
            },
            children: [
                {
                    id: "lightning_icon_bg",
                    type: "Image",
                    props: {
                        source: "https://cdn-icons-png.flaticon.com/512/616/616490.png",
                        resizeMode: "contain"
                    },
                    style: {
                        position: "absolute",
                        right: -20,
                        top: -10,
                        width: 150,
                        height: 150,
                        opacity: 0.05,
                        tintColor: "#EF4444",
                        transform: [{ rotate: "-15deg" }]
                    }
                },
                {
                    id: "header_container",
                    type: "Container",
                    style: {
                        paddingHorizontal: 16,
                        marginBottom: 16
                    },
                    children: [
                        {
                            id: "header_text",
                            type: "Text",
                            props: {
                                text: "Lightning deals"
                            },
                            style: {
                                fontSize: 20,
                                fontWeight: "800",
                                color: "#BE123C",
                                marginBottom: 4,
                                letterSpacing: -0.5
                            }
                        },
                        {
                            id: "timer_text",
                            type: "Text",
                            props: {
                                text: "Big savings on select products"
                            },
                            style: {
                                fontSize: 14,
                                fontWeight: "500",
                                color: "#4B5563"
                            }
                        }
                    ]
                },
                {
                    id: "deals_grid",
                    type: "ProductGrid",
                    props: {
                        cardStyle: "lightning"
                    },
                    dataSource: {
                        type: "DYNAMIC",
                        query: {
                            source: "lightning_deals",
                            limit: 6
                        }
                    }
                }
            ]
        },
        {
            id: "kids_fashion_section",
            type: "Container",
            style: {
                marginTop: 8,
                marginBottom: 24,
                paddingHorizontal: 16,
                backgroundColor: "#FFFFFF"
            },
            children: [
                {
                    id: "kids_header_text",
                    type: "Text",
                    props: {
                        text: "Kids' Fashion"
                    },
                    style: {
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: 16
                    }
                },
                {
                    id: "kids_grid",
                    type: "ProductGrid",
                    props: {
                        columns: 2,
                        cardStyle: "standard",
                        showPrice: true,
                        showRating: true
                    },
                    dataSource: {
                        type: "DYNAMIC",
                        query: {
                            source: "category",
                            category: "Fashion > Kids' Fashion",
                            limit: 6
                        }
                    }
                }
            ]
        },
        {
            id: "section_still_looking",
            type: "Container",
            style: {
                marginTop: 8,
                marginBottom: 24,
                paddingHorizontal: 16,
                backgroundColor: "#FFFFFF"
            },
            children: [
                {
                    id: "header_text",
                    type: "Text",
                    props: {
                        text: "Still looking for these?"
                    },
                    style: {
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: 16
                    }
                },
                {
                    id: "history_grid",
                    type: "ProductGrid",
                    props: {
                        columns: 2,
                        cardStyle: "standard",
                        showPrice: true,
                        showRating: true
                    },
                    dataSource: {
                        type: "DYNAMIC",
                        query: {
                            source: "browsing_history",
                            limit: 4
                        }
                    }
                }
            ]
        }
    ]
};

const updateLayout = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected.');

        console.log('🔄 Updating layout: for-you');
        const result = await AdvancedLayout.findOneAndUpdate(
            { slug: 'for-you' },
            premiumLayout,
            { new: true, upsert: true }
        );

        console.log('🎉 Layout updated successfully!');
        // console.log(JSON.stringify(result, null, 2));

        await mongoose.disconnect();
        console.log('👋 Disconnected.');
    } catch (error) {
        console.error('❌ Error updating layout:', error);
        process.exit(1);
    }
};

updateLayout();
