import os from "node:os";
import { spawn } from "node:child_process";

function getLanIps() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const list of Object.values(nets)) {
    for (const iface of list ?? []) {
      if (iface.family === "IPv4" && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

const lanIps = getLanIps();
console.log("\n==================================================");
console.log("  TFI & Pitch — Web + PartyKit Room Server");
console.log("  Local Web:   http://localhost:3000");
console.log("  Room Server: http://localhost:1999");
if (lanIps.length > 0) {
  for (const ip of lanIps) {
    console.log(`  Phone Wi-Fi: http://${ip}:3000  (Room WS: ${ip}:1999)`);
  }
} else {
  console.log("  Phone Wi-Fi: connect to Wi-Fi and check System Settings -> Network for IP");
}
console.log("==================================================\n");

const child = spawn("pnpm", ["exec", "turbo", "run", "dev", "--concurrency=4"], {
  stdio: "inherit",
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
child.on("exit", (code) => process.exit(code ?? 0));
