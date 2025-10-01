import type { Options } from "rehype-sanitize";
import { defaultSchema } from "rehype-sanitize";

export const COLOR_STYLE_REGEX = /^color\s*:\s*(#[0-9a-fA-F]{3,6}|rgba?\([^\)]+\)|[a-zA-Z]+|var\(--[a-zA-Z0-9-]+\))\s*;?$/i;

export const markdownSanitizeOptions: Options = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [
      ...((defaultSchema.attributes && defaultSchema.attributes["*"]) || []),
      ["style", COLOR_STYLE_REGEX],
    ],
    span: [
      ...((defaultSchema.attributes && defaultSchema.attributes.span) || []),
      ["style", COLOR_STYLE_REGEX],
    ],
  },
};

export default markdownSanitizeOptions;
