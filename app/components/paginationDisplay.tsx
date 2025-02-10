// components/PaginationDisplay.tsx
import React from 'react';
import { Pagination } from '../utils/types';

interface PaginationDisplayProps {
  pages: Pagination[];
}

const PaginationDisplay: React.FC<PaginationDisplayProps> = ({ pages }) => {
  return (
    <div>
      {pages.map((page, id) => (
        <div key={page.id}>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
          <div className='flex justify-end'>{id + 1}/{pages.length}</div>
        </div>
      ))}
    </div>
  );
};

export default PaginationDisplay;
