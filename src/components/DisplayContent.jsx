import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import Loading from './LoadSaveAnimation/Loading';

const DisplayContent = () => {
  const [content, setContent] = useState({
    galleryImages: [],
    videos: [],
    articles: []
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const storage = getStorage();

    // Fetch Content
  // Fetch Content
  const fetchContent = async (path, stateKey) => {
    const contentRef = ref(db, path);
    onValue(contentRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let loadedContent;

        if (stateKey === 'galleryImages') {
          loadedContent = await Promise.all(
            Object.keys(data || {}).map(async key => {
              const item = data[key];

              // Ensure imageUrls is an array before proceeding
              if (item.imageUrls && Array.isArray(item.imageUrls)) {
                try {
                  // Fetch URLs for each image in the imageUrls array
                  const imageUrls = await Promise.all(
                    item.imageUrls.map(async imageUrl => {
                      const imageRef = storageRef(storage, imageUrl);
                      return await getDownloadURL(imageRef);
                    })
                  );
                  return { id: key, ...item, imageUrls };
                } catch (err) {
                  console.error('Failed to get download URLs', err);
                  return null; // Handle image loading error
                }
              } else {
                console.warn(`Invalid or missing imageUrls for item with ID ${key}`);
                return null; // Skip items without valid imageUrls
              }
            })
          );
          loadedContent = loadedContent.filter(item => item !== null); // Filter out any failed or invalid items
        } else if (stateKey === 'videos') {
          loadedContent = Object.keys(data || {}).map(key => ({ id: key, ...data[key] })).reverse();
        } else {
          loadedContent = Object.keys(data || {}).map(key => ({ id: key, ...data[key] })).reverse();
        }

        setContent(prev => ({
          ...prev,
          [stateKey]: loadedContent
        }));
      } else {
        setContent(prev => ({
          ...prev,
          [stateKey]: []
        }));
      }
      setIsLoading(false);
    });
  };


    fetchContent('imageContent', 'galleryImages');
    fetchContent('videoContent', 'videos');
    fetchContent('articleContent', 'articles');

    return () => {
      // Cleanup if needed (not shown in this example)
    };
  }, []);

  useEffect(() => {
    const uniqueCategories = [...new Set([
      ...content.galleryImages.map(img => img.category),
      ...content.videos.map(video => video.category)
    ])];
    setCategories(uniqueCategories);
  }, [content.galleryImages, content.videos]);

  if (isLoading) return <Loading />;

  const renderImage = (image) => {
    return image.imageUrls.map((imageUrl, index) => ({
      original: imageUrl,
      thumbnail: imageUrl,
      description: image.imageDetails,
      originalClass: "rounded-lg shadow-lg",
      loading: "lazy", // Implement lazy loading for images
    }));
  };

  const renderVideo = (video, index) => (
    <div key={`video-${video.id}-${index}`} className="p-4 border rounded-lg mb-4 bg-white shadow-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
      <iframe
        title={`Video ${video.videoDetails}`}
        width="100%"
        height="350"
        src={`https://www.youtube.com/embed/${video.videoUrl}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg"
      ></iframe>
      <p className="mt-2 text-center text-gray-800 font-semibold">{video.videoDetails}</p>
    </div>
  );

  const renderArticle = (article, index) => (
    <div key={`article-${article.id}-${index}`} className="p-6 border rounded-lg mb-4 bg-white shadow-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
      <a href={article.articleUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600 transition-colors">
        <h3 className="text-lg font-semibold">{article.articleHeading}</h3>
        <p className='italic text-sm'>~ Prof. Dinesh Singh</p>
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <main className="container mx-auto py-12 px-6 rounded-md shadow-lg">
        <h1 className="text-5xl font-bold mb-12 text-center text-indigo-900">Explore Our Content</h1>
        
        {categories.map((category, index) => {
          const images = content.galleryImages.filter(image => image.category === category).flatMap(renderImage);
          const videos = content.videos.filter(video => video.category === category);

          return (
            <div key={`category-${category}-${index}`}>
              {images.length > 0 && (
                <section className="my-12">
                  <h2 className="text-4xl font-bold text-indigo-900 mb-8 border-b-4 pb-4 border-indigo-900">{category} - Images</h2>
                  <ImageGallery items={images} />
                </section>
              )}
              {videos.length > 0 && (
                <section className="my-12">
                  <h2 className="text-4xl font-bold text-indigo-900 mb-8 border-b-4 pb-4 border-indigo-900">{category} - Videos</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {videos.map(renderVideo)}
                  </div>
                </section>
              )}
            </div>
          );
        })}

        {/* Articles Section */}
        <section className="my-12">
          <h2 className="text-4xl font-bold text-indigo-900 mb-8 border-b-4 pb-4 border-indigo-900">Informative Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {content.articles.map(renderArticle)}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DisplayContent;
