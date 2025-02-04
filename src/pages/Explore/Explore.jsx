import React, { useEffect, useState } from 'react';
import { format, differenceInHours } from 'date-fns';
import './Explore.css';
import placeholder from '../../assets/placeholder.png';

const Explore = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastLoadedDate, setLastLoadedDate] = useState(null);
    const [history, setHistory] = useState([]);  // Stack delle immagini viste
    const [currentIndex, setCurrentIndex] = useState(-1);  // Indice attuale nell'array history


    const fetchImages = async () => {
        setLoading(true);
        try {
            let url = "https://pixo-backend-version-1-0-peho.onrender.com/get-images";
            if (lastLoadedDate) {
                url += `?before=${lastLoadedDate}`;
            }
    
            const response = await fetch(url);
            if (!response.ok) throw new Error("error fetching images");
    
            const data = await response.json();
    
            if (data.length > 0) {
                setImages((prevImages) => {
                    const uniqueImages = [...prevImages, ...data].filter((item, index, self) =>
                        index === self.findIndex((t) => t._id === item._id)
                    );
                    return uniqueImages;
                });
    
                setLastLoadedDate(data[data.length - 1].date);
            }
        } catch (error) {
            console.error("error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const bottomPosition = document.documentElement.scrollHeight;

            if (!loading && scrollPosition >= bottomPosition - 1000) {
                fetchImages();
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loading]);

    const formattedDate = (date) => {
        const publishedDate = new Date(date);
        const hoursDifference = differenceInHours(new Date(), publishedDate);
        
        if (hoursDifference === 0) return 'now';
        else if (hoursDifference < 24) return `${hoursDifference}h ago`;
        else return format(publishedDate, 'MM-dd');
    };

    return (
        <div className="explore">
            {/* <div className="player-with-all-the-fucking-other-stuff">
                <div className="images-grid">
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <div key={index} className="image-container">
                                <img src={image.url} alt={image.title} />
                                <div className="gradient-overlay"></div>
                                <p>
                                    {image.author || "-"} · {formattedDate(image.date)} <br />
                                    {image.title} <strong>{image.tags?.map(tag => `#${tag}`).join(' ')}</strong> <br />
                                    ♫ {image.songname} - {image.songartist} <br />
                                </p>
                            </div>
                        ))
                    ) : (
                        <></>
                    )}
                </div>
            </div> */}
        </div>
    );
};

export default Explore;