import React, { useState, useEffect } from 'react';
import { Galleria } from 'primereact/galleria';

const ImageGallery = () => {
    const [images, setImages] = useState<string[]>([]);
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
                setImages((prevImages) => [...prevImages, ...mappedActiveImages]);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [images]);

    const itemTemplate = (imageURL: string) => {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <img
                    src={imageURL}
                    alt={`Imagen ${imageURL}`}
                    style={{
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                />
            </div>
        );
    };

    const thumbnailTemplate = (imageURL: string) => {
        return (
            <div className="p-1">
                <img
                    src={imageURL}
                    alt={`Miniatura ${imageURL}`}
                    style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                    }}
                />
            </div>
        );
    };

    if (images.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="alert alert-info">No hay imágenes disponibles</div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <Galleria
                                value={images}
                                activeIndex={activeIndex}
                                onItemChange={(e) => setActiveIndex(e.index)}
                                showThumbnails={false}
                                showIndicators={true}
                                showItemNavigators={false}
                                item={itemTemplate}
                                thumbnail={thumbnailTemplate}
                                circular={true}
                                autoPlay={true}
                                transitionInterval={5000}
                                style={{ maxWidth: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageGallery;