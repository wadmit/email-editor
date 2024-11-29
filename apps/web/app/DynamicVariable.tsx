import { useEditorContext } from '@/stores/editor-store';
import React from 'react';

const availableVariables = [
  {
    name: 'Lead id',
    value: 'lead.id',
  },
  {
    name: 'Lead name',
    value: 'lead.name',
  },
  {
    name: 'Lead email',
    value: 'lead.email',
  },
  {
    name: 'Lead phone',
    value: 'lead.phone',
  },
  {
    name: 'Lead latest_wisescore',
    value: 'lead.latest_wisescore',
  },
];
const DynamicVariable = ({
  handleVaribales,
}: {
  handleVaribales: (value: string) => void;
}) => {
  const { editor } = useEditorContext((s) => s);

  const handleDyamicVariable = (variable: string) => {
    editor?.commands.insertContent(`{{${variable}}}`);
    handleVaribales(variable)
  };
  return (
    <>
      <p className="mb-2 text-center">Lead variables</p>

      <ul className="w-48 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
        {availableVariables.map((item, index) => {
          return (
            <li
            key={index}
              onClick={() => handleDyamicVariable(item.value)}
              className="w-full cursor-pointer rounded-t-lg border-b border-gray-200 px-4 py-2 dark:border-gray-600"
            >
              {item.name}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default DynamicVariable;
