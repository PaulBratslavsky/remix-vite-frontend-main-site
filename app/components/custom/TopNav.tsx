import { Link, useNavigation } from "@remix-run/react";
import { cn } from "~/lib/utils";

import { SheetTrigger, SheetContent, Sheet } from "~/components/ui/sheet";
import { MenuIcon } from "lucide-react";

import {
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenu,
} from "~/components/ui/navigation-menu";
import { Button } from "~/components/ui/button";

interface TopNavProps {
  id: number;
  logoLink: {
    id: number;
    href: string;
    text: string;
    isEternal: boolean;
  };
  navItem: NavItemProps[];
}

interface NavItemProps {
  id: number;
  href: string;
  text: string;
  isEternal: boolean;
}

function NavItem({
  item,
  className,
}: {
  readonly item: NavItemProps;
  readonly className?: string;
}) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const { href, text } = item;
  return (
    <NavigationMenuItem className="list-none">
      <Link
        className={cn(className, isLoading ? "animate-pulse" : "")}
        to={href}
        prefetch="intent"
      >
        {text}
      </Link>
    </NavigationMenuItem>
  );
}

export function TopNav({ data }: { readonly data: TopNavProps }) {
  const { logoLink, navItem } = data;

  return (
    <div
      className="
      bg-white 
      dark:bg-gray-800 
      rounded-full my-1
      "
    >
      <div className="flex mx-4 items-center justify-between px-4 py-2">
        <Link className="flex items-center gap-2" to={logoLink.href}>
          <MountainIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">{logoLink.text}</span>
        </Link>
        <div className="hidden md:flex md:items-center md:gap-4 ">
          <NavigationMenu>
            <NavigationMenuList>
              {navItem
                ? navItem.map((item: NavItemProps) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      className="
                        inline-flex 
                        h-9 
                        w-max 
                        items-center 
                        justify-center 
                        rounded-md 
                        bg-white 
                        px-4 
                        py-2 
                        text-sm 
                        font-medium 
                        transition-colors
                        hover:bg-gray-100 
                        hover:text-gray-900 
                        focus:bg-gray-100
                        focus:text-gray-900 
                        focus:outline-none 
                        disabled:pointer-events-none 
                        disabled:opacity-50 
                        data-[active]:bg-gray-100/50 
                        data-[state=open]:bg-gray-100/50 
                        dark:bg-gray-950 
                        dark:hover:bg-gray-800 
                        dark:hover:text-gray-50 
                        dark:focus:bg-gray-800 
                        dark:focus:text-gray-50 
                        dark:data-[active]:bg-gray-800/50 
                        dark:data-[state=open]:bg-gray-800/50 
                        "
                    />
                  ))
                : null}
            </NavigationMenuList>
          </NavigationMenu>
          <Button>Get Started</Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="lg:hidden" size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link className="flex items-center gap-2" to={logoLink.href}>
              <MountainIcon className="h-6 w-6" />
              <span className="text-lg font-semibold">{logoLink.text}</span>
            </Link>
            <div className="grid gap-2 py-6">
              {navItem
                ? navItem.map((item: NavItemProps) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      className="flex w-full items-center py-1 pl-4 rounded-sm text-lg font-semibold"
                    />
                  ))
                : null}
              <Button>Get Started</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function MountainIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
