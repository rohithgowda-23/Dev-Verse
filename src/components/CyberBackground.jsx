import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Visible monochrome 3D background behind the question area + 30-second side-to-side decorative drift.
 */
export default function CyberBackground({ intensity = 'normal' }) {
  const mountRef = useRef(null);
  const [driftPhase, setDriftPhase] = useState(0); // Toggles every 30 seconds

  // 30-second decorative movement timer (pauses when tab is inactive)
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        setDriftPhase((prev) => (prev === 0 ? 1 : 0));
      }
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    let animationId = null;
    let renderer = null;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        58,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      camera.position.z = 11;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      container.appendChild(renderer.domElement);

      // Visible monochrome 3D wireframe polyhedron behind center questions
      const icoGeo = new THREE.IcosahedronGeometry(3.8, 1);
      const icoMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: intensity === 'subtle' ? 0.14 : 0.22,
      });
      const icosahedron = new THREE.Mesh(icoGeo, icoMat);
      icosahedron.position.set(0, 0.2, -2.5);
      scene.add(icosahedron);

      // Secondary monochrome orbital ring
      const torusGeo = new THREE.TorusGeometry(5.2, 0.04, 12, 72);
      const torusMat = new THREE.MeshBasicMaterial({
        color: 0xd4d4d4,
        transparent: true,
        opacity: intensity === 'subtle' ? 0.16 : 0.24,
      });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.position.set(0, 0.2, -2.5);
      torus.rotation.x = Math.PI / 3;
      scene.add(torus);

      // Floating geometric octahedrons that drift smoothly every 30s
      const floaters = [
        new THREE.Mesh(
          new THREE.OctahedronGeometry(0.45, 0),
          new THREE.MeshBasicMaterial({ color: 0xe5e5e5, wireframe: true, transparent: true, opacity: 0.28 })
        ),
        new THREE.Mesh(
          new THREE.OctahedronGeometry(0.35, 0),
          new THREE.MeshBasicMaterial({ color: 0xa3a3a3, wireframe: true, transparent: true, opacity: 0.25 })
        ),
      ];
      floaters[0].position.set(-4.5, 2.5, -1.5);
      floaters[1].position.set(4.5, -2.2, -1.5);
      scene.add(floaters[0], floaters[1]);

      // Monochrome particle field
      const particleCount = 130;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 26;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
      const particlesGeo = new THREE.BufferGeometry();
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particlesMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.085,
        transparent: true,
        opacity: intensity === 'subtle' ? 0.3 : 0.42,
      });
      const particles = new THREE.Points(particlesGeo, particlesMat);
      scene.add(particles);

      const handleResize = () => {
        if (!renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      let targetX = 0;
      const clock = new THREE.Clock();

      const animate = () => {
        animationId = window.requestAnimationFrame(animate);
        if (document.hidden) return;
        const t = clock.getElapsedTime();
        // Smooth 30-second cycle target interpolation
        const cyclePhase = Math.floor(t / 30) % 2;
        targetX = cyclePhase === 0 ? -2.2 : 2.2;
        icosahedron.position.x += (targetX * 0.45 - icosahedron.position.x) * 0.015;
        torus.position.x = icosahedron.position.x;

        floaters[0].position.x += ((cyclePhase === 0 ? -4.8 : 4.8) - floaters[0].position.x) * 0.012;
        floaters[1].position.x += ((cyclePhase === 0 ? 4.8 : -4.8) - floaters[1].position.x) * 0.012;
        floaters[0].rotation.y += 0.008;
        floaters[1].rotation.x += 0.008;

        icosahedron.rotation.y += 0.002;
        icosahedron.rotation.x += 0.001;
        torus.rotation.z -= 0.0015;
        particles.rotation.y += 0.0005;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationId) window.cancelAnimationFrame(animationId);
        icoGeo.dispose();
        icoMat.dispose();
        torusGeo.dispose();
        torusMat.dispose();
        particlesGeo.dispose();
        particlesMat.dispose();
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch {
      return undefined;
    }
  }, [intensity]);

  return (
    <>
      <div
        ref={mountRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Subtle 30-second drifting monochrome symbols behind questions */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          className="decorative-drift-item font-mono"
          style={{
            position: 'absolute',
            top: '18%',
            left: '20%',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.16)',
            transform: driftPhase === 0 ? 'translateX(0px)' : 'translateX(42vw)',
          }}
        >
          [ 0x4A // HASH_SYNC ]
        </div>
        <div
          className="decorative-drift-item font-mono"
          style={{
            position: 'absolute',
            bottom: '18%',
            right: '22%',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.16)',
            transform: driftPhase === 0 ? 'translateX(0px)' : 'translateX(-42vw)',
          }}
        >
          [ NODE_VERIFY :: 256-BIT ]
        </div>
      </div>
    </>
  );
}
