import { authService } from "../fbase";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
import { useAuthUser } from "../hooks/quries/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import last from "lodash/last";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { Link } from "react-router-dom";

export interface INweet {
  id: string;
  text: string;
  createdAt: number;
  creatorId: string;
  attachmentUrl: string;
}

const LIMIT = 5;

function useNweetsQuery({ limit = LIMIT, pageToken }: { limit: number; pageToken?: string; }) {
  return useQuery<{ list: INweet[]; nextPageToken: string; }, Error>(['nweets', { pageToken, limit }], {
    queryFn: () => axios.get('https://firestore.googleapis.com/v1/projects/tablelab-d9e2e/databases/(default)/documents/nweets', {
      params: {
        pageSize: limit,
        orderBy: 'createdAt desc',
        pageToken
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
    })
  })
}

const Home = () => {
  const user = useAuthUser(['user'], authService, {
    select: (data) => ({
      uid: data?.uid ?? '',
      displayName: data?.displayName ?? '',
    })
  });
  const [pageToken] = useQueryParam('pageToken', StringParam);
  const [limit] = useQueryParam('limit', NumberParam);
  const nweets = useNweetsQuery({ pageToken: pageToken ?? undefined, limit: limit ?? 5 })
  const nextPageToken = nweets.data?.nextPageToken;

  return (
    <div className="container">
      <NweetFactory />
      <div style={{ marginTop: 30 }}>
        {nweets.data?.list.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === user.data?.uid}
          />
        ))}
      </div>
      <Link to={{ search: `pageToken=${nextPageToken}` }}>Next</Link>
    </div>
  );
};

export default Home;
