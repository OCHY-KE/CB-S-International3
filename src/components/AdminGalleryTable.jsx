import React from 'react';
import { Edit3, Trash2, Film, Image as ImageIcon } from 'lucide-react';
import { GALLERY_CATEGORIES } from '../services/galleryService';
import styles from '../styles/AGT.module.css';

const AdminGalleryTable = ({
  items,
  loading,
  tableCategory,
  tableSearch,
  onCategoryChange,
  onSearchChange,
  onEdit,
  onDelete
}) => {
  return (
    <section className={styles.tableCard}>
      <div className={styles.tableToolbar}>
        <h2>Published Assets ({items.length})</h2>
        <div className={styles.tableFilters}>
          <select
            aria-label="Filter assets by category"
            value={tableCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={styles.tableSearchInput}
          >
            {GALLERY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by title or location..."
            value={tableSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.tableSearchInput}
          />
        </div>
      </div>

      <div className={styles.tableResponsive}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading gallery assets...</p>
        ) : items.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>No assets found matching criteria.</p>
        ) : (
          <table className={styles.mediaTable}>
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th>Category</th>
                <th>Format</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const previewUrl =
                  item.type === 'video'
                    ? item.posterUrl || item.mediaUrl
                    : item.mediaUrl || item.posterUrl;

                return (
                  <tr key={item.id}>
                    <td>
                      {previewUrl ? (
                        <img src={previewUrl} className={styles.tableThumb} alt={item.title} />
                      ) : (
                        <div className={styles.tableThumbPlaceholder}>
                          {item.type === 'video' ? <Film size={18} /> : <ImageIcon size={18} />}
                        </div>
                      )}
                    </td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.type === 'video' ? '🎬 Video' : '📷 Photo'}</td>
                    <td>
                      <div className={styles.actionBtnsRow}>
                        <button
                          type="button"
                          className={styles.iconActionBtn}
                          onClick={() => onEdit(item)}
                          title="Edit"
                          aria-label={`Edit ${item.title}`}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.iconActionBtn} ${styles.deleteBtn}`}
                          onClick={() => onDelete(item.id, item.title)}
                          title="Delete"
                          aria-label={`Delete ${item.title}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AdminGalleryTable;