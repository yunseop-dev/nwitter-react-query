import { useState } from "react";
import { authService, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useAuthUser } from "../hooks/quries/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { INweet } from "../routes/Home";
import { last } from "lodash";

type INewNweet = Omit<INweet, 'id'>;

const NweetFactory = () => {
  const queryClient = useQueryClient();
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const user = useAuthUser(['user'], authService, {
    select: (data) => ({
      uid: data?.uid ?? '',
      displayName: data?.displayName ?? '',
    })
  });

  const addDoc = useMutation(
    (nweet: INewNweet) => axios.post<INweet>("https://firestore.googleapis.com/v1/projects/tablelab-d9e2e/databases/(default)/documents/nweets", {
      fields: {
        text: { stringValue: nweet.text },
        createdAt: { integerValue: nweet.createdAt },
        creatorId: { stringValue: nweet.creatorId },
        attachmentUrl: { stringValue: nweet.attachmentUrl },
      }
    }).then(({ data }: any) => ({
      id: last((data.name as string).split('/')),
      text: data.fields.text.stringValue,
      createdAt: Number(data.fields.createdAt.integerValue),
      creatorId: data.fields.creatorId.stringValue,
      attachmentUrl: data.fields.attachmentUrl.stringValue,
    } as INweet)), {
    async onSuccess(data) {
      await queryClient.cancelQueries(['nweets'])
      const previousNweets = queryClient.getQueryData<INweet[]>(['nweets'])
      queryClient.setQueryData<INweet[]>(['nweets'], (oldData = []) => [data, ...oldData])

      return { previousNweets }
    },
    onError(error, variables, context: any) {
      queryClient.setQueryData(['nweets'], context.previousNweets)
    }
  })

  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (nweet === "") {
      return;
    }

    let attachmentUrl = "";

    if (attachment !== "") {
      // const attachmentRef = storageService
      //   .ref()
      //   .child();

      const attachmentRef = ref(storageService, `${user.data?.uid}/${uuidv4()}`)

      await uploadString(attachmentRef, attachment, "data_url")
      attachmentUrl = await getDownloadURL(attachmentRef);
    }

    const nweetObj: INewNweet = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: user.data?.uid ?? '',
      attachmentUrl,
    };
    await addDoc.mutateAsync(nweetObj)

    setNweet("");
    setAttachment("");
  };

  const onChange = (event: any) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event: any) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent: any) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    if (Boolean(theFile)) {
      reader.readAsDataURL(theFile);
    }
  };

  const onClearAttachment = () => setAttachment("");

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
