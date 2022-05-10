import { readFileSync } from "fs";
import { marked } from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
import colors from "./colors";

const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64");

const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
  "base64"
);

const colorMap: Record<string, string> = {
  juniper: colors.juniper.DEFAULT,
  lilac: colors.lilac,
  cherry: colors.cherry.DEFAULT,
  lavender: colors.lavender,
  robin: colors.robin.DEFAULT,
  vanilla: colors.vanilla[100],
  honey: colors.honey.DEFAULT,
};

function getCss(pattern: string, theme: string) {
  let patternCSS = "";

  const patternForeground = colorMap[theme]
    ? colorMap[theme]
    : colors.juniper.DEFAULT;
  const patternBackground = colors.ink[400];

  const patternMap: Record<string, string> = {
    wavy: `background-image:  repeating-radial-gradient( circle at 0 0, transparent 0, ${patternBackground} 32px ), repeating-linear-gradient( ${patternForeground}55, ${patternForeground} );`,
    moon: `background-image: radial-gradient( ellipse farthest-corner at 42px 42px , ${patternForeground}, ${patternForeground} 50%, ${patternBackground} 50%); background-size: 42px 42px;`,
    polka: `background-image: radial-gradient(${patternForeground} 2px, ${patternBackground} 2px); background-size: 32px 32px;`,
    diagonal: `background-image: repeating-linear-gradient(45deg, ${patternForeground} 0, ${patternForeground} 3px, ${patternBackground} 0, ${patternBackground} 50%); background-size: 28px 28px;`,
    triange: `background-image: linear-gradient(45deg, ${patternForeground} 50%, ${patternBackground} 50%); background-size: 32px 32px;`,
    cross: `background: radial-gradient(circle, transparent 20%, ${patternBackground} 20%, ${patternBackground} 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, ${patternBackground} 20%, ${patternBackground} 80%, transparent 80%, transparent) 35px 35px, linear-gradient(${patternForeground} 2.8000000000000003px, transparent 2.8000000000000003px) 0 -1.4000000000000001px, linear-gradient(90deg, ${patternForeground} 2.8000000000000003px, ${patternBackground} 2.8000000000000003px) -1.4000000000000001px 0; background-size: 70px 70px, 70px 70px, 35px 35px, 35px 35px;`,
  };

  patternCSS = patternMap[pattern] ? patternMap[pattern] : "";

  return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    body {
        ${patternCSS}
        background-color: ${patternBackground};
        opacity: 1;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    .wrapper {
      padding: 100px 50px;
      width: 80%;
      height: 70%;
      margin: 0px auto;
      
      background: rgba(22, 24, 29, 0.75);
      border-radius: 18px;
      background-blend-mode: darken, luminosity;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(238, 238, 238, 0.1);


      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    code {
        color: ${colors.juniper.DEFAULT};
        font-family: Menlo;
        white-space: pre-wrap;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Inter', sans-serif;
        font-size: 96px;
        font-weight: 800;
        font-style: normal;
        color: ${colors.vanilla[100]};
        line-height: 1.8;
    }

    .subtitle {
        font-family: 'Inter', sans-serif;
        font-size: 40px;
        font-weight: 400;
        max-width: 65%;
        margin-left: auto;
        margin-right: auto;
        font-style: normal;
        margin-top: -80px;
        color: ${colors.vanilla[200]};
        line-height: 1.8;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { title, subtitle, pattern, theme } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(pattern, theme)}
    </style>
    <body>
        <div class="wrapper">
          <section class="wrapper-body">
            <div class="heading">${emojify(marked(title))}</div>
            <div class="subtitle">
            ${subtitle ? marked(subtitle) : ""}
            </div>
          </section>
          <div class="logo-wrapper">
              ${getImage(
                "https://assets.deepsource.io/cfa46a5/img/logo-wordmark-white.41979ab.svg",
                "300px",
                "auto"
              )}
          </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "225") {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}
