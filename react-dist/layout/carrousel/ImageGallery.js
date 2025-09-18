import React, { useState, useEffect } from 'react';
import { Galleria } from 'primereact/galleria';
const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    console.log("useEffect");
    setImages(["/MedicalSoft_Login_Default.jpg"]);
    const fetchImages = async () => {
      try {
        const response = await fetch('https://hooks.medicalsoft.ai/webhook/imagenes');
        const data = await response.json();
        const activeImages = data.filter(img => img.Activo);
        const mappedActiveImages = activeImages.map((img, index) => {
          const fileId = img.url_imagen.match(/\/d\/([^\/]+)/)?.[1] || '';
          const imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
          return imageUrl;
        });
        setImages(prevImages => [...prevImages, ...mappedActiveImages]);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, []);
  useEffect(() => {
    // Configuramos el cambio automático de imágenes cada 5 segundos
    if (images.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images]);
  const itemTemplate = imageURL => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center align-items-center",
      style: {
        height: '70vh'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: imageURL,
      alt: `Imagen ${imageURL}`,
      style: {
        width: '100%',
        objectFit: 'cover',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }
    }));
  };
  const thumbnailTemplate = imageURL => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-1"
    }, /*#__PURE__*/React.createElement("img", {
      src: imageURL,
      alt: `Miniatura ${imageURL}`,
      style: {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '4px'
      }
    }));
  };
  if (images.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center align-items-center",
      style: {
        height: '400px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "alert alert-info"
    }, "No hay im\xE1genes disponibles"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "container my-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-10 col-lg-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body p-0"
  }, /*#__PURE__*/React.createElement(Galleria, {
    value: images,
    activeIndex: activeIndex,
    onItemChange: e => setActiveIndex(e.index),
    showThumbnails: false,
    showIndicators: true,
    showItemNavigators: false,
    item: itemTemplate,
    thumbnail: thumbnailTemplate,
    circular: true,
    autoPlay: true,
    transitionInterval: 5000,
    style: {
      maxWidth: '100%'
    }
  }))))));
};
export default ImageGallery;