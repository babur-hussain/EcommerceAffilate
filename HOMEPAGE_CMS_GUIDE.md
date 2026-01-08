# Homepage CMS System - Complete Guide

## Overview
The homepage is now fully **CMS-driven** and controlled by **Admin** and **Business Manager** roles via API endpoints. The system supports multiple section types, drag-and-drop ordering, draft/published versioning, and automatic caching.

---

## Architecture

### Backend Components

1. **Model**: `apps/backend/src/models/homepageConfig.model.ts`
   - Single document per platform
   - Sections array with type, order, enabled, config
   - Draft/Published versioning system

2. **Admin Routes**: `apps/backend/src/routes/admin.homepage.route.ts`
   - GET `/api/admin/homepage` - Fetch current config
   - POST `/api/admin/homepage/sections` - Create section
   - PUT `/api/admin/homepage/sections/:id` - Update section
   - PATCH `/api/admin/homepage/reorder` - Reorder sections
   - POST `/api/admin/homepage/publish` - Publish changes (Admin only)

3. **Public Route**: `apps/backend/src/routes/homepage.route.ts`
   - GET `/api/homepage` - Rendered homepage (cached)
   - Resolves products dynamically per section
   - Returns published version only

### Frontend Components

- **Homepage**: `apps/web/src/app/page.tsx`
  - Fetches `/api/homepage` with fallbacks
  - Dynamically renders sections based on type
  - Maps section types to components

---

## Section Types

### 1. HERO_BANNER
Display a prominent hero banner (uses existing MainBanner component).

**Config Fields**:
```json
{
  "type": "HERO_BANNER",
  "title": "Optional title",
  "subtitle": "Optional subtitle",
  "enabled": true,
  "config": {}
}
```

### 2. TEXT_BANNER
Text-only banner with title and subtitle.

**Config Fields**:
```json
{
  "type": "TEXT_BANNER",
  "title": "Banner Title",
  "subtitle": "Banner description",
  "enabled": true,
  "config": {}
}
```

### 3. PRODUCT_CAROUSEL
Horizontal scrollable product list (ranked by popularity + sponsorships).

**Config Fields**:
```json
{
  "type": "PRODUCT_CAROUSEL",
  "title": "Featured Products",
  "enabled": true,
  "config": {
    "limit": 12
  }
}
```

### 4. SPONSORED_CAROUSEL
Product carousel prioritizing sponsored products.

**Config Fields**:
```json
{
  "type": "SPONSORED_CAROUSEL",
  "title": "Sponsored Deals",
  "enabled": true,
  "config": {
    "limit": 8
  }
}
```

### 5. CATEGORY_GRID
Products filtered by category.

**Config Fields**:
```json
{
  "type": "CATEGORY_GRID",
  "title": "Electronics",
  "enabled": true,
  "config": {
    "category": "Electronics",
    "limit": 12
  }
}
```

---

## API Endpoints

### Admin Endpoints (Require Auth + Admin/Manager Role)

#### Get Configuration
```bash
GET /api/admin/homepage
Authorization: Bearer <token>
```

**Response**:
```json
{
  "_id": "...",
  "isPublished": false,
  "draftVersion": 3,
  "publishedVersion": 2,
  "sections": [
    {
      "_id": "section-id-1",
      "type": "HERO_BANNER",
      "enabled": true,
      "order": 1,
      "title": "Welcome",
      "config": {}
    }
  ],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

#### Create Section
```bash
POST /api/admin/homepage/sections
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "PRODUCT_CAROUSEL",
  "title": "Best Sellers",
  "subtitle": "Top products this month",
  "enabled": true,
  "config": {
    "limit": 10
  }
}
```

**Response**: Full config with new section added at end.

#### Update Section
```bash
PUT /api/admin/homepage/sections/:sectionId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "config": {
    "limit": 15
  }
}
```

**Response**: Full config with updated section.

#### Reorder Sections
```bash
PATCH /api/admin/homepage/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderedIds": ["section-id-3", "section-id-1", "section-id-2"]
}
```

**Response**: Full config with new order applied.

#### Publish Changes (Admin Only)
```bash
POST /api/admin/homepage/publish
Authorization: Bearer <token>
```

**Response**: Full config with `isPublished: true` and updated `publishedVersion`.

---

### Public Endpoint (No Auth)

#### Get Rendered Homepage
```bash
GET /api/homepage
```

**Response**:
```json
{
  "version": 2,
  "sections": [
    {
      "type": "HERO_BANNER",
      "title": "Welcome"
    },
    {
      "type": "PRODUCT_CAROUSEL",
      "title": "Best Sellers",
      "items": [
        {
          "_id": "product-1",
          "title": "Product Name",
          "price": 29.99,
          "image": "https://...",
          "rating": 4.5,
          ...
        }
      ]
    }
  ]
}
```

- Only **published** config is returned
- Products are resolved dynamically from ranking service
- Response is **cached** with TTL (uses `env.cache.rankingHomeTtl`)
- Cache invalidated on any admin edit/publish

---

## Workflow

### Draft → Publish Workflow

1. **Create/Edit Sections** (Admin/Manager)
   - Add new sections via POST `/api/admin/homepage/sections`
   - Edit existing sections via PUT `/api/admin/homepage/sections/:id`
   - Reorder via PATCH `/api/admin/homepage/reorder`
   - Each change increments `draftVersion`

2. **Preview Draft** (Admin/Manager)
   - Currently, preview shows config in GET `/api/admin/homepage`
   - Frontend could add a preview mode checking draftVersion

3. **Publish** (Admin Only)
   - POST `/api/admin/homepage/publish`
   - Sets `isPublished: true` and `publishedVersion = draftVersion`
   - Clears public cache
   - Frontend immediately reflects new layout

4. **Public View**
   - GET `/api/homepage` returns only published version
   - If not published, returns `{ version: 0, sections: [] }`
   - Frontend falls back to ranked products

---

## Permissions

| Endpoint                          | Admin | Business Manager | Public |
|-----------------------------------|-------|------------------|--------|
| GET `/api/admin/homepage`         | ✅    | ✅               | ❌     |
| POST `/api/admin/homepage/sections` | ✅    | ✅               | ❌     |
| PUT `/api/admin/homepage/sections/:id` | ✅    | ✅               | ❌     |
| PATCH `/api/admin/homepage/reorder` | ✅    | ✅               | ❌     |
| **POST `/api/admin/homepage/publish`** | **✅** | **❌**       | ❌     |
| GET `/api/homepage`               | ✅    | ✅               | ✅     |

**Note**: Only **Admin** can publish. Managers can draft/edit but not make changes live.

---

## Caching

- **Cache Key**: `homepage:rendered`
- **TTL**: `env.cache.rankingHomeTtl` (default: same as ranking)
- **Invalidation**: Automatic on:
  - Section create
  - Section update
  - Section reorder
  - Publish

**Manual Cache Clear** (if needed):
```typescript
import { delCache } from '../utils/cache';
delCache('homepage:rendered');
```

---

## Frontend Integration

### Current Implementation

The homepage (`apps/web/src/app/page.tsx`) now:
1. Fetches GET `/api/homepage`
2. Falls back to `/ranking/homepage` → `/products` if empty
3. Dynamically renders each section by type:
   - `HERO_BANNER` → MainBanner component
   - `TEXT_BANNER` → Title/subtitle card
   - `PRODUCT_CAROUSEL` / `SPONSORED_CAROUSEL` / `CATEGORY_GRID` → ProductRow

### Adding New Section Types

1. Add type to `HomepageSectionType` in model
2. Handle resolution in `homepage.route.ts` switch
3. Add rendering case in `page.tsx` switch

---

## Example Admin UI (Future Enhancement)

You can build a dashboard at `/admin/homepage` with:
- Drag-and-drop section reordering
- Live preview toggle (Draft vs Published)
- Section editor form (title, config, enabled toggle)
- Publish button (Admin only)

**Suggested Libraries**:
- `react-beautiful-dnd` for drag-and-drop
- `react-hook-form` for section forms

---

## Testing

### Create First Section
```bash
# Login as Admin
curl -X POST http://localhost:4000/api/admin/homepage/sections \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "PRODUCT_CAROUSEL",
    "title": "Featured Products",
    "enabled": true,
    "config": { "limit": 12 }
  }'
```

### Publish
```bash
curl -X POST http://localhost:4000/api/admin/homepage/publish \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### View Public Homepage
```bash
curl http://localhost:4000/api/homepage
```

### Verify Frontend
Open http://localhost:3000 - you should see dynamically rendered sections.

---

## Migration Notes

- **Existing Homepages**: If you already seeded data, no migration needed. The system creates a default empty config on first access.
- **Initial Setup**: Create at least one section and publish it for the public homepage to show CMS content.
- **Fallback**: If no published config exists, frontend shows ranked products (backward compatible).

---

## Summary

✅ **Admin/Manager** control homepage layout via API  
✅ **Multiple section types** (Hero, Product Carousel, Category Grid, etc.)  
✅ **Draft/Publish workflow** with versioning  
✅ **Automatic caching** with invalidation on edits  
✅ **Dynamic frontend** rendering (no hardcoded layout)  
✅ **Role-based permissions** (Manager can draft, only Admin can publish)  
✅ **Public browsing** without authentication

This system gives you full control over homepage content, layout, and personalization without touching code!
