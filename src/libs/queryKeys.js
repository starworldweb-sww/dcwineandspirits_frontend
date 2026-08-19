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
  shopByBrandTitle: () => [...categoryKeys.lists(), "shop-by-brand-title"],
  topCategory: () => [...homeKeys.lists(), "top-category"],
  occasionMenu: () => [...homeKeys.lists(), "occasion-menu"],
  giftDropDown: () => [...homeKeys.lists(), "gift-drop-down"],
  giftDropDownShopByCategory: () => [
    ...homeKeys.lists(),
    "gift-drop-down-shop-by-category",
  ],
  giftDropDownGiftByOrigin: () => [
    ...homeKeys.lists(),
    "gift-drop-down-gift-by-origin",
  ],
  giftDropDownShopByPrice: () => [
    ...homeKeys.lists(),
    "gift-drop-down-shop-by-price",
  ],
  personalization: () => [...homeKeys.lists(), "personalization"],
  occasionTreasures: () => [...homeKeys.lists(), "occasion-treasures"],
};

export const newsletterKeys = {
  // Base keys
  all: ["newsletter"],

  // 1. subscribe ke liye (Maps to: POST /newsletter/subscribe)
  subscribe: () => [...newsletterKeys.all, "subscribe"],
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
export const customerKeys = {
  // Base keys
  all: ["customer"],
  lists: () => [...customerKeys.all, "list"],
  details: () => [...customerKeys.all, "detail"],

  // 1. login ke liye (Maps to: POST /customer/login)
  login: () => [...customerKeys.all, "login"],

  // 2. register ke liye (Maps to: POST /customer/register)
  register: () => [...customerKeys.all, "register"],

  // 3. forgotPassword ke liye (Maps to: POST /customer/forgot-password)
  forgotPassword: () => [...customerKeys.all, "forgot-password"],

  // 4. resetPassword ke liye (Maps to: POST /customer/reset-password)
  resetPassword: () => [...customerKeys.all, "reset-password"],

  // 5. logout ke liye (Maps to: POST /customer/logout)
  logout: () => [...customerKeys.all, "logout"],

  // 6. profile ke liye (Maps to: GET /customer/profile)
  profile: () => [...customerKeys.details(), "profile"],

  // 7. changePassword ke liye (Maps to: PUT /customer/change-password)
  changePassword: () => [...customerKeys.all, "change-password"],

  // 8. editAccountInformation ke liye (Maps to: PUT /customer/edit-information)
  editInformation: () => [...customerKeys.all, "edit-information"],
};

export const cartKeys = {
  all: ["cart"],
  getCartList: () => [...cartKeys.all, "cartList"],
  addtoCart: () => [...cartKeys.getCartList()],
  deleteCart: () => ["cart-delete", "delete"],
};

export const mobileCategoryKeys = {
  all: ["mobileCategory"],
  list: () => [...mobileCategoryKeys.all, "list"],
};

export const customerAddressKeys = {
  all: ["customerAddress"],
  list: () => [...customerAddressKeys.all, "list"],
  getCountryList: () => [...customerAddressKeys.all, "country"],
  getZoneList: () => [...customerAddressKeys.all, "zone"],
  getAddressesList: () => [...customerAddressKeys.all, "addresses-list"],
  createAddress: () => ["customer-addresses", "create"],
  updateAddress: () => ["customer-addresses", "update"],
  getAddressById: (addressId) => [
    ...customerAddressKeys.all,
    "address",
    addressId,
  ],
  deleteAddress: () => ["customer-addresses", "delete"],
};

export const checkoutKeys = {
  all: ["checkout"],
  placeOrder: () => [...checkoutKeys.all, "place-order"],
  createPaymentIntent: () => [...checkoutKeys.all, "create-payment-intent"],
};
export const shippingRateKeys = {
  all: ["shipping-rate"],
  getShippingRate: (countryId, zoneId, quantity) => [
    ...shippingRateKeys.all,
    "get-shipping-rate",
    countryId,
    zoneId,
    quantity,
  ],
};
