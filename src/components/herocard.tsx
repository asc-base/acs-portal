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
    <div className="relative w-full overflow-hidden h-[180px] md:h-[240px]">
      <Image
        loading="lazy"
        src={image}
        alt="Hero Image"
        fill
        className="absolute object-cover blur-[2px]"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <h3 className="mb-1 md:mb-3 font-bold md:text-4xl">{header}</h3>
        {description?.split("/").map((part) => (
          <h5 key={part} className="mb-2 md:text-xl">
            {part}
          </h5>
        ))}
      </div>
    </div>
  );
};
