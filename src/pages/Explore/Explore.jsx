import React, { useEffect, useState } from 'react';
import { format, differenceInHours } from 'date-fns';
import './Explore.css';
import placeholder from '../../assets/placeholder.png';

const Explore = () => {
    const [images, setImages] = useState([]); // Array to hold multiple images
    const [loading, setLoading] = useState(false);
    const [lastLoadedDate, setLastLoadedDate] = useState(null); // Track the last loaded image's date

    const fetchImages = async () => {
        setLoading(true);
        try {
            let url = "http://localhost:5000/get-images";
            if (lastLoadedDate) {
                url += `?before=${lastLoadedDate}`; // Fetch images before the last loaded date
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error("Error fetching images");

            const data = await response.json();

            // If we have new images, append them
            if (data.length > 0) {
                setImages((prevImages) => [...prevImages, ...data]);
                // Set the date of the last image loaded for the next request
                setLastLoadedDate(data[data.length - 1].date);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages(); // Load the initial set of images
    }, []); // Trigger on initial render

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const bottomPosition = document.documentElement.scrollHeight;

            if (!loading && scrollPosition >= bottomPosition - 100) { // Trigger when near the bottom
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
            <div className="player-with-all-the-fucking-other-stuff">
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
            </div>
        </div>
    );
};

export default Explore;