import * as React from "react";
import type { RenderableTreeNodes } from "@markdoc/markdoc";

import pkg from "@markdoc/markdoc";
const { renderers, parse, transform } = pkg;

export function markdown(markdown: string, config: any): RenderableTreeNodes {
  return transform(parse(markdown, config));
}

export function Markdown({
  content,
  config = {},
}: {
  content: string;
  config?: any;
}) {
  return (
    <div className="rich-text">
      {renderers.react(markdown(content, config), React)}
    </div>
  );
}
