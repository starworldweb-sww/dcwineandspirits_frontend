export const categoryKeys = {
  // Base keys
  all: ["categories"],
  lists: () => [...categoryKeys.all, "list"],
  details: () => [...categoryKeys.all, "detail"],

  // 1. getAllCategories ke liye (Maps to: GET /category or /categories)
  allCategories: () => [...categoryKeys.lists(), "all-categories"],

  // 2. getHeaderCategory ke liye (Maps to: GET /header-category)
  headerCategory: () => [...categoryKeys.lists(), "header-category"],

  // Future-proofing: Agar kabhi single category detail ka endpoint banayein
  singleCategoryDetail: (slug) => [...categoryKeys.details(), slug],
};
  
export const homeKeys = {
  // Base keys for home page specific data
  all: ["home"],
  lists: () => [...homeKeys.all, "list"],

  // 1. getHomePageProducts ke liye (Maps to: GET /header-category/home-page-products)
  pageProducts: () => [...homeKeys.lists(), "home-page-products"],

  // 2. getHomePageTopBanner ke liye (Maps to: GET /home-page-top-banner)
  topBanner: () => [...homeKeys.lists(), "home-page-top-banner"],
  shopByBrand: () => [...categoryKeys.lists(), "shop-by-brand"],
  giftByOccasion: () => [...homeKeys.lists(), "gift-by-occasion"],
  wineGifts: () => [...homeKeys.lists(), "wine-gifts"],
  topCategories: () => [...homeKeys.lists(), "top-categories"],
  loveByBanner: () => [...homeKeys.lists(), "love-by-banners"],
  pageText: () => [...homeKeys.lists(), "home-page-text"],
};

export const productKeys = {
  // Base keys
  all: ["products"],
  lists: () => [...productKeys.all, "list"],
  details: () => [...productKeys.all, "detail"],

  // 1. getAllProducts ke liye (Maps to: GET /)
  allProducts: (showNum = 24) => [...productKeys.lists(), "all-data", showNum],

  // 2. getProductBySlugOrId ke liye (Maps to: GET /:slug)
  bySlugOrId: (slug) => [...productKeys.lists(), "by-slug-or-id", slug],

  // 3. getSingleProductDetails ke liye (Maps to: GET /single-product/:slug)
  singleProductDetail: (slug) => [...productKeys.details(), slug],
};