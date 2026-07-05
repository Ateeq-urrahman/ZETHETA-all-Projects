'use client';

import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write clear, learner-friendly financial guidance...'
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'rich-editor',
        'aria-label': 'Rich text block content editor'
      }
    },
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="rich-editor rich-editor--loading">Loading editor...</div>;
  }

  return (
    <div className="rich-editor-shell">
      <div className="rich-editor-toolbar" aria-label="Text formatting toolbar">
        <button type="button" aria-label="Bold" onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </button>
        <button type="button" aria-label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </button>
        <button type="button" aria-label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          List
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
