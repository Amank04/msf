import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsPlusCircle } from 'react-icons/bs';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref, push, update } from 'firebase/database';
import { imgdb, txtdb } from '../../databaseConfig/firebaseConfig';
import Loading from '../../LoadSaveAnimation/Loading';
import Saving from '../../LoadSaveAnimation/Saving';
import SuccessNotification from '../../LoadSaveAnimation/SuccessNotification';
import ErrorNotification from '../../LoadSaveAnimation/ErrorNotification';

const ContentForm = () => {
  const { register, handleSubmit, watch, setValue, setError, clearErrors, formState: { errors } } = useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [openedSections, setOpenedSections] = useState({
    imageSection: true,
    videoSection: false,
    articleSection: false
  });

  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.item;
  const editType = location.state?.type;

  const imageFile = watch('imageFile');
  const [imagePreview, setImagePreview] = useState({});


  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const fileArray = Array.from(imageFile); // Convert FileList to an array
      const fileReaders = [];
  
      fileArray.forEach((file, index) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          setImagePreview((prevPreviews) => ({
            ...prevPreviews,
            [index]: e.target.result,
          }));
        };
        fileReader.readAsDataURL(file);
        fileReaders.push(fileReader);
      });
  
      // Clean up file readers on unmount
      return () => {
        fileReaders.forEach((fileReader) => fileReader.abort());
      };
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);
  
  

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (editData) {
      if (editType === 'imageContent') {
        setValue('category', editData.category);
        setValue('imageDetails', editData.imageDetails);
        setImagePreview(editData.imageUrl);
        setOpenedSections({ imageSection: true, videoSection: false, articleSection: false });
      } else if (editType === 'videoContent') {
        setValue('category', editData.category);
        setValue('videoUrl', `https://www.youtube.com/watch?v=${editData.videoUrl}`);
        setValue('videoDetails', editData.videoDetails);
        setOpenedSections({ imageSection: false, videoSection: true, articleSection: false });
      } else if (editType === 'articleContent') {
        setValue('category', editData.category);
        setValue('articleUrl', editData.articleUrl);
        setValue('articleHeading', editData.articleHeading);
        if (editData.articleImageUrl) {
          setImagePreview(editData.articleImageUrl);
        }
        setOpenedSections({ imageSection: false, videoSection: false, articleSection: true });
      }
    }
  }, [editData, editType, setValue]);

  const toggleSection = (section) => {
    setOpenedSections(prev => ({
      ...{ imageSection: false, videoSection: false, articleSection: false },
      [section]: !prev[section]
    }));
  };

  const uploadImages = async (imageFiles) => {
    // console.log(typeof imageFiles)
    const arrayFiles = Array.from(imageFiles);
    const uploadPromises = arrayFiles.map((imageFile) => {
      const storageReference = storageRef(imgdb, `contentImages/${imageFile.name}`);
      return uploadBytes(storageReference, imageFile)
        .then(() => getDownloadURL(storageReference));
    });
  
    return Promise.all(uploadPromises);
  };
  

  const validateYouTubeUrl = (url) => {
    const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/i;
    const match = url.match(pattern);
    return match ? match[1] : null;
  };

  const onSubmit = async (data) => {
    // event.preventDefault(); // Prevents the default form submission
    console.log("Form data: ", data); // Log form data
    setIsSaving(true);
    try {
      if (openedSections.videoSection) {
        const embedId = validateYouTubeUrl(data.videoUrl);
        if (!embedId) {
          setError('videoUrl', {
            type: 'manual',
            message: 'Please enter a valid YouTube video link.'
          });
          setIsSaving(false);
          return;
        }
        data.videoUrl = embedId;
      }
  
      const uploadedData = {
        category: data.category || ''
      };
  
      if (openedSections.imageSection && data.imageFile) {
        const imageUrls = await uploadImages(data.imageFile);
        uploadedData.imageUrls = imageUrls;
        uploadedData.imageDetails = data.imageDetails || '';
      }
  
      if (openedSections.videoSection && data.videoUrl) {
        uploadedData.videoUrl = data.videoUrl;
        uploadedData.videoDetails = data.videoDetails || '';
      }
  
      if (openedSections.articleSection && data.articleUrl) {
        uploadedData.articleUrl = data.articleUrl;
        uploadedData.articleHeading = data.articleHeading || '';
        if (data.articleImage.length > 0) {
          uploadedData.articleImageUrl = await uploadImages(data.articleImage[0]);
        }
      }
  
      if (editData) {
        const dbRef = ref(txtdb, `${editType}/${editData.id}`);
        await update(dbRef, uploadedData);
      } else {
        if (openedSections.imageSection && data.imageFile) {
          await push(ref(txtdb, 'imageContent'), uploadedData);
        }
  
        if (openedSections.videoSection && data.videoUrl) {
          await push(ref(txtdb, 'videoContent'), uploadedData);
        }
  
        if (openedSections.articleSection && data.articleUrl) {
          await push(ref(txtdb, 'articleContent'), uploadedData);
        }
      }
  
      setShowSuccess(true);
      setTimeout(() => navigate('/admin/forms/gallery'), 2000); // Navigate back after success
    } catch (error) {
      console.error('Error submitting content: ', error);
      setShowError(true);
    } finally {
      setIsSaving(false);
    }
  };
  

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {isSaving && <Saving />}
      <div className="flex">
        <div className="flex flex-col space-y-2 p-6 bg-gray-200">
          {Object.entries(openedSections).map(([sectionKey, isOpen]) => (
            <button
              key={sectionKey}
              onClick={() => toggleSection(sectionKey)}
              className={`py-2 px-4 rounded transition duration-300 flex items-center gap-2 ${isOpen ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'} text-white`}
            >
              <BsPlusCircle />
              {sectionKey.replace(/([A-Z])/g, ' $1').replace('Section', ' Section')}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white shadow-lg rounded-lg flex-grow space-y-4">
          <h2 className="text-2xl font-bold text-indigo-600">{editData ? 'Edit Content' : 'Upload Content'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input type="text" {...register('category')} className="mt-1 block w-full pl-3 py-2 text-base text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          {Object.entries(openedSections).map(([sectionKey, isOpen]) => isOpen && (
            <div key={sectionKey}>
              {sectionKey === 'imageSection' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image File {editData ? '' : <span className="text-red-500">*</span>}
                  </label>
                  <input 
  type="file" 
  {...register('imageFile', { required: !editData ? 'Image file is required' : false })} 
  multiple 
  className="mt-1 block w-full pl-3 py-2 text-base text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
/>


                  {errors.imageFile && <p className="text-red-500 text-xs italic">{errors.imageFile.message}</p>}
                  {imagePreview && Object.values(imagePreview).map((src, index) => (
  <img key={index} src={src} alt={`Preview ${index}`} className="mt-4 h-48 w-auto border rounded-md" />
))}
                  <label className="block text-sm font-medium text-gray-700 mt-2">Image Details</label>
                  <textarea {...register('imageDetails')} className="mt-1 block w-full pl-3 py-2 text-base text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              )}

              {sectionKey === 'videoSection' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Video URL <span className="text-red-500">*</span>
                  </label>
                  <input type="url" {...register('videoUrl', { required: 'Please enter a valid YouTube video link.' })} className="mt-1 block w-full pl-3 py-2 text-base text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.videoUrl && <p className="text-red-500 text-xs italic">{errors.videoUrl.message}</p>}
                  <label className="block text-sm font-medium text-gray-700 mt-2">Video Details</label>
                  <textarea {...register('videoDetails')} className="mt-1 block w-full pl-3 py-2 text-base text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              )}

              {sectionKey === 'articleSection' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Article URL <span className="text-red-500">*</span>
                  </label>
                  <input type="url" {...register('articleUrl', { required: 'Article URL is required' })} className="mt-1 block w-full pl-3 py-2 text-base text-gray-900 border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.articleUrl && <p className="text-red-500 text-xs italic">{errors.articleUrl.message}</p>}
                  <label className="block text-sm font-medium text-gray-700 mt-2">Article Heading</label>
                  <input type="text" {...register('articleHeading')} className="mt-1 block w-full pl-3 py-2 text-base text-gray-900 border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  <label className="block text-sm font-medium text-gray-700 mt-2">Article Image</label>
                  <input type="file" {...register('articleImage')} className="mt-1 block w-full pl-3 py-2 text-base text-gray-900 border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              )}
            </div>
          ))}

          {showSuccess && (
            <SuccessNotification message="Content submitted successfully!" onClose={() => setShowSuccess(false)} />
          )}
          {showError && (
            <ErrorNotification message="Failed to submit content!" onClose={() => setShowError(false)} />
          )}
          
          <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            {editData ? 'Update Content' : 'Submit Content'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ContentForm;
