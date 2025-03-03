import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, differenceInHours } from 'date-fns';
import './Player.css';
import { jwtDecode } from "jwt-decode";
import heart_smash from '../../assets/GIFPaint-2--unscreen.gif';
import placeholder from '../../assets/placeholder.png';
import commentsIcon from '../../assets/svgviewer-png-output (2).png';
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
  const videoRef = useRef(null);
  const [views, setViews] = useState(0);
  const [currentImageId, setCurrentImageId] = useState("");
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [audio, setAudio] = useState(1);
  const pressTimer = useRef(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const [IsOpacity, setOpacity] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isImage, setIsImage] = useState(true);
  const [picture, setPicture] = useState(null);
  const historyStack = useRef([]);
  const futureStack = useRef([]);
  const [textToCopy, setTextToCopy] = useState("");
  const lastClickTime = useRef(0);
  const { id } = useParams();
  const imageRef = useRef(null);
  let lastTouchY = 0;
  const formattedDate = date
    ? (() => {
        const publishedDate = new Date(date);
        const hoursDifference = differenceInHours(new Date(), publishedDate);
        if (hoursDifference === 0) {
          return 'now';
        } else if (hoursDifference < 24) {
          return `${hoursDifference}h ago`;
        } else {
          return format(publishedDate, 'MM-dd');
        }
      })()
    : "-";

  useEffect(() => {
    if (videoRef.current) {
      if (isLongPress) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isLongPress]);

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
  };

  const handleLongPressStart = () => {
    setOpacity(true);
    if (audioRef.current) audioRef.current.pause();
    setIsLongPress(true);
  };

  const handleLongPressEnd = () => {
    setOpacity(false);
    if (audioRef.current) audioRef.current.play();
    setIsLongPress(false);
  };

  const handleDoubleClick = async () => {
    const now = Date.now();
    if (now - lastClickTime.current < 300) {
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 760);
      if (!isLiked && !isLiking) {
        await handleLike();
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
      setPicture(data.picture);
      setTextToCopy(`https://pixo-v1.netlify.app/${data._id}`);
      setCurrentImageId(data._id);
      if (data.url.endsWith(".mp4")) {
        setIsImage(false);
      } else {
        setIsImage(true);
      }
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
      setPicture(data.picture);
      setTextToCopy(`https://pixo-v1.netlify.app/${data._id}`);
      if (data.url.endsWith(".mp4")) {
        setIsImage(false);
      } else {
        setIsImage(true);
      }
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
    navigate(`/profile/${author}`);
  };

  const handleWheel = (event) => {
    if (event.deltaY > 0) {
      handleScroll();
    } else if (event.deltaY < 0) {
      handleScrollUp();
    }
    event.preventDefault();
  };

  let initialTouchY = null;
  const handleTouchStart = (event) => {
    initialTouchY = event.touches[0].clientY;
    setIsLongPress(false);
    pressTimer.current = setTimeout(() => {
      handleLongPressStart();
      setIsLongPress(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (!isLongPress) {
      handleToggleMute();
    }
    handleLongPressEnd();
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
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        handleScroll();
      } else if (event.key === "ArrowUp") {
        handleScrollUp();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [loading, lastScrollTime, isAnimating]);  

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
    if (audioRef.current) {
      if (songlink) {
        audioRef.current.src = songlink;
        audioRef.current.play().catch((error) => {});
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [songlink]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audio;
    }
    if (videoRef.current) {
      videoRef.current.volume = audio;
    }
  }, [audio]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken?.id || "";
      } catch (error) {
        console.error("no id found:", error);
      }
    }
    return "";
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const userId = getUserIdFromToken();
    const imageId = currentImageId;
    if (!imageId || !userId) {
      setIsLiking(false);
      return;
    }
    try {
      const imageResponse = await fetch(`https://pixo-backend-version-1-2.onrender.com/image/${imageId}`);
      if (!imageResponse.ok) {
        console.error("Image fetch error");
        setIsLiking(false);
        return;
      }
      const imageData = await imageResponse.json();
      const alreadyLiked = imageData.likes.includes(userId);
      const url = alreadyLiked ? "https://pixo-backend-version-1-2.onrender.com/dislike-image" : "https://pixo-backend-version-1-2.onrender.com/like-image";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId, userId }),
      });
      if (!response.ok) {
        console.error("Error response from like/dislike");
        setIsLiking(false);
        return;
      }
      const data = await response.json();
      setLikes(data.likes);
      setIsLiked(!alreadyLiked);
    } catch (error) {
      console.error("Error handling like/dislike:", error);
    } finally {
      setTimeout(() => {
        setIsLiking(false);
      }, 1000);
    }
  };

  const handleMouseEnter = () => {
    const volume = document.querySelector(".player-volume");
    if (volume) {
      volume.style.opacity = "1";
      volume.style.transition = "opacity .2s ease";
    }
  };

  const handleMouseLeave = () => {
    const volume = document.querySelector(".player-volume");
    if (volume) {
      volume.style.opacity = "0";
      volume.style.transition = "opacity .2s ease";
    }
  };

  return (
    <div className="player">
      <div
        className={`player-with-all-the-fucking-other-stuff ${isScrolling ? "scroll-to" : ""} ${isScrollingUp ? "scroll-to-up" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onClick={handleDoubleClick}
      >
        <div ref={imageRef}>
          {imageUrl ? (
            isImage ? (
              <img src={imageUrl} className="img-url" alt="content" />
            ) : (
              <video
                key={currentImageId}
                autoPlay
                loop
                ref={videoRef}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.volume = audio;
                  }
                }}
              >
                <source src={imageUrl} type="video/mp4" />
              </video>
            )
          ) : (
            <img src="https://webdi.fr/img/couleurs/000000.png" alt="" />
          )}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="gradient-overlay"
          ></div>
          <p className={`desc ${IsOpacity ? "opacity0" : ""}`}>
            {author || "-"} · {formattedDate} <br />
            {title} <strong>{tags}</strong> <br />
            {songname && `♫ ${songname}`}<br />
          </p>
        </div>
      </div>
      <div onMouseEnter={handleMouseEnter} className={`player-volume ${IsOpacity ? "opacity0" : ""}`}>
        {audio === 0 ? (
          <svg width="24" height="24" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M25 10.8685C25 8.47242 22.3296 7.04325 20.3359 8.37236L10.3944 15H6C4.34315 15 3 16.3431 3 18V30C3 31.6568 4.34314 33 6 33H10.3944L20.3359 39.6276C22.3296 40.9567 25 39.5276 25 37.1315V10.8685ZM29.2929 18.1213L35.1716 24L29.2929 29.8787C28.9024 30.2692 28.9024 30.9024 29.2929 31.2929L30.7071 32.7071C31.0976 33.0976 31.7308 33.0976 32.1213 32.7071L38 26.8284L43.8787 32.7071C44.2692 33.0976 44.9024 33.0976 45.2929 32.7071L46.7071 31.2929C47.0976 30.9024 47.0976 30.2692 46.7071 29.8787L40.8284 24L46.7071 18.1213C47.0976 17.7308 47.0976 17.0976 46.7071 16.7071L45.2929 15.2929C44.9024 14.9024 44.2692 14.9024 43.8787 15.2929L38 21.1716L32.1213 15.2929C31.7308 14.9024 31.0976 14.9024 30.7071 15.2929L29.2929 16.7071C28.9024 17.0976 28.9024 17.7308 29.2929 18.1213Z"></path>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M20.3359 8.37236C22.3296 7.04325 25 8.47242 25 10.8685V37.1315C25 39.5276 22.3296 40.9567 20.3359 39.6276L10.3944 33H6C4.34314 33 3 31.6568 3 30V18C3 16.3431 4.34315 15 6 15H10.3944L20.3359 8.37236ZM21 12.737L12.1094 18.6641C11.7809 18.8831 11.3948 19 11 19H7V29H11C11.3948 29 11.7809 29.1169 12.1094 29.3359L21 35.263V12.737ZM32.9998 24C32.9998 21.5583 32.0293 19.3445 30.4479 17.7211C30.0625 17.3255 29.9964 16.6989 30.3472 16.2724L31.6177 14.7277C31.9685 14.3011 32.6017 14.2371 33.0001 14.6195C35.4628 16.9832 36.9998 20.3128 36.9998 24C36.9998 27.6872 35.4628 31.0168 33.0001 33.3805C32.6017 33.7629 31.9685 33.6989 31.6177 33.2724L30.3472 31.7277C29.9964 31.3011 30.0625 30.6745 30.4479 30.2789C32.0293 28.6556 32.9998 26.4418 32.9998 24ZM37.0144 11.05C36.6563 11.4705 36.7094 12.0995 37.1069 12.4829C40.1263 15.3951 42.0002 19.4778 42.0002 23.9999C42.0002 28.522 40.1263 32.6047 37.1069 35.5169C36.7094 35.9003 36.6563 36.5293 37.0144 36.9498L38.3109 38.4727C38.6689 38.8932 39.302 38.9456 39.7041 38.5671C43.5774 34.9219 46.0002 29.7429 46.0002 23.9999C46.0002 18.2569 43.5774 13.078 39.7041 9.43271C39.302 9.05421 38.6689 9.10664 38.3109 9.52716L37.0144 11.05Z"></path>
          </svg>
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
      <div className={`player-controls ${isScrolling ? "scroll-to-other" : ""} ${isScrollingUp ? "scroll-to-1000" : ""} ${IsOpacity ? "opacity0-2" : ""}`}>
        <div className='profile-icon'>
          <img
            onClick={takeToUser}
            src={picture ? picture : "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/640px-A_black_image.jpg"}
            alt="profile"
          />
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
          <svg className={`like ${isLiked ? "liked" : ""}`} onClick={handleLike} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M12.39 20.87a.696.696 0 0 1-.78 0C9.764 19.637 2 14.15 2 8.973c0-6.68 7.85-7.75 10-3.25 2.15-4.5 10-3.43 10 3.25 0 5.178-7.764 10.664-9.61 11.895z" fill="#fff"></path>
            </g>
          </svg>
          <p>{likes}</p>
        </li>
        <li className='share'>
          <svg onClick={toggleVisibility} fill="#00ff00" height="200px" width="200px" version="1.1" viewBox="0 0 512 512">
            <g>
              <path className="st0" d="M512,230.431L283.498,44.621v94.807C60.776,141.244-21.842,307.324,4.826,467.379 c48.696-99.493,149.915-138.677,278.672-143.14v92.003L512,230.431z"></path>
            </g>
          </svg>
          <p>Share</p>
        </li>
        <li>
          <svg onClick={toggleVisibility2} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" className="bi bi-three-dots-vertical">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
            </g>
          </svg>
          <p></p>
        </li>
      </div>
      <div className={`message-box ${isVisible ? 'show' : ''}`}>
        <p>Share</p>
        <button className="close-button" onClick={e => { e.stopPropagation(); setIsVisible(false); }}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#0F0F0F"></path>
            </g>
          </svg>
        </button>
        <div className="message">
          <h2>{textToCopy}</h2>
          <button className="copy-button" onClick={handleCopy}>
            <svg fill="#000000" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <title>copy-line</title>
                <path d="M29.5,7h-19A1.5,1.5,0,0,0,9,8.5v24A1.5,1.5,0,0,0,10.5,34h19A1.5,1.5,0,0,0,31,32.5V8.5A1.5,1.5,0,0,0,29.5,7ZM29,32H11V9H29Z" className="clr-i-outline clr-i-outline-path-1"></path>
                <path d="M26,3.5A1.5,1.5,0,0,0,24.5,2H5.5A1.5,1.5,0,0,0,4,3.5v24A1.5,1.5,0,0,0,5.5,29H6V4H26Z" className="clr-i-outline clr-i-outline-path-2"></path>
                <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect>
              </g>
            </svg>
          </button>
        </div>
      </div>
      <div className={`message-box message-also-pt2 ${isVisible2 ? 'show' : ''}`}>
        <p>Description</p>
        <button className="close-button" onClick={e => { e.stopPropagation(); setIsVisible2(false); }}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#0F0F0F"></path>
            </g>
          </svg>
        </button>
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
      <audio ref={audioRef} controls autoPlay>
        <source src={songlink} type="audio/mp3" />
      </audio>
    </div>
  );
};

export default Player;
