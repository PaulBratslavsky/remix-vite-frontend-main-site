import { useFetcher } from "@remix-run/react";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { chat } from "~/services/chat.server";
import { useEffect, useState, useRef } from "react";

export async function action(args: ActionFunctionArgs) {
  const { request, params } = args;

  const formData = await request.formData();
  const formItems = Object.fromEntries(formData);
  const videoId = params?.videoId;

  if (!videoId) return json({ data: null, message: "No videoId found!" });

  let response: any = null;

  switch (formItems._action) {
    case "chat":
      response = await chat(videoId as string, formItems.query as string);
      return json({ data: response?.text, message: "Updated!" });
    default:
      return json({ data: null, message: "No action found!" });
  }
}

export function VideoChat({ videoId }: { videoId: string }) {
  const [text, setText] = useState("");
  const fetcher = useFetcher<typeof action>();
  const isSubmitting = fetcher.formData?.get("_action") === "chat";

  const data = fetcher.data;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetcher.load("/resources/video-chat/" + videoId);
  }, []);

  useEffect(() => {
    if (data) {
      setText((prevState) => prevState.concat("\n \n" + data?.data));
      // Scroll the textarea to the bottom every time the text changes

      // why you are not working
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }
  }, [data]);

  return (
    <div>
      {text && (
        <fetcher.Form
          method="POST"
          action={`/resources/video-chat/${videoId}`}
          className="w-full"
        >
          <fieldset
            disabled={isSubmitting}
            className="flex-row gap-2 items-center justify-center my-4 relative"
          >
            <Textarea
              name="content"
              className="w-full h-[315px] mt-4"
              value={text}
              ref={textareaRef}
            />
          </fieldset>
        </fetcher.Form>
      )}
      <fetcher.Form
        key={data?.data}
        method="POST"
        action={`/resources/video-chat/${videoId}`}
        className="w-full"
      >
        <fieldset
          disabled={isSubmitting}
          className="flex gap-2 items-center justify-center my-4"
        >
          <Input
            name="query"
            placeholder="Ask your question"
            className="w-full"
            required
          />

          <Button name="_action" value="chat" type="submit">
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </fieldset>
      </fetcher.Form>
    </div>
  );
}