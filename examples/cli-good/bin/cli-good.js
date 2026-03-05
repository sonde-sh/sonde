#!/usr/bin/env node

const args = process.argv.slice(2);
const wantsHelp = args.includes("--help") || args.length === 0;
const command = args.find((arg) => !arg.startsWith("-"));

function printRootHelp() {
  process.stdout.write(`cli-good - deterministic, automation-first fixture
Usage: cli-good [command] [options]

Options:
  -h, --help                     Show help
  --json                         Output machine-readable JSON
  --yes                          Assume yes for confirmations
  --dry-run                      Preview changes only
  --fields <list>                Select output fields

Commands:
  deploy                         Deploy an application
  manifest                       Print fixture manifest info
`);
}

function printDeployHelp() {
  process.stdout.write(`Deploy an application
Usage: cli-good deploy [options]

Options:
  -h, --help                     Show help
  --json                         Output machine-readable JSON
  --yes                          Assume yes for confirmations
  --dry-run                      Preview deployment plan
  --fields <list>                Select output fields
`);
}

function printManifestHelp() {
  process.stdout.write(`Print fixture manifest info
Usage: cli-good manifest [options]

Options:
  -h, --help                     Show help
  --json                         Output machine-readable JSON
  --fields <list>                Select output fields
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
  const asJson = args.includes("--json");
  if (asJson) {
    process.stdout.write('{"ok":true,"status":"deployed"}\n');
  } else {
    process.stdout.write("deployment complete\n");
  }
  process.exit(0);
}

if (command === "manifest") {
  const asJson = args.includes("--json");
  if (asJson) {
    process.stdout.write('{"name":"cli-good","version":"1.0.0"}\n');
  } else {
    process.stdout.write("cli-good manifest v1.0.0\n");
  }
  process.exit(0);
}

process.stderr.write("Unknown command\n");
process.exit(1);
