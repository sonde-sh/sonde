export {
  parseHelpText,
  type ParsedHelpText,
} from "./help-parser.js";
export {
  generateManifest,
  type GenerateManifestInput,
  type GenerateManifestResult,
} from "./generate.js";
export {
  generateManifestFromHelp,
  type HelpTextInput,
  type ManifestGeneratorInput,
} from "./manifest-generator.js";
export {
  DEFAULT_OUTPUT_FILE,
  toStableManifestJson,
  writeManifestFile,
} from "./writer.js";
