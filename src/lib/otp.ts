import { prisma } from "./prisma";

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOtp(userId: string): Promise<string> {
  // Invalidate previous OTPs
  await prisma.otp.updateMany({
    where: { userId, used: false },
    data: { used: true },
  });

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.otp.create({
    data: { userId, code, expiresAt },
  });

  return code;
}

export async function verifyOtp(
  userId: string,
  code: string
): Promise<boolean> {
  const otp = await prisma.otp.findFirst({
    where: {
      userId,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otp) return false;

  await prisma.otp.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return true;
}
