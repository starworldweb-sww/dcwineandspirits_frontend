import axiosInstance from "@/config/axiosConfig"

export const shippingRateService = {

    getShippingRate: async (countryId, zoneId, quantity = 1) => {
        const params = new URLSearchParams()
        if (countryId) params.set("countryId", countryId)
        if (zoneId) params.set("zoneId", zoneId)
        if (quantity) params.set("quantity", quantity)
        const res = await axiosInstance.get(`/shipping-rate?${params.toString()}`)
        return res?.data?.success && res?.data?.data ? res.data.data : null
    }
}