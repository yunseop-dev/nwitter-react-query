import { authService, dbService } from "../fbase";
import { useEffect, useState } from "react";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useAuthUser } from "../hooks/quries/useAuthUser";

const Home = ({ userObj }: any) => {
  const [nweets, setNweets] = useState<any[]>([]);
  const user = useAuthUser(['user'], authService, {
    select: (data) => ({
      uid: data?.uid ?? '',
      displayName: data?.displayName ?? '',
    })
  });

  useEffect(() => {
    getDocs(
      query(
        collection(dbService, "nweets"),
        orderBy("createdAt", "desc"),
      )
    ).then((snapshot) => {
      const newArray: any = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      setNweets(newArray);
    });

  }, []);

  return (
    <div className="container">
      <NweetFactory />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
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
