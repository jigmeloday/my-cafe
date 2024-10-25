
import './gallery.css';
import SubHeader from '../../components/sub-header/sub-header';
import {useRef} from 'react';
import {BsArrowLeftShort, BsArrowRightShort, BsInstagram} from 'react-icons/bs';
import {images} from '../../constants';

function Gallery() {
    const scrollRef = useRef();
    const { gallery01, gallery02, gallery03, gallery04, gallery05, gallery06, gallery07 } = images;
    const scroll = (direction) => {
        const { current } = scrollRef;
        if (direction === 'left') {
            current.scrollLeft -=300
        } else {
            current.scrollLeft +=300
        }
    }
    return(
        <div className="app__gallery flex__center">
            <div className="app__gallery-content">
                <SubHeader title="Instagram" />
                <h1 className="headtext__cormorant"> Photo Gallery </h1>
                <p className="p__opensans" style={{ color:'#aaa', marginTop: '2rem' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat mattis ipsum turpis elit elit scelerisque egestas mu.
                </p>
                <button type="button" className="custom__button">
                    View More
                </button>
            </div>
            <div className="app__gallery-images">
                <div className="app__gallery-images_container" ref={scrollRef}>
                    {
                        [gallery05, gallery07,gallery01, gallery06, gallery02, gallery03, gallery04].map((value, index) => (
                            <div className="app__gallery-images_card flex__center" key={`${index}-gallery_image`}>
                                <img src={value} alt="gallery"/>
                                <BsInstagram className="gallery__image-icon" />
                            </div>
                        ))
                    }
                </div>
                <div className="app__gallery-images_arrows">
                    <BsArrowLeftShort className="gallery__arrow-icon" onClick={() => scroll('left')} />
                    <BsArrowRightShort className="gallery__arrow-icon" onClick={() => scroll('right')} />
                </div>
            </div>
        </div>
    )
}

export default Gallery;
