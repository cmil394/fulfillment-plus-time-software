import { hashPassword } from "./auth";
import { prisma } from "../lib/prisma";
import { config } from "dotenv";

config();

export const seedOwner = async () => {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;

  if (!email || !password) {
    console.warn("OWNER_EMAIL or OWNER_PASSWORD not set — skipping owner seed");
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log("Owner already exists");
    return;
  }

  const hashedPassword = await hashPassword(password);
  const employeeCode = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const pin = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName: "System Owner",
      firstName: "System",
      lastName: "Owner",
      role: "Owner",
      status: "APPROVED",
      employeeCode,
      pin,
    },
  });

  console.log(
    `Owner created — email: ${email}, employeeCode: ${employeeCode}, pin: ${pin}`,
  );
};
