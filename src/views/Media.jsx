import React, { useState, useEffect } from 'react';
import MediaService from '@services/MediaService.jsx';

const MediaUploadForm = () => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    const result = await MediaService.uploadMedia(file, tags.split(',').map(t => t.trim()));
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    } else {
      setFile(null);
      setTags('');
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">File</span>
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input file-input-bordered w-full text-base-content bg-base-200" 
              accept="image/*,video/*"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tags</span>
            </label>
            <input
              type="text"
              placeholder="Add tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input input-bordered w-full text-base-content bg-base-200 placeholder:text-base-content/70"
            />
          </div>
          <button 
            type="submit" 
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading || !file}
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

const MediaGallery = () => {
  const [filter, setFilter] = useState('all');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMedia = async () => {
    setLoading(true);
    setError('');
    const result = await MediaService.getMedia(filter);
    setLoading(false);

    if (result.success) {
      setMedia(result.data);
    } else {
      setError(result.error);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media?')) return;
    
    const result = await MediaService.deleteMedia(id);
    if (result.success) {
      loadMedia();
    } else {
      setError(result.error);
    }
  };

  if (loading) return <div className="loading loading-lg"></div>;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="mb-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered w-full max-w-xs text-base-content bg-base-200 placeholder:text-base-content/70"
          >
            <option value="all">All</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((item) => (
            <div key={item.id} className="card bg-base-200">
              <figure className="px-4 pt-4">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.filename} className="rounded-xl" />
                ) : (
                  <video src={item.url} controls className="rounded-xl" />
                )}
              </figure>
              <div className="card-body">
                <h3 className="card-title text-sm">{item.filename}</h3>
                <div className="flex flex-wrap gap-1">
                  {item.tags?.map((tag, index) => (
                    <span key={index} className="badge badge-primary">{tag}</span>
                  ))}
                </div>
                <div className="card-actions justify-end">
                  <button 
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MediaPage = () => {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Media Manager</h1>
      <div className="tabs tabs-boxed mb-4">
        <a 
          className={`tab ${activeTab === 'upload' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload
        </a>
        <a 
          className={`tab ${activeTab === 'gallery' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery
        </a>
      </div>
      {activeTab === 'upload' ? <MediaUploadForm /> : <MediaGallery />}
    </div>
  );
};

export default MediaPage;