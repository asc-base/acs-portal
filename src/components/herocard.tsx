import Image, { StaticImageData } from "next/image";
import { FC } from "react";

interface IHeroCard {
  image: StaticImageData | string;
  header?: string;
  description?: string;
}

export const HeroCard: FC<IHeroCard> = (props) => {
  const { image, description, header } = props;
  return (
    <div className="relative w-full overflow-hidden flex flex-col justify-center min-h-[12rem] md:min-h-[18rem]">
      <Image
        loading="eager"
        src={image}
        alt="Hero Image"
        fill
        className="absolute object-cover blur-[2px] select-none"
        priority
      />
      
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center px-4 py-4 text-center text-white">
        <h1 
          className="mb-3 font-bold drop-shadow-lg tracking-tight"
          style={{ fontSize: "var(--text-h1)" }}
        >
          {header}
        </h1>
        {description?.split("/").map((part, index) => (
          <h5 
            key={index} 
            className="font-medium drop-shadow-md opacity-90"
            style={{ fontSize: "var(--text-h3)" }}
          >
            {part}
          </h5>
        ))}
      </div>
    </div>
  );
};
