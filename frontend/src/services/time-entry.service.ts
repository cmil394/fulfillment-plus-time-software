import api from "./api";

export const timeEntryService = {
  startTimer: async (taskId: number, notes?: string) => {
    const res = await api.post("/time-entries/start", { taskId, notes });
    return res.data.data;
  },

  stopTimer: async () => {
    const res = await api.patch("/time-entries/active/stop");
    return res.data.data;
  },

  getActiveTimer: async () => {
    const res = await api.get("/time-entries/active");
    return res.data.data;
  },
};
