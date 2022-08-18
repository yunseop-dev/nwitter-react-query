import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import useUser from "../../../hooks/queries/useUser";
import useAddNweetMutation, { TodoInputBody } from "../hooks/mutations/useAddNweetMutation";

const NweetFactory = () => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const user = useUser()
  const addDoc = useAddNweetMutation()

  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (nweet === "") {
      return;
    }

    const nweetObj: TodoInputBody = {
      text: nweet,
      done: false,
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
    <form onSubmit={onSubmit} className="flex flex-col items-center w-full">
      <div className="flex justify-between items-center flex-wrap relative mb-5 w-full">
        <input
          className="grow-1 h-10 px-5 py-0 text-black border border-solid border-twitter rounded-2xl font-medium font-xs"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <button type="submit" className="absolute right-0 bg-twitter h-10 w-10 px-0 py-2.5 text-center rounded-3xl text-xs">
          <span className="text-white">&rarr;</span>
        </button>
      </div>
      <label htmlFor="attach-file" className="text-twitter cursor-pointer">
        <span className="mr-2.5 font-xs">Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="opacity-0"
      />
      {attachment && (
        <div className="flex flex-col justify-center">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
            alt="attached"
          />
          <div className="text-twitter cursor-pointer text-center" onClick={onClearAttachment}>
            <span className="mr-2.5 text-xs">Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
