import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad" | "onError"> {
  /** Image source URL */
  src: string;
  /** Alt text (required for SEO) */
  alt: string;
  /** Optional width for intrinsic sizing */
  width?: number;
  /** Optional height for intrinsic sizing */
  height?: number;
  /** Priority loading (above-the-fold images) — disables lazy loading */
  priority?: boolean;
  /** Blur placeholder color while loading */
  placeholderColor?: string;
  /** Sizes attribute for responsive images */
  sizes?: string;
}

/**
 * Optimized image component with:
 * - Native lazy loading (loading="lazy") for below-fold images
 * - Intersection Observer for fade-in animation
 * - fetchpriority="high" for above-fold images
 * - width/height to prevent CLS (Cumulative Layout Shift)
 * - Blur-up placeholder effect
 * - decoding="async" for non-blocking decode
 * - Proper alt text for SEO
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholderColor = "hsl(var(--muted))",
  sizes,
  className,
  style,
  ...rest
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <img
      ref={imgRef}
      src={inView ? src : undefined}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onLoad={() => setLoaded(true)}
      className={cn(
        "transition-opacity duration-500",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        backgroundColor: loaded ? undefined : placeholderColor,
        ...style,
      }}
      {...rest}
    />
  );
}
