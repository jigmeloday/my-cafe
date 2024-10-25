import images from '../../constants/images';
import './about.css';
function AboutUs() {
    return(
        <div className="app__aboutus app__bg flex__center section__padding" id="about">
            <div className="app__aboutus-overlay flex__center">
                <img src={images.G} alt="G letter"/>
            </div>
            <div className="app__aboutus-content flex__center">
                <div className="app__aboutus-content_about">
                    <h1 className="headtext__cormorant">About us</h1>
                    <img src={images.spoon} alt="about_spoon" className="spoon__img"/>
                    <p className="p__opensans">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pharetra adipiscing ultrices vulputate posuere tristique. In sed odio nec aliquet eu proin mauris et.
                    </p>
                    <button type="button" className="custom__button">No more</button>
                </div>
                <div className="app__aboutus-content__knife">
                    <img src={images.knife} alt="knife" />
                </div>
                <div className="app__aboutus-content_history">
                    <h1 className="headtext__cormorant">History</h1>
                    <img src={images.spoon} alt="about_spoon" className="spoon__img"/>
                    <p className="p__opensans">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pharetra adipiscing ultrices vulputate posuere tristique. In sed odio nec aliquet eu proin mauris et.
                    </p>
                    <button type="button" className="custom__button">No more</button>
                </div>
            </div>
        </div>
    )
}

export default AboutUs
