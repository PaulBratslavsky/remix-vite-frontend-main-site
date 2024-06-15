import React from "react";
import { StrapiImage } from "~/components/custom/StrapiImage";

interface BackgroundImageProps {
  image: {
    url: string;
    alternativeText: string;
  };
}

export default function BackgroundImage({
  image,
}: Readonly<BackgroundImageProps>) {
  return (
    <React.Fragment>
      <div className="
        absolute 
        inset-0  
        bg-black 
        bg-opacity-50 
        overflow-hidden z-10"></div>
      <StrapiImage
        src={image.url}
        alt={image.alternativeText}
        height={1080}
        width={1920}
        className="absolute inset-0 object-cover aspect-auto w-full h-full z-0"
      />
    </React.Fragment>
  );
}
