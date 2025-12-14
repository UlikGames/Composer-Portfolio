import { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * ModelViewer Component
 * A React wrapper for the @google/model-viewer web component
 * 
 * To use:
 * 1. Place your .glb/.gltf file at /public/models/
 * 2. Add a poster image (fallback) at /public/models/
 * 3. Customize rotation and camera settings via props
 */

interface ModelViewerProps {
    src: string;
    poster?: string;
    alt?: string;
    autoRotate?: boolean;
    rotationPerSecond?: string; // e.g., "30deg" for subtle, "90deg" for faster
    cameraOrbit?: string; // e.g., "0deg 75deg 105%" for viewing angle
    className?: string;
    shadowIntensity?: string; // "0" to "1"
    environmentImage?: string; // URL to HDR environment map
}

export const ModelViewer = ({
    src,
    poster,
    alt = '3D Model',
    autoRotate = true,
    rotationPerSecond = '15deg', // Very subtle rotation
    cameraOrbit = '0deg 75deg 105%',
    className,
    shadowIntensity = '0.3',
    environmentImage = 'neutral', // 'neutral' or custom HDR URL
}: ModelViewerProps) => {
    const viewerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Dynamically load the model-viewer script if not already loaded
        if (!customElements.get('model-viewer')) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
            document.head.appendChild(script);
        }
    }, []);

    return (
        // @ts-expect-error - model-viewer is a web component loaded dynamically
        <model-viewer
            ref={viewerRef}
            src={src}
            poster={poster}
            alt={alt}
            camera-orbit={cameraOrbit}
            auto-rotate={autoRotate ? '' : undefined}
            rotation-per-second={autoRotate ? rotationPerSecond : undefined}
            shadow-intensity={shadowIntensity}
            environment-image={environmentImage}
            camera-controls
            disable-zoom
            interaction-prompt="none"
            loading="lazy"
            className={cn(
                'w-full h-full',
                className
            )}
            style={{
                '--poster-color': 'transparent',
            } as React.CSSProperties}
        />
    );
};
