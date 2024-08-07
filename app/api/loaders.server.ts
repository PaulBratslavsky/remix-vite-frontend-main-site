import qs from "qs";
import { getStrapiURL } from "~/lib/utils";
import { fetchTranscript } from "~/services/youtube-transcript.server";

const baseUrl = getStrapiURL();
const PAGE_SIZE = 6;

async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
}

export async function getPageData(slug: string) {
  const query = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      blocks: {
        on: {
          "layout.hero": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
        },
      },
    },
  });

  const url = `${baseUrl}/api/pages?${query}`;
  return await fetchData(url);
}

export async function getGlobalData() {
  const url = new URL("/api/global", baseUrl);

  url.search = qs.stringify({
    populate: ["topNav.logoLink", "topNav.navItem"],
  });

  return await fetchData(url.href);
}

export async function getHomePageData() {
  const url = new URL("/api/home-page", baseUrl);

  url.search = qs.stringify({
    populate: {
      blocks: {
        on: {
          "layout.hero": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
        },
      },
    },
  });

  return fetchData(url.href);
}

export async function getAllMusicData() {
  const url = new URL("/api/songs", baseUrl);

  url.search = qs.stringify({
    sort: ["createdAt:desc"],
    populate: {
      artist: {
        fields: ["name"],
      },
      image: {
        fields: ["url", "alternativeText"],
      },
      audio: {
        fields: ["url", "alternativeText"],
      },
    },
  });

  return await fetchData(url.href);
}

export async function getAllLinksData() {
  const url = new URL("/api/links", baseUrl);
  return await fetchData(url.href);
}

export async function getAllPostsData(query: string, page: string) {
  const url = new URL("/api/posts", baseUrl);

  url.search = qs.stringify({
    sort: { createdAt: "desc" },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
    },
    filters: {
      $or: [
        { title: { $containsi: query } },
        { description: { $containsi: query } },
        { content: { $containsi: query } },
      ],
    },
    pagination: {
      pageSize: PAGE_SIZE,
      page: page,
    },
  });

  return await fetchData(url.href);
}

export async function getSinglePostsData(slug: string) {
  const url = new URL("/api/posts", baseUrl);

  url.search = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
      blocks: {
        populate: {
          clip: {
            populate: true,
          },
        },
      },
    },
  });

  return await fetchData(url.href);
}

export async function getSinglePreviewPostsData(slug: string) {
  const url = new URL("/api/posts", baseUrl);

  url.search = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
      blocks: {
        populate: {
          clip: {
            populate: true,
          },
        },
      },
    },
    publicationState: "preview",
  });

  return await fetchData(url.href);
}

export async function getVideoTranscript(videoId: string) {
  const transcriptData = await fetchTranscript(videoId);
  return {
    data: transcriptData,
  };
}
