import { access, cp, lstat, rm, symlink } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(import.meta.dirname, "..");
const source = path.join(repoRoot, "public");
const target = path.join(repoRoot, "apps", "web", "public");

await access(source);

try {
  const stat = await lstat(target);
  if (stat.isDirectory() && !stat.isSymbolicLink()) process.exit(0);
  if (stat.isSymbolicLink()) {
    if (process.env.VERCEL === "1") {
      await rm(target, { recursive: true, force: true });
      await cp(source, target, { recursive: true });
    }
    process.exit(0);
  }
} catch {
  if (process.env.VERCEL === "1") {
    await cp(source, target, { recursive: true });
  } else {
    const type = process.platform === "win32" ? "junction" : "dir";
    await symlink(source, target, type);
  }
}
