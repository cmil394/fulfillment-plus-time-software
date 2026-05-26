import api from "./api";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

let inflightGetAll: Promise<Customer[]> | null = null;
let cachedCustomers: Customer[] | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 300_000;

export const customerService = {
  getAll: (): Promise<Customer[]> => {
    if (cachedCustomers && Date.now() < cacheExpiresAt) {
      return Promise.resolve(cachedCustomers);
    }
    if (!inflightGetAll) {
      inflightGetAll = api
        .get("/customers")
        .then((r) => {
          cachedCustomers = r.data.data as Customer[];
          cacheExpiresAt = Date.now() + CACHE_TTL_MS;
          return cachedCustomers;
        })
        .finally(() => {
          inflightGetAll = null;
        });
    }
    return inflightGetAll;
  },

  invalidateCache: () => {
    cachedCustomers = null;
    cacheExpiresAt = 0;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data.data;
  },
};
