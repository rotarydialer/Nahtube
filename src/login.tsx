import * as React from "react";
import * as ReactDOM from "react-dom";

import { Login } from "./components/Login";

ReactDOM.render(
    <Login compiler="TypeScript" framework="React" />,
    document.getElementById("wrapper")
);