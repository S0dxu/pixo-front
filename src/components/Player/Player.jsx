import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, differenceInHours } from 'date-fns';
import './Player.css';
import { jwtDecode } from "jwt-decode";
import heart_smash from '../../assets/GIFPaint-2--unscreen.gif'
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
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const audioRef = useRef(null);
    const [views, setViews] = useState(0);
    const [currentImageId, setCurrentImageId] = useState("");
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [audio, setAudio] = useState(1);
    const pressTimer = useRef(null);
    const [isLongPress, setIsLongPress] = useState(false);
    const [IsOpacity, setOpacity] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const historyStack = useRef([]);
    const futureStack = useRef([]);

    useEffect(() => {
        const handleTouchMove = (e) => {
          if (window.scrollY === 0 && e.touches[0].clientY > 0) {
            e.preventDefault();
          }
        };
      
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
      
        return () => {
          window.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);
    
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
        setIsVisible2(false);
    };
    
    const toggleVisibility2 = () => {
        setIsVisible2(!isVisible2);
        setIsVisible(false);
    };

    const handleToggleMute = () => {
        /* if (audioRef.current) {
            if (audioRef.current.volume > 0) {
                sessionStorage.setItem('savedVolume', audio.toString());
                setAudio(0);
                audioRef.current.volume = 0;
            } else {
                const savedVolume = sessionStorage.getItem('savedVolume');
                const newVolume = savedVolume ? parseFloat(savedVolume) : 1;
                setAudio(newVolume);
                audioRef.current.volume = newVolume;
            }
        } */
    };

    /* const handleTouchLongPressStart = () => {
        pressTimer.current = setTimeout(() => {
          handleLongPressStart();
          setIsLongPress(true);
        }, 500);
      };
      
      const handleTouchLongPressEnd = () => {
        if (pressTimer.current) {
          clearTimeout(pressTimer.current);
          pressTimer.current = null;
        }
        if (isLongPress) {
          handleLongPressEnd();
          setIsLongPress(false);
        }
    };    */   

    const handleLongPressStart = () => {
        setOpacity(true);
        audioRef.current.pause()
        setIsLongPress(true);
    };

    const handleLongPressEnd = () => {
        setOpacity(false)
        audioRef.current.play()
        setIsLongPress(false);
    };

    const lastClickTime = useRef(0);

    const handleDoubleClick = async () => {
        const now = Date.now();
        if (now - lastClickTime.current < 300) {
            setIsPlaying(true);
            setTimeout(() => {
                setIsPlaying(false);
            }, 760);
            if (!isLiked) {
                const userId = getUserIdFromToken();
                const imageId = currentImageId;
                if (!imageId || !userId) return;
                try {
                    const response = await fetch("https://pixo-backend-version-1-2.onrender.com/like-image", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ imageId, userId }),
                    });
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error("Error response:", errorText);
                        alert("Something went wrong. Please try again.");
                        return;
                    }
                    const data = await response.json();
                    setLikes(data.likes);
                    setIsLiked(true);
                } catch (error) {
                    console.error("Error handling like:", error);
                    alert("An error occurred. Please try again later.");
                }
            } else {
                console.log("Already liked");
            }
        }
        lastClickTime.current = now;
    };

    const handleMouseDown = () => {
        setIsLongPress(false);
        pressTimer.current = setTimeout(() => {
            handleLongPressStart();
            setIsLongPress(true);
        }, 500);
    };

    const handleMouseUp = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }

        if (!isLongPress) {
            handleToggleMute();
        }

        handleLongPressEnd();
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

    const fetchImageById = async (imgId) => {
        setLoading(true);
        try {
          const response = await fetch(`https://pixo-backend-version-1-2.onrender.com/get-image-by-id/${imgId}`);
          if (!response.ok) throw new Error("error fetching ID");
          const data = await response.json();
          setImageUrl(data.url);
          setAuthor(data.author);
          setDate(data.date);
          setTitle(data.title);
          setSongname(data.songname);
          setSonglink(data.songlink);
          setTags(tagsHandler(data.tags));
          setViews(data.views);
          setTextToCopy(`https://pixo-v1.netlify.app/${data._id}`);
          setCurrentImageId(data._id);
          const userId = getUserIdFromToken();
          const likesArr = data.likes;
          setIsLiked(likesArr.some(like => like.toString() === userId));
          setLikes(likesArr.length);
        } catch (error) {
          console.error("another error :", error);
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
          if (currentImageId) {
            historyStack.current.push(currentImageId);
            futureStack.current = [];
          }
          setImageUrl(data.url);
          setAuthor(data.author);
          setDate(data.date);
          setTitle(data.title);
          setSongname(data.songname);
          setSonglink(data.songlink);
          setTags(tagsHandler(data.tags));
          setViews(data.views);
          setCurrentImageId(data._id);
          setTextToCopy(`https://pixo-v1.netlify.app/${data._id}`);
          const userId = getUserIdFromToken();
          const likesArr = data.likes;
          setIsLiked(likesArr.some(like => like.toString() === userId));
          setLikes(likesArr.length);
          return data._id;
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
    }, [id]);

    const tagsHandler = (tags) => {
        return tags.map(tag => `#${tag}`).join(' ');  
    };

    const handleScroll = () => {
        const currentTime = Date.now();
        if (currentTime - lastScrollTime >= 1000 && !loading && !isAnimating) {
            setTimeout(() => setImageUrl("https://webdi.fr/img/couleurs/000000.png"), 500);

            setIsScrolling(true);
            setIsAnimating(true);
            setTimeout(() => {
                if (futureStack.current.length > 0) {
                historyStack.current.push(currentImageId);
                const nextId = futureStack.current.pop();
                fetchImageById(nextId);
                } else {
                fetchRandomImage();
                }
                setIsAnimating(false);
            }, 10);
            setLastScrollTime(currentTime);
            setTimeout(() => setIsScrolling(false), 600);
        }
    };
    

    const handleScrollUp = () => {
        const currentTime = Date.now();
        if (currentTime - lastScrollTime >= 1000 && !loading && !isAnimating && historyStack.current.length > 0) {
            setTimeout(() => setImageUrl("https://webdi.fr/img/couleurs/000000.png"), 500);
            
            setIsScrollingUp(true);
            setIsAnimating(true);
            setTimeout(() => {
                if (currentImageId) {
                futureStack.current.push(currentImageId);
                }
                const prevId = historyStack.current.pop();
                fetchImageById(prevId);
                setIsAnimating(false);
            }, 10);
            setLastScrollTime(currentTime);
            setTimeout(() => setIsScrollingUp(false), 600);
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
        else if (event.deltaY < 0) {
            handleScrollUp();
          }
        event.preventDefault();
    };
    
    let initialTouchY = null;

    const handleTouchStart = (event) => {
        initialTouchY = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
    const touchY = event.touches[0].clientY;

    if (touchY < 20 || touchY > window.innerHeight - 20) {
        return;
    }

    if (initialTouchY === null) {
        initialTouchY = touchY;
    }

    const deltaY = touchY - initialTouchY;

    if (Math.abs(deltaY) >= 70) {
        if (deltaY > 0 && !loading) {
        handleScrollUp();
        } else if (deltaY < 0 && !loading) {
        handleScroll();
        }
        initialTouchY = touchY;
    }
    };

      
    useEffect(() => {
        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
    
        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [loading, lastScrollTime]);

    useEffect(() => {
        const savedVolume = sessionStorage.getItem('volume');
        
        if (savedVolume) {
            setAudio(parseFloat(savedVolume));
        }
    }, []);

    useEffect(() => {
        if (audio !== null) {
            sessionStorage.setItem('volume', audio.toString());
        }
    }, [audio]);

    useEffect(() => {
        if (audioRef.current && songlink) {
            audioRef.current.src = songlink;
            audioRef.current.play().catch((error) => {
                /* console.error("Playback error:", error); */
                return
            });
        }
    }, [songlink]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = audio;
        }
    }, [audio]);

    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                /* console.log(decodedToken); */
                return decodedToken?.id || "";
            } catch (error) {
                console.error("no id found:", error);
            }
        }
        return "";
    };

    const handleLike = async () => {
        const userId = getUserIdFromToken();
        const imageId = currentImageId;
    
        if (!imageId || !userId) {
            return;
        }
    
        try {
            const imageResponse = await fetch(`https://pixo-backend-version-1-2.onrender.com/image/${imageId}`);
            if (!imageResponse.ok) {
                const errorText = await imageResponse.text();
                console.error("Image fetch error:", errorText);
                alert("Unable to retrieve image data");
                return;
            }
    
            const imageData = await imageResponse.json();
            const isLiked = imageData.likes.includes(userId);
            const url = isLiked ? "https://pixo-backend-version-1-2.onrender.com/dislike-image" : "https://pixo-backend-version-1-2.onrender.com/like-image";
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ imageId, userId }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                alert("Something went wrong. Please try again.");
                return;
            }
    
            const data = await response.json();
    
            setLikes(data.likes);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Error handling like/dislike:", error);
            alert("An error occurred. Please try again later.");
        }
    };
    

    const volume = document.querySelector(".player-volume");
    const likes_count = likes.length;

    const handleMouseEnter = () => {
        volume.style.opacity = "1";
        volume.style.transition = "opacity .2s ease"
    };
    
    const handleMouseLeave = () => {
        volume.style.opacity = "0";
        volume.style.transition = "opacity .2s ease"
    };
      
    return (
        <div className="player">
            <div
                className={`player-with-all-the-fucking-other-stuff ${isScrolling ? "scroll-to" : ""} ${isScrollingUp ? "scroll-to-up" : ""}`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onClick={handleDoubleClick}
            >
                <div ref={imageRef}>
                    {imageUrl ? (
                        <img src={imageUrl} className={`img-url`} />
                    ) : (
                        <img src="https://webdi.fr/img/couleurs/000000.png" alt="" />
                    )}
                    <div 
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave} 
                    className={`gradient-overlay`}></div>
                    <p className={` desc  ${IsOpacity ? "opacity0" : ""}`}>
                        {author || "-"} · {formattedDate} <br />
                        {title} <strong>{tags}</strong> <br />
                        {songname && `♫ ${songname}`}<br />
                    </p>
                </div>
                <img className='default' src="https://png.pngtree.com/thumb_back/fh260/background/20201226/pngtree-simple-beige-gradient-background-image_515340.jpg" />
            </div>
            <div onMouseEnter={handleMouseEnter} className={`player-volume ${IsOpacity ? "opacity0" : ""}`}>
                {audio === 0 ? (
                    <svg width="24" data-e2e="" height="24" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M25 10.8685C25 8.47242 22.3296 7.04325 20.3359 8.37236L10.3944 15H6C4.34315 15 3 16.3431 3 18V30C3 31.6568 4.34314 33 6 33H10.3944L20.3359 39.6276C22.3296 40.9567 25 39.5276 25 37.1315V10.8685ZM29.2929 18.1213L35.1716 24L29.2929 29.8787C28.9024 30.2692 28.9024 30.9024 29.2929 31.2929L30.7071 32.7071C31.0976 33.0976 31.7308 33.0976 32.1213 32.7071L38 26.8284L43.8787 32.7071C44.2692 33.0976 44.9024 33.0976 45.2929 32.7071L46.7071 31.2929C47.0976 30.9024 47.0976 30.2692 46.7071 29.8787L40.8284 24L46.7071 18.1213C47.0976 17.7308 47.0976 17.0976 46.7071 16.7071L45.2929 15.2929C44.9024 14.9024 44.2692 14.9024 43.8787 15.2929L38 21.1716L32.1213 15.2929C31.7308 14.9024 31.0976 14.9024 30.7071 15.2929L29.2929 16.7071C28.9024 17.0976 28.9024 17.7308 29.2929 18.1213Z"></path></svg>
                ) : (
                    <svg width="24" data-e2e="" height="24" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M20.3359 8.37236C22.3296 7.04325 25 8.47242 25 10.8685V37.1315C25 39.5276 22.3296 40.9567 20.3359 39.6276L10.3944 33H6C4.34314 33 3 31.6568 3 30V18C3 16.3431 4.34315 15 6 15H10.3944L20.3359 8.37236ZM21 12.737L12.1094 18.6641C11.7809 18.8831 11.3948 19 11 19H7V29H11C11.3948 29 11.7809 29.1169 12.1094 29.3359L21 35.263V12.737ZM32.9998 24C32.9998 21.5583 32.0293 19.3445 30.4479 17.7211C30.0625 17.3255 29.9964 16.6989 30.3472 16.2724L31.6177 14.7277C31.9685 14.3011 32.6017 14.2371 33.0001 14.6195C35.4628 16.9832 36.9998 20.3128 36.9998 24C36.9998 27.6872 35.4628 31.0168 33.0001 33.3805C32.6017 33.7629 31.9685 33.6989 31.6177 33.2724L30.3472 31.7277C29.9964 31.3011 30.0625 30.6745 30.4479 30.2789C32.0293 28.6556 32.9998 26.4418 32.9998 24ZM37.0144 11.05C36.6563 11.4705 36.7094 12.0995 37.1069 12.4829C40.1263 15.3951 42.0002 19.4778 42.0002 23.9999C42.0002 28.522 40.1263 32.6047 37.1069 35.5169C36.7094 35.9003 36.6563 36.5293 37.0144 36.9498L38.3109 38.4727C38.6689 38.8932 39.302 38.9456 39.7041 38.5671C43.5774 34.9219 46.0002 29.7429 46.0002 23.9999C46.0002 18.2569 43.5774 13.078 39.7041 9.43271C39.302 9.05421 38.6689 9.10664 38.3109 9.52716L37.0144 11.05Z"></path></svg>
                )}
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.001" 
                    value={audio} 
                    onChange={(e) => setAudio(parseFloat(e.target.value))} 
                />
            </div>
            {/* {isPlaying && (
            <img 
                src={`${heart_smash}?t=${Date.now()}`}
                className="like-smash" 
            />
        )} */}
            <div className={`player-controls ${isScrolling ? "scroll-to-other" : ""} ${isScrollingUp ? "scroll-to-1000" : ""} ${IsOpacity ? "opacity0-2" : ""}`} >
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
                    {/* <svg className={`like ${isLiked ? "liked" : ""}`} onClick={handleLike} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#HeartFill_clip0)">
                            <g filter="url(#HeartFill_filter0_d)">
                                <path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.25C10.5 2.25 12 4.25 12 4.25C12 4.25 13.5 2.25 16.5 2.25C20 2.25 22.5 4.99999 22.5 8.5C22.5 12.5 19.2311 16.0657 16.25 18.75C14.4095 20.4072 13 21.5 12 21.5C11 21.5 9.55051 20.3989 7.75 18.75C4.81949 16.0662 1.5 12.5 1.5 8.5C1.5 4.99999 4 2.25 7.5 2.25Z"></path>
                            </g>
                        </g>
                    </svg> */}

                    <svg className={`like ${isLiked ? "liked" : ""}`} /* className='like' */ onClick={handleLike} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.9752 12.1852L20.2361 12.0574L20.9752 12.1852ZM20.2696 16.265L19.5306 16.1371L20.2696 16.265ZM6.93777 20.4771L6.19056 20.5417L6.93777 20.4771ZM6.12561 11.0844L6.87282 11.0198L6.12561 11.0844ZM13.995 5.22142L14.7351 5.34269V5.34269L13.995 5.22142ZM13.3323 9.26598L14.0724 9.38725V9.38725L13.3323 9.26598ZM6.69814 9.67749L6.20855 9.10933H6.20855L6.69814 9.67749ZM8.13688 8.43769L8.62647 9.00585H8.62647L8.13688 8.43769ZM10.5181 4.78374L9.79208 4.59542L10.5181 4.78374ZM10.9938 2.94989L11.7197 3.13821V3.13821L10.9938 2.94989ZM12.6676 2.06435L12.4382 2.77841L12.4382 2.77841L12.6676 2.06435ZM12.8126 2.11093L13.042 1.39687L13.042 1.39687L12.8126 2.11093ZM9.86195 6.46262L10.5235 6.81599V6.81599L9.86195 6.46262ZM13.9047 3.24752L13.1787 3.43584V3.43584L13.9047 3.24752ZM11.6742 2.13239L11.3486 1.45675V1.45675L11.6742 2.13239ZM3.9716 21.4707L3.22439 21.5353L3.9716 21.4707ZM3 10.2342L3.74721 10.1696C3.71261 9.76945 3.36893 9.46758 2.96767 9.4849C2.5664 9.50221 2.25 9.83256 2.25 10.2342H3ZM20.2361 12.0574L19.5306 16.1371L21.0087 16.3928L21.7142 12.313L20.2361 12.0574ZM13.245 21.25H8.59635V22.75H13.245V21.25ZM7.68498 20.4125L6.87282 11.0198L5.3784 11.149L6.19056 20.5417L7.68498 20.4125ZM19.5306 16.1371C19.0238 19.0677 16.3813 21.25 13.245 21.25V22.75C17.0712 22.75 20.3708 20.081 21.0087 16.3928L19.5306 16.1371ZM13.2548 5.10015L12.5921 9.14472L14.0724 9.38725L14.7351 5.34269L13.2548 5.10015ZM7.18773 10.2456L8.62647 9.00585L7.64729 7.86954L6.20855 9.10933L7.18773 10.2456ZM11.244 4.97206L11.7197 3.13821L10.2678 2.76157L9.79208 4.59542L11.244 4.97206ZM12.4382 2.77841L12.5832 2.82498L13.042 1.39687L12.897 1.3503L12.4382 2.77841ZM10.5235 6.81599C10.8354 6.23198 11.0777 5.61339 11.244 4.97206L9.79208 4.59542C9.65573 5.12107 9.45699 5.62893 9.20042 6.10924L10.5235 6.81599ZM12.5832 2.82498C12.8896 2.92342 13.1072 3.16009 13.1787 3.43584L14.6307 3.05921C14.4252 2.26719 13.819 1.64648 13.042 1.39687L12.5832 2.82498ZM11.7197 3.13821C11.7548 3.0032 11.8523 2.87913 11.9998 2.80804L11.3486 1.45675C10.8166 1.71309 10.417 2.18627 10.2678 2.76157L11.7197 3.13821ZM11.9998 2.80804C12.1345 2.74311 12.2931 2.73181 12.4382 2.77841L12.897 1.3503C12.3873 1.18655 11.8312 1.2242 11.3486 1.45675L11.9998 2.80804ZM14.1537 10.9842H19.3348V9.4842H14.1537V10.9842ZM4.71881 21.4061L3.74721 10.1696L2.25279 10.2988L3.22439 21.5353L4.71881 21.4061ZM3.75 21.5127V10.2342H2.25V21.5127H3.75ZM3.22439 21.5353C3.2112 21.3828 3.33146 21.25 3.48671 21.25V22.75C4.21268 22.75 4.78122 22.1279 4.71881 21.4061L3.22439 21.5353ZM14.7351 5.34269C14.8596 4.58256 14.8241 3.80477 14.6307 3.0592L13.1787 3.43584C13.3197 3.97923 13.3456 4.54613 13.2548 5.10016L14.7351 5.34269ZM8.59635 21.25C8.12244 21.25 7.72601 20.887 7.68498 20.4125L6.19056 20.5417C6.29852 21.7902 7.3427 22.75 8.59635 22.75V21.25ZM8.62647 9.00585C9.30632 8.42 10.0392 7.72267 10.5235 6.81599L9.20042 6.10924C8.85404 6.75767 8.3025 7.30493 7.64729 7.86954L8.62647 9.00585ZM21.7142 12.313C21.9695 10.8365 20.8341 9.4842 19.3348 9.4842V10.9842C19.9014 10.9842 20.3332 11.4959 20.2361 12.0574L21.7142 12.313ZM3.48671 21.25C3.63292 21.25 3.75 21.3684 3.75 21.5127H2.25C2.25 22.1953 2.80289 22.75 3.48671 22.75V21.25ZM12.5921 9.14471C12.4344 10.1076 13.1766 10.9842 14.1537 10.9842V9.4842C14.1038 9.4842 14.0639 9.43901 14.0724 9.38725L12.5921 9.14471ZM6.87282 11.0198C6.8474 10.7258 6.96475 10.4378 7.18773 10.2456L6.20855 9.10933C5.62022 9.61631 5.31149 10.3753 5.3784 11.149L6.87282 11.0198Z" fill="#000"></path> </g></svg>
                    <p>{likes}</p>
                </li>
                {/* <li>
                    <svg fill="#000000" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_iconCarrier">
                            <path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path>
                        </g>
                    </svg>
                    <p>0</p>
                </li> */}
                <li className='share'>
                    <svg onClick={toggleVisibility} fill="#00ff00" height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
                        <g>
                            <path className="st0" d="M512,230.431L283.498,44.621v94.807C60.776,141.244-21.842,307.324,4.826,467.379 c48.696-99.493,149.915-138.677,278.672-143.14v92.003L512,230.431z"></path>
                        </g>
                    </svg>
                    <p>Share</p>
                </li>
                <li>
                    <svg onClick={toggleVisibility2} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" className="bi bi-three-dots-vertical"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path> </g></svg>
                    <p></p>
                </li>
            </div>

            {/* <div className="comments">

            </div> */}

            <div className={`message-box ${isVisible ? 'show' : ''}`}>
                <p>Share</p>
                <button className="close-button" onClick={e => { e.stopPropagation(); setIsVisible(false); }}><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#0F0F0F"></path> </g></svg></button>
                <div className="message">
                    <h2>{textToCopy}</h2>
                    <button className="copy-button" onClick={handleCopy}><svg fill="#000000" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>copy-line</title> <path d="M29.5,7h-19A1.5,1.5,0,0,0,9,8.5v24A1.5,1.5,0,0,0,10.5,34h19A1.5,1.5,0,0,0,31,32.5V8.5A1.5,1.5,0,0,0,29.5,7ZM29,32H11V9H29Z" className="clr-i-outline clr-i-outline-path-1"></path><path d="M26,3.5A1.5,1.5,0,0,0,24.5,2H5.5A1.5,1.5,0,0,0,4,3.5v24A1.5,1.5,0,0,0,5.5,29H6V4H26Z" className="clr-i-outline clr-i-outline-path-2"></path> <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect> </g></svg></button>
                </div>
            </div>

            <div className={`message-box message-also-pt2 ${isVisible2 ? 'show' : ''}`}>
                <p>Description</p>
                <button className="close-button" onClick={e => { e.stopPropagation(); setIsVisible2(false); }}><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#0F0F0F"></path> </g></svg></button>
                <div className="flex-cnt">
                    <li>
                        <h5>{likes}</h5>
                        <p>Likes</p>
                    </li>
                    <li>
                        <h5>{views}</h5>
                        <p>Views</p>
                    </li>
                    <li>
                        <h5>{formattedDate}</h5>
                        <p>Date</p>
                    </li>
                </div>
                <div className="message">
                    <h2>{title}</h2>
                </div>
                <div className='hashtags-cnt'>
                    <p>{tags}</p>
                </div>
            </div>

            <audio ref={audioRef} controls autoPlay >
                <source src={songlink} type="audio/mp3" />
            </audio>
        </div>
    );
}

export default Player;