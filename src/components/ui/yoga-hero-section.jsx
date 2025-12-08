// YogaHeroSection.jsx - Yoga-themed version of the horizon hero
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

export const YogaHeroSection = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollProgressRef = useRef(null);
  const ctaRef = useRef(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
  const cameraVelocity = useRef({ x: 0, y: 0, z: 0 });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const threeRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    particles: [],
    lotus: null,
    mountains: [],
    animationId: null
  });

  // Initialize Three.js with yoga theme
  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;
      
      // Scene setup with warm yoga atmosphere
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0xf7f4f1, 0.00015);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      // Renderer with warm tones
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.8;

      // Post-processing with subtle bloom - simplified
      const canvas = canvasRef.current;
      if (canvas) {
        refs.composer = refs.renderer; // Use renderer directly for now
      }

      // Create yoga-themed scene elements
      createFloatingParticles();
      createLotusField();
      createZenMountains();
      createPeacefulAtmosphere();
      getLocation();

      // Start animation
      animate();
      
      // Mark as ready
      setIsReady(true);
    };

    const createFloatingParticles = () => {
      const { current: refs } = threeRefs;
      const particleCount = 2000;
      
      for (let i = 0; i < 2; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let j = 0; j < particleCount; j++) {
          const radius = 100 + Math.random() * 400;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          // Warm, peaceful colors (gold, cream, light orange)
          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.6) {
            color.setHSL(0.1, 0.3, 0.9 + Math.random() * 0.1); // Cream/white
          } else if (colorChoice < 0.9) {
            color.setHSL(0.08, 0.7, 0.8); // Golden
          } else {
            color.setHSL(0.05, 0.5, 0.85); // Light orange
          }
          
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 1.5 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              // Gentle floating motion like meditation
              float angle = time * 0.02 * (1.0 - depth * 0.5);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              // Add vertical floating
              pos.y += sin(time * 0.5 + pos.x * 0.01) * 5.0;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (200.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              opacity *= 0.8; // Softer appearance
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const particles = new THREE.Points(geometry, material);
        refs.scene.add(particles);
        refs.particles.push(particles);
      }
    };

    const createLotusField = () => {
      const { current: refs } = threeRefs;
      
      const geometry = new THREE.PlaneGeometry(6000, 3000, 80, 80);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0xf7f4f1) }, // Cream
          color2: { value: new THREE.Color(0xd4af37) }, // Gold
          opacity: { value: 0.15 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Gentle wave motion like breathing
            float elevation = sin(pos.x * 0.005 + time * 0.5) * cos(pos.y * 0.005 + time * 0.3) * 15.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 5.0 + time * 0.3) * cos(vUv.y * 5.0 + time * 0.2);
            vec3 color = mix(color1, color2, mixFactor * 0.3 + 0.7);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 1.5);
            alpha *= 1.0 + vElevation * 0.005;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const lotus = new THREE.Mesh(geometry, material);
      lotus.position.z = -800;
      lotus.rotation.x = 0;
      refs.scene.add(lotus);
      refs.lotus = lotus;
    };

    const createZenMountains = () => {
      const { current: refs } = threeRefs;
      
      // Zen-inspired mountain layers with warm colors
      const layers = [
        { distance: -50, height: 40, color: 0xf2ede8, opacity: 1 },
        { distance: -80, height: 60, color: 0xede8e2, opacity: 0.9 },
        { distance: -110, height: 80, color: 0xe8e0d5, opacity: 0.7 },
        { distance: -140, height: 100, color: 0xd4af37, opacity: 0.5 }
      ];

      layers.forEach((layer, index) => {
        const points = [];
        const segments = 40;
        
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 800;
          // Gentler, more flowing mountain shapes
          const y = Math.sin(i * 0.15) * layer.height * 0.8 + 
                   Math.sin(i * 0.08) * layer.height * 0.4 +
                   Math.random() * layer.height * 0.1 - 80;
          points.push(new THREE.Vector2(x, y));
        }
        
        points.push(new THREE.Vector2(4000, -200));
        points.push(new THREE.Vector2(-4000, -200));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance * 0.3;
        mountain.userData = { baseZ: layer.distance, index, baseOpacity: layer.opacity };
        refs.scene.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createPeacefulAtmosphere = () => {
      const { current: refs } = threeRefs;
      
      const geometry = new THREE.SphereGeometry(500, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.5);
            // Warm golden atmosphere
            vec3 atmosphere = vec3(1.0, 0.9, 0.7) * intensity;
            
            float pulse = sin(time * 1.0) * 0.05 + 0.95; // Very gentle pulse
            atmosphere *= pulse;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.15);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene.add(atmosphere);
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;

      // Update floating particles
      refs.particles.forEach((particleField, i) => {
        if (particleField.material.uniforms) {
          particleField.material.uniforms.time.value = time;
        }
      });

      // Update lotus field
      if (refs.lotus && refs.lotus.material.uniforms) {
        refs.lotus.material.uniforms.time.value = time * 0.3;
      }

      // Smooth camera movement
      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.03; // Even smoother for zen-like movement
        
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;
        
        // Gentle breathing-like motion
        const breathX = Math.sin(time * 0.05) * 1;
        const breathY = Math.cos(time * 0.08) * 0.5;
        
        refs.camera.position.x = smoothCameraPos.current.x + breathX;
        refs.camera.position.y = smoothCameraPos.current.y + breathY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 0, -400);
      }

      // Gentle mountain parallax
      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.3;
        mountain.position.x = Math.sin(time * 0.05) * 1 * parallaxFactor;
        mountain.position.y = 30 + (Math.cos(time * 0.08) * 0.5 * parallaxFactor);
      });

      if (refs.renderer) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };

    initThree();

    // Handle resize
    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      const { current: refs } = threeRefs;
      
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener('resize', handleResize);

      // Dispose resources
      refs.particles.forEach(particleField => {
        particleField.geometry.dispose();
        particleField.material.dispose();
      });

      refs.mountains.forEach(mountain => {
        mountain.geometry.dispose();
        mountain.material.dispose();
      });

      if (refs.lotus) {
        refs.lotus.geometry.dispose();
        refs.lotus.material.dispose();
      }

      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, []);

  const getLocation = () => {
    const { current: refs } = threeRefs;
    const locations = [];
    refs.mountains.forEach((mountain, i) => {
      locations[i] = mountain.position.z;
    });
    refs.locations = locations;
  };

  // GSAP Animations
  useEffect(() => {
    if (!isReady) return;
    
    gsap.set([titleRef.current, subtitleRef.current, scrollProgressRef.current, ctaRef.current], {
      visibility: 'visible'
    });

    const tl = gsap.timeline();

    // Animate title
    if (titleRef.current) {
      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 2,
        ease: "power4.out"
      });
    }

    // Animate subtitle
    if (subtitleRef.current) {
      tl.from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
      }, "-=1.5");
    }

    // Animate CTA buttons
    if (ctaRef.current) {
      tl.from(ctaRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      }, "-=1");
    }

    // Animate scroll indicator
    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5");
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  // Scroll handling - simplified for single hero section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const progress = Math.min(scrollY / (heroHeight * 0.8), 1); // Start fading at 80% of hero height
      
      setScrollProgress(progress);

      const { current: refs } = threeRefs;
      
      // Calculate opacity for fade out effect
      const fadeOpacity = Math.max(0, 1 - progress * 1.5);
      
      // Apply fade to canvas
      if (canvasRef.current) {
        canvasRef.current.style.opacity = fadeOpacity;
      }
      
      // Apply fade to content
      if (titleRef.current) {
        titleRef.current.style.opacity = fadeOpacity;
        titleRef.current.style.transform = `translateY(${progress * -50}px) scale(${1 - progress * 0.2})`;
      }
      
      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = fadeOpacity;
        subtitleRef.current.style.transform = `translateY(${progress * -30}px)`;
      }
      
      if (ctaRef.current) {
        ctaRef.current.style.opacity = fadeOpacity;
        ctaRef.current.style.transform = `translateY(${progress * -20}px)`;
      }
      
      if (scrollProgressRef.current) {
        scrollProgressRef.current.style.opacity = fadeOpacity;
      }

      // Simple parallax effect that doesn't interfere with other sections
      if (refs.camera) {
        const parallaxOffset = scrollY * 0.3;
        refs.camera.position.y = 20 + parallaxOffset * 0.1;
        refs.camera.position.z = 100 + parallaxOffset * 0.15;
        refs.camera.lookAt(0, 0, -400);
      }

      // Fade out particles as user scrolls past hero
      refs.particles.forEach((particleField) => {
        if (particleField.material.uniforms) {
          particleField.material.uniforms.opacity = { value: fadeOpacity * 0.8 };
        }
        if (particleField.material) {
          particleField.material.opacity = fadeOpacity;
        }
      });
      
      // Move mountains with scroll
      refs.mountains.forEach((mountain, i) => {
        const speed = 0.1 + i * 0.05;
        mountain.position.z = mountain.userData.baseZ + scrollY * speed;
        if (mountain.material) {
          mountain.material.opacity = fadeOpacity * mountain.userData.baseOpacity;
        }
      });
      
      if (refs.lotus) {
        refs.lotus.position.z = -800 + scrollY * 0.3;
        if (refs.lotus.material && refs.lotus.material.uniforms) {
          refs.lotus.material.uniforms.opacity.value = fadeOpacity * 0.15;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="yoga-hero-container">
      <canvas ref={canvasRef} className="yoga-hero-canvas" />
      
      {/* Main content */}
      <div className="yoga-hero-content">
        <h1 ref={titleRef} className="yoga-hero-title" style={{ visibility: 'hidden' }}>
          BREATHE
        </h1>
        
        <div ref={subtitleRef} className="yoga-hero-subtitle" style={{ visibility: 'hidden' }}>
          <p className="subtitle-line">
            Transform your life through ancient wisdom

          </p>
          <p className="subtitle-line">
            Find peace in movement, strength in stillness
          </p>
        </div>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="yoga-hero-cta" style={{ visibility: 'hidden' }}>
          <Link to="/services" className="cta-primary">
            Begin Your Journey
          </Link>
          <Link to="/demo" className="cta-outline">
            Book Free Session
          </Link>
        </div>

        {/* Floating Action Buttons */}
        <div className="floating-action-buttons" style={{ 
          opacity: scrollProgress < 0.3 ? 1 : 0,
          visibility: scrollProgress < 0.3 ? 'visible' : 'hidden'
        }}>
          <div className="credentials-banner">
            <span className="credentials-text">Certified YTTC-200 • Transforming Lives Since 2014</span>
          </div>
          <div className="floating-buttons">
            <Link to="/free-trial" className="floating-btn trial-btn">
              <span className="btn-icon">🎯</span>
              <span className="btn-text">Start Free Trial</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/batch-timings" className="floating-btn session-btn">
              <span className="btn-icon">📅</span>
              <span className="btn-text">Book a Session</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div ref={scrollProgressRef} className="yoga-scroll-progress" style={{ visibility: 'hidden' }}>
        <div className="scroll-text">SCROLL</div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="section-counter">
          {String(Math.floor(scrollProgress * 100)).padStart(2, '0')}%
        </div>
      </div>
    </div>
  );
};