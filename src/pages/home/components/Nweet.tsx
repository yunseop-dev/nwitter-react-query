import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import useUpdateNweetMutation from "../hooks/mutations/useUpdateNweetMutation";
import useDeleteNweetMutation from "../hooks/mutations/useDeleteNweetMutation";

const Nweet = ({ nweetObj, isOwner }: any) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const updateDoc = useUpdateNweetMutation();
  const deleteDoc = useDeleteNweetMutation();

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
    await updateDoc.mutateAsync({
      id: nweetObj.id,
      text: newNweet,
    })
    setEditing(false);
  };

  return (
    <div className="flex flex-col text-black/75 relative rounded-xl p-5 max-w-xs w-full bg-white mb-5">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="flex flex-col w-full max-w-xs">
            <input
              onChange={onChange}
              value={newNweet}
              required
              placeholder="Edit your nweet"
              autoFocus
              className="w-full px-5 py-2.5 rounded-2xl border border-solid border-black text-center bg-white text-black"
            />
            <input type="submit" value="Update Nweet" className="cursor-pointer mt-4 mb-1" />
          </form>
          <button type="button" onClick={toggleEditing} className="cursor-pointer w-full px-5 py-2 text-center text-white rounded-2xl bg-red-600">
            Cancel
          </button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} width="50px" height="50px" alt="attached" />
          )}
          {isOwner && (
            <div className="absolute right-2.5 top-2.5">
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
