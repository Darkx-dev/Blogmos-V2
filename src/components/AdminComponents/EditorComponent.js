"use client";
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
    <MDXEditor
      onChange={setContent}
      ref={editorRef}
      markdown={markdown}
      contentEditableClassName="bg-[#00000006]"
      placeholder="Write something"
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <InsertTable />
              <InsertImage />
              <InsertCodeBlock />
              <CodeToggle />
              <ListsToggle />
            </>
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
  );
};

export default EditorComponent;
