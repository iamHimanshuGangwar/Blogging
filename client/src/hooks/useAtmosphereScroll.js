import { useEffect } from 'react';

/**
 * Custom hook to implement Intersection Observer for Adaptive Atmosphere
 * Detects which section user is in and updates body[data-section] attribute
 */
const useAtmosphereScroll = () => {
  useEffect(() => {
    // Create an Intersection Observer with 50% threshold
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Get the section id from the element
            const sectionId = entry.target.id || entry.target.dataset.section;
            
            // Update body attribute
            if (sectionId) {
              document.body.setAttribute('data-section', sectionId);
              
              // Optional: Add a small haptic feedback / animation trigger
              // You can use this to trigger other effects
              window.dispatchEvent(
                new CustomEvent('section-change', { detail: { section: sectionId } })
              );
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
        rootMargin: '0px'
      }
    );

    // Observe all elements with [data-section] attribute
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    // Cleanup
    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);
};
export default useAtmosphereScroll;
