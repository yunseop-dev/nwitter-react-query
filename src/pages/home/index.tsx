import Nweet from "./components/Nweet";
import NweetFactory from "./components/NweetFactory";
import useTodosQuery from "./hooks/queries/useTodosQuery";
import { useMemo } from "react";
import { useQueryParam, NumberParam } from "use-query-params";

const Home = () => {
  const nweets = useTodosQuery();
  const [pageParam, setPageParam] = useQueryParam('page', NumberParam);
  const page = useMemo(() => pageParam ?? 1, [pageParam]);

  return (
    <div className="flex justify-center max-w-4xl w-full mx-auto mt-20 mb-0">
      <div className="flex flex-col w-full max-w-xs">
        <NweetFactory />
        <div className="mt-7">
          {nweets.data?.data.map((nweet) => (
            <Nweet
              key={nweet.id}
              nweetObj={nweet}
              isOwner={true}
            />
          ))}
        </div>
        <span>Current Page: {page}</span>
        <button
          onClick={() => setPageParam(old => Math.max((old ?? 1) - 1, 1))}
          disabled={page === 1}
        >
          Previous Page
        </button>{' '}
        <button
          onClick={() => {
            if (!nweets.isPreviousData) {
              setPageParam(old => (old ?? 1) + 1)
            }
          }}
          // Disable the Next Page button until we know a next page is available
          disabled={nweets.isPreviousData}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default Home;
