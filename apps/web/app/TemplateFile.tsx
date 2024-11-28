import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const TemplateFile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/templates/email-template/images`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-gray-500">Loading images...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    // setCopied(link);
    // setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <p className='text-center mb-4'>Image history</p>
      <div className="grid grid-cols-2 gap-4">
      {data.map((eachData: any, index) => (
        <div
          key={index}
          className="group relative flex cursor-pointer flex-col items-center rounded bg-white p-1 shadow"
          onClick={() =>
            handleCopy(
              `${process.env.NEXT_PUBLIC_IMAGE_DISTRIBUTION_KEY}/${eachData.key}`
            )
          }
        >
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_DISTRIBUTION_KEY}/${eachData.key}`}
            alt={`Image ${index + 1}`}
            className="h-24 w-full rounded object-cover"
          />
          {/* <p className="mt-2 w-full truncate text-sm text-gray-500">{image}</p> */}
          <div className="absolute left-0 top-0 hidden h-full w-full items-center justify-center bg-black bg-opacity-20 group-hover:flex">
            <p className="text-xs font-bold text-white">Click to Copy</p>
          </div>
          {/* {copied === image && (
        <span className="absolute bottom-2 text-green-500 text-xs">Copied!</span>
      )} */}
        </div>
      ))}
    </div>
    </div>
  );
};

export default TemplateFile;
