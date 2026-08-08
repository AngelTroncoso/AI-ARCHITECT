import React, { useEffect, useRef, useState } from 'react';
import { getLeaderAvatarUrl, OFFICIAL_LEADER_PHOTOS, AvatarStyle } from '../utils/avatars';

interface LeaderAvatarProps {
  leaderId: string;
  name: string;
  style?: AvatarStyle;
  companyColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

export const LeaderAvatar: React.FC<LeaderAvatarProps> = ({
  leaderId,
  name,
  style = 'comic',
  companyColor = '#00E0FF',
  size = 'md',
  className = '',
  showBadge = false,
}) => {
  const officialPhoto = OFFICIAL_LEADER_PHOTOS[leaderId] || getLeaderAvatarUrl(leaderId, 'photo');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 rounded-3xl',
  };

  const badgeSizeClasses = {
    sm: 'text-[8px] px-1 py-0.2',
    md: 'text-[9px] px-1.5 py-0.5',
    lg: 'text-[10px] px-2 py-0.5',
    xl: 'text-xs px-2.5 py-1',
  };

  useEffect(() => {
    let active = true;
    setCanvasReady(false);
    setLoadError(false);

    if (style === 'photo') {
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = officialPhoto;

    img.onload = () => {
      if (!active || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const renderDim = 128;
      canvas.width = renderDim;
      canvas.height = renderDim;

      if (style === 'pixel') {
        // Pixelate by downscaling official photo then upscaling without smoothing
        const px = 28;
        const offCanvas = document.createElement('canvas');
        offCanvas.width = px;
        offCanvas.height = px;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.drawImage(img, 0, 0, px, px);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(offCanvas, 0, 0, px, px, 0, 0, renderDim, renderDim);

          // Color quantization for 8-bit retro pixel art
          const imgData = ctx.getImageData(0, 0, renderDim, renderDim);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.floor(data[i] / 48) * 48;
            data[i + 1] = Math.floor(data[i + 1] / 48) * 48;
            data[i + 2] = Math.floor(data[i + 2] / 48) * 48;
          }
          ctx.putImageData(imgData, 0, 0);
        }
      } else if (style === 'comic') {
        // Pop-art comic filter applied directly to official photo
        ctx.filter = 'contrast(160%) saturate(180%) brightness(105%)';
        ctx.drawImage(img, 0, 0, renderDim, renderDim);

        const imgData = ctx.getImageData(0, 0, renderDim, renderDim);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.floor(data[i] / 64) * 64;
          data[i + 1] = Math.floor(data[i + 1] / 64) * 64;
          data[i + 2] = Math.floor(data[i + 2] / 64) * 64;
        }
        ctx.putImageData(imgData, 0, 0);
      } else if (style === 'anime') {
        // Anime cel-shading filter applied directly to official photo
        ctx.filter = 'contrast(150%) saturate(200%) brightness(110%)';
        ctx.drawImage(img, 0, 0, renderDim, renderDim);

        const imgData = ctx.getImageData(0, 0, renderDim, renderDim);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.floor(data[i] / 36) * 36 + 12);
          data[i + 1] = Math.min(255, Math.floor(data[i + 1] / 36) * 36 + 12);
          data[i + 2] = Math.min(255, Math.floor(data[i + 2] / 36) * 36 + 12);
        }
        ctx.putImageData(imgData, 0, 0);
      }

      setCanvasReady(true);
    };

    img.onerror = () => {
      if (active) setLoadError(true);
    };

    return () => {
      active = false;
    };
  }, [officialPhoto, style]);

  const fallbackStyleUrl = getLeaderAvatarUrl(leaderId, style as AvatarStyle);

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {style !== 'photo' && !loadError ? (
        <div className="relative">
          <canvas
            ref={canvasRef}
            className={`${sizeClasses[size]} object-cover shadow-lg transition-transform duration-200 hover:scale-105 bg-slate-900 border-2 ${
              canvasReady ? 'block' : 'hidden'
            }`}
            style={{ borderColor: companyColor }}
          />
          {!canvasReady && (
            <img
              src={officialPhoto}
              alt={name}
              referrerPolicy="no-referrer"
              onError={() => setLoadError(true)}
              className={`${sizeClasses[size]} object-cover shadow-lg transition-transform duration-200 hover:scale-105 bg-slate-900 border-2 ${
                style === 'comic'
                  ? 'contrast-150 saturate-150'
                  : style === 'pixel'
                  ? 'image-pixelated contrast-125'
                  : 'saturate-200 contrast-125'
              }`}
              style={{ borderColor: companyColor }}
            />
          )}
        </div>
      ) : (
        <img
          src={loadError ? fallbackStyleUrl : officialPhoto}
          alt={name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = fallbackStyleUrl;
          }}
          className={`${sizeClasses[size]} object-cover shadow-lg transition-transform duration-200 hover:scale-105 bg-slate-900 border-2`}
          style={{ borderColor: companyColor }}
        />
      )}

      {showBadge && (
        <span
          className={`absolute -bottom-1 -right-1 font-mono font-black uppercase rounded shadow-md border ${badgeSizeClasses[size]}`}
          style={{
            backgroundColor: '#090D16',
            borderColor: companyColor,
            color: companyColor,
          }}
        >
          {style === 'comic' ? 'COMIC' : style === 'pixel' ? 'PIXEL' : style === 'anime' ? 'MANGA' : 'PHOTO'}
        </span>
      )}
    </div>
  );
};

