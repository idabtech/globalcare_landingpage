import { api } from "./api.service";

export const hospitalService = {
    getHospitals: async () => {
        const response = await api.get('/hospitals');
        return response.data;
    },
    getHospitalById: async () => {
        const response = await api.get(`/hospitals/my`);
        return response.data;
    }
}