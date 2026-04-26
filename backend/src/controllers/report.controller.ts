import { Response, NextFunction } from "express";
import ExcelJS from "exceljs";
import { AuthRequest } from "../middleware/auth.middleware";
import * as reportService from "../services/report.service";

const BLUE = "FF2563EB";
const NAVY = "FF1E3A5F";
const WHITE = "FFFFFFFF";
const BORDER = "FFD1D5DB";
const TEXT_DARK = "FF111827";
const TEXT_DIM = "FF9CA3AF";
const TITLE_BG = "FFF0F4FF";

const thin = (argb = BORDER): ExcelJS.Border => ({
  style: "thin",
  color: { argb },
});
const medium = (argb = BLUE): ExcelJS.Border => ({
  style: "medium",
  color: { argb },
});
const fill = (argb: string): ExcelJS.FillPattern => ({
  type: "pattern",
  pattern: "solid",
  fgColor: { argb },
});

export const getEmployeeReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const startDate =
      typeof req.query.startDate === "string" ? req.query.startDate : undefined;
    const endDate =
      typeof req.query.endDate === "string" ? req.query.endDate : undefined;

    const { employeeName, customers, totalSeconds, start, end } =
      await reportService.getEmployeeReport(userId, startDate, endDate);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "FulfillmentPlus";

    const sheet = workbook.addWorksheet("Hours Report", {
      pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true },
      views: [{ state: "frozen", xSplit: 0, ySplit: 4 }],
    });

    sheet.getColumn(1).width = 30;
    sheet.getColumn(2).width = 30;
    sheet.getColumn(3).width = 14;

    sheet.mergeCells("A1:C1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = `Hours Report - ${employeeName}`;
    titleCell.font = { bold: true, size: 15, color: { argb: NAVY } };
    titleCell.alignment = { horizontal: "left", vertical: "middle" };
    titleCell.fill = fill(TITLE_BG);
    sheet.getRow(1).height = 32;

    sheet.mergeCells("A2:C2");
    const rangeCell = sheet.getCell("A2");
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-NZ", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    rangeCell.value = `${fmt(start)} – ${fmt(end)}`;
    rangeCell.font = { size: 10, italic: true, color: { argb: TEXT_DIM } };
    rangeCell.alignment = { horizontal: "left", vertical: "middle" };
    rangeCell.fill = fill(TITLE_BG);
    sheet.getRow(2).height = 18;

    sheet.getRow(3).height = 6;

    const headerRow = sheet.addRow(["Customer", "Task", "Hours"]);
    headerRow.height = 26;
    headerRow.eachCell((cell, col) => {
      cell.fill = fill(BLUE);
      cell.font = { bold: true, size: 11, color: { argb: WHITE } };
      cell.alignment = {
        vertical: "middle",
        horizontal: col === 3 ? "right" : "left",
      };
      cell.border = {
        top: thin(BLUE),
        left: thin(BLUE),
        right: thin(BLUE),
        bottom: medium(NAVY),
      };
    });

    const SUBTOTAL_BG = "FFE8F0FB";
    const ROW_ALT = "FFF5F8FF";

    for (const customer of customers) {
      customer.tasks.forEach((task, i) => {
        const rowBg = i % 2 === 0 ? WHITE : ROW_ALT;
        const row = sheet.addRow([
          customer.customerName,
          ` ${task.taskName}`,
          task.seconds / 3600,
        ]);
        row.height = 22;

        row.getCell(1).fill = fill(rowBg);
        row.getCell(1).font = {
          bold: true,
          size: 10,
          color: { argb: TEXT_DARK },
        };
        row.getCell(1).alignment = { vertical: "middle" };
        row.getCell(1).border = {
          top: thin(),
          bottom: thin(),
          left: medium(),
          right: thin(),
        };

        row.getCell(2).fill = fill(rowBg);
        row.getCell(2).font = { size: 10, color: { argb: TEXT_DARK } };
        row.getCell(2).alignment = { vertical: "middle" };
        row.getCell(2).border = {
          top: thin(),
          bottom: thin(),
          left: thin(),
          right: thin(),
        };

        row.getCell(3).fill = fill(rowBg);
        row.getCell(3).numFmt = "0.00";
        row.getCell(3).font = { size: 10, color: { argb: TEXT_DARK } };
        row.getCell(3).alignment = { horizontal: "right", vertical: "middle" };
        row.getCell(3).border = {
          top: thin(),
          bottom: thin(),
          left: thin(),
          right: medium(),
        };
      });

      // Customer subtotal row
      const subRow = sheet.addRow([
        `${customer.customerName} - Total`,
        "",
        customer.totalSeconds / 3600,
      ]);
      subRow.height = 24;

      subRow.getCell(1).fill = fill(SUBTOTAL_BG);
      subRow.getCell(1).font = { bold: true, size: 10, color: { argb: NAVY } };
      subRow.getCell(1).alignment = { vertical: "middle" };
      subRow.getCell(1).border = {
        top: thin(),
        bottom: medium(BLUE),
        left: medium(),
        right: thin(),
      };

      subRow.getCell(2).fill = fill(SUBTOTAL_BG);
      subRow.getCell(2).border = {
        top: thin(),
        bottom: medium(BLUE),
        left: thin(),
        right: thin(),
      };

      subRow.getCell(3).fill = fill(SUBTOTAL_BG);
      subRow.getCell(3).numFmt = "0.00";
      subRow.getCell(3).font = { bold: true, size: 10, color: { argb: NAVY } };
      subRow.getCell(3).alignment = { horizontal: "right", vertical: "middle" };
      subRow.getCell(3).border = {
        top: thin(),
        bottom: medium(BLUE),
        left: thin(),
        right: medium(),
      };
    }

    const totalRow = sheet.addRow(["TOTAL HOURS", "", totalSeconds / 3600]);
    totalRow.height = 28;
    totalRow.eachCell((cell, col) => {
      cell.fill = fill(NAVY);
      cell.font = { bold: true, size: 12, color: { argb: WHITE } };
      cell.border = {
        top: thin(NAVY),
        bottom: medium(NAVY),
        left: thin(NAVY),
        right: thin(NAVY),
      };
      if (col === 3) {
        cell.numFmt = "0.00";
        cell.alignment = { horizontal: "right", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle" };
      }
    });

    sheet.addRow([]);
    const footerRowNum = sheet.lastRow!.number + 1;
    sheet.mergeCells(`A${footerRowNum}:C${footerRowNum}`);
    const footerCell = sheet.getCell(`A${footerRowNum}`);
    footerCell.value = `Generated ${new Date().toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" })}`;
    footerCell.font = { size: 9, italic: true, color: { argb: TEXT_DIM } };
    footerCell.alignment = { horizontal: "right" };

    const safeName = employeeName
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_");
    const filename = `${safeName}_hours_report.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};

export const getEmployeeReportSummary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const startDate =
      typeof req.query.startDate === "string" ? req.query.startDate : undefined;
    const endDate =
      typeof req.query.endDate === "string" ? req.query.endDate : undefined;

    const data = await reportService.getEmployeeReport(
      userId,
      startDate,
      endDate,
    );
    res.json({
      employeeName: data.employeeName,
      totalSeconds: data.totalSeconds,
      customers: data.customers,
      start: data.start,
      end: data.end,
    });
  } catch (err) {
    next(err);
  }
};

export const getCustomerReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { customerId } = req.params;
    const startDate =
      typeof req.query.startDate === "string" ? req.query.startDate : undefined;
    const endDate =
      typeof req.query.endDate === "string" ? req.query.endDate : undefined;

    const { customerName, taskMap, start, end } =
      await reportService.getCustomerReport(
        customerId as string,
        startDate,
        endDate,
      );

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "FulfillmentPlus";

    const sheet = workbook.addWorksheet("Hours Report", {
      pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true },
      views: [{ state: "frozen", xSplit: 0, ySplit: 4 }],
    });

    sheet.getColumn(1).width = 40;
    sheet.getColumn(2).width = 14;

    sheet.mergeCells("A1:B1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = `Hours Report - ${customerName}`;
    titleCell.font = { bold: true, size: 15, color: { argb: NAVY } };
    titleCell.alignment = { horizontal: "left", vertical: "middle" };
    titleCell.fill = fill(TITLE_BG);
    sheet.getRow(1).height = 32;

    sheet.mergeCells("A2:B2");
    const rangeCell = sheet.getCell("A2");
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-NZ", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    rangeCell.value = `${fmt(start)} – ${fmt(end)}`;
    rangeCell.font = { size: 10, italic: true, color: { argb: TEXT_DIM } };
    rangeCell.alignment = { horizontal: "left", vertical: "middle" };
    rangeCell.fill = fill(TITLE_BG);
    sheet.getRow(2).height = 18;

    sheet.getRow(3).height = 6;

    const headerRow = sheet.addRow(["Task", "Hours"]);
    headerRow.height = 26;
    headerRow.eachCell((cell, col) => {
      cell.fill = fill(BLUE);
      cell.font = { bold: true, size: 11, color: { argb: WHITE } };
      cell.alignment = {
        vertical: "middle",
        horizontal: col === 2 ? "right" : "left",
      };
      cell.border = {
        top: thin(BLUE),
        left: thin(BLUE),
        right: thin(BLUE),
        bottom: medium(NAVY),
      };
    });

    let grandTotalSeconds = 0;

    for (const [, { taskName, users }] of taskMap) {
      const taskTotalSeconds = Array.from(users.values()).reduce(
        (sum, { seconds }) => sum + seconds,
        0,
      );

      const dataRow = sheet.addRow([taskName, taskTotalSeconds / 3600]);
      dataRow.height = 21;

      dataRow.getCell(1).fill = fill(WHITE);
      dataRow.getCell(1).font = {
        bold: true,
        size: 10,
        color: { argb: TEXT_DARK },
      };
      dataRow.getCell(1).alignment = { vertical: "middle" };
      dataRow.getCell(1).border = {
        top: thin(),
        bottom: thin(),
        left: medium(),
        right: thin(),
      };

      dataRow.getCell(2).fill = fill(WHITE);
      dataRow.getCell(2).numFmt = "0.00";
      dataRow.getCell(2).font = { size: 10, color: { argb: TEXT_DARK } };
      dataRow.getCell(2).alignment = {
        horizontal: "right",
        vertical: "middle",
      };
      dataRow.getCell(2).border = {
        top: thin(),
        bottom: thin(),
        left: thin(),
        right: thin(),
      };

      grandTotalSeconds += taskTotalSeconds;
    }

    // Grand total
    const totalRow = sheet.addRow(["TOTAL HOURS", grandTotalSeconds / 3600]);
    totalRow.height = 28;
    totalRow.eachCell((cell, col) => {
      cell.fill = fill(NAVY);
      cell.font = { bold: true, size: 12, color: { argb: WHITE } };
      cell.border = {
        top: medium(),
        bottom: medium(NAVY),
        left: thin(NAVY),
        right: thin(NAVY),
      };
      if (col === 2) {
        cell.numFmt = "0.00";
        cell.alignment = { horizontal: "right", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle" };
      }
    });

    sheet.addRow([]);
    const footerRowNum = sheet.lastRow!.number + 1;
    sheet.mergeCells(`A${footerRowNum}:B${footerRowNum}`);
    const footerCell = sheet.getCell(`A${footerRowNum}`);
    footerCell.value = `Generated ${new Date().toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" })}`;
    footerCell.font = { size: 9, italic: true, color: { argb: TEXT_DIM } };
    footerCell.alignment = { horizontal: "right" };

    const safeName = customerName
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_");
    const filename = `${safeName}_hours_report.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};
