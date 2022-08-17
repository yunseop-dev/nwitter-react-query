import Nweet from "./components/Nweet";
import NweetFactory from "./components/NweetFactory";
import useNweetsInfiniteQuery from "./hooks/queries/useNweetsInfiniteQuery";
import useUser from "../../hooks/queries/useUser";

const Home = () => {
  const user = useUser()
  const nweets = useNweetsInfiniteQuery();

  return (
    <div className="flex justify-center max-w-4xl w-full mx-auto mt-20 mb-0">
      <div className="flex flex-col w-full max-w-xs">
        <NweetFactory />
        <div className="mt-7">
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
