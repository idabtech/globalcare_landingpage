import { api } from "./api.service";

export const hospitalService = {
    getHospitals: async () => {
        const response = await api.get('/hospitals');
        return response.data;
    },
    getHospitalById: async () => {
        const response = await api.get(`/hospitals/my`);
        return response.data;
    },
    bookAppointment: async (appointmentData: any) => {
        const response = await api.post('/appointments/public', appointmentData);
        return response.data;
    },
    getBusySlots: async (doctorId: number, date: string) => {
        const response = await api.get('/appointments/public/availability', {
            params: { doctor_id: doctorId, date }
        });
        return response.data;
    }
}