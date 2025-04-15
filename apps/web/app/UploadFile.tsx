import axios from 'axios';
import React from 'react';
import { useState } from 'react';

const UploadFile = ({ onUploadComplete }: { onUploadComplete: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    setLoading(true);
    const selectedFile = e.target.files[0];

    const fileURL = URL.createObjectURL(selectedFile);
    setFile(selectedFile);

    await uploadFile(selectedFile);
    setFile(null);
  };

  const uploadFile = async (selectedFile: File) => {
    if (!selectedFile) {
      alert('Please select a file!');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/templates/upload-email-template-image?path=email-template/file`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading file', error);
      alert('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mx-auto flex w-max min-w-[300px] items-center overflow-hidden rounded-md bg-white p-1 font-[sans-serif] text-[#333] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
      <div className="flex px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 612.675 612.675"
        >
          <path
            d="M581.209 223.007 269.839 530.92c-51.592 51.024-135.247 51.024-186.839 0-51.592-51.023-51.592-133.737 0-184.761L363.248 69.04c34.402-34.009 90.15-34.009 124.553 0 34.402 34.008 34.402 89.166 0 123.174l-280.249 277.12c-17.19 17.016-45.075 17.016-62.287 0-17.19-16.993-17.19-44.571 0-61.587L394.37 161.42l-31.144-30.793-249.082 246.348c-34.402 34.009-34.402 89.166 0 123.174 34.402 34.009 90.15 34.009 124.552 0l280.249-277.12c51.592-51.023 51.592-133.737 0-184.761-51.593-51.023-135.247-51.023-186.839 0L36.285 330.784l1.072 1.071c-53.736 68.323-49.012 167.091 14.5 229.88 63.512 62.79 163.35 67.492 232.46 14.325l1.072 1.072 326.942-323.31-31.122-30.815z"
            data-original="#000000"
          />
        </svg>
        <p className="ml-3 text-sm">{file ? file.name : 'No image selected'}</p>
      </div>
      <label
        htmlFor="uploadFile1"
        className="ml-auto block w-max cursor-pointer rounded-md bg-gray-800 px-3 py-2.5 text-sm text-white outline-none hover:bg-gray-700"
      >
        {isLoading ? 'Uploading...' : 'Upload'}
      </label>
      <input
        onChange={handleFileChange}
        type="file"
        accept="image/*"
        id="uploadFile1"
        className="hidden"
      />
    </div>
  );
};

export default UploadFile;
