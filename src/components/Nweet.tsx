import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import last from "lodash/last";
import { INweet } from "../routes/Home";

interface INweetUpdateVariables {
  id: string;
  text: string
}

const Nweet = ({ nweetObj, isOwner }: any) => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const updateDoc = useMutation<INweet, AxiosError, INweetUpdateVariables>(
    ({ id, text }) => axios.patch<INweet>(`https://firestore.googleapis.com/v1/projects/tablelab-d9e2e/databases/(default)/documents/nweets/${id}?updateMask.fieldPaths=text`, {
      fields: {
        text: { stringValue: text },
      }
    }).then(({ data }: any) => ({
      id: last((data.name as string).split('/')),
      text: data.fields.text.stringValue,
      createdAt: Number(data.fields.createdAt.integerValue),
      creatorId: data.fields.creatorId.stringValue,
      attachmentUrl: data.fields.attachmentUrl.stringValue,
    } as INweet)),
    {
      async onSuccess(data) {
        await queryClient.cancelQueries(['nweets'])
        const previousNweets = queryClient.getQueryData<INweet[]>(['nweets'])
        queryClient.setQueryData<INweet[]>(['nweets'], (oldData = []) => oldData.map((item) => {
          if (item.id === data.id) return data;
          return item;
        }))

        return { previousNweets }
      },
      onError(error, variables, context: any) {
        queryClient.setQueryData(['nweets'], context.previousNweets)
      }
    }
  );

  const deleteDoc = useMutation(
    (id: string) => axios.delete(`https://firestore.googleapis.com/v1/projects/tablelab-d9e2e/databases/(default)/documents/nweets/${id}`).then(() => ({ id })), {
    async onSuccess(data) {
      console.log(data);
      await queryClient.cancelQueries(['nweets'])
      const previousNweets = queryClient.getQueryData<INweet[]>(['nweets'])
      queryClient.setQueryData<INweet[]>(['nweets'], (oldData = []) => oldData.filter((item) => item.id !== data.id))

      return { previousNweets }
    },
    onError(error, variables, context: any) {
      queryClient.setQueryData(['nweets'], context.previousNweets)
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
    await updateDoc.mutateAsync({
      id: nweetObj.id,
      text: newNweet,
    })
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
