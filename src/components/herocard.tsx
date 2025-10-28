import Image, { StaticImageData } from "next/image";
import { FC } from "react";

interface IHeroCard {
  image: StaticImageData | string;
  description?: string;
}

export const HeroCard: FC<IHeroCard> = (props) => {
  const { image, description } = props;
  return (
    <div className="relative h-60 w-full overflow-hidden">
      <Image
        loading="lazy"
        src={image}
        alt="Hero Image"
        width={800}
        height={600}
        className="absolute h-full w-full object-cover blur-[2px]"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <h1 className="mb-4 text-4xl font-bold md:text-6xl">
          สาขาวิทยาการคอมพิวเตอร์ประยุกต์
        </h1>
        {description &&
          description.split("/").map((part, index) => (
            <h5 key={index} className="mb-2 text-lg md:text-xl">
              {part}
            </h5>
          ))}
      </div>
    </div>
  );
};
