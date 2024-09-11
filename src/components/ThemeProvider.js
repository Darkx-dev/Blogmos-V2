"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const ThemeProviderSystem = ({ children, ...props }) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default ThemeProviderSystem

