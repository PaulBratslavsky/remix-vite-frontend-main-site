import { type MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getHomePageData } from "~/api/loaders.server";
import { FeaturedPosts } from "~/components/custom/FeaturedPosts";
import { Hero } from "~/components/custom/Hero";

export async function loader() {
  const response = await getHomePageData();
  return json({ ...response });
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const blocks = data.data?.blocks;
  if (!blocks) return <p>No content found</p>;
  const heroData = blocks[0];
  return (
    <div>
      <Hero data={heroData} />
      <FeaturedPosts />
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="bg-pink-500 text-white min-h-[calc(100vh-56px)] flex justify-center items-center">
      <h2>Error Placeholder</h2>
    </div>
  );
}
