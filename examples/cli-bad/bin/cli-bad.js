#!/usr/bin/env node

const args = process.argv.slice(2);
const wantsHelp = args.includes("--help") || args.length === 0;
const command = args.find((arg) => !arg.startsWith("-"));

function printRootHelp() {
  const unstableSuffix = Math.random().toString(16).slice(2, 8);
  process.stdout.write(`cli-bad - noisy interactive fixture ${unstableSuffix}
Usage: cli-bad [command]

Options:
  -h, --help                     Show help

Commands:
  deploy                         Launch deploy flow
`);
  process.stdout.write("Are you sure? [y/n]\n");
}

function printDeployHelp() {
  process.stdout.write(`Deploy flow
Usage: cli-bad deploy

Options:
  -h, --help                     Show help
`);
  process.stdout.write("Confirm deployment now [y/n]\n");
}

if (!command && wantsHelp) {
  printRootHelp();
  process.exit(0);
}

if (command === "deploy" && wantsHelp) {
  printDeployHelp();
  process.exit(0);
}

if (command === "deploy") {
  process.stdout.write("interactive deploy required\n");
  process.stdout.write("Are you sure? [y/n]\n");
  process.exit(0);
}

process.stderr.write("Command not recognized\n");
process.exit(1);
