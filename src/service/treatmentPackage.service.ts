import { api } from "./api.service";

export const treatmentPackageService = {
  getTreatmentPackages: async (filters: any = {}) => {
    const params = new URLSearchParams();
    if (filters.specialty) params.append('specialty', filters.specialty);
    if (filters.hospital_id) params.append('hospital_id', filters.hospital_id);
    if (filters.country) params.append('country', filters.country);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    const response = await api.get(`/treatment-packages?${params.toString()}`);
    return response.data;
  },
};
