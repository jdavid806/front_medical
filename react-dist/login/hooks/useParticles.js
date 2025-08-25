import { useCallback } from 'react';
import { loadFull } from 'tsparticles';
export const useParticles = () => {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async container => {}, []);
  const particlesOptions = {
    particles: {
      number: {
        value: 85,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#505A67"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#3A4552"
        }
      },
      opacity: {
        value: 0.5,
        random: false
      },
      size: {
        value: 3,
        random: true
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#000000",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 2.22,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out"
      }
    },
    interactivity: {
      events: {
        onhover: {
          enable: false,
          mode: "repulse"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  };
  return {
    particlesInit,
    particlesLoaded,
    particlesOptions
  };
};