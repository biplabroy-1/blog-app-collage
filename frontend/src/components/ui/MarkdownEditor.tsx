import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    minHeight?: number;
};

const wrapSelection = (el: HTMLTextAreaElement, before: string, after = before) => {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end) || '';
    const newText = el.value.substring(0, start) + before + selected + after + el.value.substring(end);
    const cursorPos = start + before.length + selected.length + after.length;
    el.value = newText;
    el.setSelectionRange(cursorPos, cursorPos);
    el.dispatchEvent(new Event('input', { bubbles: true }));
};

const insertAtCursor = (el: HTMLTextAreaElement, text: string) => {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newText = el.value.substring(0, start) + text + el.value.substring(end);
    const cursorPos = start + text.length;
    el.value = newText;
    el.setSelectionRange(cursorPos, cursorPos);
    el.dispatchEvent(new Event('input', { bubbles: true }));
};

const MarkdownEditor: React.FC<Props> = ({ value, onChange, placeholder, minHeight = 240 }) => {
    const [mode, setMode] = useState<'write' | 'preview'>('write');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const applyWrap = (before: string, after?: string) => {
        if (!textareaRef.current) return;
        wrapSelection(textareaRef.current, before, after);
        onChange(textareaRef.current.value);
        textareaRef.current.focus();
    };

    const applyInsert = (text: string) => {
        if (!textareaRef.current) return;
        insertAtCursor(textareaRef.current, text);
        onChange(textareaRef.current.value);
        textareaRef.current.focus();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                    <button type="button" onClick={() => applyWrap('**')} title="Bold" className="px-2 py-1 rounded border">B</button>
                    <button type="button" onClick={() => applyWrap('_')} title="Italic" className="px-2 py-1 rounded border">I</button>
                    <button type="button" onClick={() => applyWrap('# ', '')} title="Heading" className="px-2 py-1 rounded border">H</button>
                    <button type="button" onClick={() => applyWrap('`')} title="Inline code" className="px-2 py-1 rounded border">{'</>'}</button>
                    <button type="button" onClick={() => applyInsert('\n```\n\n```\n')} title="Code block" className="px-2 py-1 rounded border">Code</button>
                    <button type="button" onClick={() => applyWrap('[', '](url)')} title="Link" className="px-2 py-1 rounded border">Link</button>
                </div>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setMode('write')} className={`px-3 py-1 rounded ${mode === 'write' ? 'bg-primary text-white' : 'border'}`}>
                        Write
                    </button>
                    <button type="button" onClick={() => setMode('preview')} className={`px-3 py-1 rounded ${mode === 'preview' ? 'bg-primary text-white' : 'border'}`}>
                        Preview
                    </button>
                </div>
            </div>

            {mode === 'write' ? (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ minHeight }}
                    className="w-full p-3 rounded border bg-input text-foreground font-mono"
                />
            ) : (
                <div className="prose max-w-full p-3 rounded border bg-card text-foreground">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || '*Nothing to preview*'}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default MarkdownEditor;
