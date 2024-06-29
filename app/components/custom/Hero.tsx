import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

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
    <Link
      to={href}
      target={isExternal ? "_blank" : "_self"}
      rel="noopener noreferrer"
    >
      <Button className="text-white font-bold">{text}</Button>
    </Link>
  );
}

export function Hero({ data }: { readonly data: HeroProps }) {
  const { heading, text, image, buttonLink } = data;
  return (
    <section className="bg-gray-900">
      <div className="relative isolate overflow-hidden pt-14">
        <img
          src={image.url}
          alt={image.alternativeText}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
              Join our community.{" "}
              <Link
                to="https://discord.gg/YYHuwWQqXz"
                className="font-semibold text-white"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                Discord <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {heading}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">{text}</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {buttonLink
                ? buttonLink.map((link: ButtonLinkProps) => (
                    <ButtonLink key={link.id} data={link} />
                  ))
                : null}
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

// <section
//   className="
//   relative
//   overflow-hidden
//   h-full
//   lg:h-[600px]
// "
// >
//   <div className="container h-full grid grid-cols-1 lg:grid-cols-2  gap-10 d-cols-2 p-16 ">
//     <div className="items-center text-center text lg:text-start space-y-6 z-50">
//       <div className="text-5xl md:text-6xl font-bold">
//           <h1 className=" bg-gradient-to-r leading-normal from-[#f50cca]  to-[#f03232] text-transparent bg-clip-text">
//             {heading}
//           </h1>
//       </div>

//       <p className="text-xl text-white md:w-10/12 mx-auto lg:mx-0">
//         {text}
//       </p>

//       <div className="space-y-4 md:space-y-0 md:space-x-4">
//         {buttonLink
//           ? buttonLink.map((link: ButtonLinkProps) => (
//               <ButtonLink key={link.id} data={link} />
//             ))
//           : null}
//       </div>
//     </div>

//     <div className="z-50"></div>
//   </div>
//   <BackgroundImage image={image} />
// </section>
