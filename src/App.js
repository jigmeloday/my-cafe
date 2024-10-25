import NavBar from './components/nav-bar/nav-bar';
import Header from './containers/header/header';
import './App.css';
import AboutUs from './containers/about-us/about-us';

function App() {
  return (
      <div>
          <NavBar />
          <Header />
          <AboutUs />
      </div>
  );
}

export default App;
