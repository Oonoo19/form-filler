import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import html2pdf from 'html2pdf.js';

const PdfViewer = (htmlContent: string) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const options = {
        filename: 'generated.pdf',
        html2canvas: {},
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };

      html2pdf()
        .set(options)
        .from(contentRef.current)
        .toPdf()
        .output('blob')
        .then((pdfBlob: Blob) => {
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfUrl(pdfUrl);
        });
    }
  }, []);

  return (
    <div>
      <div ref={contentRef} style={{ display: 'none' }}>
        {/* Your HTML content to convert into PDF */}
        {htmlContent}
        <h1>Your Document Title</h1>
        <p>This is a paragraph in your HTML document.</p>
      </div>

      {pdfUrl && (
        <Viewer fileUrl={pdfUrl} />
      )}
    </div>
  );
};

export default PdfViewer;


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
          newline.appendChild(newline);
          newline.appendChild(nodeClone.cloneNode(true));
          container.replaceChild(newline, nodeClone);
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

    
  };
  getAllNodesOnce(container);    
};


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
      const currentNode = stack.pop(); // Get the top node from the stack
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
              const currentStyle = currentNode.style;
              const parentTag = currentNode.tagName;
              console.log("tagname: ", parentTag);
              if(parentTag == 'UL' || parentTag == 'OL' || parentTag == 'TABLE'){
                console.log("tag");
                // Add current page and create new page
                currentPage.style.height = `${layout.height}px`;
                addPages(pageId++, currentPage.outerHTML);
                currentPage = document.createElement('div');
                currentPage.className = 'page';
                currentPage.style.width = `${layout.width}px`;
                currentPage.style.padding = `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`;
                currentPage.appendChild(nodeClone);
                break;
              }
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
          addPages(pageId++, currentPage.outerHTML);
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
  };
  getAllNodesOnce(container);    
};