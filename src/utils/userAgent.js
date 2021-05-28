import UAParser from "ua-parser-js";

const userAgent = UAParser();

export const browser = userAgent.browser;
