import path from "path";
import os from "os";
import fs from "fs";

export function getUploadsDir(): string {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const dir = isServerless
    ? path.join(/*turbopackIgnore: true*/ os.tmpdir(), "frameflow_uploads")
    : path.join(/*turbopackIgnore: true*/ process.cwd(), "uploads");

  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (_) {}
  }
  return dir;
}

export function getGeneratedDir(): string {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const dir = isServerless
    ? path.join(/*turbopackIgnore: true*/ os.tmpdir(), "frameflow_generated")
    : path.join(/*turbopackIgnore: true*/ process.cwd(), "generated");

  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (_) {}
  }
  return dir;
}
