import api from "./api";

export const reportService = {
  downloadEmployeeReport: async (
    startDate?: string,
    endDate?: string,
  ): Promise<{ blob: Blob; filename: string }> => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get(`/reports/employee/me${query}`, {
      responseType: "blob",
    });
    const disposition = response.headers["content-disposition"] as
      | string
      | undefined;
    const match = disposition?.match(/filename="(.+?)"/);
    const filename = match?.[1] ?? "employee_hours_report.xlsx";
    return { blob: response.data as Blob, filename };
  },

  downloadCustomerReport: async (
    customerId: string,
    startDate: string,
    endDate: string,
  ): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(
      `/reports/customer/${customerId}?startDate=${startDate}&endDate=${endDate}`,
      { responseType: "blob" },
    );
    const disposition = response.headers["content-disposition"] as
      | string
      | undefined;
    const match = disposition?.match(/filename="(.+?)"/);
    const filename = match?.[1] ?? `report_${customerId}.xlsx`;
    return { blob: response.data as Blob, filename };
  },
};
