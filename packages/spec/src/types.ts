export type StmManifestVersion = string;

export interface StmOption {
  long: string;
  short?: string;
  description?: string;
  takesValue: boolean;
  valueHint?: string;
}

export interface StmCommand {
  name: string;
  path: string[];
  description?: string;
  usage?: string;
  options: StmOption[];
  subcommands: string[];
  supportsJson: boolean;
  mayPrompt: boolean;
}

export interface StmCliMeta {
  name: string;
  binary: string;
  description?: string;
}

export interface StmManifest {
  $schema?: string;
  version: StmManifestVersion;
  generatedAt: string;
  cli: StmCliMeta;
  globalOptions: StmOption[];
  commands: StmCommand[];
}

export type StmManifestV1 = StmManifest;

export interface DeterministicError {
  code:
    | "MISSING_FILE"
    | "READ_FAILED"
    | "INVALID_JSON"
    | "VALIDATION_FAILED"
    | "UNSUPPORTED_VERSION";
  message: string;
  details?: unknown;
}

export interface LoadManifestSuccess {
  ok: true;
  manifest: StmManifest;
}

export interface LoadManifestFailure {
  ok: false;
  error: DeterministicError;
}

export type LoadManifestResult = LoadManifestSuccess | LoadManifestFailure;
