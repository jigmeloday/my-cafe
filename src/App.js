import './App.css';
import RootRouter from './route/root.route';
import NavBar from './components/nav-bar/nav-bar';
import Footer from './containers/footer/footer';

function App() {
  return (
      <main>
          <NavBar />
          <RootRouter />
          <Footer />
      </main>
  );
}

export default App;
