import { meal } from '../../constants'
import {useRef, useState} from 'react';
import {BsPauseFill, BsPlayFill} from 'react-icons/bs';
import './intro.css';

function Intro() {
    const vidRef = useRef();
    const [playVideo, setPlayVideo] = useState(true);
    const handleVideo = () => {
        setPlayVideo((playVideo) => !playVideo)
        if (playVideo) {
            vidRef.current.pause();
        } else {
            vidRef.current.play();
        }
    }

    return(
        <div className="app__video">
            <video ref={vidRef} src={meal} datatype="video/mp4" loop controls={false} muted />
            <div className="app__video-overlay flex__center">
                <div
                    onClick={handleVideo}
                    className="app__video-overlay_circle flex__center">
                    {
                        playVideo ?  <BsPauseFill color="#fff" fontSize={30} /> : <BsPlayFill color="#fff" fontSize={30} />
                    }
                </div>
            </div>
        </div>
    )
}

export default Intro;
