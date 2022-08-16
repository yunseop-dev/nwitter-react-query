import Nweet from "./components/Nweet";
import NweetFactory from "./components/NweetFactory";
import useNweetsInfiniteQuery from "./hooks/queries/useNweetsInfiniteQuery";
import useUser from "../../hooks/queries/useUser";

const Home = () => {
  const user = useUser()
  const nweets = useNweetsInfiniteQuery();

  return (
    <div className="container">
      <NweetFactory />
      <div style={{ marginTop: 30 }}>
        {nweets.list.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === user.data?.uid}
          />
        ))}
      </div>
      {nweets.hasNextPage && <button type="button" onClick={() => nweets.fetchNextPage()}>Next</button>}
    </div>
  );
};

export default Home;
