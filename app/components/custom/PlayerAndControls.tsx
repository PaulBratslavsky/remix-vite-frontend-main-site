import { useState } from "react";
import { YouTubePlaylist } from "~/components/custom/YouTubePlaylist";
import { MediaPlayer } from "~/components/custom/MediaPlayer";
import { VideoChat } from "~/routes/resources.video-chat.$videoId";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface PlayerAndControlsProps {
  videoId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  playlist?: any[];
  title: string;
  description: string;
}

export function PlayerAndControls({
  videoId,
  playlist,
  title,
  description,
}: Readonly<PlayerAndControlsProps>) {
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [timeStamp, setTimeStamp] = useState(0);

  function handleClipChange(index: number) {
    if (playlist) {
      setCurrentClipIndex(index);
      setTimeStamp(playlist[index].start);
    }
  }

  return (
    <section className="overflow-hidden bg-slate-200 ">
      <div className="mx-auto grid grid-cols-1 items-start lg:grid-cols-3">
        {/* Left column */}
        <div className="grid grid-cols-1 lg:col-span-2">
          <MediaPlayer videoId={videoId} timestamp={timeStamp} controls />
        </div>

        {/* Right column */}
        <div className="grid grid-cols-1">
          <aside className="py-6 px-2">
            <Tabs defaultValue="chapters" >
              <TabsList className="w-full bg-primary text-white">
                <TabsTrigger value="chapters">Chapter</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              <TabsContent value="chapters">
                {playlist ? (
                  <YouTubePlaylist
                    playlist={playlist}
                    title={title}
                    description={description}
                    currentClipIndex={currentClipIndex}
                    handleClipChange={handleClipChange}
                  />
                ) : (
                  <p className="text-white">
                    There is no playlist for this video.
                  </p>
                )}{" "}
              </TabsContent>
              <TabsContent value="chat">
                <VideoChat videoId={videoId} />
              </TabsContent>
            </Tabs>
          </aside>
        </div>
      </div>
    </section>
  );
}
