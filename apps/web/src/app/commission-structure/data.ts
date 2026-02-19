
export interface CommissionRate {
    range: string;
    rate: string;
}

export interface SubCategory {
    name: string;
    rates: CommissionRate[];
}

export interface CategoryGroup {
    name: string;
    subCategories: SubCategory[];
}

export const COMMISSIONS: CategoryGroup[] = [
    {
        name: "Automotive, Car & Accessories",
        subCategories: [
            {
                name: "Automotive - Helmets & Riding Gloves",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1000", rate: "6.5%" },
                    { range: "item price > 1000", rate: "8.5%" },
                ]
            },
            {
                name: "Automotive - Tyres & Rims",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.0%" },
                    { range: "item price > 500", rate: "7.0%" },
                ]
            },
            {
                name: "Automotive Vehicles - 2-Wheelers, 4-Wheelers and Electric Vehicles",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 50000", rate: "5.0%" },
                    { range: "item price > 50000", rate: "2.0%" },
                ]
            },
            {
                name: "Automotive – Car and Bike parts, Brakes, Styling and body fittings, Transmission, Engine parts, Exhaust systems, Interior fitting, Suspension and Wipers",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "14.0%" },
                    { range: "item price > 500 and <= 1000", rate: "15.0%" },
                    { range: "item price > 1000", rate: "16.0%" },
                ]
            },
            {
                name: "Automotive – Cleaning kits (Sponges, Brush, Duster, Cloths and liquids), Car interior & exterior care (Waxes, polish, Shampoo and other), Car and Bike Lighting and Paints",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "11.0%" },
                    { range: "item price > 500", rate: "13.0%" },
                ]
            },
            {
                name: "Automotive Accessories (Floor Mats, Seat/Car/Bike Covers) and Riding Gear (Face Covers and Gloves)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "14.0%" },
                ]
            },
            {
                name: "Vehicle Tools and Appliances",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "8.0%" },
                    { range: "item price > 500", rate: "8.5%" },
                ]
            },
            {
                name: "Oils, Lubricants",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.5%" },
                    { range: "item price > 500", rate: "11.5%" },
                ]
            },
            {
                name: "Automotive – Batteries and air fresheners",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "8.5%" },
                ]
            },
            {
                name: "Car Electronics Devices",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "7.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "9.5%" },
                    { range: "item price > 1,000", rate: "12.0%" },
                ]
            },
            {
                name: "Car Electronics Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "11.0%" },
                    { range: "item price > 1,000", rate: "15.0%" },
                ]
            }
        ]
    },
    {
        name: "Baby Products, Toys & Education",
        subCategories: [
            {
                name: "Baby Hardlines - Swings, Bouncers and Rockers, Carriers, Baby Safety - Guards and Locks, Baby Room Décor, Baby Furniture, Baby Car Seats and Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.0%" },
                    { range: "item price > 500 and <= 1000", rate: "9.0%" },
                    { range: "item price > 1000", rate: "6.5%" },
                ]
            },
            {
                name: "Baby Strollers",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.0%" },
                    { range: "item price > 500 and <= 1000", rate: "8.0%" },
                    { range: "item price > 1000", rate: "9.0%" },
                ]
            },
            {
                name: "Baby diapers",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.5%" },
                    { range: "item price > 500", rate: "9.5%" },
                ]
            },
            {
                name: "Toys - Drones",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "30.0%" },
                ]
            },
            {
                name: "Toys - Party Supplies, Balloons, Banners, Masks, Confetti, Birthday Celebration",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1,000", rate: "8.5%" },
                    { range: "item price > 1,000", rate: "12.5%" },
                ]
            },
            {
                name: "Toys - Games and Puzzles, Boards Games, Adult Games and Building Sets",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1,000", rate: "8.5%" },
                    { range: "item price > 1,000", rate: "12.5%" },
                ]
            },
            {
                name: "Toys - Infant and Pre-school Toys (Electronic and Non-Electronic)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1,000", rate: "8.5%" },
                    { range: "item price > 1,000", rate: "11.5%" },
                ]
            },
            {
                name: "Toys - Outdoor, Activity and Sports Toys",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "9.5%" },
                    { range: "item price > 500", rate: "10.5%" },
                ]
            },
            {
                name: "Toys - Plush Toys, Action Figures and Dolls",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "10.5%" },
                ]
            },
            {
                name: "Toys - Remote and Non-Remote Controlled Vehicles and Vehicle Sets",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "8.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "10.5%" },
                    { range: "item price > 1,000", rate: "12.5%" },
                ]
            },
            {
                name: "Toys - STEM, Art and Craft, Learning and Development Toys",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1,000", rate: "8.5%" },
                    { range: "item price > 1,000", rate: "11.5%" },
                ]
            },
            {
                name: "Baby and Kids-Furniture and Home Décor",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "8.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "6.0%" },
                    { range: "item price > 1,000", rate: "8.5%" },
                ]
            },
            {
                name: "Baby-Walker",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "9.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "7.0%" },
                    { range: "item price > 1,000", rate: "5.0%" },
                ]
            }
        ]
    },
    {
        name: "Books, Music, Movies, Video Games, Entertainment",
        subCategories: [
            {
                name: "Books",
                rates: [
                    { range: "item price <= INR 250", rate: "3%" },
                    { range: "item price > INR 250 and <= INR 500", rate: "4.5%" },
                    { range: "item price > INR 500 and <= INR 1000", rate: "9%" },
                    { range: "item price > INR 1000", rate: "13.5%" },
                ]
            },
            {
                name: "School Textbook Bundles",
                rates: [
                    { range: "item price <= 250", rate: "2.0%" },
                    { range: "item price > 250 and <= 1,000", rate: "3.0%" },
                    { range: "item price > 1,000 and <= 1,500", rate: "4.0%" },
                    { range: "item price > 1,500", rate: "4.5%" },
                ]
            },
            {
                name: "Movies",
                rates: [
                    { range: "All prices", rate: "6.5%" },
                ]
            },
            {
                name: "Music",
                rates: [
                    { range: "All prices", rate: "6.5%" },
                ]
            },
            {
                name: "Email Gift Cards",
                rates: [
                    { range: "All prices", rate: "0%" },
                ]
            },
            {
                name: "Musical Instruments - Guitars",
                rates: [
                    { range: "item price <= 500", rate: "10.0%" },
                    { range: "item price > 500 and <= 1000", rate: "8.0%" },
                    { range: "item price > 1000", rate: "10.0%" },
                ]
            },
            {
                name: "Musical Instruments - Keyboards",
                rates: [
                    { range: "item price <= 500", rate: "8.0%" },
                    { range: "item price > 500 and <= 1000", rate: "12.0%" },
                    { range: "item price > 1000", rate: "8.0%" },
                ]
            },
            {
                name: "Musical Instruments - Microphones",
                rates: [
                    { range: "item price <= 1000", rate: "9.5%" },
                    { range: "item price > 1000", rate: "11.5%" },
                ]
            },
            {
                name: "Musical Instruments - Others",
                rates: [
                    { range: "item price <= 300", rate: "10.0%" },
                    { range: "item price > 300 and <= 500", rate: "7.0%" },
                    { range: "item price > 500 and <= 1,000", rate: "10.5%" },
                    { range: "item price > 1,000", rate: "11.0%" },
                ]
            },
            {
                name: "Musical Instruments - DJ & VJ Equipment, Recording and Computer, Cables & Leads, PA & Stage",
                rates: [
                    { range: "item price <= 300", rate: "6.0%" },
                    { range: "item price > 300 and <= 500", rate: "4.5%" },
                    { range: "item price > 500 and <= 1000", rate: "5.5%" },
                    { range: "item price > 1000", rate: "11.0%" },
                ]
            },
            {
                name: "Video Games - Online game services",
                rates: [
                    { range: "item price <= 1,000", rate: "0.0%" },
                    { range: "item price > 1,000 and <= 2,000", rate: "2.0%" },
                    { range: "item price > 2,000", rate: "3.0%" },
                ]
            },
            {
                name: "Video Games - Accessories",
                rates: [
                    { range: "item price <= 500", rate: "10.5%" },
                    { range: "item price > 500 and <= 1000", rate: "12.5%" },
                    { range: "item price > 1000", rate: "13.5%" },
                ]
            },
            {
                name: "Video Games - Consoles",
                rates: [
                    { range: "item price <= 500", rate: "7.0%" },
                    { range: "item price > 500 & <= 1000", rate: "5.0%" },
                    { range: "item price > 1000", rate: "9.0%" },
                ]
            },
            {
                name: "Video Games- other products",
                rates: [
                    { range: "item price <= 500", rate: "9.0%" },
                    { range: "item price > 500 and <= 1,000", rate: "10.0%" },
                    { range: "item price > 1,000", rate: "12.0%" },
                ]
            }
        ]
    },
    {
        name: "Industrial, Medical, Scientific Supplies & Office Products",
        subCategories: [
            {
                name: "Business and Industrial Supplies - Scientific Supplies",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 15000", rate: "11.5%" },
                    { range: "item price > 15000", rate: "7.0%" },
                ]
            },
            {
                name: "OTC Medicine",
                rates: [
                    { range: "item price <= 500", rate: "12.0%" },
                    { range: "item price > 500", rate: "15.0%" },
                ]
            },
            {
                name: "Masks",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "8.0%" },
                ]
            },
            {
                name: "Weighing Scales & Fat Analyzers",
                rates: [
                    { range: "item price <= 300", rate: "11.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.5%" },
                    { range: "item price > 500", rate: "13.5%" },
                ]
            },
            {
                name: "3D Printers",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "12.0%" },
                ]
            },
            {
                name: "Business and Industrial Supplies - Electrical Testing, Dimensional Measurement, Thermal Printers, Barcode Scanners",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "6.0%" },
                ]
            },
            {
                name: "Business & Industrial Supplies - Commercial, Food Handling Equipment and Health Supplies",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "5.5%" },
                ]
            },
            {
                name: "Body Support - Wearables and Soft Aids",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "6.0%" },
                ]
            },
            {
                name: "Stethoscopes",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "10.5%" },
                ]
            },
            {
                name: "Packing materials",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "5.0%" },
                ]
            },
            {
                name: "Power & hand Tools and Water Dispenser",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "8.0%" },
                    { range: "item price > 500", rate: "10.0%" },
                ]
            },
            {
                name: "Office products - Office supplies",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.0%" },
                    { range: "item price > 500 and <= 1000", rate: "12.0%" },
                    { range: "item price > 1000", rate: "13.0%" },
                ]
            },
            {
                name: "Office Furniture - Study Table, Office and Gaming Chairs",
                rates: [
                    { range: "item price <= 1,000", rate: "16.5%" },
                    { range: "item price > 1,000 and <= 15,000", rate: "15.5%" },
                    { range: "item price > 15,000", rate: "11.0%" },
                ]
            },
            {
                name: "Office products - Electronic Devices",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "4.5%" },
                    { range: "item price > 500 and <= 1000", rate: "10.5%" },
                    { range: "item price > 1000", rate: "11.5%" },
                ]
            },
            {
                name: "Office products - Arts and Crafts",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "2.0%" },
                    { range: "item price > 500", rate: "5.0%" },
                ]
            },
            {
                name: "Office products - Writing Instruments",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1000", rate: "11.0%" },
                    { range: "item price > 1000", rate: "14.0%" },
                ]
            }
        ]
    },
    {
        name: "Clothing, Fashion, Fashion Accessories, Jewellery, Luggage, Shoes",
        subCategories: [
            {
                name: "Apparel - Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "13.0%" },
                    { range: "item price > 500 and <= 1000", rate: "17.0%" },
                    { range: "item price > 1000", rate: "19.0%" },
                ]
            },
            {
                name: "Apparel - Sweat Shirts and Jackets",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "14.0%" },
                    { range: "item price > 500", rate: "18.0%" },
                ]
            },
            {
                name: "Apparel - Shorts",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "2.0%" },
                    { range: "item price > 500 and <= 1000", rate: "19.5%" },
                    { range: "item price > 1000", rate: "24.0%" },
                ]
            },
            {
                name: "Apparel - Baby",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price >300", rate: "7.0%" },
                ]
            },
            {
                name: "Apparel - Ethnic wear",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "1.0%" },
                    { range: "item price > 500 and <= 1000", rate: "10.0%" },
                    { range: "item price > 1000", rate: "16.5%" },
                ]
            },
            {
                name: "Apparel - Other innerwear",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "7.0%" },
                    { range: "item price > 500 and <= 1000", rate: "16.5%" },
                    { range: "item price > 1000", rate: "18.5%" },
                ]
            },
            {
                name: "Apparel - Sleepwear",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.0%" },
                    { range: "item price > 500 and <= 1000", rate: "13.0%" },
                    { range: "item price > 1000", rate: "19.0%" },
                ]
            },
            {
                name: "Apparel - Sarees and Dress Materials",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "4.0%" },
                    { range: "item price > 500 and <= 1000", rate: "12.0%" },
                    { range: "item price > 1000", rate: "23.0%" },
                ]
            },
            {
                name: "Apparel - Dress",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "4.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "15.0%" },
                    { range: "item price > 1,000", rate: "19.0%" },
                ]
            },
            {
                name: "Apparel - Shirts",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "4.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "12.0%" },
                    { range: "item price > 1,000", rate: "21.0%" },
                ]
            },
            {
                name: "Apparel - Socks and Stockings",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.0%" },
                    { range: "item price > 500 and <= 1,000", rate: "11.0%" },
                    { range: "item price > 1,000", rate: "19.0%" },
                ]
            },
            {
                name: "Apparel - Thermals",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "4.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "11.0%" },
                    { range: "item price > 1,000", rate: "19.0%" },
                ]
            },
            {
                name: "Apparel - Men's T-shirts (except Tank tops and full sleeve tops)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.0%" },
                    { range: "item price > 500 and <= 1,000", rate: "17.0%" },
                    { range: "item price > 1,000", rate: "23.0%" },
                ]
            },
            {
                name: "Apparel - Womens' Innerwear / Lingerie",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "12.0%" },
                    { range: "item price > 500", rate: "18.0%" },
                ]
            },
            {
                name: "Pants - Trousers, Jeans, Trackpants and Leggings",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "4.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "15.0%" },
                    { range: "item price > 1,000", rate: "19.0%" },
                ]
            },
            {
                name: "Backpacks",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.0%" },
                    { range: "item price > 500 and <= 1000", rate: "12.0%" },
                    { range: "item price > 1000", rate: "14.5%" },
                ]
            },
            {
                name: "Eyewear - Sunglasses, Frames and zero power eye glasses",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "9.0%" },
                    { range: "item price > 500 and <= 1000", rate: "14.5%" },
                    { range: "item price > 1000", rate: "18.5%" },
                ]
            },
            {
                name: "Fashion Jewellery",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "17.5%" },
                    { range: "item price > 500", rate: "22.5%" },
                ]
            },
            {
                name: "Fine Jewellery - Gold Coins",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "5.0%" },
                ]
            },
            {
                name: "Fine Jewellery - studded",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "13.0%" },
                ]
            },
            {
                name: "Fine Jewellery - unstudded and solitaire",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "5.0%" },
                ]
            },
            {
                name: "Silver Jewellery",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1000", rate: "10.5%" },
                    { range: "item price > 1000", rate: "13.0%" },
                ]
            },
            {
                name: "Flip Flops, Fashion Sandals and Slippers",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "4.0%" },
                    { range: "item price > 500 and <= 1000", rate: "12.5%" },
                    { range: "item price > 1000", rate: "15.0%" },
                ]
            },
            {
                name: "Handbags",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.5%" },
                    { range: "item price > 500 and <= 1000", rate: "11.0%" },
                    { range: "item price > 1000", rate: "12.0%" },
                ]
            },
            {
                name: "Luggage - Suitcase & Trolleys",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "1.5%" },
                    { range: "item price > 500 and <= 1000", rate: "6.5%" },
                    { range: "item price > 1000", rate: "5.5%" },
                ]
            },
            {
                name: "Luggage - Travel Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "9.0%" },
                    { range: "item price > 500 and <= 1000", rate: "10.0%" },
                    { range: "item price > 1000", rate: "12.0%" },
                ]
            },
            {
                name: "Kids shoes",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1000", rate: "14.0%" },
                    { range: "item price > 1000", rate: "16%" },
                ]
            },
            {
                name: "Shoes",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.0%" },
                    { range: "item price > 500 and <= 1000", rate: "10.0%" },
                    { range: "item price > 1000", rate: "16.5%" },
                ]
            },
            {
                name: "Wallets",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.0%" },
                    { range: "item price > 500 and <= 1000", rate: "12.5%" },
                    { range: "item price > 1000", rate: "14.0%" },
                ]
            },
            {
                name: "Watches",
                rates: [
                    { range: "item price <= 300", rate: "14.0%" },
                    { range: "item price > 300 and <= 500", rate: "8.0%" },
                    { range: "item price > 500", rate: "15.0%" },
                ]
            }
        ]
    },
    {
        name: "Electronics (Camera, Mobile, PC, Wireless) & Accessories",
        subCategories: [
            {
                name: "Cables and Adapters",
                rates: [
                    { range: "item price <=300", rate: "21.5%" },
                    { range: "item price >300 and <=500", rate: "17.0%" },
                    { range: "item price >500", rate: "20.0%" },
                ]
            },
            {
                name: "Camera Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "11.0%" },
                    { range: "item price > 500 and <= 1,000", rate: "12.5%" },
                    { range: "item price > 1,000", rate: "13.5%" },
                ]
            },
            {
                name: "Camera Lenses",
                rates: [
                    { range: "item price <= 1000", rate: "7.0%" },
                    { range: "item price > 1000", rate: "10.0%" },
                ]
            },
            {
                name: "Camera and Camcorder",
                rates: [
                    { range: "item price <= 1000", rate: "5.0%" },
                    { range: "item price > 1000", rate: "7.0%" },
                ]
            },
            {
                name: "Cases, Covers, Skins, Screen Guards",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "22.0%" },
                    { range: "item price > 500", rate: "25.0%" },
                ]
            },
            {
                name: "Desktops",
                rates: [
                    { range: "All prices", rate: "8%" },
                ]
            },
            {
                name: "Electronic Accessories (Electronics, PC & Wireless)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "17.0%" },
                    { range: "item price > 500 and <= 1,000", rate: "15.5%" },
                    { range: "item price > 1,000", rate: "17.0%" },
                ]
            },
            {
                name: "Electronic Devices (except TV, Camera & Camcorder, Camera Lenses and Accessories, GPS Devices, Speakers)",
                rates: [
                    { range: "item price <= 1000", rate: "9.0%" },
                    { range: "item price > 1000", rate: "11.0%" },
                ]
            },
            {
                name: "Entertainment Collectibles",
                rates: [
                    { range: "item price <= 300", rate: "13%" },
                    { range: "item price > 300", rate: "17%" },
                ]
            },
            {
                name: "GPS Devices",
                rates: [
                    { range: "item price <= 300", rate: "13.5%" },
                    { range: "item price > 300 and <= 500", rate: "12.5%" },
                    { range: "item price > 500", rate: "13.5%" },
                ]
            },
            {
                name: "Hard Disks",
                rates: [
                    { range: "item price <= 1000", rate: "9.5%" },
                    { range: "item price > 1000", rate: "12.5%" },
                ]
            },
            {
                name: "Headsets, Headphones and Earphones",
                rates: [
                    { range: "item price <= 500", rate: "18.0%" },
                    { range: "item price >500 and <= 1,000", rate: "17.5%" },
                    { range: "item price > 1,000", rate: "18.0%" },
                ]
            },
            {
                name: "Computer & Laptop - Keyboards & Mouse",
                rates: [
                    { range: "item price <=500", rate: "14.0%" },
                    { range: "item price >500 and <= 1,000", rate: "14.5%" },
                    { range: "item price > 1,000", rate: "17%" },
                ]
            },
            {
                name: "Kindle Accessories",
                rates: [
                    { range: "All prices", rate: "25%" },
                ]
            },
            {
                name: "Laptop Bags & Sleeves",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.0%" },
                    { range: "item price > 500 and <= 1000", rate: "12.0%" },
                    { range: "item price > 1000", rate: "14.5%" },
                ]
            },
            {
                name: "Laptop and Camera Battery",
                rates: [
                    { range: "item price <= 300", rate: "14.0%" },
                    { range: "item price >300 and <=500", rate: "12.5%" },
                    { range: "item price >500 and <= 1,000", rate: "14.0%" },
                    { range: "item price > 1,000", rate: "15.5%" },
                ]
            },
            {
                name: "Laptops",
                rates: [
                    { range: "item price <= 70,000", rate: "6.0%" },
                    { range: "item price >70,000", rate: "7.0%" },
                ]
            },
            {
                name: "Memory Cards",
                rates: [
                    { range: "All prices", rate: "16%" },
                ]
            },
            {
                name: "Mobile phones",
                rates: [
                    { range: "All prices", rate: "5%" },
                ]
            },
            {
                name: "Tablets (including Graphic Tablets)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 12,000", rate: "6.0%" },
                    { range: "item price > 12,000", rate: "10.0%" },
                ]
            },
            {
                name: "Modems & Networking Devices",
                rates: [
                    { range: "All prices", rate: "14%" },
                ]
            },
            {
                name: "Monitors",
                rates: [
                    { range: "item price <= 1,000", rate: "6.5%" },
                    { range: "item price > 1,000", rate: "8.0%" },
                ]
            },
            {
                name: "PC Components (RAM, Motherboards)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "5.5%" },
                ]
            },
            {
                name: "Power Banks & Chargers",
                rates: [
                    { range: "item price <= INR 1000", rate: "20%" },
                    { range: "item price > INR 1000", rate: "20.5%" },
                ]
            },
            {
                name: "Printers & Scanners",
                rates: [
                    { range: "item price <= 1000", rate: "9.0 %" },
                    { range: "item price > 1000", rate: "10.5 %" },
                ]
            },
            {
                name: "Software Products",
                rates: [
                    { range: "item price <= 500", rate: "0.0%" },
                    { range: "item price > 500 and <= 1,000", rate: "8%" },
                    { range: "item price > 1,000 and <= 2,000", rate: "7.5%" },
                    { range: "item price > 2,000", rate: "9.5%" },
                ]
            },
            {
                name: "Speakers",
                rates: [
                    { range: "item price <= 500", rate: "11.0%" },
                    { range: "item price > 500 and <= 1000", rate: "11.5%" },
                    { range: "item price > 1000", rate: "14.0%" },
                ]
            },
            {
                name: "Television",
                rates: [
                    { range: "All prices", rate: "6%" },
                ]
            },
            {
                name: "Landline Phones",
                rates: [
                    { range: "All prices", rate: "7%" },
                ]
            },
            {
                name: "Smart Watches & Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "15.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "16.5%" },
                    { range: "item price > 1,000", rate: "17.0%" },
                ]
            },
            {
                name: "USB Flash Drives (Pen Drives)",
                rates: [
                    { range: "All prices", rate: "16%" },
                ]
            },
            {
                name: "Projectors, Home Theatre Systems, Binoculars and Telescopes",
                rates: [
                    { range: "All prices", rate: "6.00%" },
                ]
            }
        ]
    },
    {
        name: "Grocery, Food & Pet Supplies",
        subCategories: [
            {
                name: "Grocery - herbs and spices",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1000", rate: "5.5%" },
                    { range: "item price > 1000", rate: "8.0%" },
                ]
            },
            {
                name: "Grocery & Gourmet - Oils",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "1.5%" },
                    { range: "item price > 500 and <= 1000", rate: "7.5%" },
                    { range: "item price > 1000", rate: "9.0%" },
                ]
            },
            {
                name: "Grocery - Dried fruits and nuts",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.0%" },
                    { range: "item price > 500 and <= 1000", rate: "8.0%" },
                    { range: "item price > 1000", rate: "9.0%" },
                ]
            },
            {
                name: "Grocery - Hampers and gifting",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.0%" },
                    { range: "item price > 500 and <= 1000", rate: "9.0%" },
                    { range: "item price > 1000", rate: "11.5%" },
                ]
            },
            {
                name: "Pet food",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1000", rate: "11.5%" },
                    { range: "item price > 1000", rate: "12.5%" },
                ]
            },
            {
                name: "Pet - Aquatics Supplies",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.5%" },
                    { range: "item price > 500", rate: "14.0%" },
                ]
            },
            {
                name: "Pet Products",
                rates: [
                    { range: "item price <= 300", rate: "2.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.5%" },
                    { range: "item price > 500", rate: "12.0%" },
                ]
            },
            {
                name: "Pet comforters including Bed, Feeder, Cages, Carriers, Crates, Kennels and Doors",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "11.0%" },
                    { range: "item price > 1,000", rate: "12.5%" },
                ]
            },
            {
                name: "Pet Essentials including Health Care, Grooming Aids, Shower and Bath Supplies, Supplements and Vitamins, Tick and Flea Control, Dental Care",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "12.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "13.0%" },
                    { range: "item price > 1,000", rate: "14.0%" },
                ]
            },
            {
                name: "Pet Accessories including Apparel, Collar, Leash and Harness",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "11.0%" },
                    { range: "item price > 500", rate: "12.5%" },
                ]
            }
        ]
    },
    {
        name: "Health, Beauty, Personal Care & Personal Care Appliances",
        subCategories: [
            {
                name: "Beauty - Fragrance",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "12.5%" },
                    { range: "item price > 500", rate: "14.0%" },
                ]
            },
            {
                name: "Beauty - Haircare, Bath and Shower",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.0%" },
                    { range: "item price > 500", rate: "8.0%" },
                ]
            },
            {
                name: "Beauty - Makeup",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "2.0%" },
                    { range: "item price > 500 and <= 1000", rate: "3.5%" },
                    { range: "item price > 1000", rate: "7.0%" },
                ]
            },
            {
                name: "Face Wash",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.0%" },
                    { range: "item price > 500 and <= 1000", rate: "9.0%" },
                    { range: "item price > 1000", rate: "9.5%" },
                ]
            },
            {
                name: "Moisturizer cream",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.5%" },
                    { range: "item price > 500 and <= 1000", rate: "9.0%" },
                    { range: "item price > 1000", rate: "9.5%" },
                ]
            },
            {
                name: "Sunscreen",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.0%" },
                    { range: "item price > 500 and <= 1000", rate: "9.0%" },
                    { range: "item price > 1000", rate: "9.5%" },
                ]
            },
            {
                name: "Deodrants",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1000", rate: "6.5%" },
                    { range: "item price > 1000", rate: "7.0%" },
                ]
            },
            {
                name: "Facial steamers",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "2.5%" },
                    { range: "item price > 500", rate: "7.0%" },
                ]
            },
            {
                name: "Health and Personal Care - Ayurvedic products, Oral care, hand sanitizers, Pooja supplies",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.0%" },
                    { range: "item price > 500", rate: "7.0%" },
                ]
            },
            {
                name: "Health & Household - Sports Nutrition and meal replacement shakes",
                rates: [
                    { range: "All prices", rate: "9%" },
                ]
            },
            {
                name: "Health and Household - Household Cleaning, Laundry, Air Fresheners, Personal Hygiene (Hand Wash)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "4.5%" },
                    { range: "item price > 500 and <= 1000", rate: "7.5%" },
                    { range: "item price > 1000", rate: "8.0%" },
                ]
            },
            {
                name: "Health and Household - Sports Nutrition and Meal Replacement Shakes",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "9.0%" },
                    { range: "item price > 500", rate: "9.5%" },
                ]
            },
            {
                name: "Health and Household - Vitamins & Mineral Health Supplements",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "9.0%" },
                    { range: "item price > 500 and <= 1000", rate: "10.5%" },
                    { range: "item price > 1000", rate: "11.0%" },
                ]
            },
            {
                name: "Luxury Beauty",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.0%" },
                    { range: "item price > 500 and <= 1000", rate: "9.0%" },
                    { range: "item price > 1000", rate: "10.0%" },
                ]
            },
            {
                name: "Pharmacy - Prescription Medicines",
                rates: [
                    { range: "All prices", rate: "7%" },
                ]
            },
            {
                name: "Car Cradles, Lens Kits and Tablet Cases",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.0%" },
                    { range: "item price > 500 and <= 1,000", rate: "11.5%" },
                    { range: "item price > 1,000", rate: "12.5%" },
                ]
            },
            {
                name: "Personal Care Appliances - Electric Massagers",
                rates: [
                    { range: "item price <= 500", rate: "9.5%" },
                    { range: "item price >500 and <= 1,000", rate: "13.5%" },
                    { range: "item price > 1,000", rate: "14.5%" },
                ]
            },
            {
                name: "Health and Household - Medical Equipment, Sexual Wellness, Adult Incontinence, Elderly Care",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "8.0%" },
                ]
            },
            {
                name: "Personal Care Appliances - Glucometer and Glucometer Strips",
                rates: [
                    { range: "All prices", rate: "5.5%" },
                ]
            },
            {
                name: "Personal Care Appliances - Thermometers",
                rates: [
                    { range: "item price <=500", rate: "12.5%" },
                    { range: "item price >500", rate: "10.5%" },
                ]
            },
            {
                name: "Personal Care Appliances (Grooming & Styling)",
                rates: [
                    { range: "item price > 500 and <= 1000", rate: "7.0%" },
                    { range: "item price > 1000", rate: "9.5%" },
                ]
            },
            {
                name: "Personal Care Appliances - Weighing Scales and Fat Analyzers",
                rates: [
                    { range: "item price <= 300", rate: "11.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.5%" },
                    { range: "item price > 500", rate: "13.5%" },
                ]
            },
            {
                name: "Feminine Hygiene and Care",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "2.0%" },
                    { range: "item price > 500 and <= 1,000", rate: "7.5%" },
                    { range: "item price > 1,000", rate: "8.0%" },
                ]
            },
            {
                name: "Personal Care Appliances - Electric Pain Relief Devices (Electric Heating Pads, Electric Hot Water Bags, EMS, Tens)",
                rates: [
                    { range: "All prices", rate: "7.5%" },
                ]
            },
            {
                name: "Personal Care Appliances - Electric Tooth brush, Oral Irrigators and Accessories",
                rates: [
                    { range: "item price <= 300", rate: "4.5%" },
                    { range: "item price > 300 and <= 500", rate: "5.5%" },
                    { range: "item price > 500", rate: "7.5%" },
                ]
            },
            {
                name: "Personal Care Appliances - Blood Pressure Monitors",
                rates: [
                    { range: "item price <= 300", rate: "9.5%" },
                    { range: "item price > 300 and <= 500", rate: "11.5%" },
                    { range: "item price > 500 and <= 1,000", rate: "8.5%" },
                    { range: "item price > 1,000", rate: "7.5%" },
                ]
            }
        ]
    },
    {
        name: "Home, Décor, Home Improvement, Furniture, Outdoor, Lawn & Garden",
        subCategories: [
            {
                name: "Bean Bags & Inflatables",
                rates: [
                    { range: "All prices", rate: "8.0%" },
                ]
            },
            {
                name: "Mattresses",
                rates: [
                    { range: "item price <= INR 1000", rate: "25.5%" },
                    { range: "item price > INR 1000 and <= INR 20000", rate: "16%" },
                    { range: "item price > INR 20000", rate: "13.5%" },
                ]
            },
            {
                name: "Rugs and Doormats",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "2.0%" },
                    { range: "item price > 500", rate: "9.0%" },
                ]
            },
            {
                name: "Clocks",
                rates: [
                    { range: "item price <= 500", rate: "0.0%" },
                    { range: "item price > 500 and <= 1000", rate: "9.0%" },
                    { range: "item price > 1000", rate: "10.0%" },
                ]
            },
            {
                name: "Wall Art",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "11.0%" },
                    { range: "item price > 500", rate: "13.5%" },
                ]
            },
            {
                name: "Home - Fragrance & Candles",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.0%" },
                    { range: "item price > 500", rate: "12.5%" },
                ]
            },
            {
                name: "Bedsheets, Blankets and covers",
                rates: [
                    { range: "item price <= 500", rate: "0.0%" },
                    { range: "item price > 500 and <= 1000", rate: "7.0%" },
                    { range: "item price > 1000", rate: "8.5%" },
                ]
            },
            {
                name: "Home furnishing (Excluding curtain and curtain accessories)",
                rates: [
                    { range: "item price <= 500", rate: "0.0%" },
                    { range: "item price > 500 and <= 1000", rate: "7.0%" },
                    { range: "item price > 1000", rate: "11.0%" },
                ]
            },
            {
                name: "Containers, Boxes, Bottles, and Kitchen Storage",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.0%" },
                    { range: "item price > 500", rate: "12.0%" },
                ]
            },
            {
                name: "Home improvement - Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "2.5%" },
                    { range: "item price > 500", rate: "13.5%" },
                ]
            },
            {
                name: "Tiles & Flooring Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price >300", rate: "8.0%" },
                ]
            },
            {
                name: "Wires (Electrical Wires/cables for house wiring, ad hoc usage)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price >300", rate: "10.0%" },
                ]
            },
            {
                name: "Home Storage (Excluding Kitchen Containers, Boxes, Bottles, and Kitchen Storage)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "3.0%" },
                    { range: "item price > 500 and <= 1000", rate: "11.0%" },
                    { range: "item price > 1000", rate: "15.0%" },
                ]
            },
            {
                name: "Wallpapers & Wallpaper Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "9.0%" },
                    { range: "item price > 500 and <= 1000", rate: "8.0%" },
                    { range: "item price > 1000", rate: "6.5%" },
                ]
            },
            {
                name: "Home Decor Products",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "3.0%" },
                    { range: "item price > 500 and <= 1000", rate: "12.0%" },
                    { range: "item price > 1000", rate: "17.0%" },
                ]
            },
            {
                name: "Wall Paints and Tools",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price >300", rate: "6.0%" },
                ]
            },
            {
                name: "Home - Waste & Recycling",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "8.0%" },
                ]
            },
            {
                name: "Craft materials",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "2.0%" },
                    { range: "item price > 500", rate: "5.0%" },
                ]
            },
            {
                name: "Water Purifier and Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 5000", rate: "6.5%" },
                    { range: "item price > 5000", rate: "7.5%" },
                ]
            },
            {
                name: "Water Heaters and Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 5000", rate: "8.0%" },
                    { range: "item price > 5000", rate: "9.0%" },
                ]
            },
            {
                name: "Home improvement - Kitchen & Bath (Fittings, accessories), Cleaning Supplies, Electricals, Hardware, Building Materials",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "10.0%" },
                    { range: "item price > 500", rate: "12.0%" },
                ]
            },
            {
                name: "Sanitaryware - Toilets, Bathtubs, Basins/Sinks, Bath Mirrors & Vanities, and Shower Enclosures/partitions",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "8.0%" },
                ]
            },
            {
                name: "Home Safety & Security Systems",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.0%" },
                    { range: "item price > 500 and <= 1000", rate: "8.0%" },
                    { range: "item price > 1000", rate: "6.0%" },
                ]
            },
            {
                name: "Inverter and Batteries",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "4.5%" },
                ]
            },
            {
                name: "Cleaning and Home Appliances",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 5000", rate: "7.5%" },
                    { range: "item price > 5000", rate: "8.5%" },
                ]
            },
            {
                name: "Ladders",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "8.0%" },
                ]
            },
            {
                name: "Indoor Lighting – Wall, ceiling fixture lights, lamp bases, lamp shades and Smart Lighting",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.0%" },
                    { range: "item price > 500 and <= 1000", rate: "14.5%" },
                    { range: "item price > 1000", rate: "12.5%" },
                ]
            },
            {
                name: "Doors and Windows (wooden, metal, PVC/UPVC Doors & Windows)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "10.0%" },
                ]
            },
            {
                name: "LED Bulbs and Battens",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.5%" },
                    { range: "item price > 500", rate: "14.0%" },
                ]
            },
            {
                name: "Cushion Covers",
                rates: [
                    { range: "item price <= 500", rate: "0.0%" },
                    { range: "item price > 500", rate: "10.0%" },
                ]
            },
            {
                name: "Curtains and Curtain Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "16.5%" },
                    { range: "item price > 500 and <= 1000", rate: "11.5%" },
                    { range: "item price > 1000", rate: "16.5%" },
                ]
            },
            {
                name: "Slipcovers and Kitchen Linens",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.5%" },
                    { range: "item price > 500", rate: "15.5%" },
                ]
            },
            {
                name: "Safes and Lockers with Locking Mechanism",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "12.0%" },
                ]
            },
            {
                name: "Lawn & Garden - Solar Panels",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "6.0%" },
                ]
            },
            {
                name: "Lawn & Garden - Leaf blower and Water pump",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "6.5%" },
                ]
            },
            {
                name: "Lawn & Garden- Chemical Pest Control, Mosquito nets, Bird control, Plant protection, Foggers",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1000", rate: "7.0%" },
                    { range: "item price > 1000", rate: "9.0%" },
                ]
            },
            {
                name: "Lawn & Garden - Solar Devices (Panels, Inverters, Charge controller, Battery, Lights, Solar gadgets)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price >300", rate: "8.0%" },
                ]
            },
            {
                name: "Lawn and Garden - Plants, Seeds & Bulbs",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "9.5%" },
                    { range: "item price > 500 and <= 1000", rate: "11.5%" },
                    { range: "item price > 1000", rate: "11.0%" },
                ]
            },
            {
                name: "Lawn & Garden - Outdoor equipments (Saws, Lawn Mowers, Cultivator, Tiller, String Trimmers, Water Pumps, Generators, Barbeque Grills, Greenhouses)",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "6.5%" },
                ]
            }
        ]
    },
    {
        name: "Kitchen, Large & Small Appliances",
        subCategories: [
            {
                name: "Kitchen - Glassware & Ceramicware",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "4.0%" },
                    { range: "item price > 500 and <= 1000", rate: "11.0%" },
                    { range: "item price > 1000", rate: "12.5%" },
                ]
            },
            {
                name: "Kitchen - Gas Stoves & Pressure Cookers",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1500", rate: "6.0%" },
                    { range: "item price > 1500", rate: "10.0%" },
                ]
            },
            {
                name: "Cookware, Tableware & Dinnerware",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.0%" },
                    { range: "item price > 500 and <= 1000", rate: "9.0%" },
                    { range: "item price > 1000", rate: "12.5%" },
                ]
            },
            {
                name: "Kitchen Tools & Supplies - Choppers, Knives, Bakeware & Accessories",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.0%" },
                    { range: "item price > 500", rate: "12.5%" },
                ]
            },
            {
                name: "Large Appliances (excl. Accessories, Refrigerators and Chimneys)",
                rates: [
                    { range: "All prices", rate: "5.5%" },
                ]
            },
            {
                name: "Large Appliances - Accessories",
                rates: [
                    { range: "All prices", rate: "16%" },
                ]
            },
            {
                name: "Large Appliances - Chimneys",
                rates: [
                    { range: "All prices", rate: "9.5%" },
                ]
            },
            {
                name: "Large Appliances – Refrigerators",
                rates: [
                    { range: "All prices", rate: "5%" },
                ]
            },
            {
                name: "Small Appliances",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1000", rate: "6.5%" },
                    { range: "item price > 1000 and <= 5000", rate: "4.5%" },
                    { range: "item price > 5000", rate: "8.0%" },
                ]
            },
            {
                name: "Fans and Robotic Vacuums",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 3000", rate: "6.5%" },
                    { range: "item price > 3000", rate: "8.0%" },
                ]
            }
        ]
    },
    {
        name: "Sports, Gym & Sporting Equipment",
        subCategories: [
            {
                name: "Bicycles",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 1000", rate: "5.5%" },
                    { range: "item price > 1000", rate: "6.0%" },
                ]
            },
            {
                name: "Gym Equipments",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.0%" },
                    { range: "item price > 500 and <= 1000", rate: "10.0%" },
                    { range: "item price > 1000 and <= 35000", rate: "12.0%" },
                    { range: "item price > 35000", rate: "10.0%" },
                ]
            },
            {
                name: "Sports- Cricket and Badminton Equipments, Tennis, Table Tennis , Squash, Football, Volleyball, Basketball , Throwball, Swimming",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "6.0%" },
                    { range: "item price > 500 and <= 1000", rate: "8.0%" },
                    { range: "item price > 1000", rate: "8.5%" },
                ]
            },
            {
                name: "Sports Collectibles",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300", rate: "17.0%" },
                ]
            },
            {
                name: "Sports - Cricket Bats, Badminton Racquets, Tennis Racquets, Pickleball Paddles, Squash Racquets and TT Tables",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "5.0%" },
                    { range: "item price > 500 and <= 1,000", rate: "7.0%" },
                    { range: "item price > 1,000", rate: "7.5%" },
                ]
            },
            {
                name: "Sports & Outdoors - Footwear",
                rates: [
                    { range: "item price <= 300", rate: "0.0%" },
                    { range: "item price > 300 and <= 500", rate: "12.5%" },
                    { range: "item price > 500 and <= 1000", rate: "14.5%" },
                    { range: "item price > 1000", rate: "16.0%" },
                ]
            }
        ]
    },
    {
        name: "Others",
        subCategories: [
            {
                name: "Gift Cards (Physical)",
                rates: [
                    { range: "All prices", rate: "2%" },
                ]
            },
            {
                name: "Silver Coins & Bars",
                rates: [
                    { range: "All prices", rate: "0.2%" },
                ]
            },
            {
                name: "Utility Bill Payments",
                rates: [
                    { range: "All prices", rate: "0.2%" },
                ]
            },
            {
                name: "Flight Bookings",
                rates: [
                    { range: "All prices", rate: "1%" },
                ]
            },
            {
                name: "Hotel & ClearTrip Bookings",
                rates: [
                    { range: "All prices", rate: "8%" },
                ]
            },
            {
                name: "Bus Bookings",
                rates: [
                    { range: "All prices", rate: "6.5%" },
                ]
            },
            {
                name: "Others",
                rates: [
                    { range: "All prices", rate: "6%" },
                ]
            }
        ]
    },
    // APPEND_NEXT_CATEGORY_HERE
];
