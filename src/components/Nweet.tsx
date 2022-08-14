import { dbService } from "../fbase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { doc, updateDoc } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const Nweet = ({ nweetObj, isOwner }: any) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const deleteDoc = useMutation(
    (id) => axios.delete(`https://firestore.googleapis.com/v1/projects/tablelab-d9e2e/databases/(default)/documents/nweets/${id}`), {
    onSuccess(data) {
      console.log(data);
    },
    onError(error, variables, context) {
      console.log(error, variables, context);
    }
  })

  const onDeleteClick = async () => {
    const ok = window.confirm("삭제하시겠습니까?");

    if (ok) {
      await deleteDoc.mutateAsync(nweetObj.id);
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    await updateDoc(doc(dbService, `nweets/${nweetObj.id}`), { text: newNweet })
    setEditing(false);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              onChange={onChange}
              value={newNweet}
              required
              placeholder="Edit your nweet"
              autoFocus
              className="formInput"
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
