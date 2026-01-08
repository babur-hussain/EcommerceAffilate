export type CategoryMeta = {
  title?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  // Example:
  // electronics: {
  //   title: 'Electronics',
  //   description: 'Latest gadgets and devices',
  //   seoTitle: 'Buy Electronics Online',
  //   seoDescription: 'Shop phones, laptops, and accessories at great prices.',
  // },
};

export const getCategoryMeta = (category?: string): CategoryMeta => {
  if (!category) return {};
  const key = category.trim().toLowerCase();
  return CATEGORY_META[key] || {};
};
