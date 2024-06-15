import { Meta, Links, Scripts } from "@remix-run/react";
import { BugIcon } from "~/components/icons/BugIcon";


interface RootErrorComponentProps {
  readonly children: React.ReactNode;
  readonly heading?: string;
}

export function RootErrorComponent({ children, heading }: Readonly<RootErrorComponentProps>) {
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container mx-auto  w-[960px] p-6 my-8">
          <div className="space-y-4">
            <BugIcon className="h-24 w-24 text-pink-500 dark:text-pink-400" />
            <h1 className="text-4xl font-bold text-pink-600 dark:text-gray-100 mb-4">
              {heading ?? "Oh no! Something went wrong!"}
            </h1>
            <div className="overflow-scroll">{children}</div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
