import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/landing';
import MenuPage from '../pages/menu-page';

function RootRouter() {
    return(
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/menu" element={<MenuPage/>} />
        </Routes>
    )
}

export default RootRouter;
