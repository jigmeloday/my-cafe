import images from '../../constants/images';
import SubHeader from '../../components/sub-header/sub-header';
import './header.css';

function Header() {
    return(
        <div className="app__header app__wrapper section__padding" id="home">
            <div className="app__wrapper_info">
                <SubHeader title="Chase the new flavour" />
                <h1 className="app__header-h1">The Key to Find Dining</h1>
                <p className="p__opensans" style={{margin: '2rem 0'}}>Sit tellus lobortis sed senectus vivamus molestie. Condimentum volutpat morbi facilisis quam scelerisque sapien. Et, penatibus aliquam amet tellus </p>
                <button type="button" className="custom__button">Explore Menu</button>
            </div>
            <div className="app__wrapper_img ">
                <img src={images.welcome} alt="welcome image" />
            </div>
        </div>
    )
}

export default Header;
