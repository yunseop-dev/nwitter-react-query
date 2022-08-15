import { authService } from "../fbase";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
import { useAuthUser } from "../hooks/quries/useAuthUser";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import last from "lodash/last";
import flattenDeep from "lodash/flattenDeep";
import { useMemo } from "react";

export interface INweet {
  id: string;
  text: string;
  createdAt: number;
  creatorId: string;
  attachmentUrl: string;
}

const LIMIT = 5;

function useNweetsInfiniteQuery() {
  return useInfiniteQuery(['nweets'], ({ pageParam }) => axios.get('https://firestore.googleapis.com/v1/projects/tablelab-d9e2e/databases/(default)/documents/nweets', {
    params: {
      pageSize: LIMIT,
      orderBy: 'createdAt desc',
      pageToken: pageParam
    }
  }).then(({ data }) => {
    const list = data.documents.map(((item: any) => ({
      id: last((item.name as string).split('/')),
      text: item.fields.text.stringValue,
      createdAt: Number(item.fields.createdAt.integerValue),
      creatorId: item.fields.creatorId.stringValue,
      attachmentUrl: item.fields.attachmentUrl.stringValue,
    })));
    const nextPageToken = data.nextPageToken;
    return { list, nextPageToken }
  }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageToken,
    }
  )
};

const Home = () => {
  const user = useAuthUser(['user'], authService, {
    select: (data) => ({
      uid: data?.uid ?? '',
      displayName: data?.displayName ?? '',
    })
  });
  const nweets = useNweetsInfiniteQuery();
  const list = useMemo(() => flattenDeep(nweets.data?.pages.map(page => page.list) ?? []), [nweets.data?.pages])

  return (
    <div className="container">
      <NweetFactory />
      <div style={{ marginTop: 30 }}>
        {list.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === user.data?.uid}
          />
        ))}
      </div>
      {nweets.hasNextPage && <button onClick={() => nweets.fetchNextPage()}>Next</button>}
    </div>
  );
};

export default Home;
