'use client'
import React, { useState } from 'react';
import ContractFiller from './contractFiller';
import TextEditor from './textEditor';
import { Select, SelectProps } from 'antd';
import "./ui/document.css";
import { LayoutOption, MarginOption } from '../utils/types';
// import { predefinedLayouts, predefinedMargins } from '../utils/constants';

export const predefinedLayouts: LayoutOption[] = [
    {
      key: "A4",
      label: "A4 (210mm × 297mm)",
      // Approximate pixels
      width: 794, 
      height: 1123, 
    },
    {
      key: "Letter",
      label: "Letter (8.5in × 11in)",
      // Approximate pixels
      width: 816, 
      height: 1056, 
    },
];

export const predefinedMargins: MarginOption[] = [
    {
        key: "Normal",
        label: "Normal (1 inch)",
        top: 96,  
        bottom: 96,
        left: 96,
        right: 96,
    },
    {
        key: "Narrow",
        label: "Narrow (0.5 inch)",
        top: 48,
        bottom: 48,
        left: 48,
        right: 48,
    },
    {
        key: "Moderate",
        label: "Moderate (1 inch top/bottom, 0.75 inch left/right)",
        top: 96,
        bottom: 96,
        left: 72,  
        right: 72,
    },
    {
        key: "Wide",
        label: "Wide (1 inch top/bottom, 2 inches left/right)",
        top: 96,
        bottom: 96,
        left: 192,  
        right: 192,
    },
];

export default function Editor() {
    const [content, setContent] = useState("Enter text here:");
    const [selectedLayout, setSelectedLayout] = useState<LayoutOption>(predefinedLayouts[0]);
    const [selectedMargin, setSelectedMargin] = useState<MarginOption>(predefinedMargins[0]);

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
    }

    const handleSelectChange: SelectProps["onChange"] = (value: string) => {
        // Find the selected layout by key and set
        const layout = predefinedLayouts.find((layout) => layout.key === value);
        if (layout) {
            setSelectedLayout(layout);
        }
    };

    const handleMarginChange: SelectProps["onChange"] = (value: string) => {
        const margin = predefinedMargins.find((margin) => margin.key === value);
        if (margin) {
            setSelectedMargin(margin);
        }
    };

    return (
        <div className="h-screen w-screen p-10 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1 h-full">
                <TextEditor onContentChange={handleContentChange}/>
                <div className='my-4 font-bold'>Layout settings:</div>
                <div className='flex gap-4'>
                    <Select
                        value={selectedLayout.key}
                        style={{ width: 200 }}
                        placeholder="Select a layout"
                        onChange={handleSelectChange}
                    >
                        {predefinedLayouts.map((option) => (
                            <Select.Option key={option.key} value={option.key}>
                                {option.label}
                            </Select.Option>
                            ))}
                    </Select>
                    <Select
                        value={selectedMargin.key}
                        style={{ width: 200 }}
                        placeholder="Select margins"
                        onChange={handleMarginChange}
                    >
                        {predefinedMargins.map((option) => (
                            <Select.Option key={option.key} value={option.key}>
                                {option.label}
                            </Select.Option>
                            ))}
                    </Select>
                </div>
            </div>
            <ContractFiller htmlContent={content} layout={selectedLayout} margin={selectedMargin} />
        </div>
    );
}