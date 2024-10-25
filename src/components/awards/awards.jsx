import './awars.css';

function Awards({ award }) {
    return(
        <div className="app__awards-card">
            <img src={ award.imgUrl } alt="award1" />
            <div className="app__awards-cards_content">
                <p className="p__cormorant" style={{ color: "#dcca37" }}>{award.title}</p>
                <p className="p__cormorant">{award.subtitle}</p>
            </div>

        </div>
    )
}

export default Awards;
