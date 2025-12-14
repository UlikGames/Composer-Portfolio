import { useRef, useEffect } from 'react';

/**
 * SplineScene - Spline 3D viewer wrapper component
 * Embed a Spline scene with responsive iframe
 * Prevents page scroll when hovering to allow zoom control
 */

interface SplineSceneProps {
    sceneUrl: string;
    className?: string;
}

export const SplineScene = ({
    sceneUrl,
    className = ''
}: SplineSceneProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!document.querySelector('script[data-spline-viewer]')) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://unpkg.com/@splinetool/viewer@1.12.16/build/spline-viewer.js';
            script.dataset.splineViewer = 'true';
            document.head.appendChild(script);
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Prevent page scroll when hovering over the 3D model
        const preventScroll = (e: WheelEvent) => {
            e.stopPropagation();
        };

        container.addEventListener('wheel', preventScroll, { passive: false });

        return () => {
            container.removeEventListener('wheel', preventScroll);
        };
    }, []);

    if (!sceneUrl) return null;

    return (
        <div
            ref={containerRef}
            className={`w-full h-full ${className}`}
        >
            {/* @ts-expect-error - spline-viewer is a web component loaded dynamically */}
            <spline-viewer
                loading-anim-type="spinner-small-dark"
                url={sceneUrl}
                aria-label="Interactive 3D model"
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};
