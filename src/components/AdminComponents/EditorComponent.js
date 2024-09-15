"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
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
import { Maximize2, Minimize2, AlertTriangle, Terminal } from "lucide-react";
import "highlight.js/styles/github-dark.css";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MAX_CONTENT_LENGTH = 10000; // Maximum allowed content length

export default function EditorComponent({ markdown, setContent }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

  const toggleFullScreen = useCallback((e) => {
    e.preventDefault();
    setIsFullScreen((prev) => !prev);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleContentChange = useCallback(
    (newContent) => {
      if (newContent.length > MAX_CONTENT_LENGTH) {
        setError(
          `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`
        );
      } else {
        setError(null);
        setContent(newContent);
      }
    },
    [setContent]
  );

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isFullScreen) {
        toggleFullScreen(event);
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isFullScreen, toggleFullScreen]);

  return (
    <div
      className={`w-full overflow-auto max-h-screen scrollbar-hide ${
        isFullScreen ? "fixed inset-0 z-[30]" : ""
      }`}
    >
      <div
        className={`relative flex flex-col ${isFullScreen ? "h-screen" : ""}`}
      >
        {error && (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the cli.
            </AlertDescription>
          </Alert>
        )}
        <MDXEditor
          onChange={handleContentChange}
          ref={editorRef}
          markdown={markdown}
          className={`${
            isFullScreen
              ? "fixed border-none h-full overflow-auto scrollbar-hide w-full top-0 left-0 backdrop-blur-md"
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
            imagePlugin({
              imageUploadHandler: async () => {
                // Implement your image upload logic here
                return Promise.reject("Image upload not implemented");
              },
            }),
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
                <div className="flex flex-wrap justify-between items-center gap-2 w-full dark:gray-600 border-t h-full p-2">
                  <div className="flex items-center gap-2">
                    <BlockTypeSelect />
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <ListsToggle />
                    <InsertCodeBlock />
                    <InsertImage />
                    <InsertThematicBreak />
                  </div>
                  <div className="flex items-center gap-2">
                    <DiffSourceToggleWrapper />
                    <button
                      className="p-2 rounded transition-colors"
                      onClick={toggleFullScreen}
                      aria-label={
                        isFullScreen ? "Exit full screen" : "Enter full screen"
                      }
                    >
                      {isFullScreen ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ),
            }),
          ]}
        />
      </div>
    </div>
  );
}
