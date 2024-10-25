import SubHeader from '../sub-header/sub-header';
import './newsletter.css';

function Newsletter() {
    return(
        <div className="app__newsletter">
            <div className="app__newsletter-heading">
                <SubHeader title="Newsletter" />
                <h1 className="headtext__cormorant">Subscribe To Our Newsletter</h1>
                <p className="p__opensans">And never miss latest Updates!</p>
            </div>
            <div className="app__newsletter-input flex__center">
                <input type="email" placeholder="Enter your email address" />
                <button type="button" className="custom__button">Subscribe</button>
            </div>
        </div>
    );
}

export default Newsletter;
