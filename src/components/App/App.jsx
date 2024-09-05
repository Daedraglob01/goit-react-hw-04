import React, { useState, useEffect } from "react";
import fetchImages from "../../services/unsplash-api";
import SearchBar from "../SearchBar/SearchBar";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import ImageGallery from "../ImageGallery/ImageGallery";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";
import ImageModal from "../ImageModal/ImageModal";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalImagesCount, setTotalImagesCount] = useState(0);

  // Fetch images when search term or page changes
  useEffect(() => {
    if (searchTerm.trim() === "") return;

    const fetchImagesData = async () => {
      setIsLoading(true);
      try {
        const { results, total } = await fetchImages(searchTerm, currentPage);
        handleImageResults(results, total);
      } catch (error) {
        setFetchError("Unable to fetch images. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImagesData();
  }, [searchTerm, currentPage]);

  const handleImageResults = (results, total) => {
    if (currentPage === 1) {
      setImages(results);
      setTotalImagesCount(total);
    } else {
      setImages(prevImages => [...prevImages, ...results]);
    }

    if (total === 0) {
      toast.error("No images found for the given query.");
    }
  };

  useEffect(() => {
    if (images.length === totalImagesCount && totalImagesCount > 0) {
      toast.error("All available images have been loaded.");
    }
  }, [images, totalImagesCount]);

  const handleSearchSubmit = (query) => {
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="container">
      <SearchBar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} openModal={handleImageSelect} />
      {isLoading && <Loader />}
      {images.length > 0 && images.length < totalImagesCount && (
        <LoadMoreBtn onLoadMore={handleLoadMore} />
      )}
      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          closeModal={handleCloseModal}
          image={selectedImage}
        />
      )}
      <Toaster position="top-right" reverseOrder={false} />
      {fetchError && <ErrorMessage message={fetchError} />}
    </div>
  );
};

export default App;
