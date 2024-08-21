import React from 'react';
import { useNavigate } from 'react-router-dom';

const BeautifulButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/about/story'); // Replace with your target path
    };

    return (
        <div className='bg-gradient-to-r from-teal-600 to-blue-700 py-12 w-full flex flex-col items-center justify-center '>
            <div className='text-center text-2xl font-bold leading-8 text-white sm:text-3xl sm:leading-9 pb-2'>

            <h5 className="text-yellow-300 uppercase font-semibold">Discover our journey</h5>
            <p>Our History</p>
            </div>
            <p className="text-white text-lg max-w-3xl text-center mb-4 font-serif">
                The Mathematical Sciences Foundation (MSF) has a rich history that traces back to the consolidation of various mathematical activities into the Centre for Mathematical Sciences (CMS) at St. Stephen's College in 1998. In 2000, substantial funding from ICICI Bank transformed CMS into the ICICI Centre for Mathematical Sciences (ICMS). This center rapidly expanded, offering innovative programs that outgrew its initial capacity......
            </p>
            <button
                onClick={handleClick}
                className="bg-indigo-700 hover:bg-indigo-950 text-white font-bold py-2 px-4 rounded-full"
            >
                Learn More
            </button>
            
        </div>
    );
};

export default BeautifulButton;
