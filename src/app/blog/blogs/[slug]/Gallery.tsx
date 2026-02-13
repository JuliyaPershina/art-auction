// 'use client';

// import Image from 'next/image';
// import { useState } from 'react';

// interface GalleryProps {
//   images: string[];
//   title: string;
// }

// export default function Gallery({ images, title }: GalleryProps) {
//   const [selected, setSelected] = useState<string | null>(null);

//   if (!images.length) return null;

//   return (
//     <>
//       <div className="flex flex-col gap-4 lg:sticky lg:top-24 max-h-[80vh] overflow-y-auto pr-2">
//         {/* Велике фото */}
//         <div className="cursor-pointer" onClick={() => setSelected(images[0])}>
//           <Image
//             src={images[0]}
//             alt={title}
//             width={800}
//             height={600}
//             className="w-full rounded-2xl object-contain"
//           />
//         </div>

//         {/* Маленькі фото */}
//         {images.slice(1).map((img, i) => (
//           <div
//             key={i}
//             className="cursor-pointer"
//             onClick={() => setSelected(img)}
//           >
//             <Image
//               src={img}
//               alt={title}
//               width={400}
//               height={300}
//               className="w-full rounded-xl object-contain"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {selected && (
//         <div
//           className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
//           onClick={() => setSelected(null)}
//         >
//           <Image
//             src={selected}
//             alt="Preview"
//             width={1200}
//             height={800}
//             className="max-h-[90vh] w-auto object-contain"
//           />
//         </div>
//       )}
//     </>
//   );
// }

'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  images: string[];
  title: string;
}

export default function Gallery({ images, title }: Props) {
  const [active, setActive] = useState<string | null>(null);

  if (!images.length) return null;

  const [main, ...thumbs] = images;

  return (
    <>
      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto pr-2">
        {/* MAIN IMAGE */}
        <div className="cursor-pointer" onClick={() => setActive(main)}>
          <Image
            src={main}
            alt={title}
            width={800}
            height={600}
            className="w-full h-auto rounded-2xl object-contain"
          />
        </div>

        {/* THUMBNAILS */}
        <div className="grid grid-cols-2 gap-4">
          {thumbs.map((img, index) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => setActive(img)}
            >
              <Image
                src={img}
                alt={`${title}-${index}`}
                width={400}
                height={300}
                className="w-full h-auto rounded-xl object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE LAYOUT – БЕЗ HORIZONTAL SCROLL */}
      <div className="flex flex-col gap-4 lg:hidden">
        {images.map((img, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => setActive(img)}
          >
            <Image
              src={img}
              alt={`${title}-${index}`}
              width={800}
              height={600}
              className="w-full h-auto rounded-xl object-contain"
            />
          </div>
        ))}
      </div>

      {/* MODAL WITH ANIMATION */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-[95vw] max-h-[95vh]"
            >
              <Image
                src={active}
                alt={title}
                width={1400}
                height={1000}
                className="w-auto h-auto max-h-[90vh] object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
