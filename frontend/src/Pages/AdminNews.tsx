import React, { useState } from 'react';
import SideBar from '../components/SideBar';

const AdminNews: React.FC = () => {
  const [view, setView] = useState<'list' | 'edit'>('list'); // Toggle between 'list' and 'edit' views
  const [editType, setEditType] = useState<'news' | 'announcement' | null>(null); // Type of edit
  const [editId, setEditId] = useState<number | null>(null); // ID of the item being edited
  const [editTitle, setEditTitle] = useState<string>(''); // Title of the item being edited

  // Data for news and announcements
  const newsData = [
    { id: 1, title: 'So-Safe Corps Apprehend Two for Theft' },
    { id: 2, title: 'Enhanced Security Measures' },
    { id: 3, title: 'Community Outreach Program Success' },
    { id: 4, title: 'Training Program Graduates 200 Officers' },
  ];

  const announcementsData = [
    { id: 1, title: 'Protecting Our Community' },
    { id: 2, title: 'Professional Security Services' },
    { id: 3, title: 'Community Partnership' },
  ];

  // Handle Edit Button Click
  const handleEdit = (id: number, type: 'news' | 'announcement') => {
    setEditType(type);
    setEditId(id);

    // Find the item to edit based on type and ID, and set its title
    const data = type === 'news' ? newsData : announcementsData;
    const item = data.find((item) => item.id === id);
    setEditTitle(item?.title || '');

    setView('edit');
  };

  // Handle "Write New" Button Click
  const handleWriteNew = (type: 'news' | 'announcement') => {
    setEditType(type);
    setEditId(null); // No specific ID since this is a new entry
    setEditTitle(''); // Reset the title for new entries
    setView('edit');
  };

  // Handle Save and Back
  const handleSave = () => {
    console.log('Save the changes:', { editId, editType, editTitle });
    setView('list');
  };

  const handleBack = () => {
    setView('list');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-[#006838] text-white p-4 text-xl font-bold text-center">
          Admin News and Announcement Page
        </header>
        {view === 'list' ? (
          // List View
          <div className="flex-1 p-8">
            <h1 className="text-xl font-bold mb-4">Latest News</h1>
            <table className="w-full mb-4">
              <tbody>
                {newsData.map((news) => (
                  <tr key={news.id}>
                    <td className="p-2">{news.title}</td>
                    <td className="p-2 flex space-x-4 justify-end mr-20">
                      <button
                        onClick={() => handleEdit(news.id, 'news')}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => handleWriteNew('news')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg mb-8"
            >
              Write New News
            </button>

            <h1 className="text-xl font-bold mb-4">Latest Announcements</h1>
            <table className="w-full mb-4">
              <tbody>
                {announcementsData.map((announcement) => (
                  <tr key={announcement.id}>
                    <td className="p-2">{announcement.title}</td>
                    <td className="p-2 flex space-x-4 justify-end mr-20">
                      <button
                        onClick={() => handleEdit(announcement.id, 'announcement')}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => handleWriteNew('announcement')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Write New Announcement
            </button>
          </div>
        ) : (
          // Edit View
          <div className="p-8">
            <h1 className="text-xl font-bold mb-4">
              {editId
                ? `Edit ${editType === 'news' ? 'News' : 'Announcement'}`
                : `Write New ${editType === 'news' ? 'News' : 'Announcement'}`}
            </h1>
            <form className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter title"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <input
                  type="file"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={5}
                  placeholder="Enter content"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNews;
