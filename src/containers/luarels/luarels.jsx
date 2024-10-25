import { data, images } from '../../constants';
import SubHeader from '../../components/sub-header/sub-header';
import Awards from '../../components/awards/awards';
import './luarels.css'

function Luarels() {
    return(
       <div className="app__bg app__wrapper section__padding" id="award">
           <div className="app__wrapper_info ">
               <SubHeader title="Awards & recognition" />
               <h1 className="headtext__cormorant">Our Laurels</h1>
               <div className="app__luarels_awards">
                   {
                       data.awards.map((item) => (
                           <Awards award={item} key={item.title} />
                       ))
                   }
               </div>
           </div>
           <div className="app__wrapper_img">
               <img src={images.laurels}/>
           </div>
       </div>
    );
}

export default Luarels;
