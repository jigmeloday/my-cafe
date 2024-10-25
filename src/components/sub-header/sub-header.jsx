import images from '../../constants/images';

function SubHeader({ title }) {
    return(
        <div style={{ marginBottom: '1rem' }}>
            <p className="p__cormorant">
                {title}
            </p>
            <img src={images.spoon} alt="spoon" className="spoon__img" />
        </div>
    )
}

export default SubHeader;
