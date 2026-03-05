export type StmVersion = "1";

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

export interface StmManifestV1 {
  $schema?: string;
  version: StmVersion;
  generatedAt: string;
  cli: StmCliMeta;
  globalOptions: StmOption[];
  commands: StmCommand[];
}

export interface DeterministicError {
  code:
    | "MISSING_FILE"
    | "READ_FAILED"
    | "INVALID_JSON"
    | "VALIDATION_FAILED";
  message: string;
  details?: unknown;
}

export interface LoadManifestSuccess {
  ok: true;
  manifest: StmManifestV1;
}

export interface LoadManifestFailure {
  ok: false;
  error: DeterministicError;
}

export type LoadManifestResult = LoadManifestSuccess | LoadManifestFailure;
