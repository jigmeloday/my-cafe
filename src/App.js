import NavBar from './components/nav-bar/nav-bar';
import Header from './containers/header/header';
import './App.css';
import AboutUs from './containers/about-us/about-us';
import SpecialMenu from './containers/menu/SpecialMenu';
import Chef from './containers/chef/chef';
import Intro from './containers/intro/intro';
import Luarels from './containers/luarels/luarels';
import Gallery from './containers/gallery/gallery';
import Findus from './containers/findus/findus';
import Footer from './containers/footer/footer';

function App() {
  return (
      <div>
          <NavBar />
          <Header />
          <AboutUs />
          <SpecialMenu />
          <Chef />
          <Intro />
          <Luarels />
          <Gallery />
          <Findus />
          <Footer />
      </div>
  );
}

export default App;
