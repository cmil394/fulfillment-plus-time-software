import api from "./api";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

let inflightGetAll: Promise<Customer[]> | null = null;

export const customerService = {
  getAll: (): Promise<Customer[]> => {
    if (!inflightGetAll) {
      inflightGetAll = api
        .get("/customers")
        .then((r) => r.data.data as Customer[])
        .finally(() => {
          inflightGetAll = null;
        });
    }
    return inflightGetAll;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data.data;
  },
};
