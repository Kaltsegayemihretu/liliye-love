import React, { useState, useEffect } from 'react';
import { Image, Video, Plus, Trash2, Edit2, Upload, Check } from 'lucide-react';
import { api } from '../../services/api';
import { formatImageUrl } from '../../utils/image';

export default function AdminMedia() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // New photo modal state
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    imageUrl: '',
    caption: '',
    category: 'album',
    rotation: 0
  });

  const loadMedia = async () => {
    try {
      const [pData, vData] = await Promise.all([api.getPhotos(), api.getVideos()]);
      setPhotos(pData);
      setVideos(vData);
    } catch (err) {
      console.warn('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhoto(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newPhoto.imageUrl) return alert('Please enter an Image URL or upload a file.');

    try {
      const formatted = {
        ...newPhoto,
        imageUrl: formatImageUrl(newPhoto.imageUrl)
      };
      await api.addPhoto(formatted);
      setNewPhoto({ title: '', imageUrl: '', caption: '', category: 'album', rotation: 0 });
      loadMedia();
    } catch (err) {
      alert('Failed to add photo: ' + err.message);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await api.deletePhoto(id);
      loadMedia();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400 font-semibold">Loading Media Manager...</div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Image className="w-6 h-6 text-[#ff2a75]" />
          Photos & Videos Manager
        </h1>
        <p className="text-sm text-slate-600 font-semibold mt-1">
          Upload cutout stickers, album photos, and video memories.
        </p>
      </div>

      {/* ADD NEW PHOTO FORM */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#ff2a75]" />
          Add New Photograph / Cutout
        </h2>

        <form onSubmit={handleAddPhoto} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Image Caption</label>
              <input
                type="text"
                placeholder='e.g., "That day." or "Us."'
                value={newPhoto.caption}
                onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={newPhoto.category}
                onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-semibold"
              >
                <option value="album">Scrapbook Album</option>
                <option value="hero">Hero Cutout Floating Sticker</option>
                <option value="final">Final Section Photo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Image URL or Local File Upload</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="https://images.unsplash.com/... or base64 data"
                value={newPhoto.imageUrl}
                onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                className="flex-1 p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-mono"
              />
              <label className="px-5 py-3 rounded-2xl bg-white border-2 border-dashed border-[#ff2a75] text-[#ff2a75] text-xs font-bold hover:bg-[#ffe4ec] cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Image
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-[#ff2a75] text-white font-bold text-xs shadow-md hover:bg-[#e60067]"
          >
            Add Photo to Scrapbook
          </button>
        </form>
      </div>

      {/* EXISTING PHOTOS GALLERY */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">Current Scrapbook Photos ({photos.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo._id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md relative group">
              <img src={formatImageUrl(photo.imageUrl)} alt={photo.caption} className="w-full h-36 object-cover rounded-xl" />
              <div className="mt-2 text-center text-xs font-handwritten font-bold text-slate-800 truncate">
                {photo.caption || 'No Caption'}
              </div>
              <div className="mt-1 text-[10px] font-mono text-[#ff2a75] uppercase text-center font-bold">
                {photo.category}
              </div>

              <button
                onClick={() => handleDeletePhoto(photo._id)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:scale-110 transition-transform opacity-90 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
