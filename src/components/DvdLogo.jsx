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
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [collisionEffect, setCollisionEffect] = useState(false);
  const [collisionEdge, setCollisionEdge] = useState('');
  const dvdRef = useRef(null);
  const animationRef = useRef(null);

  // Handle physics animation when there's velocity (after dragging)
  useEffect(() => {
    // Only animate if there's velocity (after a drag)
    if (isDragging || (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1)) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      if (!dvdRef.current) return;
      
      const dvdRect = dvdRef.current.getBoundingClientRect();
      const width = dvdRect.width;
      const height = dvdRect.height;
      
      let newX = position.x + velocity.x;
      let newY = position.y + velocity.y;
      let newVelocityX = velocity.x;
      let newVelocityY = velocity.y;
      let hasCollision = false;
      let edge = '';
      
      // Check for collisions with window boundaries
      if (newX + width > window.innerWidth) {
        newX = window.innerWidth - width;
        newVelocityX = -velocity.x * (0.8 + Math.random() * 0.4); // Add some randomness to bounce
        hasCollision = true;
        edge = 'right';
      } else if (newX < 0) {
        newX = 0;
        newVelocityX = -velocity.x * (0.8 + Math.random() * 0.4);
        hasCollision = true;
        edge = 'left';
      }
      
      if (newY + height > window.innerHeight) {
        newY = window.innerHeight - height;
        newVelocityY = -velocity.y * (0.8 + Math.random() * 0.4);
        hasCollision = true;
        edge = 'bottom';
      } else if (newY < 0) {
        newY = 0;
        newVelocityY = -velocity.y * (0.8 + Math.random() * 0.4);
        hasCollision = true;
        edge = 'top';
      }
      
      // Apply air resistance
      newVelocityX *= 0.97;
      newVelocityY *= 0.97;
      
      // Update state
      setPosition({ x: newX, y: newY });
      setVelocity({ x: newVelocityX, y: newVelocityY });
      
      // Trigger collision effect
      if (hasCollision) {
        setCollisionEffect(true);
        setCollisionEdge(edge);
        setTimeout(() => setCollisionEffect(false), 300);
      }
      
      // Stop animation when velocity becomes very small
      if (Math.abs(newVelocityX) < 0.1 && Math.abs(newVelocityY) < 0.1) {
        setVelocity({ x: 0, y: 0 });
        return;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, position, velocity]);

  // Refs for tracking drag state
  const prevPosRef = useRef({ x: 0, y: 0 });
  const hitWallRef = useRef(false);
  
  // Handle dragging
  useEffect(() => {
    // Update ref with current position
    prevPosRef.current = { x: position.x, y: position.y };
    
    const handleMouseMove = (e) => {
      if (isDragging && dvdRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep DVD within viewport bounds
        const dvdRect = dvdRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - dvdRect.width;
        const maxY = window.innerHeight - dvdRect.height;
        
        // Store current position for velocity calculation
        prevPosRef.current = { x: position.x, y: position.y };
        
        // Check for collisions during drag
        let hasCollision = false;
        let edge = '';
        let newVelocity = { x: 0, y: 0 };
        
        // Calculate drag speed for potential bounce (use more recent movement data)
        const dragSpeedX = Math.abs(e.movementX) > 0 ? e.movementX : (newX - position.x);
        const dragSpeedY = Math.abs(e.movementY) > 0 ? e.movementY : (newY - position.y);
        
        // Stronger bounce effect
        const bounceMultiplier = 3;
        
        if (newX <= 0) {
          hasCollision = true;
          edge = 'left';
          // Bounce right if hitting left wall with stronger effect
          newVelocity.x = Math.max(Math.abs(dragSpeedX) * bounceMultiplier, 5);
        } else if (newX >= maxX) {
          hasCollision = true;
          edge = 'right';
          // Bounce left if hitting right wall with stronger effect
          newVelocity.x = -Math.max(Math.abs(dragSpeedX) * bounceMultiplier, 5);
        }
        
        if (newY <= 0) {
          hasCollision = true;
          edge = 'top';
          // Bounce down if hitting top wall with stronger effect
          newVelocity.y = Math.max(Math.abs(dragSpeedY) * bounceMultiplier, 5);
        } else if (newY >= maxY) {
          hasCollision = true;
          edge = 'bottom';
          // Bounce up if hitting bottom wall with stronger effect
          newVelocity.y = -Math.max(Math.abs(dragSpeedY) * bounceMultiplier, 5);
        }
        
        // Update position first
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
        
        // Trigger collision effect if hitting an edge while dragging
        if (hasCollision && !hitWallRef.current) {
          hitWallRef.current = true;
          setCollisionEffect(true);
          setCollisionEdge(edge);
          
          // Apply a temporary bounce effect without releasing drag
          const tempPosition = { ...position };
          
          // Apply a small bounce in the opposite direction
          if (edge === 'left' || edge === 'right') {
            tempPosition.x += edge === 'left' ? 5 : -5;
          }
          if (edge === 'top' || edge === 'bottom') {
            tempPosition.y += edge === 'top' ? 5 : -5;
          }
          
          // Update position with bounce effect
          setPosition(tempPosition);
          
          // Reset collision effect after animation
          setTimeout(() => {
            setCollisionEffect(false);
            hitWallRef.current = false;
          }, 300);
        }
      }
    };

    const handleMouseUp = (e) => {
      if (isDragging) {
        // Check if we're at an edge
        const dvdRect = dvdRef.current?.getBoundingClientRect();
        if (dvdRect) {
          const maxX = window.innerWidth - dvdRect.width;
          const maxY = window.innerHeight - dvdRect.height;
          
          let hasCollision = false;
          let edge = '';
          let newVelocity = { x: 0, y: 0 };
          
          // Calculate drag speed for potential bounce
          const dragSpeedX = Math.abs(e.movementX) > 0 ? e.movementX : 0;
          const dragSpeedY = Math.abs(e.movementY) > 0 ? e.movementY : 0;
          
          // Stronger bounce effect
          const bounceMultiplier = 3;
          
          if (position.x <= 0) {
            hasCollision = true;
            edge = 'left';
            // Bounce right if hitting left wall with stronger effect
            newVelocity.x = Math.max(Math.abs(dragSpeedX) * bounceMultiplier, 5);
          } else if (position.x >= maxX) {
            hasCollision = true;
            edge = 'right';
            // Bounce left if hitting right wall with stronger effect
            newVelocity.x = -Math.max(Math.abs(dragSpeedX) * bounceMultiplier, 5);
          }
          
          if (position.y <= 0) {
            hasCollision = true;
            edge = 'top';
            // Bounce down if hitting top wall with stronger effect
            newVelocity.y = Math.max(Math.abs(dragSpeedY) * bounceMultiplier, 5);
          } else if (position.y >= maxY) {
            hasCollision = true;
            edge = 'bottom';
            // Bounce up if hitting bottom wall with stronger effect
            newVelocity.y = -Math.max(Math.abs(dragSpeedY) * bounceMultiplier, 5);
          }
          
          if (hasCollision) {
            // Apply bounce velocity
            setVelocity({
              x: newVelocity.x !== 0 ? newVelocity.x : 0,
              y: newVelocity.y !== 0 ? newVelocity.y : 0
            });
            
            // Show collision effect
            setCollisionEffect(true);
            setCollisionEdge(edge);
            setTimeout(() => setCollisionEffect(false), 300);
          } else {
            // Normal velocity calculation if not at an edge
            // Calculate new velocity based on mouse movement and position change
            // Use the larger of the two values for more responsive feel
            const positionChangeX = position.x - prevPosRef.current.x;
            const positionChangeY = position.y - prevPosRef.current.y;
            
            const mouseVelocityX = Math.abs(e.movementX) > Math.abs(positionChangeX) 
              ? e.movementX * 0.5 
              : positionChangeX * 0.5;
              
            const mouseVelocityY = Math.abs(e.movementY) > Math.abs(positionChangeY)
              ? e.movementY * 0.5
              : positionChangeY * 0.5;
            
            // Only update velocity if there was significant movement
            if (Math.abs(mouseVelocityX) > 0.5 || Math.abs(mouseVelocityY) > 0.5) {
              setVelocity({
                x: mouseVelocityX,
                y: mouseVelocityY
              });
            }
          }
        }
        
        // Reset wall hit tracking
        hitWallRef.current = false;
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position.x, position.y]);

  // Handle window resize with useCallback to avoid dependency issues
  const handleResize = React.useCallback(() => {
    if (dvdRef.current) {
      const dvdRect = dvdRef.current.getBoundingClientRect();
      const maxX = window.innerWidth - dvdRect.width;
      const maxY = window.innerHeight - dvdRect.height;
      
      setPosition(prev => ({
        x: Math.min(prev.x, maxX),
        y: Math.min(prev.y, maxY)
      }));
    }
  }, [dvdRef, position]);
  
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const handleMouseDown = (e) => {
    if (dvdRef.current) {
      const dvdRect = dvdRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - dvdRect.left,
        y: e.clientY - dvdRect.top
      });
      setIsDragging(true);
      // Stop any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
        transition: collisionEffect ? 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
        transform: collisionEffect 
          ? `scale(1.1) ${
              collisionEdge === 'left' || collisionEdge === 'right' 
                ? 'rotateY(10deg)' 
                : collisionEdge === 'top' || collisionEdge === 'bottom'
                  ? 'rotateX(10deg)'
                  : ''
            }`
          : 'scale(1)'
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
        className={`dvd-logo ${collisionEffect ? 'collision' : ''}`}
        onClick={handleClick}
        style={{
          position: 'absolute',
          left: '75px',  // Fixed position in the middle of container (300px - 150px)/2
          top: '75px',   // Fixed position in the middle of container (300px - 150px)/2
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #4A90E2 40%, #2171C7 80%, #1a5da0 100%)',
          borderRadius: '50%',
          boxShadow: collisionEffect 
            ? `0 0 25px rgba(255,255,255,0.8), inset 0 0 30px rgba(255,255,255,0.5)` 
            : '0 0 15px rgba(0,0,0,0.3), inset 0 0 30px rgba(255,255,255,0.2)',
          animation: 'spin 4s linear infinite',
          cursor: 'pointer',
          transition: 'box-shadow 0.3s ease'
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
