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
  pageText: () => [...homeKeys.lists(), "home-page-text"],
  shopByBrandTitle: () => [...categoryKeys.lists(), "shop-by-brand-title"],
  topCategory: () => [...homeKeys.lists(), "top-category"],
  occasionMenu: () => [...homeKeys.lists(), "occasion-menu"],
  giftDropDown: () => [...homeKeys.lists(), "gift-drop-down"],
  giftDropDownShopByCategory: () => [...homeKeys.lists(), "gift-drop-down-shop-by-category"],
  giftDropDownGiftByOrigin: () => [...homeKeys.lists(), "gift-drop-down-gift-by-origin"],
  giftDropDownShopByPrice: () => [...homeKeys.lists(), "gift-drop-down-shop-by-price"],
  personalization: () => [...homeKeys.lists(), "personalization"],
  occasionTreasures: () => [...homeKeys.lists(), "occasion-treasures"],
  

};

export const productKeys = {
  // Base keys
  all: ["products"],
  lists: () => [...productKeys.all, "list"],
  details: () => [...productKeys.all, "detail"],

  // 1. getAllProducts ke liye (Maps to: GET /)
  allProducts: () => [...productKeys.lists(), "all-data"],

  // 2. getProductBySlugOrId ke liye (Maps to: GET /:slug)
  bySlugOrId: (slug) => [...productKeys.lists(), "by-slug-or-id", slug],

  // 3. getSingleProductDetails ke liye (Maps to: GET /single-product/:slug)
  singleProductDetail: (slug) => [...productKeys.details(), slug],
  
  
  
};