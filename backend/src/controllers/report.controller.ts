import { Response, NextFunction } from "express";
import ExcelJS from "exceljs";
import { AuthRequest } from "../middleware/auth.middleware";
import * as reportService from "../services/report.service";

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
    const sheet = workbook.addWorksheet("Hours Report");

    const blue = "FF3B6FD4";
    const lightBlue = "FFE8F0FE";
    const darkNavy = "FF1A1A2E";
    const white = "FFFFFFFF";
    const subtleGray = "FFF9F9F9";

    const headerFill: ExcelJS.FillPattern = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: blue },
    };
    const subtotalFill: ExcelJS.FillPattern = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: lightBlue },
    };
    const totalFill: ExcelJS.FillPattern = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: darkNavy },
    };
    const altFill: ExcelJS.FillPattern = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: subtleGray },
    };

    sheet.mergeCells("A1:C1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = `Hours Report — ${customerName}`;
    titleCell.font = { bold: true, size: 14, color: { argb: darkNavy } };
    titleCell.alignment = { horizontal: "left", vertical: "middle" };
    sheet.getRow(1).height = 28;

    sheet.mergeCells("A2:C2");
    const rangeCell = sheet.getCell("A2");
    rangeCell.value = `Period: ${start.toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" })} – ${end.toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" })}`;
    rangeCell.font = { size: 10, color: { argb: "FF888888" }, italic: true };
    sheet.getRow(2).height = 18;

    sheet.addRow([]);

    const colHeaderRow = sheet.addRow(["Task", "Employee", "Hours"]);
    colHeaderRow.height = 22;
    colHeaderRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = { bold: true, color: { argb: white }, size: 11 };
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.border = { bottom: { style: "thin", color: { argb: white } } };
    });

    let grandTotalSeconds = 0;

    for (const [, { taskName, users }] of taskMap) {
      let taskTotalSeconds = 0;
      const userEntries = Array.from(users.values());

      userEntries.forEach(({ userName, seconds }, i) => {
        const dataRow = sheet.addRow([
          taskName,
          userName,
          +(seconds / 3600).toFixed(2),
        ]);
        dataRow.height = 18;
        dataRow.getCell(3).numFmt = "0.00";
        if (i % 2 === 1) {
          dataRow.eachCell((cell) => {
            cell.fill = altFill;
          });
        }
        dataRow.getCell(1).font = { color: { argb: "FF333333" } };
        dataRow.getCell(2).font = { color: { argb: "FF555555" } };
        dataRow.getCell(3).alignment = { horizontal: "right" };
        taskTotalSeconds += seconds;
      });

      const subtotalRow = sheet.addRow([
        "",
        "  Task Total",
        +(taskTotalSeconds / 3600).toFixed(2),
      ]);
      subtotalRow.height = 18;
      subtotalRow.eachCell((cell) => {
        cell.fill = subtotalFill;
        cell.font = { bold: true, color: { argb: blue } };
      });
      subtotalRow.getCell(2).alignment = { horizontal: "left" };
      subtotalRow.getCell(3).numFmt = "0.00";
      subtotalRow.getCell(3).alignment = { horizontal: "right" };

      sheet.addRow([]);
      grandTotalSeconds += taskTotalSeconds;
    }

    const totalRow = sheet.addRow([
      "CUSTOMER TOTAL",
      "",
      +(grandTotalSeconds / 3600).toFixed(2),
    ]);
    totalRow.height = 24;
    totalRow.eachCell((cell) => {
      cell.fill = totalFill;
      cell.font = { bold: true, color: { argb: white }, size: 12 };
    });
    totalRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
    totalRow.getCell(3).numFmt = "0.00";
    totalRow.getCell(3).alignment = { horizontal: "right", vertical: "middle" };

    sheet.getColumn(1).width = 28;
    sheet.getColumn(2).width = 28;
    sheet.getColumn(3).width = 14;

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
