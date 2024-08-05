import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Card, CardTitle } from "~/components/ui/card";
import { PaginationComponent } from "~/components/custom/Pagination";

import {
  isRouteErrorResponse,
  useRouteError,
  useLoaderData,
  Scripts,
  Link,
} from "@remix-run/react";

import { formatDate } from "~/lib/utils";
import { getAllPostsData, getPageData } from "~/api/loaders.server";

import { PageHeader } from "~/components/custom/PageHeader";
import { FeaturedPosts } from "~/components/custom/FeaturedPosts";
import { RootErrorComponent } from "~/components/custom/RootErrorComponent";
import { Search } from "~/components/custom/Search";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") ?? "";
  const page = url.searchParams.get("page") ?? "1";

  const pageData = await getPageData("blog");
  const postData = await getAllPostsData(query, page);

  if (!postData) return json({ message: "No posts found" }, { status: 404 });


  return json({
    params: params,
    pageData: pageData.data[0],
    postData: postData,
    query: query,
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

  postData: {
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

  query: string;
}

function blocksRenderer(block: any) {
  switch (block.__component) {
    case "layout.hero":
      return <PageHeader key={block.__component} data={block} />;
    case "layout.post-list":
      return <FeaturedPosts key={block.__component} data={block} />;
    default:
      return null;
  }
}

export default function BlogRoute() {
  const { pageData, postData, query } = useLoaderData<
    typeof loader
  >() as PageData;
  if (!pageData) return null;

  const pageCount = postData.meta.pagination.pageCount;

  return (
    <div>
      <section>{pageData.blocks.map(blocksRenderer)}</section>
      <section className="container mx-auto py-16 space-y-6 sm:space-y-12">
        <h2 className="text-4xl font-bold text-primary text-center my-6">
          All Posts
        </h2>
        
        <Search query={query} />

        <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {postData.data.map((post) => {
            return (
              <Link to={`/blog/${post?.slug}`} key={post.id} prefetch="intent">
                <Card className="max-w-sm mx-auto group hover:no-underline focus:no-underline bg-gray-900 lg:w-[300px] xl:min-w-[375px] rounded-2xl overflow-hidden shadow-lg p-6">
                  <CardTitle className="text-2xl text-primary font-semibold group-hover:underline group-focus:underline">
                    <h2>{post.title}</h2>
                  </CardTitle>
                  <div>
                    <div className="flex items-center gap-1 my-2">
                      <span className="text-xs text-gray-400">
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="text-xs text-white">by Paul</span>
                    </div>
                    <p className="py-4 text-white">{post.description}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        <PaginationComponent pageCount={pageCount} />
      </section>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <RootErrorComponent heading="Oh no! Something went wrong when loading the blog page!">
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
      <RootErrorComponent heading="Oh no! Something went wrong when loading the blog page!">
        <div>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <p>{error.stack}</p>
        </div>
      </RootErrorComponent>
    );
  } else {
    return (
      <RootErrorComponent heading="Oh no! Something went wrong when loading the dynamic route!">
        <div>
          <h1>Unknown Error</h1>;
        </div>
        <Scripts />
      </RootErrorComponent>
    );
  }
}
