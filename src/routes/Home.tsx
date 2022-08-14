import { authService } from "../fbase";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
import { useAuthUser } from "../hooks/quries/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Nweet {
  id: string;
  text: string;
  createdAt: number;
  creatorId: string;
  attachmentUrl: string;
}

const Home = ({ userObj }: any) => {
  const user = useAuthUser(['user'], authService, {
    select: (data) => ({
      uid: data?.uid ?? '',
      displayName: data?.displayName ?? '',
    })
  });
  const nweets = useQuery<Nweet[], Error>(['nweets'], {
    queryFn: () => axios.post('https://firestore.googleapis.com/v1/projects/tablelab-d9e2e/databases/(default)/documents:runQuery', {
      structuredQuery:
      {
        from: [
          {
            collectionId: 'nweets'
          }
        ],
        orderBy: [
          {
            field: {
              fieldPath: 'createdAt'
            },
            direction: 'DESCENDING'
          }
        ],
      }
    })
      .then(({ data }) => data.map((item: any) => item.document).map(((item: any) => ({
        id: item.name,
        text: item.fields.text.stringValue,
        createdAt: Number(item.fields.createdAt.integerValue),
        creatorId: item.fields.creatorId.stringValue,
        attachmentUrl: item.fields.attachmentUrl.stringValue,
      }))))
  })

  return (
    <div className="container">
      <NweetFactory />
      <div style={{ marginTop: 30 }}>
        {nweets.data?.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === user.data?.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
