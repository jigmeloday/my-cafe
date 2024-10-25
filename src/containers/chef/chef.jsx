import { images } from '../../constants';
import SubHeader from '../../components/sub-header/sub-header';
import './chef.css';

function Chef() {
    return (
        <div className="app__bg app__wrapper section__padding">
            <div className="app__wrapper_img app__wrapper_img-reverse">
                <img src={images.chef} alt="chef" />
            </div>
            <div className="app__wrapper_info">
                <SubHeader title="Chef's Word" />
                <h1 className="headtext__cormorant">
                    What We Believe In
                </h1>
                <div className="app__chef-content">
                    <div className="app__chef-content-quote">
                        <img src={images.quote} alt="quote" />
                        <p className="p__opensans">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit auctor sit .
                        </p>
                    </div>
                    <p className="p__opensans">
                        auctor sit iaculis in arcu. Vulputate nulla lobortis mauris eget sit. Nulla scelerisque scelerisque congue ac consequat, aliquam molestie lectus eu. Congue iaculis integer curabitur semper sit nunc.
                    </p>
                </div>
                <div className="app__chef-sign">
                    <p>Kelvin Luo</p>
                    <p className="p__opensans"> Chef & Founder </p>
                    <img src={images.sign} alt="sign"/>
                </div>
            </div>
        </div>
    )
}

export default Chef;
