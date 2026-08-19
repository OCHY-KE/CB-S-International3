import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/UserProfile.module.css';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  LogOut, Edit2, Save, X, Loader2, CheckCircle, AlertCircle 
} from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    location: '',
    bio: ''
  });

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        navigate('/login');
        return;
      }

      setUser(authUser);

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, phone, location, bio`)
        .eq('id', authUser.id)
        .single();

      if (error && status !== 406) throw error;
      
      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || ''
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile data.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  async function updateProfile(e) {
    e.preventDefault();
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();

      const updates = {
        id: user.id,
        ...profileData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditMode(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={styles.loaderPage}>
        <Loader2 className={styles.spinner} size={48} />
        <p>Fetching your adventure profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarCircle}>
              {profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : <User size={32} />}
            </div>
            <div className={styles.headerText}>
              <h1>{profileData.full_name || 'Safari Traveler'}</h1>
              <span className={styles.emailBadge}>
                <Mail size={14} /> {user?.email}
              </span>
            </div>
          </div>
          
          <button 
            type="button"
            className={editMode ? styles.cancelBtn : styles.editBtn}
            onClick={() => {
                setEditMode(!editMode);
                setMessage({ type: '', text: '' });
            }}
          >
            {editMode ? <><X size={18} /> Cancel</> : <><Edit2 size={18} /> Edit Profile</>}
          </button>
        </div>

        {/* Status Messages */}
        {message.text && (
          <div className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={updateProfile} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label><User size={16} /> Full Name</label>
              <input
                type="text"
                disabled={!editMode}
                value={profileData.full_name}
                onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                placeholder="e.g. David Sheldrick"
              />
            </div>

            <div className={styles.inputGroup}>
              <label><Phone size={16} /> Phone Number</label>
              <input
                type="tel"
                disabled={!editMode}
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                placeholder="+254 700 000000"
              />
            </div>

            <div className={styles.inputGroup}>
              <label><MapPin size={16} /> Location</label>
              <input
                type="text"
                disabled={!editMode}
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                placeholder="e.g. Maasai Mara, Kenya"
              />
            </div>

            <div className={styles.inputGroup}>
              <label><Calendar size={16} /> Member Since</label>
              <input
                type="text"
                disabled
                className={styles.disabledInput}
                value={new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              />
            </div>
          </div>

          <div className={styles.inputGroupFull}>
            <label>Travel Bio & Interests</label>
            <textarea
              disabled={!editMode}
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              placeholder="Tell us about your favorite safari destinations or wildlife interests..."
              rows="4"
            />
          </div>

          {editMode && (
            <div className={styles.actionArea}>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? <Loader2 className={styles.spinner} size={18} /> : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          )}
        </form>

        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;