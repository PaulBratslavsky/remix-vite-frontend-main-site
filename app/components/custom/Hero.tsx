import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import BackgroundImage from "./BackgroundImage";

interface ImageProps {
  id: number;
  url: string;
  alternativeText: string;
}

interface ButtonLinkProps {
  id: number;
  text: string;
  isExternal: boolean;
  type: string;
  href: string;
}

interface HeroProps {
  heading: string;
  text: string;
  image: ImageProps;
  buttonLink: ButtonLinkProps[];
}

function ButtonLink({ data }: { readonly data: ButtonLinkProps }) {
  const { text, isExternal, href } = data;

  return (
    <Link to={href} target={isExternal ? "_blank" : "_self"} rel="noopener noreferrer">
      <Button className="text-gray-900 font-bold">{text}</Button>
    </Link>
  );
}

export function Hero({ data }: { readonly data: HeroProps }) {
  const { heading, text, image, buttonLink } = data;
  return (
    <section
      className="
      py-20 
      md:py-32 
      relative 
      border-2 
      rounded-[30px] 
      overflow-hidden
      h-full
      lg:h-[600px]
    "
    >
      <div className="container h-full grid grid-cols-1 lg:grid-cols-2  gap-10 d-cols-2 p-16 ">
        <div className="items-center text-center text lg:text-start space-y-6 z-50">
          <div className="text-5xl md:text-6xl font-bold">
              <h1 className=" bg-gradient-to-r leading-normal from-[#f50cca]  to-[#f03232] text-transparent bg-clip-text">
                {heading}
              </h1>
          </div>

          <p className="text-xl text-white md:w-10/12 mx-auto lg:mx-0">
            {text}
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            {buttonLink
              ? buttonLink.map((link: ButtonLinkProps) => (
                  <ButtonLink key={link.id} data={link} />
                ))
              : null}
          </div>
        </div> 

        <div className="z-50"></div>
      </div>
      <BackgroundImage image={image} />
    </section>
  );
}
