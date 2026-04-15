import { useState, useReducer } from 'react';
import type { BlogComment, BlogReply } from '@/types/blog';

interface CommentsState {
    comments: BlogComment[];
    commentsCount: number;
}

type CommentsAction = 
    | { type: 'SET_COMMENTS'; payload: { comments: BlogComment[], count: number } }
    | { type: 'ADD_COMMENT'; payload: BlogComment }
    | { type: 'ADD_REPLY'; payload: { commentId: number, reply: BlogReply } };

function commentsReducer(state: CommentsState, action: CommentsAction): CommentsState {
    switch (action.type) {
        case 'SET_COMMENTS':
            return { 
                comments: action.payload.comments, 
                commentsCount: action.payload.count 
            };
        case 'ADD_COMMENT':
            return { 
                comments: [action.payload, ...state.comments], 
                commentsCount: state.commentsCount + 1 
            };
        case 'ADD_REPLY':
            return {
                commentsCount: state.commentsCount + 1,
                comments: state.comments.map(c => 
                    c.id === action.payload.commentId 
                        ? { ...c, replies: [...c.replies, action.payload.reply] }
                        : c
                )
            };
        default:
            return state;
    }
}

export function useComments(initialComments: BlogComment[], initialCount: number, postId: number) {
    const [state, dispatch] = useReducer(commentsReducer, { 
        comments: initialComments, 
        commentsCount: initialCount 
    });
    
    const [postingStatus, setPostingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const submitComment = async (name: string, email: string, content: string) => {
        setPostingStatus('submitting');
        setMessage('');

        try {
            const response = await fetch(`/api/public/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, content }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to post comment');

            dispatch({ type: 'ADD_COMMENT', payload: data.comment });
            setPostingStatus('success');
            setMessage('Your comment is awaiting moderation.');
            return true;
        } catch (err: any) {
            setPostingStatus('error');
            setMessage(err.message);
            return false;
        }
    };

    const submitReply = async (commentId: number, name: string, content: string) => {
        try {
            const response = await fetch(`/api/public/comments/${commentId}/replies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, content }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to post reply');

            dispatch({ type: 'ADD_REPLY', payload: { commentId, reply: data.reply } });
            return true;
        } catch (err: any) {
            console.error(err);
            return false;
        }
    };

    return {
        comments: state.comments,
        commentsCount: state.commentsCount,
        postingStatus,
        message,
        submitComment,
        submitReply,
        resetStatus: () => { setPostingStatus('idle'); setMessage(''); }
    };
}
