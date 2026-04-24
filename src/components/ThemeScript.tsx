"use client";

import { useServerInsertedHTML } from "next/navigation";

const THEME_KEY = "dpcode-theme";

const themeInit = `(function(){try{var d=document.documentElement;var K=${JSON.stringify(THEME_KEY)};function apply(){var t=localStorage.getItem(K);if(t==='dark'){d.classList.add('dark');return}if(t==='light'){d.classList.remove('dark');return}window.matchMedia('(prefers-color-scheme: dark)').matches?d.classList.add('dark'):d.classList.remove('dark')}apply();window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(!localStorage.getItem(K))apply()})}catch(e){}})()`;

/** Injects theme sync into the HTML stream so it runs before paint without React 19 script-tag warnings. */
export function ThemeScript() {
  useServerInsertedHTML(() => (
    <script
      id="dpcode-theme-init"
      dangerouslySetInnerHTML={{ __html: themeInit }}
    />
  ));
  return null;
}
