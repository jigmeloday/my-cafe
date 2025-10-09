import Image from 'next/image';

function BlogList() {
  return (
    <div className="flex space-x-[24px]">
      <div className="w-[60%] group border-[0.5px] border-primary-50 cursor-pointer rounded-md overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-500 ease-in-out">
        <div className="h-[440px] w-full overflow-hidden ">
          <Image
            src="/banner/dummy/globe.jpg"
            alt="img"
            height={600}
            width={600}
            className="h-full w-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-110"
          />
        </div>
        <div className="space-y-3 py-[24px] px-2">
          <p className="text-black/55 text-[14px]">By - Jigme</p>
          <h4>Brewing Happiness: Inside Bhutan’s Most Loved Cafés</h4>
          <p className="text-[12px] text-black/80">October 10, 2025 </p>
          <p>
            Step into the cozy corners of Bhutan’s favorite cafés, where every
            cup tells a story. From handcrafted brews to warm community vibes,
            discover how these spots are redefining comfort, creativity, and
            connection — one sip at a time.
          </p>
        </div>
      </div>
      <div className="w-[40%] h-fit space-y-[32px]">
        <div className="flex space-x-4 group cursor-pointer">
          <div className="size-[120px] overflow-hidden rounded-md flex-shrink-0">
            <Image
              src="/banner/dummy/globe.jpg"
              alt="img"
              height={600}
              width={600}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-black/55 text-[12px]">By - Jigme</p>
            <p className="text-xl font-bold leading-snug group-hover:text-primary-700 transition-all duration-500 ease-in-out my-[12px]">
              From Bean to Cup: The Art of Perfect Coffee Making
            </p>
            <p className="text-[10px]">Published Oct 10, 2025</p>
          </div>
        </div>
        <div className="flex space-x-4 group cursor-pointer">
          <div className="size-[120px] overflow-hidden rounded-md flex-shrink-0">
            <Image
              src="/banner/dummy/globe.jpg"
              alt="img"
              height={600}
              width={600}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-black/55 text-[12px]">By - Jigme</p>
            <p className="text-xl font-bold leading-snug group-hover:text-primary-700 transition-all duration-500 ease-in-out my-[16px]">
              From Bean to Cup: The Art of Perfect Coffee Making
            </p>
            <p className="text-[10px]">Published Oct 10, 2025</p>
          </div>
        </div>
        <div className="flex space-x-4 group cursor-pointer">
          <div className="size-[120px] overflow-hidden rounded-md flex-shrink-0">
            <Image
              src="/banner/dummy/globe.jpg"
              alt="img"
              height={600}
              width={600}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-black/55 text-[12px]">By - Jigme</p>
            <p className="text-xl font-bold leading-snug group-hover:text-primary-700 transition-all duration-500 ease-in-out my-[16px]">
              From Bean to Cup: The Art of Perfect Coffee Making
            </p>
            <p className="text-[10px]">Published Oct 10, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogList;
