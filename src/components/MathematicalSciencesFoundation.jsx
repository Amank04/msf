import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MathematicalSciencesFoundation = () => {
  const sectionRefs = {
    first: useRef(null),
    second: useRef(null),
    third: useRef(null),
    fourth: useRef(null),
    fifth: useRef(null),
    sixth: useRef(null),
  };

  const navigate = useNavigate();

  const handleClick = () => {
      // console.log("buttoin is pressed.")
      navigate('/courses'); // Replace with your target path
  };

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
      setOpenSection(prevOpenSection => (prevOpenSection === section ? null : section));
  };

  const handleLearnMoreClick = () => {
    document.getElementById('our-story').scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(entry.target.dataset.animation);
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="font-lato text-gray-900 bg-gradient-to-r from-cyan-50 to-blue-100">
      <section className="relative w-full bg-gradient-to-r from-teal-900 to-blue-950 h-screen">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2">
        <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">Mathematical Sciences Foundation</h1>
          <p className="text-blue-100 text-2xl font-bold mb-4 animate-pulse">
            A initiative by Prof. Dinesh Singh
          </p>
          <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleLearnMoreClick}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section id='our-story' ref={sectionRefs.second} data-animation="animate-slide-in" className="py-4 bg-gradient-to-r from-cyan-50 to-blue-100">
        <div className="container mx-auto px-8">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-indigo-600 text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-lg leading-relaxed mb-4 font-serif">
                The Mathematical Sciences Foundation (MSF) has a rich history that traces back to the consolidation of various mathematical activities into the Centre for Mathematical Sciences (CMS) at St. Stephen's College in 1998. In 2000, substantial funding from ICICI Bank transformed CMS into the ICICI Centre for Mathematical Sciences (ICMS). This center rapidly expanded, offering innovative programs that outgrew its initial capacity, leading to the establishment of the Mathematical Sciences Foundation in July 2002. Dr. Anil Wilson, Principal of St. Stephen's College and former Vice-Chancellor of Himachal Pradesh University, served as the Founder Chairman.
              </p>
            </div>
            <div className="w-full md:w-1/2 p-4">
              <img src="https://mathscifound.org/wp-content/uploads/2019/02/blackboard-606627_960_720-1.jpg" alt="Our Story" className="w-full h-auto rounded-lg shadow-lg transition transform hover:scale-105 duration-300" />
            </div>
          </div>
        </div>
      </section>

      <section ref={sectionRefs.third} data-animation="animate-slide-in" className="py-4 bg-gradient-to-r from-cyan-50 to-blue-100">
        <div className="container mx-auto px-8">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 p-4">
              <img src="https://mathscifound.org/wp-content/uploads/2019/02/blackboard-606627_960_720-1.jpg" alt="Our Mission" className="w-full h-auto rounded-lg shadow-lg transition transform hover:scale-105 duration-300" />
            </div>
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-indigo-600 text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed mb-4 font-serif">
                MSF's mission is to promote mathematics at all educational levels, from school to research. It operates from Delhi, India, and offers undergraduate programs in Mathematical Finance and Mathematical Simulation with IT, and graduate programs in partnership with the University of Houston leading to PhDs in Mathematics, Computer Science, and Physics. The foundation also hosts significant seminars and conferences, such as the "Life of Mathematics" and "Mathematics in the 20th Century," attracting prominent mathematicians worldwide.
              </p>
              <p className="text-lg leading-relaxed font-serif">
                The foundation's initiatives extend to contests like the MSF Challenge and Recognizing Ramanujan, aimed at encouraging school students to engage with mathematics innovatively and recognize their problem-solving skills. These contests not only promote mathematical thinking but also honor the legacy of great Indian mathematicians such as Srinivasa Ramanujan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={sectionRefs.fourth} data-animation="animate-slide-in" className="py-4 bg-gradient-to-r from-cyan-50 to-blue-100">
        <div className="container mx-auto px-8">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-indigo-600 text-3xl font-bold mb-4">How We Got Started</h2>
              <p className="text-lg leading-relaxed mb-4 font-serif">
                The roots of MSF go back to the mid-1990s with educational and research activities undertaken by a group of mathematicians from several institutions, such as University of Delhi, St. Stephen’s College, Indian Institute of Technology, Delhi, and the Indian Statistical Institute, Delhi. They were subsequently joined by members of the Economics and Physics faculties from St. Stephen’s College.
              </p>
              <p className="text-lg leading-relaxed font-serif">
                The early projects were mostly carried out with funding from the Department of Science and Technology (DST), Government of India. Notable amongst these was the project titled Mathematics in the Modern World (MMW), which ran from 1995 to 2001, and aimed at showing the applicability of mathematics in solving real-life problems.
              </p>
            </div>
            <div className="w-full md:w-1/2 p-4">
              <img src="https://mathscifound.org/wp-content/uploads/2019/02/1917286_120551681601_4593531_n_120551681601.jpg" alt="How We Got Started" className="w-full h-auto rounded-lg shadow-lg transition transform hover:scale-105 duration-300" />
            </div>
          </div>
        </div>
      </section>

{/* Button to courses */}
      <div className='py-6 w-full flex flex-col items-center justify-center'>
            <h1 className="text-indigo-600 text-3xl font-bold mb-2">
                Discover Our Past Courses
            </h1>
            <button
                onClick={handleClick}
                className="bg-white text-purple-600 font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
            >
                Learn Our Courses
            </button>
        </div>

      <div className="text-center py-4 bg-gradient-to-r from-cyan-50 to-blue-100">
      <h2 className="text-indigo-600 text-3xl font-bold mb-4">FAQs</h2>
        <div className="container mx-auto px-8">
          <div className="mb-5">
            <button
              onClick={() => toggleSection('achievements')}
              className="flex justify-between items-center w-full py-4 px-6 text-left text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-lg focus:outline-none"
            >
              Notable Achievements of the Mathematical Sciences Foundation (MSF)
              <span>{openSection === 'achievements' ? '−' : '+'}</span>
            </button>
            {openSection === 'achievements' && (
              <div className="p-6 bg-white rounded-b-lg">
                <p className="text-lg leading-relaxed mb-4 font-serif">
                  The Mathematical Sciences Foundation (MSF) has achieved significant milestones since its inception. It has successfully integrated innovative educational programs that cater to various levels of mathematical education, from school to advanced research. The foundation has been instrumental in organizing high-profile seminars and conferences, such as the "Life of Mathematics" program, which invites eminent mathematicians to engage with students and faculty. Another notable event was the international conference "Mathematics in the 20th Century," held in 2006 to commemorate the birth centenary of André Weil.
                </p>
              </div>
            )}
          </div>

          <div className="mb-5">
            <button
              onClick={() => toggleSection('partnership')}
              className="flex justify-between items-center w-full py-4 px-6 text-left text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-lg focus:outline-none"
            >
              Benefits of the Partnership with the University of Houston
              <span>{openSection === 'partnership' ? '−' : '+'}</span>
            </button>
            {openSection === 'partnership' && (
              <div className="p-6 bg-white rounded-b-lg">
                <p className="text-lg leading-relaxed mb-4 font-serif">
                  The partnership between the MSF and the University of Houston has been highly beneficial in expanding the foundation's academic and research capabilities. This collaboration allows graduate students to receive rigorous training in mathematics in India before proceeding to the University of Houston for advanced studies. The programs are designed to prepare students for both academic careers and industry roles. This partnership has also enhanced the research opportunities available to students, providing them with exposure to international standards and practices in mathematical sciences.
                </p>
              </div>
            )}
          </div>

          <div className="mb-5">
            <button
              onClick={() => toggleSection('seminars')}
              className="flex justify-between items-center w-full py-4 px-6 text-left text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-lg focus:outline-none"
            >
              Seminars and Conferences Hosted by MSF
              <span>{openSection === 'seminars' ? '−' : '+'}</span>
            </button>
            {openSection === 'seminars' && (
              <div className="p-6 bg-white rounded-b-lg">
                <p className="text-lg leading-relaxed mb-4 font-serif">
                  MSF organizes a variety of seminars and conferences aimed at fostering a deeper understanding and appreciation of mathematics. One of the key programs is the "Life of Mathematics," which annually brings distinguished mathematicians to St. Stephen's College for direct interaction with students and faculty. Recent participants have included notable figures like Sir Michael Atiyah and Martin Golubitsky. The "Mathematics in the 20th Century" conference, held in 2006, was another significant event that highlighted the contributions of mathematicians over the past century and facilitated discussions on future directions in the field.
                </p>
              </div>
            )}
          </div>

          <div className="mb-5">
            <button
              onClick={() => toggleSection('financial')}
              className="flex justify-between items-center w-full py-4 px-6 text-left text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-lg focus:outline-none"
            >
              Financial Aid and Scholarships
              <span>{openSection === 'financial' ? '−' : '+'}</span>
            </button>
            {openSection === 'financial' && (
              <div className="p-6 bg-white rounded-b-lg">
                <p className="text-lg leading-relaxed mb-4 font-serif">
                MSF offers scholarships and fellowships to deserving students based on merit and financial need. These scholarships are intended to cover tuition fees and, in some cases, provide a stipend for living expenses. For instance, graduate students participating in the programs in collaboration with the University of Houston receive training at MSF for a year, during which they are likely supported through scholarships or stipends to cover their educational expenses​.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathematicalSciencesFoundation;
