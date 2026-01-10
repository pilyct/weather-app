// const Spinner: React.FC = () => {
//   return (
//     <div className='flex flex-col items-center justify-center'>
//       <div className="flex items-center justify-center mb-4 space-x-2 bg-transparent animate-spinSlow">
//         <div className="border-4 border-orange-200 border-dashed rounded-full h-14 w-14"></div>
//       </div>
//       <p className='font-medium text-white'>Hang tight, we're talking to the clouds...</p>
//     </div>
//   )
// }

// export default Spinner;
import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <div className="mb-4 flex items-center justify-center bg-transparent">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-dashed border-orange-200" />
      </div>
      <p className="text-sm font-medium text-white sm:text-base">
        Hang tight, we're talking to the clouds...
      </p>
    </div>
  );
};

export default Spinner;
