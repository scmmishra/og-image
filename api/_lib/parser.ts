import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { query } = parse(req.url || "/", true);
  const { title, subtitle, extension, pattern, theme } = query || {};

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    title: decodeURIComponent(title as string),
    subtitle: decodeURIComponent(subtitle as string),
    pattern: pattern as string,
    theme: theme as string,
  };

  return parsedRequest;
}
