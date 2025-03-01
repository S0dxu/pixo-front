import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Explore.css';

const Explore = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const videoRefs = useRef([]);

    const fetchImages = async () => {
        try {
            let endpoint = `https://pixo-backend-version-1-2.onrender.com/get-all-images?limit=20&page=${page}`;
            if (searchQuery.trim() !== "") {
                endpoint += `&search=${encodeURIComponent(searchQuery)}`;
            }
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error("error getting images");
            const data = await response.json();

            if (data.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (page === 1) {
                setImages(data);
            } else {
                setImages(prevImages => [...prevImages, ...data]);
            }
        } catch (error) {
            console.error("Errore:", error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, [page, searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
        setImages([]);
    };

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10 && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }, [hasMore]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const goToPlayer = (id) => {
        navigate(`/${id}`);
    };

    const autoplay = (index) => {
        if (videoRefs.current[index]) {
            videoRefs.current[index].play();
        }
    };

    const stop = (index) => {
        if (videoRefs.current[index]) {
            videoRefs.current[index].pause();
        }
    };

    return (
        <div className="explore">
            <div className="search-container">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 17L21 21" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#fff" strokeWidth="2" />
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {images.map((img, index) => (
                <div key={`${img._id}-${index}`} className="image-containera" onClick={() => goToPlayer(img._id)}>
                    {img.url.toLowerCase().endsWith(".mp4") ? (
                        <div>
                            <video
                                ref={(el) => (videoRefs.current[index] = el)}
                                muted
                                loop
                                onMouseEnter={() => autoplay(index)}
                                onMouseLeave={() => stop(index)}
                            >
                                <source src={img.url} type="video/mp4" />
                            </video>
                            <svg className='VideoPlayer' aria-label="Reel" class="x1lliihq x1n2onr6 x1hfr7tm xq3z1fi" fill="#fff" height="24" role="img" viewBox="0 0 24 24" width="24">
                                <title>Reel</title>
                                <path d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z" fillRule="evenodd"></path>
                            </svg>
                        </div>
                    ) : (
                        <img src={img.url} alt="Immagine" />
                    )}
                </div>
            ))}

            {hasMore && <p className="loading-text"></p>}
        </div>
    );
};

export default Explore;
