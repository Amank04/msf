import React from "react";

const AboutSection = React.forwardRef(({ title, content, imageUrl }, ref) => {
  return (
    <section
      id="about"
      ref={ref}
      data-animation="animate-slide-in"
      className="py-4 bg-gradient-to-r from-cyan-50 to-blue-100"
    >
      <div className="container mx-auto px-8">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/2 p-4 order-2 md:order-1">
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">About</h2>
            {content && (
              <p className="text-lg leading-relaxed">{content}</p>
            )}
          </div>
          <div className="w-full md:w-1/2 p-4 order-1 md:order-2">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="About"
                className="w-full h-auto rounded-lg shadow-lg transition transform hover:scale-105 duration-300"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;
