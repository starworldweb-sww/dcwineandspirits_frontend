import axiosInstance from "@/config/axiosConfig"

export const customerAddressService = {

    getCountryList: async () => {
        const res = await axiosInstance.get(`/customer-address/countries`)
        console.log("ress",res)
        return  res?.data?.data || []
    },
    getZoneList: async (countryId) => {
        const res = await axiosInstance.get(`/customer-address/zones/${countryId}`)
        return  res?.data?.data || []
    }

}