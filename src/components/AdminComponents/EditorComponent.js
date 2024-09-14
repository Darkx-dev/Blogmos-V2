"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  BoldItalicUnderlineToggles,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  imagePlugin,
  toolbarPlugin,
  InsertImage,
  BlockTypeSelect,
  codeBlockPlugin,
  InsertCodeBlock,
  codeMirrorPlugin,
  ListsToggle,
  listsPlugin,
  markdownShortcutPlugin,
  DiffSourceToggleWrapper,
  diffSourcePlugin,
  InsertThematicBreak,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Maximize2, Minimize2 } from "lucide-react";
import "highlight.js/styles/github-dark.css";

export default function EditorComponent({ markdown, setContent }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const editorRef = useRef(null);

  const toggleFullScreen = useCallback((e) => {
    e.preventDefault(); // Prevent the default button behavior
    setIsFullScreen((prev) => !prev);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div
      className={`w-full overflow-auto max-h-screen scrollbar-hide ${
        isFullScreen ? "fixed inset-0 z-[30] bg-background" : ""
      }`}
    >
      <div
        className={`relative flex flex-col ${isFullScreen ? "h-screen" : ""}`}
      >
        <MDXEditor
          onChange={setContent}
          ref={editorRef}
          markdown={markdown}
          className={`${
            isFullScreen
              ? "fixed border-none h-full overflow-auto scrollbar-hide w-full top-0 left-0 backdrop-blur-md bg-gray-500/5"
              : ""
          }`}
          contentEditableClassName={`mb-2 dark:shadow-white dark:text-white border rounded-lg p-4 ${
            isFullScreen && "min-h-screen"
          }`}
          placeholder="Write your blog post here..."
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            markdownShortcutPlugin(),
            imagePlugin(),
            diffSourcePlugin(),
            thematicBreakPlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                javascript: "JavaScript",
                css: "CSS",
                html: "HTML",
                python: "Python",
                c: "C",
                cpp: "C++",
                rust: "Rust",
                go: "Go",
                php: "PHP",
                ruby: "Ruby",
              },
            }),
            toolbarPlugin({
              toolbarContents: () => (
                <div className="flex flex-wrap justify-between gap-2 w-full dark:gray-600 border-t h-full p-2">
                  <BlockTypeSelect />
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <ListsToggle />
                  <InsertCodeBlock />
                  <InsertImage />
                  <DiffSourceToggleWrapper />
                  <InsertThematicBreak />
                  <button className="pr-2" onClick={toggleFullScreen}>
                    {isFullScreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ),
            }),
          ]}
        />
      </div>
    </div>
  );
}
