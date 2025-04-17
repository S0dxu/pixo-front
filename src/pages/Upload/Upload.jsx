import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Upload.css";
import phone from "./../../assets/mockup_apple_iphone_15_2023_734f0b84182.png";
import load from "./../../assets/loading-animation.svg";

const Upload = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const file = location.state?.file || null;
    const link = location.state?.link || null;
    const [imageUrl, setImageUrl] = useState("");
    const [author, setAuthor] = useState("");
    const [date, setDate] = useState("");
    const [title, setTitle] = useState("");
    const [songname, setSongname] = useState("");
    const [songlink, setSonglink] = useState("");
    const [tags, setTags] = useState("");
    const videoRef = useRef(null)
    const [videoLink, setVideoLink] = useState("");
    const [videoTitle, setVideoTitle] = useState("");
    const token = localStorage.getItem("token") ? localStorage.getItem("token") : ""
      
    const songsList = [
        { title: "None", link: "" },
        { title: "Ransom", link: "https://www.soundboard.com/track/download/1052113" },
        { title: "Wake Me Up", link: "https://www.soundboard.com/track/download/976130" },
        { title: "Without Me", link: "https://www.soundboard.com/track/download/986791" },
        { title: "Levitating", link: "https://www.soundboard.com/track/download/1109990" },
        /* { title: "Uptown Funk", link: "https://www.soundboard.com/track/download/" },
        { title: "Stay", link: "https://www.soundboard.com/track/download/" },
        { title: "Blinding Lights", link: "https://www.soundboard.com/track/download/" },
        { title: "Peaches", link: "https://www.soundboard.com/track/download/" },
        { title: "Save Your Tears", link: "https://www.soundboard.com/track/download/" },
        { title: "Watermelon Sugar", link: "https://www.soundboard.com/track/download/" } */
    ];

    const [selectedSong, setSelectedSong] = useState(songsList[0]);

    const handleSongSelect = (song) => {
        setSongname(song.title);
        setSonglink(song.link);
        setSelectedSong(song);
    };

    const formattedDate = date ? (() => {
        const publishedDate = new Date(date);
        const hoursDifference = differenceInHours(new Date(), publishedDate);

        if (hoursDifference == 0) {
            return 'now';
        }
        else if (hoursDifference < 24) {
            return `${hoursDifference}h ago`;
        }
        else {
            return format(publishedDate, 'MM-dd');
        }
    })() : "-";

    const formatFileSize = (size) => {
        if (size >= 1e9) {
            return (size / 1e9).toFixed(2) + " GB";
        } else if (size >= 1e6) {
            return (size / 1e6).toFixed(2) + " MB";
        } else {
            return (size / 1e3).toFixed(2) + " KB";
        }
    };

    const fileSize = file ? formatFileSize(file.size) : "";

    const [hashtags, setHashtags] = useState([]);
    const [hashtagInput, setHashtagInput] = useState("");

    const addHashtag = () => {
        const hashtag = hashtagInput.trim();
        if (hashtag && !hashtags.includes(hashtag)) {
            setHashtags([...hashtags, hashtag]);
        }
        setHashtagInput("");
    };

    const removeHashtag = (hashtagToRemove) => {
        setHashtags(hashtags.filter(hashtag => hashtag !== hashtagToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addHashtag();
        }
    };

    /* const getUsernameFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken?.username || "";
            } catch (error) {
                console.error("Error while decoding token:", error);
            }
        }
        return "";
    };
 */
    const sendToMainFunc = async () => {
        setLoading(true);
        try {
            const data = {
                url: link,
                author: token,
                date: date,
                title: title,
                songname: songname,
                songlink: songlink,
                tags: hashtags
            };
    
            /* console.log('Sending data:', data); */
    
            const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-image`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) throw new Error("Error sending data");
    
            const responseData = await response.json();
            /* console.log(responseData); */

            navigate("./../foryou");
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        }
    };
    
    const play = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };    

    if (loading) return <div className="loading-screen-animation">
        <img src={load} alt="" />
    </div>;

    return (
        <div className="upload">
            <div className={`image-result ${file == null ? "up-to" : ""}`}>
                <div className="left">
                    {file ? (
                        <>
                            <h1>{file.name}</h1>
                        </>
                    ) : (
                        <></>
                    )}

                    {file ? (
                        <p>
                            <svg
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                role="img"
                                focusable="false"
                                data-icon="check-circle-fill"
                                aria-hidden="true"
                                fill="currentColor"
                                will-change="auto"
                                transform="rotate(0)"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 1.999c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10m4.707 8.708a1 1 0 0 0-1.414-1.414L11 13.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l2.823 2.823a1.25 1.25 0 0 0 1.768 0z"
                                ></path>
                            </svg>
                            {file && `Uploaded (${fileSize})`}
                        </p>
                    ) : (
                        <p className="no-up">No file uploaded</p>
                    )}
                </div>
                <Link to="/create" className="right">
                    <p>
                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            role="img"
                            focusable="false"
                            data-icon="arrow-repeat"
                            aria-hidden="true"
                            fill="currentColor"
                            will-change="auto"
                            transform="rotate(0)"
                        >
                            <path d="M12 3a9 9 0 0 0-5.594 1.938A1 1 0 1 0 7.656 6.5 6.97 6.97 0 0 1 12 5a7 7 0 0 1 7 7h-1a.5.5 0 0 0-.4.8l2 2.667a.5.5 0 0 0 .8 0l2-2.667a.5.5 0 0 0-.4-.8h-1a9 9 0 0 0-9-9M4.4 8.533a.5.5 0 0 0-.8 0l-2 2.667a.5.5 0 0 0 .4.8h1a9 9 0 0 0 9 9 9 9 0 0 0 5.594-1.938 1 1 0 1 0-1.25-1.562A6.96 6.96 0 0 1 12 19a7 7 0 0 1-7-7h1a.5.5 0 0 0 .4-.8z"></path>
                        </svg>
                        Replace
                    </p>
                </Link>
            </div>
            <div className="dateils">
                <h4>Details</h4>
                <div className="description">
                    <h3>Description</h3>
                    <div className="input-container">
                        <textarea
                            className="custom-input"
                            placeholder="Share more about your image here..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={200}
                        />
                        <div className="char-count">{title.length}/200</div>
                    </div>
                    <h3>Hashtags</h3>
                    <div className="input-container tags">
                        <input
                            type="text"
                            value={hashtagInput}
                            onChange={(e) => setHashtagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Hashtags"
                        />
                        <button onClick={addHashtag}><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="-3 0 30 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg></button>
                    </div>
                    <div className="hashtags">
                        {hashtags.map((hashtag, index) => (
                            <span key={index} className="hashtag">
                                <span
                                    onClick={() => removeHashtag(hashtag)}
                                    className="remove"
                                >
                                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                </span>
                                #{hashtag}
                            </span>
                        ))}
                    </div>
                    <div className="song">
                        <h3>Music</h3>
                        <div className="songs-list">
                            {songsList.map((song, index) => (
                                <div key={index} className="song-option" onClick={() => handleSongSelect(song)}>
                                    <svg viewBox="0 0 72 72" id="emoji" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="color"> <circle cx="36" cy="36" r="22" fill="#3F3F3F" stroke="none" strokeMiterlimit="10" strokeWidth="2"></circle> <circle cx="36" cy="36" r="12.7559" fill="#9B9B9A" stroke="none" strokeMiterlimit="10" strokeWidth="2"></circle> </g> <g id="hair"></g> <g id="skin"></g> <g id="skin-shadow"></g> <g id="line"> <circle cx="36" cy="36" r="22" fill="none" stroke="#000000" strokeMiterlimit="10" strokeWidth="2"></circle> <circle cx="36" cy="36" r="12.7559" fill="none" stroke="#000000" strokeMiterlimit="10" strokeWidth="2"></circle> </g> </g></svg>
                                    <p className={`song-option ${selectedSong?.title === song.title ? "song-active" : ""}`}>
                                        {song.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="phone-cnt" onClick={play}>
                <img src={phone} className="phone" />
                {link?.endsWith(".mp4") ? (
                    <video ref={videoRef} loop autoPlay className="img">
                        <source src={link} type="video/mp4" />
                    </video>
                ) : (
                    <img src={link} className="img" alt="Uploaded" />
                )}
            </div>
            <button className="post-bnt" onClick={sendToMainFunc}>Post</button>
        </div>
    );
};

export default Upload;
