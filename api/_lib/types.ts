export type FileType = "png" | "jpeg";

export interface ParsedRequest {
  fileType: FileType;
  title: string;
  subtitle: string;
  pattern: string;
  theme: string;
}
