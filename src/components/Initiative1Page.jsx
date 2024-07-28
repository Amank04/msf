import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { txtdb } from '../components/databaseConfig/firebaseConfig';
import Loading from '../components/LoadSaveAnimation/Loading';
import Notification from './Notification';

const Initiative1Page = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sectionsRef = useRef({});

  useEffect(() => {
    const sections = [
      'introduction', 'aims', 'philosophy', 'offerings',
      'vision', 'mission', 'philosophyPractice', 'outcomes',
      'crisis', 'essentialFeatures', 'problems', 'advancedNations',
      'need'
    ];

    const fetchData = () => {
      const fetchedData = {};
      let fetchedCount = 0;

      sections.forEach((section) => {
        const sectionRef = ref(txtdb, `internetCollege/${section}`);
        onValue(sectionRef, (snapshot) => {
          const value = snapshot.val();
          fetchedData[section] = value || '';
          fetchedCount++;

          // When all sections have been fetched, update the state
          if (fetchedCount === sections.length) {
            setData(fetchedData);
            setLoading(false);
          }
        }, (error) => {
          setError('Error fetching data');
          setLoading(false);
        });
      });
    };

    fetchData();
  }, []);

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

    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      Object.values(sectionsRef.current).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [data]);

  const handleLearnMoreClick = () => {
    document.getElementById('aims-section').scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Notification message={error} type="error" onClose={() => setError('')} />
      </div>
    );
  }

  const sectionNames = {
    introduction: 'Introduction',
    aims: 'Aims',
    philosophy: 'Philosophy',
    offerings: 'Offerings',
    vision: 'Vision Statement',
    mission: 'Mission Statement',
    philosophyPractice: 'Philosophy and Practice',
    outcomes: 'Outcomes of the Philosophy',
    crisis: 'Crisis Facing Education',
    essentialFeatures: 'Essential Features of the Internet College',
    problems: 'Why Do We Have These Problems?',
    advancedNations: 'Is The Situation In The Advanced Nations Of The World Much Different?',
    need: 'The Need for an ‘Out of the Box’ Digital and Technology Based Learning Platform'
  };

  const renderContent = (text) => {
    const lines = text.split('\n');
    const elements = [];

    lines.forEach((line, index) => {
      if (line.startsWith('•') || line.startsWith('-')) {
        elements.push(
          <li key={index} className="list-disc pl-5">
            {line.slice(1).trim()}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<br key={index} />);
      } else {
        elements.push(
          <p key={index} className="mb-4">
            {line}
          </p>
        );
      }
    });

    return <>{elements}</>;
  };

  return (
    <div className="font-lato text-gray-900 bg-gradient-to-r from-cyan-50 to-blue-100 min-h-screen">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-screen relative">
        <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">Welcome to The Internet College</h1>
            <p className="text-2xl mb-8">A place for modern learning and growth</p>
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleLearnMoreClick}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-16 bg-gradient-to-b from-sky-100 to-white">
        <h1 className="text-5xl font-extrabold text-center text-indigo-900 mb-12 tracking-wide">The Internet College</h1>

        {Object.keys(data).map((key, index) => (
          <section
            key={key}
            ref={(el) => (sectionsRef.current[key] = el)}
            data-animation={`animate-${index % 2 === 0 ? 'slide-in' : 'fly-in'}`}
            className="py-20 bg-gradient-to-r from-cyan-50 to-blue-100 mb-12"
          >
            <div className="container mx-auto px-8">
              <h2 className="text-3xl font-bold mb-4 text-center capitalize">
                {sectionNames[key]}
              </h2>
              <div className="text-lg leading-relaxed mb-4 font-serif">
                {renderContent(data[key])}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Initiative1Page;
