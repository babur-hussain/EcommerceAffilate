export default function MainBanner() {
  return (
    <div className="bg-linear-to-r from-blue-50 to-blue-100">
      <div className="max-w-300 mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center h-[280px]">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Mega Sale — Up to 70% Off
          </h2>
          <p className="text-base md:text-lg mb-6 text-gray-700">
            Electronics, Fashion, Home and more
          </p>
          <button className="bg-blue-600 text-white px-8 py-2.5 rounded-md font-semibold hover:bg-blue-700 text-sm">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
