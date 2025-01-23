import React, { useState } from 'react';
import './DvdLogo.css';
import { albumCovers } from '../albumCovers';

const DvdLogo = () => {
  const [showSelector, setShowSelector] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(0);
  const [albumImage, setAlbumImage] = useState(albumCovers[0].url);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '300px',
        height: '300px',
        overflow: 'visible',
      }}
    >
      {showSelector && (
        <div 
          style={{
            position: 'absolute',
            bottom: '320px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#333',
            textAlign: 'center',
            width: '100%'
          }}>
            {albumCovers[selectedAlbum].name} - {albumCovers[selectedAlbum].artist}
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            flexWrap: 'wrap', 
            width: '100%',
            justifyContent: 'center'
          }}>
            {albumCovers.map((album, index) => (
              <button
                key={album.id}
                onClick={() => {
                  setSelectedAlbum(index);
                  setAlbumImage(album.url);
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  padding: 0,
                  border: index === selectedAlbum ? '2px solid #4A90E2' : '1px solid #ccc',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <img 
                  src={album.url} 
                  alt={album.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      <div
        className="dvd-logo"
        onClick={() => setShowSelector(!showSelector)}
        style={{
          position: 'absolute',
          left: '75px',  // Fixed position in the middle of container (300px - 150px)/2
          top: '75px',   // Fixed position in the middle of container (300px - 150px)/2
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #4A90E2 40%, #2171C7 80%, #1a5da0 100%)',
          borderRadius: '50%',
          boxShadow: '0 0 15px rgba(0,0,0,0.3), inset 0 0 30px rgba(255,255,255,0.2)',
          animation: 'spin 4s linear infinite',
          cursor: 'pointer'
        }}
      >
        <div className="reflection" />
        {albumImage && (
          <img
            src={albumImage}
            alt="Album Cover"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
              opacity: 0.85,  // Slightly transparent to blend with DVD effects
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DvdLogo;
