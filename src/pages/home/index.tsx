import Nweet from "./components/Nweet";
import NweetFactory from "./components/NweetFactory";
import useNweetsInfiniteQuery from "./hooks/queries/useNweetsInfiniteQuery";
import useUser from "../../hooks/queries/useUser";

const Home = () => {
  const user = useUser()
  const nweets = useNweetsInfiniteQuery();

  return (
    <div
      style={{
        maxWidth: 890,
        width: "100%",
        margin: "0 auto",
        marginTop: 80,
        display: "flex",
        justifyContent: "center",
      }}
    >
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
    </div>
  );
};

export default Home;
