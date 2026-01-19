# How to Add and Seed New Sections (Safely)

This guide explains how to add a new section to a category page (like Furniture, Beauty, etc.) without breaking existing functionality.

## The 4-Step Process

### 1. Frontend: Create the Component
Create your React Native component.
**Crucial Safety Tip:** Always handle missing data gracefully to prevent **Blank Page Crashes**.

```tsx
// src/components/homepage/categories/furniture/MyNewSection.tsx

import { SectionProps } from '../../SectionRenderer';

export const MyNewSection = ({ data }: SectionProps) => {
    // SAFETY CHECK: If important data is missing, return null so the rest of the page still loads.
    if (!data?.items || data.items.length === 0) return null;

    return (
        <View>
            <Text>{data.title}</Text>
            {/* Render items... */}
        </View>
    );
};
```

### 2. Frontend: Register in `SectionRenderer`
Open `src/components/homepage/SectionRenderer.tsx` and add your new component to the switch statement.
**Tip:** Use a unique, descriptive string for the `case`.

```tsx
// src/components/homepage/SectionRenderer.tsx

import { MyNewSection } from './categories/furniture/MyNewSection';

export default function SectionRenderer({ section }) {
    switch (section.type) {
        // ... existing cases ...
        
        case 'furniture_my_new_section': // <--- UNIQUE TYPE ID
            return <MyNewSection data={section.content} />;
            
        // ...
    }
}
```

### 3. Backend: Update the Seed Script
Open `apps/backend/seed-all-category-layouts.js`. Find the layout object you want to update (e.g., `furnitureLayout`).
Add your new section object to the `sections` array.

```javascript
// apps/backend/seed-all-category-layouts.js

const furnitureLayout = {
    // ...
    sections: [
        // ... existing sections ...
        
        {
            id: 'furn_new_section_01',    // Unique ID for this specific instance
            type: 'furniture_my_new_section', // MUST MATCH the case in SectionRenderer
            priority: 55,                 // Determines order (lower = higher up)
            content: {                    // Passed as 'data' prop to your component
                title: 'My New Awesome Section',
                items: [
                    { name: 'Item 1', image: '...' },
                    { name: 'Item 2', image: '...' }
                ]
            }
        }
    ]
};
```

### 4. Execute the Seed Script
Run the script to update the MongoDB database.

```bash
cd apps/backend
node seed-all-category-layouts.js
```

## Best Practices to Avoid Breaking Things

1.  **Don't Change Existing IDs**: If you change the `id` of an existing section, the frontend might lose track of it if it relies on that ID for specific logic (rare, but possible).
2.  **Verify Data Types**: If your component expects an Array, make sure your seed script provides an Array. If it expects a String, provide a String.
3.  **Restart is Key**: After running the seed script, always **Reload** the mobile app (`R` or Shake -> Reload) to fetch the new layout from the backend.
4.  **Debug Script**: If the page is blank, check if your component is throwing an error. Use `debug-furniture-data.js` (or similar) to verify the data actually saved to the DB.
