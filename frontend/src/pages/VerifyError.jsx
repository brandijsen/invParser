const VerifyError = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] pt-24 sm:pt-32 pb-24 px-4 text-center">
      <h1 className="text-3xl font-bold text-red-600">Verification failed</h1>
      <p className="mt-3 text-gray-700">The verification link is invalid or expired.</p>
    </div>
  );
};

export default VerifyError;
