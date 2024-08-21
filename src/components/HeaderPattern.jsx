import React, { useEffect, useRef } from "react";

const HeaderPattern = () => {
  const textRef = useRef(null);

  return (
    <section className="relative w-full h-40 mt-0 bg-gradient-to-r from-teal-600 to-blue-700">
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
        <div
          className="absolute top-0 left-0 right-0 bottom-0 bg-repeat bg-cover opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,<svg width='100%' height='100%' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='pattern' patternUnits='userSpaceOnUse' width='20' height='20'><circle cx='10' cy='10' r='8' fill='none' stroke='hsl(48, 100%, 67%)' stroke-width='2'/></pattern></defs><rect width='100%' height='100%' fill='url(#pattern)'/></svg>")`,
          }}
        ></div>
        <div className="sm:mt-4 mt-12">
          <p className="text-yellow-200 text-xl font-semibold mb-0 italic animate-fade-in">
            Welcome to
          </p>
          <h1
            ref={textRef}
            className="text-white text-5xl font-extrabold mt-0 animate-fly-in"
          >
            Mathematical Sciences Foundation
          </h1>
          <p className="text-yellow-200 text-md font-bold mb-4 animate-pulse italic">
            A initiative by Prof. Dinesh Singh
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeaderPattern;
