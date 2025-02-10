'use client'
import React from 'react';
import { Input } from 'antd';
import { FormField } from '../utils/types';

interface FormFieldListProps {
  formFields: FormField[];
  onInputChange: (key: string, value: string) => void;
}

const FormFieldList: React.FC<FormFieldListProps> = ({ formFields, onInputChange }) => {
  return (
    <div>
      <div className='my-4 font-bold'>Fields:</div>
      {formFields.map((field) => (
        <div key={field.key} className='p-[4px]'>
          <label>{field.label}</label>
          <Input
            type="text"
            value={field.value}
            onChange={(e) => onInputChange(field.key, e.target.value)}
            id={`input-${field.key}`}
          />
        </div>
      ))}
    </div>
  );
};

export default FormFieldList;
