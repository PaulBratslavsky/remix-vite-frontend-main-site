import { useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect } from "react";
import { getAllMusicData } from "~/api/loaders.server";
import { InlineMusicPlayer } from "~/components/custom/InlineMusicPlayer";

export async function loader() {
  const data = await getAllMusicData();
  return json(data);
}

export function Music() {
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.load("/resources/music");
  }, []);

  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";

  if (!fetcher.data) return null;
  if (isLoading) return <div className="bg-pink-500">Loading...</div>;

  const musicData = fetcher.data.data;  

  return musicData.map((item: any) => {
    if (!item) return null;
    return <InlineMusicPlayer key={item.id} audio={item} />;
  });
}
