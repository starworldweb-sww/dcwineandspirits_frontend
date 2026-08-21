

export const addRecentProduct = (product) => {
    if (typeof window === "undefined") return;
    try {

        const storedProducts = JSON.parse(localStorage.getItem("recent_products")) || [];

        const filteredProducts = storedProducts.filter(
            (item) => item.product_id !== product.product_id
        );

        filteredProducts.unshift(product);

        const updatedProducts = filteredProducts.slice(0, 4);

        localStorage.setItem(
            "recent_products",
            JSON.stringify(updatedProducts)
        );
    } catch (error) {
        console.error("Error saving recent product:", error);
    }
};


export const getRecentProducts = () => {
    if (typeof window === "undefined") return;
    return JSON.parse(localStorage.getItem("recent_products")) || [];
};