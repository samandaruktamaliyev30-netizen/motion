/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Cloud sandbox: use the preinstalled headless Chromium if present
// (Remotion's own browser download host is blocked there). No-op elsewhere.
import { existsSync } from "node:fs";
const sandboxShell =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (existsSync(sandboxShell)) {
  Config.setBrowserExecutable(sandboxShell);
}
