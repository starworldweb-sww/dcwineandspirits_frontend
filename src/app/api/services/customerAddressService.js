import axiosInstance from "@/config/axiosConfig"

export const customerAddressService = {

    getCountryList: async () => {
        const res = await axiosInstance.get(`/customer-address/countries`)
        return  res?.data?.data || []
    },
    getZoneList: async (countryId) => {
        const res = await axiosInstance.get(`/customer-address/zones/${countryId}`)
        return  res?.data?.data || []
    },
    getAddresses: async () => {
        const res = await axiosInstance.get(`/customer-address/`)
        console.log("res",res)
        return res?.data?.data || []
    }

}