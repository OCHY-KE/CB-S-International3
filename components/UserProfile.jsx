import React, { useState } from 'react';
import styles from '../src/styles/UserProfile.module.css';

const UserProfile = ({ user = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  memberSince: "March 2023",
  avatar: "https://ui-avatars.com/api/?name=Jane+Doe&background=1a472a&color=fff",
  phone: "+254 712 345 678",
  location: "Nairobi, Kenya"
} }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const upcomingSafaris = [
    { id: 1, destination: "Maasai Mara", date: "Oct 12, 2024", status: "Confirmed" },
    { id: 2, destination: "Amboseli National Park", date: "Dec 05, 2024", status: "Pending" },
  ];

  return (
    <div className={styles.container}>
      {/* Profile Sidebar/Header */}
      <aside className={styles.sidebar}>
        <div className={styles.avatarWrapper}>
          <img src={user.avatar} alt={user.name} className={styles.avatar} />
          <button className={styles.editAvatar}>Edit</button>
        </div>
        <h2 className={styles.userName}>{user.name}</h2>
        <p className={styles.userEmail}>{user.email}</p>
        <p className={styles.memberSince}>Member since {user.memberSince}</p>
        
        <div className={styles.sidebarNav}>
          <button 
            className={activeTab === 'overview' ? styles.activeTab : ''} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'settings' ? styles.activeTab : ''} 
            onClick={() => setActiveTab('settings')}
          >
            Account Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {activeTab === 'overview' ? (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Upcoming Bookings</h3>
            <div className={styles.bookingList}>
              {upcomingSafaris.map(safari => (
                <div key={safari.id} className={styles.bookingCard}>
                  <div>
                    <h4>{safari.destination}</h4>
                    <p>{safari.date}</p>
                  </div>
                  <span className={styles.statusBadge}>{safari.status}</span>
                </div>
              ))}
            </div>

            <h3 className={styles.sectionTitle}>Personal Details</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <label>Full Name</label>
                <p>{user.name}</p>
              </div>
              <div className={styles.detailItem}>
                <label>Phone Number</label>
                <p>{user.phone}</p>
              </div>
              <div className={styles.detailItem}>
                <label>Location</label>
                <p>{user.location}</p>
              </div>
            </div>
          </section>
        ) : (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Settings</h3>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input type="email" defaultValue={user.email} />
              </div>
              <div className={styles.formGroup}>
                <label>New Password</label>
                <input type="password" placeholder="Leave blank to keep current" />
              </div>
              <button type="submit" className={styles.saveButton}>Update Profile</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default UserProfile;