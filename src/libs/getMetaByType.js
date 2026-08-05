import axiosInstance from "@/config/axiosConfig";



export async function getMetaByType(type, id) {
    try {
        const res = await axiosInstance.get(`/meta/${type}/${id}`, {
            cache: 'no-store',
        });
        return res?.data;
    } catch (error) {
        return null;
    }
}