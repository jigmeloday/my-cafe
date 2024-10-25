import Header from '../containers/header/header';
import AboutUs from '../containers/about-us/about-us';
import SpecialMenu from '../containers/menu/SpecialMenu';
import Chef from '../containers/chef/chef';
import Intro from '../containers/intro/intro';
import Luarels from '../containers/luarels/luarels';
import Gallery from '../containers/gallery/gallery';
import Findus from '../containers/findus/findus';

function Landing() {
    return (
        <div>
            <Header/>
            <AboutUs/>
            <SpecialMenu/>
            <Chef/>
            <Intro/>
            <Luarels/>
            <Gallery/>
            <Findus/>
        </div>
    );
}

export default Landing;
