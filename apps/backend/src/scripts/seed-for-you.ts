
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AdvancedLayout } from '../models/advanced.layout.model';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedLayout = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        const layoutData = {
            name: 'For You Top Section',
            slug: 'for-you',
            description: 'Top section with Lightning Deals and History',
            isActive: true,
            components: [
                {
                    id: "section_lightning_deals",
                    type: "Container",
                    style: {
                        marginTop: 16,
                        marginBottom: 16,
                        paddingHorizontal: 16,
                        backgroundColor: "#FFFBEB",
                        paddingVertical: 24
                    },
                    children: [
                        {
                            id: "header_container",
                            type: "Container",
                            style: {
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 16
                            },
                            children: [
                                {
                                    id: "header_text",
                                    type: "Text",
                                    props: {
                                        text: "⚡ Lightning Deals"
                                    },
                                    style: {
                                        fontSize: 22,
                                        fontWeight: "800",
                                        color: "#D97706"
                                    }
                                },
                                {
                                    id: "timer_text",
                                    type: "Text",
                                    props: {
                                        text: "Ends in 2h 15m"
                                    },
                                    style: {
                                        fontSize: 14,
                                        fontWeight: "600",
                                        color: "#EF4444"
                                    }
                                }
                            ]
                        },
                        {
                            id: "deals_grid",
                            type: "ProductGrid",
                            props: {
                                columns: 2,
                                cardStyle: "standard",
                                showPrice: true,
                                showRating: false
                            },
                            dataSource: {
                                type: "DYNAMIC",
                                query: {
                                    source: "specific_products",
                                    ids: [
                                        "69668824a35b0a2c24fa8377",
                                        "69668824a35b0a2c24fa8377",
                                        "69668824a35b0a2c24fa8377",
                                        "69668824a35b0a2c24fa8377"
                                    ]
                                }
                            }
                        },
                        {
                            id: "view_all_btn",
                            type: "Button",
                            props: {
                                text: "View All Deals",
                                action: "navigation",
                                path: "/deals",
                                textStyle: {
                                    color: "#FFFFFF",
                                    fontWeight: "600",
                                    textAlign: "center"
                                }
                            },
                            style: {
                                marginTop: 16,
                                backgroundColor: "#D97706",
                                paddingVertical: 12,
                                borderRadius: 8
                            }
                        }
                    ]
                },
                {
                    id: "section_still_looking",
                    type: "Container",
                    style: {
                        marginTop: 24,
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

        await AdvancedLayout.findOneAndUpdate(
            { slug: 'for-you' },
            layoutData,
            { upsert: true, new: true }
        );

        console.log('Successfully seeded "for-you" layout');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding layout:', error);
        process.exit(1);
    }
};

seedLayout();
