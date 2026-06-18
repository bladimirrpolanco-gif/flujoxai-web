'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Estilo base de Quill

// Cargamos react-quill de forma dinámica (solo en cliente) para evitar errores de SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'], // Remover formato, etc.
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link',
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden [&_.ql-toolbar]:bg-zinc-800 [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-zinc-700 [&_.ql-container]:border-none [&_.ql-editor]:text-white [&_.ql-editor]:min-h-[300px] [&_.ql-editor.ql-blank::before]:text-zinc-600 [&_.ql-stroke]:stroke-zinc-400 [&_.ql-fill]:fill-zinc-400 [&_.ql-picker]:text-zinc-400">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Escribe tu contenido aquí...'}
      />
    </div>
  );
}
