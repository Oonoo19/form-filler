'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'antd';
import DOMPurify from "isomorphic-dompurify";
import "./ui/document.css";
import { FormField, Pagination, LayoutOption, MarginOption } from '../utils/types';
import { placeholderRegex } from '../utils/constants';
import { debounce } from '../utils/helpers';
import { getHtmlWithInputs, getHtmlWithPlaceholders } from '../utils/helpers';
import FormFieldList from './formFieldsList';
import PaginationDisplay from './paginationDisplay';
import PDFViewer from './pdfviewer';
import Html from 'react-pdf-html';
import { Document, Page, Text, View } from '@react-pdf/renderer';


interface ContractFillerProps {
  htmlContent: string;
  layout: LayoutOption;
  margin: MarginOption;
};

const ContractFiller: React.FC<ContractFillerProps> = ({ htmlContent, layout, margin }) => {
  const containerRef = useRef<HTMLDivElement | null>(null); //refs of innerhtml containers
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [pages, setPages] = useState<Pagination[]>([]);
  const [page, setPage] = useState<string>("");
  const [container, setContainer] = useState("");

  useEffect(() => {
    //get placeholders
    const parsedPlaceholders = Array.from(htmlContent.matchAll(placeholderRegex), match => ({
      label: match[1].trim(),
      key: match[2].trim(),
      value: '',
    }));
    // Update or add new form field
    setFormFields(prevFields => {
      const updatedFields = parsedPlaceholders.map(newField => {
        const existingField = prevFields.find(field => field.key === newField.key);
        return existingField ? { ...newField, value: existingField.value } : newField;
      });
      return updatedFields;
    });
  }, [htmlContent]);

  // Invoke paginateContent after every delay. 
  // It means function will be called after user stops typing.
  const debouncedPaginateContent = useCallback(
    debounce((content, margin, layout) => {
      paginateContent(content, margin, layout); 
      console.log("debounce: ", margin);
    }, 300), // debounce delay as ms
    [formFields, layout, margin]
  );

  useMemo(() => {
    const sanitizedContent = DOMPurify.sanitize(getHtmlWithInputs(htmlContent, formFields));
    debouncedPaginateContent(sanitizedContent, margin, layout);
    console.log("useeffect: ", margin);
  }, [formFields, layout, margin]);

  // When contract input clicked, corresponding input is focused
  useEffect(() => {
    const handleButtonClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches('.overlay-button')) {
        const key = target.getAttribute('data-key');
        if (key) {
          const inputElement = document.getElementById(`input-${key}`) as HTMLInputElement;
          console.log(inputElement);
          if (inputElement) {
            inputElement.focus();
          }
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleButtonClick);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handleButtonClick);
      }
    };
  }, []);

  const handleInputChange = (key: string, newValue: string) => {
    console.log("newvalue: ", newValue);
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.key === key ? { ...field, value: newValue } : field
      )
    );
  };

  const addPages = (pageId: number, newPage: string) => {
    if(pageId == 0) {
      setPages([]);
    }
    setPages((prevPages) => {
      const existingPage = prevPages.find((page) => page.id === pageId);
    
      return existingPage
        ? prevPages.map((page) =>
            page.id === pageId ? { ...page, content: newPage } : page
          )
        : [...prevPages, { id: pageId, content: newPage }];
    });
  }
  
 // Show content page by page
 const paginateContent = (htmlContent: string, margin: MarginOption, layout: LayoutOption) => {
  const lineHeight = 30; // One line height, approximate value!
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  const pageHeight = layout.height; // Layout height in pixels
  let currentPage = document.createElement('div');
  currentPage.className = 'page';
  currentPage.style.width = `${layout.width}px`;
  currentPage.style.padding = `${margin.top}px ${margin.right}px ${margin.left}px ${margin.bottom}px`;
  let pageId = 0;

  const getAllNodesOnce = (node: any) => {
    const stack = [node]; // Initialize the stack with the root node - DFS helper stack
  
    while (stack.length > 0) {
      const currentNode = stack.pop(); // Get the last node from the stack
      const nodeClone = currentNode.cloneNode(true) as HTMLElement;
      currentPage.appendChild(nodeClone);
      document.body.appendChild(currentPage);
      let nodeHeight = nodeClone.offsetHeight;
      let newHeight = currentPage.offsetHeight;
      document.body.removeChild(currentPage);
      if(newHeight > pageHeight) {
        currentPage.removeChild(nodeClone);
        if(nodeHeight > lineHeight) {
          if(currentNode.childNodes.length > 0) {
            for (let i = currentNode.childNodes.length - 1; i >= 0; i--) {
              const nodeToPush = currentNode.childNodes[i];
              const parentTag = currentNode.tagName;
              console.log("tagname: ", parentTag);
              const style = currentNode.style.cssText;
              switch (nodeToPush.nodeType) {
                case Node.ELEMENT_NODE:
                  const wrappedElement = document.createElement(parentTag);
                  wrappedElement.style.cssText = style;
                  wrappedElement.appendChild(nodeToPush.cloneNode(true));
                  stack.push(nodeToPush);  
                  break;
                case Node.TEXT_NODE:
                  const textContent = nodeToPush.textContent;
                  textContent.split(' ').reverse().forEach((word: any) => {
                    const wordContainer = document.createElement('span');
                    wordContainer.style.cssText = style;
                    wordContainer.innerHTML = `${word} `;
                    stack.push(wordContainer);
                  });
                  break;
                default:
                  stack.push(nodeToPush); 
                  break;
              }
            }
          } 
          continue;
        } else {
          // Add current page and create new page
          currentPage.style.height = `${layout.height}px`;
          // addPages(pageId++, currentPage.outerHTML);
          const newline = document.createElement('br');
          const line = document.createElement('br');
          newline.appendChild(line);
          newline.appendChild(line);
          newline.appendChild(nodeClone.cloneNode(true));
          container.replaceChild(newline, currentNode);
          currentPage = document.createElement('div');
          currentPage.className = 'page';
          currentPage.style.width = `${layout.width}px`;
          currentPage.style.padding = `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`;
          currentPage.appendChild(nodeClone);
        }
      }
    }
    // if there are remaining html left
    if(currentPage.innerHTML) {
      currentPage.style.height = `${layout.height}px`;
      addPages(pageId++, currentPage.outerHTML);
    }

    setContainer(container.outerHTML);
  };
  getAllNodesOnce(container);    
};

  // Print styling
  const printHtml = () => {
    const printContents = getHtmlWithPlaceholders(htmlContent, formFields);

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    //append
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    doc?.open();
    doc?.write(`
      <html>
        <head>
          <style>
            @page { margin: ${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px ; }
            body { background-color: white;}
            .background {background-color: white; margin: 0;}   
          </style>
        </head>
        <body>
          <div className='background'>
            ${printContents}
          </div>
        </body>
      </html>
    `);
    doc?.close();

    //print and clean up
    if (iframe.contentWindow) {
      iframe.contentWindow.onload = function () {
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      };
    }
  };

  const exampleContent = `
    <div>
      <h1 style="color: blue;">Hello World</h1>
      <p>This is some paragraph text.</p>
    </div>
  `;

  return (
    <div className='flex'>
      <div ref={containerRef} className='flex-1 bg-[#f3f3f3] overflow-auto p-4'>
        {/* <PaginationDisplay pages={pages}/> */}
        <div dangerouslySetInnerHTML={{__html: container}}></div>
        {/* <PDFViewer>
          <Document>
            <Page>
              <View>
                <Text>
                exampleContent
                </Text>
              </View>
            </Page>
          </Document>
        </PDFViewer> */}
      </div>
      <div className='flex-0 min-w-[200px] p-4 overflow-y-auto'>
        <Button onClick={printHtml} className="print-button">
          Print Preview
        </Button>
        <FormFieldList formFields={formFields} onInputChange={handleInputChange}/>
      </div>
    </div>
  );
};

export default ContractFiller;