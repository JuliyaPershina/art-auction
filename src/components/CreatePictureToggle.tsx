'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const CreatePictureForm = dynamic<{ onUpload: () => void }>(
  () => import('@/components/CreatePictureForm'),
  { ssr: false },
);

export default function CreatePictureToggle() {
  const [open, setOpen] = useState(false);

  const handleUpload = () => {
    console.log('Picture uploaded!');
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {open ? 'Close Upload Form' : 'Upload Picture'}
      </button>

      {open && <CreatePictureForm onUpload={handleUpload} />}
    </div>
  );
}

// 'use client';
// import { useState } from 'react';
// import dynamic from 'next/dynamic';
// import type { Picture } from './PictureGallery';

// interface Props {
//   onUpload: () => void; // колбек для оновлення галереї
// }

// // Динамічне підвантаження форми, тільки на клієнті
// const CreatePictureForm = dynamic<{
//   onUpload: () => void;
//   setOpen: (open: boolean) => void;
// }>(() => import('@/components/CreatePictureForm'), { ssr: false });

// export default function CreatePictureToggle({ onUpload }: Props) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="flex flex-col items-center space-y-2">
//       <button
//         onClick={() => setOpen(!open)}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         {open ? 'Close Upload Form' : 'Upload Picture'}
//       </button>

//       {open && <CreatePictureForm onUpload={onUpload} setOpen={setOpen} />}
//     </div>
//   );
// }


