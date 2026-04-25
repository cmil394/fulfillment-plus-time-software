import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/errors";

export type UserRow = { userName: string; seconds: number };
export type TaskRow = { taskName: string; users: Map<string, UserRow> };
export type CustomerReportData = {
  customerName: string;
  taskMap: Map<string, TaskRow>;
  start: Date;
  end: Date;
};

export const getCustomerReport = async (
  customerId: string,
  startDate?: string,
  endDate?: string,
): Promise<CustomerReportData> => {
  const now = new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = endDate ? new Date(endDate) : new Date(now);
  end.setHours(23, 59, 59, 999);

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });
  if (!customer) throw new NotFoundError("Customer not found");

  const entries = await prisma.timeEntry.findMany({
    where: {
      customerId,
      startTime: { gte: start, lte: end },
      endTime: { not: null },
    },
    include: {
      task: { select: { name: true } },
      user: {
        select: {
          fullName: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { startTime: "asc" },
  });

  const taskMap = new Map<string, TaskRow>();

  for (const entry of entries) {
    const taskId = entry.taskId ?? "__unassigned__";
    const taskName = entry.task?.name ?? "Unassigned";
    const userId = entry.userId;
    const userName =
      entry.user.fullName ||
      `${entry.user.firstName ?? ""} ${entry.user.lastName ?? ""}`.trim() ||
      entry.user.email;
    const duration = entry.durationSeconds ?? 0;

    if (!taskMap.has(taskId))
      taskMap.set(taskId, { taskName, users: new Map() });
    const taskRow = taskMap.get(taskId)!;
    if (!taskRow.users.has(userId))
      taskRow.users.set(userId, { userName, seconds: 0 });
    taskRow.users.get(userId)!.seconds += duration;
  }

  return { customerName: customer.name, taskMap, start, end };
};
