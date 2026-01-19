const { MongoClient } = require("mongodb");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// ============================================================================
// MEN'S FASHION LAYOUT
// ============================================================================
const menFashionLayout = {
    pageSlug: 'men-fashion',
    name: 'Men Fashion Page',
    isActive: true,
    sections: [
        {
            id: 'men_back_nav',
            type: 'navigation_header',
            priority: 5,
            content: {
                title: "Men's Wear",
                showBack: true
            }
        },
        {
            id: 'men_hero_banner',
            type: 'hero_banner',
            priority: 10,
            content: {
                title: "Essential Urban Wear",
                subtitle: "Curated for the modern city.",
                buttonText: "View Collection",
                backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIhZnyRUsJWz9IaSACPd--4g72fULGo7l_hQVxaBWbTq7SdeEzr0PVmxHHLbRSgkF_slf_m24r017ukjShzOq2IRLAlR5sHy8cN3OdX6HWKYGEPOcA_eUvPZkcvrcbcnbAIirYTnSfYkXfiyfN-5NuRjZzhkI6RNxQjepV6MKU0ybreBEU6-Ain5fN1Nh1ni8UWAUEamJ1k_IMtdlwKJDnR7AERvmlU7tlBeDf9lAn4i4PExgVvbnxOxg6N6hzdbOsA2aVqRQIGX4Y",
                actionUrl: "/fashion/collection/men-collection-view"
            }
        },
        {
            id: 'men_categories_grid',
            type: 'grid_categories',
            priority: 20,
            content: {
                title: "Categories",
                viewAllText: "View All",
                viewAllUrl: "/fashion/categories/men",
                items: [
                    { id: "men-sneakers", name: "Sneakers", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2B6iMSUJRDeo9PU2wZg5IIaOFv7dB_0DEI5BwfTs-x4RSYChjWoocE8fewhZN0fNg9SMrljOB0SGR56-O2CeQ7HCVNVAyk4zeZXfbYTaFCWKsJaAYtpu1BGu-ZUftAUR_GG4nSEdHOBxpBTdNI1CKhB2xYIFkOGX7v2VJmn_y_uA9EEl2ahVbbi_cOWYMMcVxmbK4WGdi0UBGe_1YfW05fMty6bxD14DV88einIxHdFyKJ3DywoD2AFymu6WhZOPxChsb0DU_QsNO", actionUrl: "/fashion/collection/men?category=men-sneakers" },
                    { id: "men-watches", name: "Watches", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcXTkgvDge5b0iiSFwdXNvKXnn8OTsoZyIJ1g07hmzt9Wj8O2J3mJk2HiWUCOhh-04LlCvukAVtmeAm8ugGpMJCq9viAe5I5hEF4Sh83zlbnpXoUmbSknezTQW-_dSM1IJDzL6SKpEp9ZY2vJe6KsfEHHAjJkG8kc3qUk4shVkvfO6H1zoMJ648-_cPd9BqJgEh9LOPxtRMHW8T-2VSo1yO-_-1WwOFfSTb0kg0gLTAm_P1BFZc_Azsj-HSHIzwiAmHgSCSLntWpFy", actionUrl: "/fashion/collection/men?category=men-watches" },
                    { id: "men-denims", name: "Denims", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxMBU6hMpnxHdvkvw18gjFVZh4V5XPXFwKmSsj7_688awDfwPvUjRikX6MMFe__FpMGNOFDnsWOl4XMpNBjBRxpnFuY0OfnMJovfVKmLko0drHnle6-8tkcpp3q0_CGFDHrON5z4tVRCznn46KOJFF4TMel6mdGiqQlg6uRYR4evoH-88uic7DA_yVuLoeV204qwhl7EaXFWF5bJgaiiluvCBbmrrxjimARXvXrwVHN15HJGBSCwE6jvpiNPtG2ch8ddwuous3844p", actionUrl: "/fashion/collection/men?category=men-denims" },
                    { id: "men-blazers", name: "Blazers", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC86VRuyO2Xhmfruxpx43WWfWGRgYeXe6bL5THvr-s6xSDB3uW0QIt7Mj1DuB-KNn1HZnWL5CAgm-H5gmoWZe0S75jpiGy30RZhjRvP7XkJO-yYDnzKbVwqv4Vk4RS2mj1Lz9-Oq681vWGi2o2_8Nr71dXU57pwXgtu2PsgACH1F5rSvoBJeagwiHer1A1dVsE1lHCWdyvBFZ78zF56ZmsuHdoj33uwYfBZUU_6McyTjqgWhBHk7jQBI0zuCy8SGeSDsHWCNeRVVmHr", actionUrl: "/fashion/collection/men?category=men-blazers" },
                    { id: "men-gymwear", name: "Gymwear", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF0symDmR9JM0VQNViqbgIKNuuU5QY3J_czh3ZVcHcRbieObM_xYEQUnSBvxi7wihaqS9rpGd_BITZrCIETOPBYO5Bq2vj8VfPGBBRQB0kVqGYWj5t9DToj9hSU6j7LO1W_I6zpo7AEG6V1blP0fEEs7UFeB2CYeko5dTvHEz_LSzM3jYgm68F-BmWpP3qYZd2s8tvHuv6B9Yeo6cx9zvgZ_n6b6OqYRXjR9vocXnTOL3IqDq9o9EXwBcDm-fldGzcIkntwUSoJS84", actionUrl: "/fashion/collection/men?category=men-gymwear" },
                    { id: "men-wallets", name: "Wallets", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3aZFXyF-INKKCM_ubiXCxegrCbfgROFZuF900vLDwPTD2uJrc0_ruz04Ijd_ygJcDQxmswDM40VQzboF_MoUBXhrJhCJjmVi0VEUs0xfKMc0wUbmjD5TW1QUAMeQKyYpeV7VYbTT87QUifTvnV_jI9HKnt-tfP8n9GdBlAvbGBR0QijoN7i_bPqsNW2roEzgjLenhmtbma5JZ-SC6xuorlJtPMTs3664VpxZP5hC1Tj76C5l1cL_fzCp4g5TKp5Au0NEyQKQz-Emp", actionUrl: "/fashion/collection/men?category=men-wallets" },
                    { id: "men-shirts", name: "Shirts", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdUmDHczpToS1X0z8aBNhu-LJxf2OGnQmBOKELad_sdCW4YqxQr0Eu5JWWQsjGSOwnev_tv9J5tTQwY4qDqQs7sGJlKFqtjD0lven-TnttjO4-rAWuysqwbBGWiWOziQFzIR0PaKAn2_MffPVM5Zj9NEpM0O4KIpHzsDJtdeEvzoLnlZLrAH47d3f50h_zQd2f2DBoMg8IyxqWbf5qKuRVsQx534AsnClIyedoo1uDBRVkl7uQT_7dM4XSFmFM7-Piynqm7PKuZVT8", actionUrl: "/fashion/collection/men?category=men-shirts" },
                    { id: "men-grooming", name: "Grooming", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTVszNvPUWJc18LC4XqA1U_0ylx8ypHRv73XDJywg4iXkY50JarXLaLQpmbP3zFJcWfapy_-_XGNbywZWyLcLRiRrewIXU0z4C1UFLdGW4yVYSynX_1HovWo_aPm4aCrYvPDKukk0t7FgDt2lrublsz3UnA_ZESp02FR2UlBGf6nylLzjZ5eiZHZsezxgphJ6r3RcvMTrTn7j9lFa3nD2L8IBNqOr8JEy3M7vR_zjP839OOiHanrHJQcMHEfXKu44yb5Nrzn2jF2LN", actionUrl: "/fashion/collection/men?category=men-grooming" },
                ]
            }
        },
        {
            id: 'men_featured_brands',
            type: 'featured_brands',
            priority: 30,
            content: {
                title: "Featured Brands",
                items: [
                    { name: "NIKE", actionUrl: "/fashion/brands/nike" },
                    { name: "ADIDAS", actionUrl: "/fashion/brands/adidas" },
                    { name: "LEVI'S", actionUrl: "/fashion/brands/levis" },
                    { name: "BOSS", actionUrl: "/fashion/brands/boss" },
                    { name: "GUCCI", actionUrl: "/fashion/brands/gucci" }
                ]
            }
        },
        {
            id: 'men_new_in',
            type: 'product_scroll',
            priority: 40,
            content: {
                title: "New In",
                viewAllText: "Shop All",
                viewAllUrl: "/fashion/new-in/men",
                items: [
                    { name: "Cashmere Overcoat", desc: "Stone Beige", price: "$450", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkKsaqcQySWzIBLdqG0tuOS9uVzdqoU3Hly1Yl_E5tGWXItLXX33E84V4QZeGtgKy4OmcUCKQPfqtGrPRKbIKEKA9KoMqDb4Be2pGiakOQPo1tr1XSNqZ2EmAvrIhxt-LdV0weU7PZL4JQq3JhTL2yKyqjxGA6H7Cx-4Ccu42tA_V0-3v7yEEURMQHGEUNHmTLbJFgDOFXni0gy5GSbgyk5QRKwuZh1peqqblmr9otcPt", actionUrl: "/product/overcoat" },
                    { name: "Chelsea Boots", desc: "Italian Leather", price: "$220", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiaEAZ_erE--jdtksndupwDA8fL6pAhEiM1jr4RllwYpEy10Rv0nfGdrbN5Npmb8TqArp8BjKm1XhAqB73Lc6L-0vWhBGX55jsZ94QEefiavwHgXpKZGlbX1_atLYg6Zu_CMosQaMrGGXEZTrXFulDpacH1rOV51LOJzEWWk-27IBwMERRzscQWPsyF1O748uub1gvVOhnoK282NUHCMIG8ih20FnnulfuwuH6cvWCWyl_zSk2RgDmRhZ53TntvL2CVOXgOCJy1-Yg", actionUrl: "/product/boots" },
                    { name: "Chronograph S1", desc: "Stainless Steel", price: "$890", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-27b3wihoB2fIJJWGt93tA6-FElHDPSHYG5bu3kgYPrS6272j8-dVkYIKx7atP-W61odSdNSixDPnvJgWpg94H-z5XSfELrqDxLIDcE2om4Ox8qg4IfE6WfzmHDMS9rlzAFrHHutHEh8LStiW6Aym3mvvwtUFFGwbe3tDJ_HnHnKNUbTzrMp-76NmmebO2BEoecuw4FGPRYz9M0O4KIpHzsDJTdeEvzoLnlZLrAH47d3f50h_zQd2f2DBoMg8IyxqWbf5qKuRVsQx534AsnClIyedoo1uDBRVkl7uQT_7dM4XSFmFM7-Piynqm7PKuZVT8", actionUrl: "/product/watch" },
                ]
            }
        }
    ]
};

async function seedMenFashionLayout() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceearn";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(); // Use default DB from URI ('ecommerce')
        const collection = db.collection('pagelayouts');

        await collection.deleteOne({ pageSlug: 'men-fashion' });
        await collection.insertOne(menFashionLayout);

        console.log("✅ Men Fashion Layout Seeded Successfully");

    } catch (err) {
        console.error("❌ Error seeding men fashion layout:", err);
    } finally {
        await client.close();
    }
}

seedMenFashionLayout();
