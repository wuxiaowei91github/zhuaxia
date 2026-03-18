import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Share2, Plus, Hash, LogIn, Send, X, Sparkles } from 'lucide-react';
import { Post, User, Lobster } from '../types';
import CreatePostModal from '../components/CreatePostModal';

interface CommunityProps {
  posts: Post[];
  user: User | null;
  lobsters: Lobster[];
  onShowLogin: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onCreatePost: (content: string, image?: string) => void;
}

export default function Community({ posts, user, lobsters, onShowLogin, onLike, onComment, onCreatePost }: CommunityProps) {
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleCommentSubmit = (postId: string) => {
    if (!commentContent.trim()) return;
    onComment(postId, commentContent);
    setCommentContent('');
    setCommentingId(null);
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">养虾人圈子</h1>
          <p className="text-white/50">交流心得，分享你的龙虾成长瞬间</p>
        </div>
        <button 
          onClick={() => {
            if (!user) onShowLogin();
            else setIsCreatePostOpen(true);
          }}
          className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          <span>发布动态</span>
        </button>
      </header>

      <AnimatePresence>
        {isCreatePostOpen && user && (
          <CreatePostModal
            user={user}
            lobsters={lobsters}
            onClose={() => setIsCreatePostOpen(false)}
            onSubmit={onCreatePost}
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          {posts.map((post, i) => {
            const hasLiked = user ? post.likes?.includes(user.id) : false;
            
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <img src={post.avatar} alt={post.user} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h3 className="font-bold">{post.user}</h3>
                      <p className="text-xs text-white/40">{post.time}</p>
                    </div>
                  </div>
                  <button className="text-white/30 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-white/80 leading-relaxed">{post.content}</p>

                {post.image && (
                  <div className="rounded-3xl overflow-hidden border border-white/10">
                    <img src={post.image} alt="Post content" className="w-full h-auto" referrerPolicy="no-referrer" />
                  </div>
                )}

                <div className="flex gap-6 pt-2">
                  <button 
                    onClick={() => { 
                      if (!user) onShowLogin();
                      else onLike(post.id);
                    }}
                    className={`flex items-center gap-2 transition-colors ${hasLiked ? 'text-red-500' : 'text-white/40 hover:text-red-500'}`}
                  >
                    <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-bold">{post.likes?.length || 0}</span>
                  </button>
                  <button 
                    onClick={() => { 
                      if (!user) onShowLogin();
                      else setCommentingId(commentingId === post.id ? null : post.id);
                    }}
                    className={`flex items-center gap-2 transition-colors ${commentingId === post.id ? 'text-brand-secondary' : 'text-white/40 hover:text-brand-secondary'}`}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm font-bold">{post.comments?.length || 0}</span>
                  </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {commentingId === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-white/5 overflow-hidden"
                    >
                      <div className="space-y-3">
                        {post.comments?.map((comment) => (
                          <div key={comment.id} className="flex gap-3 text-sm">
                            <div className="font-bold text-brand-secondary">{comment.user}:</div>
                            <div className="text-white/70">{comment.content}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                          placeholder="写下你的评论..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        />
                        <button 
                          onClick={() => handleCommentSubmit(post.id)}
                          className="p-2 bg-brand-primary text-white rounded-xl hover:scale-105 transition-transform"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {!user && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="p-12 text-center glass-card border-brand-primary/30 bg-gradient-to-b from-brand-primary/5 to-transparent space-y-6"
            >
              <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto">
                <LogIn className="w-10 h-10 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">加入养虾人社区</h3>
                <p className="text-white/40 text-sm mt-2">登录后即可发布动态、点赞互动，并结识更多虾友</p>
              </div>
              <button 
                onClick={onShowLogin}
                className="px-12 py-4 bg-brand-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-primary/20"
              >
                立即登录
              </button>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">热门话题</h3>
            <div className="space-y-3">
              {['超级龙虾进化指南', '克隆中心避坑', 'MCP工具包推荐', '今日喂养资料'].map((topic) => (
                <div key={topic} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <Hash className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">活跃养虾人</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <img 
                  key={i}
                  src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=crop&w=100&h=100`} 
                  className="w-10 h-10 rounded-full border-2 border-brand-dark"
                  alt="User"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
