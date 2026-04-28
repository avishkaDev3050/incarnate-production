import React from 'react';

const WellbeingHero = () => {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-3xl text-center">
        {/* Title */}
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          Wellbeing Journey
        </h1>

        {/* Content Paragraphs */}
        <div className="space-y-6 text-lg leading-relaxed text-gray-600 md:text-xl">
          <p>
            When body, mind, soul is at one true internal unity is attained.
          </p>
          <p>
            When body, mind, soul is at one with the world then true harmony can be experienced.
          </p>
          <p className="font-medium text-gray-800">
            When unity, harmony is infused with the Creator, our true destiny is ready to be discovered.
          </p>
        </div>
        
        {/* Decorative Element */}
        <div className="mt-10 flex justify-center">
          <div className="h-1 w-20 rounded-full bg-indigo-500"></div>
        </div>
      </div>
    </section>
  );
};

export default WellbeingHero;