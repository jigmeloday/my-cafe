import './menu-cover.css';
import {images} from '../../constants';

function MenuCover() {
    return(
        <div className="app__menu-cover flex__center section__padding">
            <div className="app__wrapper_info">
                <p className="p__opensans">Experience of</p>
                <p className="p__opensans ">Real Recipes</p>
                <p className="p__opensans ">Taste</p>
            </div>
            <div className="app__wrapper_img">
               <img src={images.gallery07} alt="meat" className="app__menu-img"/>
            </div>
        </div>
    )
}

export default MenuCover;
