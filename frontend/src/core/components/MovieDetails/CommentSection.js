import React, { useState } from 'react';
import classes from './CommentSection.module.css';

function CommentSection({ movieId }) {
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleContentChange = (event) => {
    setCommentContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!token) {
      setError('Bạn cần đăng nhập để bình luận.');
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8000/api/comments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        movieId: movieId,
        content: commentContent,
      })
    })
    .then(response => {
      setLoading(false);
      if (!response.ok) {
        if(response.status === 401){
          setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
        } else {
          setError('Có lỗi xảy ra khi gửi bình luận.');
        }
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      setCommentContent('');
      setError('');
      // Nếu bạn cần làm mới danh sách bình luận sau khi gửi thành công
      // refreshComments();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className={classes.commentSection}>
      <h3>Bình Luận</h3>
      <form onSubmit={handleSubmit} className={classes.form}>
        <textarea
          className={classes.textarea}
          value={commentContent}
          onChange={handleContentChange}
          placeholder="Viết bình luận của bạn..."
          disabled={loading}
        ></textarea>
        <button type="submit" className={classes.button} disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi'}
        </button>
      </form>
      {error && <p className={classes.error}>{error}</p>}
      {/* Nơi hiển thị danh sách bình luận */}
    </div>
  );
}

export default CommentSection;
