import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getVideoTranscript } from "~/api/loaders.server";
import { Input } from "~/components/ui/input";

function convert (seconds: number) {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().split("T")[1].split(".")[0];
}

export async function loader({ params }: LoaderFunctionArgs) {
  const videoId = params.videoId;
  if (!videoId)
    return json({ message: "No videoId provided" }, { status: 400 });
  const transcript = await getVideoTranscript(videoId);
  return json({ data: transcript.data });
}

interface VideoTranscriptProps {
  videoId: string;
  title?: string;
  setTimestamp: (timestamp: number) => void;
}

export function VideoTranscript({
  videoId,
  setTimestamp,
}: Readonly<VideoTranscriptProps>) {
  const fetcher = useFetcher() as any;
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    fetcher.load("/resources/video-transcript/" + videoId);
  }, []);

  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";

  if (!fetcher.data) return null;
  if (isLoading) return <div className="bg-pink-500 container mx-auto">Loading...</div>;

  const data = fetcher.data.data;

  function handleSearchArray(query: string) {
    const filtered = data.filter((item: any) =>
      item.text.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  }

  let test = filteredData ?? data;

  return (
    <section className="relative py-10 bg-gray-900 rounded-3xl px-10">
 
      <Search callback={handleSearchArray} />

      <div className="h-[400px] overflow-y-scroll mt-5">
        {test.map((item: any, index: number) => {
          return (
            <button
              key={index}
              className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 py-0.5 px-2 focus:ring-blue-600 focus:ring-opacity-50 text-sm text-left"
              onClick={() => setTimestamp(item.offset / 1000)}
            >
              <span className="text-yellow-400 text-xs">{convert(item.offset / 1000)}</span> - {item.text} 
            </button>
          );
        })}
      </div>
    </section>
  );
}

interface SearchProps {
  callback: (query: string) => void;
}

export function Search({ callback }: Readonly<SearchProps>) {
  const [query, setQuery] = useState("");

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    callback(event.target.value);
  }

  return (
    <div>
      <Input
        id="query"
        aria-label="Search contacts"
        placeholder="Search"
        type="search"
        onChange={handleInputChange}
        value={query}
      />
    </div>
  );
}
