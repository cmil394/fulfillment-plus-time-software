import api from "./api";

export const reportService = {
  downloadCustomerReport: async (
    customerId: string,
    startDate: string,
    endDate: string,
  ): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(
      `/reports/customer/${customerId}?startDate=${startDate}&endDate=${endDate}`,
      { responseType: "blob" },
    );
    const disposition = response.headers["content-disposition"] as string | undefined;
    const match = disposition?.match(/filename="(.+?)"/);
    const filename = match?.[1] ?? `report_${customerId}.xlsx`;
    return { blob: response.data as Blob, filename };
  },
};
