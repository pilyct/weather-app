const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center mb-4 space-x-2 bg-transparent animate-spinSlow">
        <div className="border-4 border-orange-200 border-dashed rounded-full h-14 w-14"></div>
      </div>
      <p className="font-medium text-white">
        Hang tight, we're talking to the clouds...
      </p>
    </div>
  );
};

export default Spinner;
