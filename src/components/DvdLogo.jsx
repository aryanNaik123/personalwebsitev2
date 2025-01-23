import React, { useState, useRef, useEffect } from 'react';
import './DvdLogo.css';
import { albumCovers } from '../albumCovers';

const DvdLogo = () => {
  const [showSelector, setShowSelector] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(0);
  const [albumImage, setAlbumImage] = useState(albumCovers[0].url);
  const [position, setPosition] = useState(() => ({
    x: window.innerWidth - 300,  // container width
    y: window.innerHeight - 300  // container height
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dvdRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && dvdRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep DVD within viewport bounds
        const dvdRect = dvdRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - dvdRect.width;
        const maxY = window.innerHeight - dvdRect.height;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e) => {
    if (dvdRef.current) {
      const dvdRect = dvdRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - dvdRect.left,
        y: e.clientY - dvdRect.top
      });
      setIsDragging(true);
    }
  };

  const handleClick = (e) => {
    if (!isDragging) {
      setShowSelector(!showSelector);
    }
  };


  return (
    <div 
      ref={dvdRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: '300px',
        height: '300px',
        overflow: 'visible',
        zIndex: isDragging ? 1001 : 1000,
        cursor: 'move',
        background: 'rgba(0, 0, 0, 0.001)',  // Extremely subtle background to make entire area draggable
        borderRadius: '8px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {showSelector && (
        <div 
          style={{
            position: 'absolute',
            ...(position.y < window.innerHeight / 2 
              ? {
                  top: '320px',
                  right: '20px',
                } : {
                  bottom: '320px',
                  right: '20px',
                }
            ),
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
        onClick={handleClick}
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
            draggable="false"
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
