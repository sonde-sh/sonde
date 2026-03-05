#!/usr/bin/env node

const args = process.argv.slice(2);
const wantsHelp = args.includes("--help") || args.length === 0;
const command = args.find((arg) => !arg.startsWith("-"));

function printRootHelp() {
  process.stdout.write(`cli-ok - partially automation-friendly fixture
Usage: cli-ok [command] [options]

Options:
  -h, --help                     Show help
  --json                         Output machine-readable JSON

Commands:
  deploy                         Deploy an application
  manifest                       Print fixture manifest info
`);
}

function printDeployHelp() {
  process.stdout.write(`Deploy an application
Usage: cli-ok deploy [options]

Options:
  -h, --help                     Show help
  --target <name>                Deployment target
`);
}

function printManifestHelp() {
  process.stdout.write(`Print fixture manifest info
Usage: cli-ok manifest [options]

Options:
  -h, --help                     Show help
  --json                         Output machine-readable JSON
`);
}

if (!command && wantsHelp) {
  printRootHelp();
  process.exit(0);
}

if (command === "deploy" && wantsHelp) {
  printDeployHelp();
  process.exit(0);
}

if (command === "manifest" && wantsHelp) {
  printManifestHelp();
  process.exit(0);
}

if (command === "deploy") {
  process.stdout.write("deployed (with partial automation support)\n");
  process.exit(0);
}

if (command === "manifest") {
  const asJson = args.includes("--json");
  if (asJson) {
    process.stdout.write('{"name":"cli-ok","version":"1.0.0"}\n');
  } else {
    process.stdout.write("cli-ok manifest v1.0.0\n");
  }
  process.exit(0);
}

process.stderr.write("Unknown command\n");
process.exit(1);
