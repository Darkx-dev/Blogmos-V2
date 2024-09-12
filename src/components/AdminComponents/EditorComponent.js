"use client";
import React from "react";
import {
  BoldItalicUnderlineToggles,
  InsertTable,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  imagePlugin,
  tablePlugin,
  toolbarPlugin,
  InsertImage,
  BlockTypeSelect,
  CodeToggle,
  codeBlockPlugin,
  InsertCodeBlock,
  codeMirrorPlugin,
  ListsToggle,
  listsPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const EditorComponent = ({ markdown, editorRef, setContent }) => {
  return (
    <div className="w-full overflow-x-auto">
      <MDXEditor
        onChange={setContent}
        ref={editorRef}
        markdown={markdown}
        contentEditableClassName="prose dark:prose-invert max-w-none bg-[#00000006] dark:bg-[#ffffff06] rounded-lg dark:text-white p-4 min-h-[200px]"
        placeholder="Write something"
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-wrap gap-2">
                <BlockTypeSelect />
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <InsertTable />
                <InsertImage />
                <InsertCodeBlock />
                <CodeToggle />
                <ListsToggle />
              </div>
            ),
          }),
          tablePlugin(),
          imagePlugin(),
          headingsPlugin(),
          listsPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: "JavaScript",
              css: "CSS",
              python: "Python",
            },
          }),
        ]}
      />
    </div>
  );
};

export default EditorComponent;