import React, { useState } from 'react';
import SideBar from '../components/SideBar';

const AdminNews: React.FC = () => {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editType, setEditType] = useState<'news' | 'announcement' | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [showAllNews, setShowAllNews] = useState(false); // Toggle for showing all news
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false); // Toggle for showing all announcements

  const newsData = [
    { id: 1, title: 'So-Safe Corps Apprehend Two for Theft' },
    { id: 2, title: 'Enhanced Security Measures' },
    { id: 3, title: 'Community Outreach Program Success' },
    { id: 4, title: 'Training Program Graduates 200 Officers' },
    { id: 5, title: 'Smart City Initiative Launched' },
    { id: 6, title: 'Rural Security Task Force Established' },
    { id: 7, title: 'Youth Security Awareness Campaign Launches' },
    { id: 8, title: 'Emergency Response System Upgrade Complete' },
    { id: 9, title: 'Business District Security Enhancement' },
  ];

  const announcementsData = [
    { id: 1, title: 'Protecting Our Community' },
    { id: 2, title: 'Professional Security Services' },
    { id: 3, title: 'Community Partnership' },
    { id: 4, title: 'Technology Innovation in Security' },
    { id: 5, title: 'Youth Engagement Programs' },
  ];

  const handleEdit = (id: number, type: 'news' | 'announcement') => {
    setEditType(type);
    setEditId(id);
    const data = type === 'news' ? newsData : announcementsData;
    const item = data.find((item) => item.id === id);
    setEditTitle(item?.title || '');
    setView('edit');
  };

  const handleWriteNew = (type: 'news' | 'announcement') => {
    setEditType(type);
    setEditId(null);
    setEditTitle('');
    setView('edit');
  };

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
      <div className="flex-1 flex flex-col">
        <header className="bg-[#006838] text-white p-4 text-xl font-bold text-center">
          Admin News and Announcement Page
        </header>
        {view === 'list' ? (
          <div className="flex-1 overflow-y-auto p-8">
            <div>
              <h1 className="text-xl font-bold mb-2">Latest News</h1>
              <button
                onClick={() => handleWriteNew('news')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4"
              >
                Write New News
              </button>
              <div className="space-y-2">
                {(showAllNews ? newsData : newsData.slice(0, 4)).map((news) => (
                  <div key={news.id} className="flex justify-between items-center">
                    <span>{news.title}</span>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEdit(news.id, 'news')}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAllNews((prev) => !prev)}
                className="text-white bg-gray-400 px-2 py-1 rounded-lg mt-2"
              >
                {showAllNews ? 'Show Less' : 'Show More'}
              </button>
            </div>

            <div className="mt-8">
              <h1 className="text-xl font-bold mb-2">Latest Announcements</h1>
              <button
                onClick={() => handleWriteNew('announcement')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4"
              >
                Write New Announcement
              </button>
              <div className="space-y-2">
                {(showAllAnnouncements ? announcementsData : announcementsData.slice(0, 4)).map(
                  (announcement) => (
                    <div
                      key={announcement.id}
                      className="flex justify-between items-center"
                    >
                      <span>{announcement.title}</span>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEdit(announcement.id, 'announcement')}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                      </div>
                    </div>
                  )
                )}
              </div>
              <button
                onClick={() => setShowAllAnnouncements((prev) => !prev)}
                className="text-white bg-gray-400 px-2 py-1 rounded-lg mt-2"
              >
                {showAllAnnouncements ? 'Show Less' : 'Show More'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <h1 className="text-xl font-bold mb-4">
              {editId
                ? `Edit ${editType === 'news' ? 'News' : 'Announcement'}`
                : `Write New ${editType === 'news' ? 'News' : 'Announcement'}`}
            </h1>
            <form className="space-y-6">
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
              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <input type="file" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={5}
                  placeholder="Enter content"
                />
              </div>
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
