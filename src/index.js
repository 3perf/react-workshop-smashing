import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://39cc66941d9149eda7e4bf7d7d84859d@o792279.ingest.sentry.io/5800900",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
