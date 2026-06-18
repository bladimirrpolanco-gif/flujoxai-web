'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Strikethrough, List, ListOrdered, Link as LinkIcon, Heading2, Heading3, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const btnClass = "p-2 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors disabled:opacity-50";
  const activeClass = "bg-zinc-700 text-white";

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-700 bg-zinc-800">
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${btnClass} ${editor.isActive('bold') ? activeClass : ''}`}
        title="Negrita"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${btnClass} ${editor.isActive('italic') ? activeClass : ''}`}
        title="Cursiva"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`${btnClass} ${editor.isActive('strike') ? activeClass : ''}`}
        title="Tachado"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-zinc-700 mx-1 self-center" />

      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
        className={`${btnClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}
        title="Título 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
        className={`${btnClass} ${editor.isActive('heading', { level: 3 }) ? activeClass : ''}`}
        title="Título 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-zinc-700 mx-1 self-center" />

      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        className={`${btnClass} ${editor.isActive('bulletList') ? activeClass : ''}`}
        title="Lista de viñetas"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        className={`${btnClass} ${editor.isActive('orderedList') ? activeClass : ''}`}
        title="Lista numerada"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-zinc-700 mx-1 self-center" />

      <button
        onClick={(e) => { e.preventDefault(); toggleLink(); }}
        className={`${btnClass} ${editor.isActive('link') ? activeClass : ''}`}
        title="Insertar enlace"
      >
        <LinkIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-zinc-700 mx-1 self-center" />

      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
        disabled={!editor.can().chain().focus().undo().run()}
        className={btnClass}
        title="Deshacer"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
        disabled={!editor.can().chain().focus().redo().run()}
        className={btnClass}
        title="Rehacer"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 underline cursor-pointer',
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[300px] p-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content if value changes externally (e.g. loading edit form)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 transition-shadow">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
