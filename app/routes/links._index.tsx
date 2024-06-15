import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

import {
  isRouteErrorResponse,
  useRouteError,
  useLoaderData,
  Scripts,
  Link,
} from "@remix-run/react";

import { formatDate } from "~/lib/utils";
import { getAllLinksData, getPageData } from "~/api/loaders.server";

import { PageHeader } from "~/components/custom/PageHeader";
import { RootErrorComponent } from "~/components/custom/RootErrorComponent";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const pageData = await getPageData("links");
  const linksData = await getAllLinksData();
  return json({
    params: params,
    pageData: pageData.data[0],
    linksData: linksData,
  });
}

interface PageData {
  params: { slugId: string };
  pageData: {
    id: string;
    title: string;
    slug: string;
    description: string;
    blocks: any[];
  };

  linksData: {
    data: any[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  };
}

function blocksRenderer(block: any, index: number) {
  switch (block.__component) {
    case "layout.hero":
      return <PageHeader key={index} data={block} />;
    default:
      return null;
  }
}

function LinkCard({ link }: { readonly link: any }) {
  return (
    <Link to={link.link} target="_blank" key={link.id}>
      <Card className="relative">
        <CardHeader>
          <div className="flex items-center">
            <svg
              className="hidden lg:block w-8 h-8 text-primary -ml-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6.75 6.75C6.75 5.64543 7.64543 4.75 8.75 4.75H15.25C16.3546 4.75 17.25 5.64543 17.25 6.75V19.25L12 14.75L6.75 19.25V6.75Z"
              ></path>
            </svg>
            <div className="space-y-2">
              <h2 className="block text-primary">{link.title}</h2>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <p className="text-slate-800 leading-normal">{link.description}</p>
            <span className="text-xs text-gray-400">
              {formatDate(link.publishedAt)}
            </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function LinkRoute() {
  const { pageData, linksData } = useLoaderData<typeof loader>() as PageData;
  if (!pageData) return null;

  return (
    <div>
      <section>{pageData.blocks.map(blocksRenderer)}</section>
      <section className="my-8 space-y-6 sm:space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {linksData.data.map((link) => {
            return <LinkCard key={link.id} link={link} />;
          })}
        </div>
      </section>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <RootErrorComponent heading="Oh no! Something went wrong when loading the links page!">
        <div>
          <p className="mb-4 text-4xl font-bold text-pink-600 dark:text-gray-100">
            {error.status} {error.statusText}
          </p>
          <p>{error.data}</p>
        </div>
      </RootErrorComponent>
    );
  } else if (error instanceof Error) {
    return (
      <RootErrorComponent heading="Oh no! Something went wrong when loading the links page!">
        <div>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <p>{error.stack}</p>
        </div>
      </RootErrorComponent>
    );
  } else {
    return (
      <RootErrorComponent heading="Oh no! Something went wrong when loading links page!">
        <div>
          <h1>Unknown Error</h1>;
        </div>
        <Scripts />
      </RootErrorComponent>
    );
  }
}
