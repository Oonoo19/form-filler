'use client'
import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from "jodit-react";
import { INSERT_AS_HTML } from 'jodit/esm/core/constants';

interface TextEditorProps {
    onContentChange: (newContent: string) => void; 
}

const TextEditor: React.FC<TextEditorProps> = ({ onContentChange }) => {
    const editor = useRef(null); 
    const [content, setContent] = useState("Enter text here:");
    

    // const config = useMemo( 
    //     () => ({              
    //         uploader: {
    //             insertImageAsBase64URI: true,
    //             imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'], 
    //         },
    //         cache: true,
    //     }),
    //     []
    // );  

    const options = [ 'bold', 'italic', '|', 'ul', 'ol', '|', 'font', 'fontsize', '|', 'outdent', 'indent', 'align', '|', 'hr', '|', 'fullsize', 'brush', '|', 'table', 'link', '|', 'undo', 'redo',];
    const config = useMemo(
        () => ({
        //theme: "dark",
        readonly: false,
        placeholder: '',
        // defaultActionOnPaste: INSERT_AS_HTML,
        defaultActionOnPasteFromWord: INSERT_AS_HTML,
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        defaultLineHeight: 1.5,
        buttons: options,
        buttonsMD: options,
        buttonsSM: options,
        buttonsXS: options,
        statusbar: false,
        sizeLG: 900,
        sizeMD: 700,
        sizeSM: 400,
        toolbarAdaptive: false,
        cache: true,
        }),
        [],
    );

    const handleChange = (value: any) => {
        setContent(value);
        onContentChange(value);
    };

    return (
        <div>
            <JoditEditor
                ref={editor}            
                value={content}         
                config={config}         
                onChange={handleChange} 
                className="h-[70%] mt-10 bg-white"
            />
            <style>
                {`.jodit-wysiwyg{height:400px !important}`}
            </style>
        </div>
    );
}

export default TextEditor;