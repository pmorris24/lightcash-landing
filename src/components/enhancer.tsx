"use client";

import { useEffect } from "react";
import { enhance } from "@/lib/enhance";

/** Runs the page's progressive enhancements once the static markup has hydrated. */
export function Enhancer() {
  useEffect(() => enhance(document), []);
  return null;
}
