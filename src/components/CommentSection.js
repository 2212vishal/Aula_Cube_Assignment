import React, { useState, useEffect } from 'react';
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

const CommentSection = () => {
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem('comments');
    return savedComments ? JSON.parse(savedComments) : [];
  });
  const [newComment, setNewComment] = useState('');
  const [replyIndex, setReplyIndex] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    sortComments(sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const addComment = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, { text: newComment, replies: [], timestamp: new Date().toLocaleString() }]);
      setNewComment('');
    }
  };

  const deleteComment = (index) => {
    const updatedComments = [...comments];
    updatedComments.splice(index, 1);
    setComments(updatedComments);
  };

  const addReply = (index) => {
    if (comments[index].replies.length < 3) {
      setReplyIndex(index);
    }
  };

  const saveReply = () => {
    if (replyText.trim() !== '') {
      const updatedComments = [...comments];
      updatedComments[replyIndex].replies.push({ text: replyText, timestamp: new Date().toLocaleString() });
      setComments(updatedComments);
      setReplyIndex(null);
      setReplyText('');
    }
  };

  const deleteReply = (commentIndex, replyIndex) => {
    const updatedComments = [...comments];
    updatedComments[commentIndex].replies.splice(replyIndex, 1);
    setComments(updatedComments);
  };

  const toggleStar = (index) => {
    const updatedComments = [...comments];
    updatedComments[index].starred = !updatedComments[index].starred;
    setComments(updatedComments);
  };

  const sortComments = (sortType) => {
    if (sortType === 'replies') {
      const sortedComments = [...comments].sort((a, b) => b.replies.length - a.replies.length);
      setComments(sortedComments);
    } else if (sortType === 'asc') {
      const sortedComments = [...comments].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setComments(sortedComments);
    } else if (sortType === 'desc') {
      const sortedComments = [...comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setComments(sortedComments);
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-4'>
        <textarea className='w-full h-32 p-3 border border-gray-300 rounded bg-gray-100 text-base resize-none' value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder='enter your comment...'/>
        <div className='flex justify-between flex-col sm:flex-row'>
          
          <select  className='p-2 focus:outline-none  focus:ring-4 border-2 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  ' onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sorting</option>
            <option value="replies">Number of Replies</option>
            <option value="asc">Date and Time (Ascending)</option>
            <option value="desc">Date and Time (Descending)</option>
          </select>

          <button onClick={addComment} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Post Comment</button>
        </div>
      </div>
      
      

      {comments.map((comment, commentIndex) => (
        <div key={commentIndex} className="flex flex-col gap-2 border border-gray-300 p-4 my-4">
          <div className='flex justify-between w-11/12'>
            <p className="font-bold">{comment.text}</p>
            <button onClick={() => toggleStar(commentIndex)} className="px-2 py-1 mt-2">
                {comment.starred ? <CiStar /> : <FaStar />}
            </button>
          </div>
          
          <p className="text-sm text-gray-500">{comment.timestamp}</p>
          
          {comment.replies.map((reply, replyIndex) => (
            <div key={replyIndex} className='flex flex-col ml-8 gap-2'>
              {/* <p className="font-bold w-full">{reply.text}</p> */}
              <p className="font-bold w-full" style={{ whiteSpace: 'pre-wrap' }}>{reply.text}</p>
              {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, fugit necessitatibus voluptate quisquam quo maiores consectetur corrupti. Odit dicta repellendus, fugit velit dolorum ratione. Id quisquam pariatur ipsa exercitationem sint.</p> */}
              <p className="text-sm text-gray-500">{reply.timestamp}</p>
              <button onClick={() => deleteReply(commentIndex, replyIndex)} className="w-40 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 p-1 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete-Reply</button>
            </div>
          ))}
          {comments[commentIndex].replies.length < 3 && (
            replyIndex === commentIndex ? (
              <div className="flex justify-center items-baseline gap-6 mt-2 flex-col sm:flex-row">
                <input
                  type="text"
                  placeholder="Enter your reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="border border-gray-300 pl-1 mt-1 mb-1 rounded"
                  style={{ height: "2.5rem" }}
                />
                <button onClick={saveReply} style={{ height: "2.5rem" }} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Add Reply</button>
              </div>
            ) : (
              <button onClick={() => addReply(commentIndex)} className="w-20  text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Reply</button>
            )
          )}
          <div className='flex justify-between w-11/12 '>
            <button onClick={() => deleteComment(commentIndex)} className=" text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Delete-Comment</button>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
