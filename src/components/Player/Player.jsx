import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, differenceInHours } from 'date-fns';
import './Player.css';
import placeholder from '../../assets/placeholder.png';
import comments from '../../assets/svgviewer-png-output (2).png';
import random from '../../assets/d4667c5475734c188fd2738e446bde0b~c5_1080x1080.jpeg';

const Player = () => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState("");
    const [author, setAuthor] = useState("");
    const [date, setDate] = useState("");
    const [title, setTitle] = useState("");
    const [songname, setSongname] = useState("");
    const [songlink, setSonglink] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [lastScrollTime, setLastScrollTime] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    let song = '';

    const toggleVisibility = () => {
    setIsVisible(!isVisible);
    };
    
    const { id } = useParams();
    
    const imageRef = useRef(null);
    let lastTouchY = 0;

    const formattedDate = date ? (() => {
        const publishedDate = new Date(date);
        const hoursDifference = differenceInHours(new Date(), publishedDate);
        
        if (hoursDifference === 0) {
            return 'now';
        } else if (hoursDifference < 24) {
            return `${hoursDifference}h ago`;
        } else {
            return format(publishedDate, 'MM-dd');
        }
    })() : "-";

    const fetchImageById = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`https://pixo-backend-version-1-2.onrender.com/get-image-by-id/${id}`);
            if (!response.ok) throw new Error("error fetching ID");

            const data = await response.json();
            setImageUrl(data.url);
            setAuthor(data.author);
            setDate(data.date);
            setTitle(data.title);
            setSongname(data.songname);
            setSonglink(data.songlink);
            setTags(tagsHandler(data.tags));
            setTextToCopy(`https://pixo-v1.netlify.app/${data._id}`);
            console.log("ID:", data._id);
        } catch (error) {
            console.error("another error :", error); // type shit
        } finally {
            setLoading(false);
        }
    };

    const [textToCopy, setTextToCopy] = useState(""); 

    const fetchRandomImage = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://pixo-backend-version-1-2.onrender.com/get-random-image");
            if (!response.ok) throw new Error("Error fetching image");

            const data = await response.json();
            setImageUrl(data.url);
            setAuthor(data.author);
            setDate(data.date);
            setTitle(data.title);
            setSongname(data.songname);
            setSonglink(data.songlink);
            setTags(tagsHandler(data.tags));
            setTextToCopy(`https://pixo-v1.netlify.app/${data._id}`);

            console.log("Fetched image _id:", data._id);
            return data._id
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleCopy = () => {
        console.log(textToCopy);
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return textToCopy;
    };

    useEffect(() => {
        if (id) {
            fetchImageById(id);
        } else {
            fetchRandomImage();
        }
        console.log(`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`)
    }, [id]);

    const tagsHandler = (tags) => {
        return tags.map(tag => `#${tag}`).join(' ');  
    };

    const handleScroll = () => {
        const currentTime = Date.now();
        if (currentTime - lastScrollTime >= 1000) {
            const imagePosition = imageRef.current.getBoundingClientRect();
            if (!loading && !isAnimating) {
                setIsScrolling(true);
                setIsAnimating(true);

                setTimeout(() => {
                    fetchRandomImage();
                    setIsAnimating(false);
                }, 10);

                setLastScrollTime(currentTime);
                setTimeout(() => setIsScrolling(false), 600);
            }
        }
    };

    const takeToUser = () => {
        console.log(author)
        navigate(`/profile/${author}`)
    };

    const handleWheel = (event) => {
        if (event.deltaY > 0) {
            handleScroll();
        }
        event.preventDefault();
    };
    
    const handleTouchMove = (event) => {
        const touchY = event.touches[0].clientY;
        if (touchY > lastTouchY + 150) {
            handleScroll();
        }
        lastTouchY = touchY;
        event.preventDefault();
    };
    
    useEffect(() => {
        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
    
        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [loading, lastScrollTime]);

    const getYouTubeVideoId = (url) => {
        if (url) {
            const videoId = url.split('v=')[1];
            return videoId ? videoId.split('&')[0] : '';
        }
        return '';
    };

    const youtubeVideoId = getYouTubeVideoId(songlink);

    return (
        <div className="player">
            <div className="player-with-all-the-fucking-other-stuff">
                <div ref={imageRef}>
                    {imageUrl ? (
                        <img src={imageUrl} className={`img-url ${isScrolling ? "scroll-to" : ""}`} />
                    ) : (
                        <img src="https://webgradients.com/public/webgradients_png/052%20Kind%20Steel.png" alt="" />
                    )}
                    <div className={`gradient-overlay ${isScrolling ? "scroll-to" : ""}`}></div>
                    <p className={` desc ${isScrolling ? "scroll-to-1000" : ""}`}>
                        {author || "-"} · {formattedDate} <br />
                        {title} <strong>{tags}</strong> <br />
                        ♫ {songname}<br />
                    </p>
                </div>
                <img className='default' src="https://png.pngtree.com/thumb_back/fh260/background/20201226/pngtree-simple-beige-gradient-background-image_515340.jpg" />
            </div>
            <div className="player-controls">
                <div className='profile-icon'>
                    <img onClick={takeToUser} /* src={random} */ src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/640px-A_black_image.jpg" />
                    <span>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                            <g id="SVGRepo_iconCarrier">
                                <path d="M6 12h6V6h1v6h6v1h-6v6h-1v-6H6z"></path>
                                <path fill="none" d="M0 0h24v24H0z"></path>
                            </g>
                        </svg>
                    </span>
                </div>
                <li>
                    <svg className='like' width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#HeartFill_clip0)">
                            <g filter="url(#HeartFill_filter0_d)">
                                <path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.25C10.5 2.25 12 4.25 12 4.25C12 4.25 13.5 2.25 16.5 2.25C20 2.25 22.5 4.99999 22.5 8.5C22.5 12.5 19.2311 16.0657 16.25 18.75C14.4095 20.4072 13 21.5 12 21.5C11 21.5 9.55051 20.3989 7.75 18.75C4.81949 16.0662 1.5 12.5 1.5 8.5C1.5 4.99999 4 2.25 7.5 2.25Z"></path>
                            </g>
                        </g>
                    </svg>
                    <p>0</p>
                </li>
                <li>
                    <svg fill="#000000" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_iconCarrier">
                            <path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path>
                        </g>
                    </svg>
                    <p>0</p>
                </li>
                <li>
                    <svg className='save' viewBox="0 0 24 24" fill="#" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.75 3.25H8.24999C7.52064 3.25 6.82117 3.53973 6.30545 4.05546C5.78972 4.57118 5.49999 5.27065 5.49999 6V20C5.49898 20.1377 5.53587 20.2729 5.60662 20.391C5.67738 20.5091 5.77926 20.6054 5.90112 20.6695C6.02298 20.7335 6.16012 20.7627 6.2975 20.754C6.43488 20.7453 6.56721 20.6989 6.67999 20.62L12 16.91L17.32 20.62C17.4467 20.7063 17.5967 20.7516 17.75 20.75C17.871 20.7486 17.9903 20.7213 18.1 20.67C18.2203 20.6041 18.3208 20.5072 18.3911 20.3894C18.4615 20.2716 18.499 20.1372 18.5 20V6C18.5 5.27065 18.2103 4.57118 17.6945 4.05546C17.1788 3.53973 16.4793 3.25 15.75 3.25Z" fill="#000000"></path> </g></svg>
                    <p>0</p>
                </li>
                <li className='share'>
                    <svg onClick={toggleVisibility} fill="#00ff00" height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
                        <g>
                            <path className="st0" d="M512,230.431L283.498,44.621v94.807C60.776,141.244-21.842,307.324,4.826,467.379 c48.696-99.493,149.915-138.677,278.672-143.14v92.003L512,230.431z"></path>
                        </g>
                    </svg>
                    <p>Share</p>
                </li>
            </div>
            <div className={`message-box ${isVisible ? 'show' : ''}`}>
                <p>Share</p>
                <button className="close-button" onClick={e => { e.stopPropagation(); setIsVisible(false); }}><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#0F0F0F"></path> </g></svg></button>
                <div className="message">
                    <h2>{textToCopy}</h2>
                    <button className="copy-button" onClick={handleCopy}><svg fill="#000000" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>copy-line</title> <path d="M29.5,7h-19A1.5,1.5,0,0,0,9,8.5v24A1.5,1.5,0,0,0,10.5,34h19A1.5,1.5,0,0,0,31,32.5V8.5A1.5,1.5,0,0,0,29.5,7ZM29,32H11V9H29Z" className="clr-i-outline clr-i-outline-path-1"></path><path d="M26,3.5A1.5,1.5,0,0,0,24.5,2H5.5A1.5,1.5,0,0,0,4,3.5v24A1.5,1.5,0,0,0,5.5,29H6V4H26Z" className="clr-i-outline clr-i-outline-path-2"></path> <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect> </g></svg></button>
                </div>
            </div>
            <iframe 
                id="videoPlayer" 
                width="0"
                height="0"
                frameBorder="0" 
                allow="autoplay; encrypted-media" 
                allowFullScreen 
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
            ></iframe>
        </div>
    );
}

export default Player;
