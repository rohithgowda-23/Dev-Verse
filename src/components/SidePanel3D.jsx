import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Full-height monochrome 3D composition for Left (DEVVERSE) and Right (Investigation) side panels.
 */
export default function SidePanel3D({ variant = 'devverse' }) {
  const mountRef = useRef(null);
  const isRight = variant === 'investigation';

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    let animId = null;
    let renderer = null;
    let resizeObserver = null;

    try {
      const initW = container.clientWidth || (isRight ? 280 : 185);
      const initH = container.clientHeight || window.innerHeight || 720;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, initW / initH, 0.1, 50);
      camera.position.set(0, 0, isRight ? 7.8 : 7.0);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(initW, initH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      // Monochrome Studio Lighting
      const ambient = new THREE.AmbientLight(0xd4d4d4, 0.8);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(3, 5, 6);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight(0xe5e5e5, 1.8, 22);
      rimLight.position.set(-3, -3, 4);
      scene.add(rimLight);

      const group = new THREE.Group();
      scene.add(group);

      if (variant === 'devverse') {
        // Full-height vertical stack of monochrome 3D DEVVERSE geometric emblems
        const railGeo = new THREE.CylinderGeometry(0.012, 0.012, 7.2, 8);
        const railMat = new THREE.MeshBasicMaterial({ color: 0x404040, transparent: true, opacity: 0.55 });
        const railL = new THREE.Mesh(railGeo, railMat);
        railL.position.x = -1.35;
        const railR = new THREE.Mesh(railGeo, railMat);
        railR.position.x = 1.35;
        group.add(railL, railR);

        const topCore = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.85, 0),
          new THREE.MeshStandardMaterial({ color: 0x262626, metalness: 0.85, roughness: 0.2 })
        );
        topCore.position.y = 2.35;

        const topWire = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.18, 1),
          new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.35 })
        );
        topWire.position.y = 2.35;

        const midRing = new THREE.Mesh(
          new THREE.TorusGeometry(1.25, 0.03, 12, 48),
          new THREE.MeshBasicMaterial({ color: 0xd4d4d4, transparent: true, opacity: 0.55 })
        );
        midRing.rotation.x = Math.PI / 2.6;

        const botCrystal = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.8, 0),
          new THREE.MeshBasicMaterial({ color: 0xa3a3a3, wireframe: true, transparent: true, opacity: 0.45 })
        );
        botCrystal.position.y = -2.35;

        group.add(topCore, topWire, midRing, botCrystal);
      } else {
        // Full-height Right-Side Monochrome 3D Cyber-Investigation Composition
        const spineGeo = new THREE.CylinderGeometry(0.012, 0.012, 7.6, 8);
        const spineMat = new THREE.MeshBasicMaterial({ color: 0x404040, transparent: true, opacity: 0.5 });
        const spine = new THREE.Mesh(spineGeo, spineMat);
        spine.position.set(0, 0, -1.2);
        group.add(spine);

        // Upper: Digital Fingerprint Concentric Scanner Rings
        const bioGroup = new THREE.Group();
        bioGroup.position.set(0, 2.25, -0.3);
        [0.42, 0.65, 0.88, 1.12, 1.35].forEach((r, idx) => {
          const arc = new THREE.Mesh(
            new THREE.TorusGeometry(r, 0.025, 10, 44, Math.PI * (1.35 + idx * 0.08)),
            new THREE.MeshBasicMaterial({
              color: idx % 2 === 0 ? 0xffffff : 0xa3a3a3,
              transparent: true,
              opacity: 0.65 - idx * 0.07,
            })
          );
          arc.rotation.z = idx * 0.75;
          bioGroup.add(arc);
        });
        group.add(bioGroup);

        // Center: Large 3D Chrome & Obsidian Magnifying Glass
        const magGroup = new THREE.Group();
        magGroup.position.set(0.05, 0.15, 0.55);

        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(1.18, 0.13, 24, 64),
          new THREE.MeshStandardMaterial({ color: 0xe5e5e5, metalness: 0.9, roughness: 0.14 })
        );
        magGroup.add(rim);

        const innerRim = new THREE.Mesh(
          new THREE.TorusGeometry(1.04, 0.025, 12, 64),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
        );
        magGroup.add(innerRim);

        const lens = new THREE.Mesh(
          new THREE.CylinderGeometry(1.04, 1.04, 0.06, 48),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.16,
            metalness: 0.2,
            roughness: 0.05,
          })
        );
        lens.rotation.x = Math.PI / 2;
        magGroup.add(lens);

        const collar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 0.28, 16),
          new THREE.MeshStandardMaterial({ color: 0xd4d4d4, metalness: 0.85, roughness: 0.2 })
        );
        collar.position.set(0.92, -0.92, 0);
        collar.rotation.z = Math.PI / 4;
        magGroup.add(collar);

        const handle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.15, 1.6, 20),
          new THREE.MeshStandardMaterial({ color: 0x171717, metalness: 0.7, roughness: 0.3 })
        );
        handle.position.set(1.48, -1.48, 0);
        handle.rotation.z = Math.PI / 4;
        magGroup.add(handle);
        group.add(magGroup);

        // Lower: Floating 3D Evidence Document Slabs & Encrypted Cube
        const docSlab = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 2.0, 0.08),
          new THREE.MeshStandardMaterial({ color: 0x171717, metalness: 0.5, roughness: 0.3 })
        );
        docSlab.position.set(-0.25, -2.05, -0.6);
        docSlab.rotation.set(0.08, 0.25, -0.08);
        group.add(docSlab);

        const docBar = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 0.1, 0.09),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 })
        );
        docBar.position.set(-0.25, -1.45, -0.56);
        docBar.rotation.set(0.08, 0.25, -0.08);
        group.add(docBar);

        const lowerWire = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.65, 0),
          new THREE.MeshBasicMaterial({ color: 0xa3a3a3, wireframe: true, transparent: true, opacity: 0.4 })
        );
        lowerWire.position.set(0.55, -2.55, 0.2);
        group.add(lowerWire);
      }

      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || initW;
        const h = container.clientHeight || initH;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
      }

      const clock = new THREE.Clock();
      const animate = () => {
        animId = window.requestAnimationFrame(animate);
        if (document.hidden) return;
        const t = clock.getElapsedTime();
        if (variant === 'devverse') {
          group.rotation.y = t * 0.48;
        } else {
          group.rotation.y = Math.sin(t * 0.45) * 0.32;
          group.position.y = Math.sin(t * 0.7) * 0.08;
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        if (resizeObserver) resizeObserver.disconnect();
        if (animId) window.cancelAnimationFrame(animId);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch {
      return undefined;
    }
  }, [variant, isRight]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        position: 'relative',
      }}
    />
  );
}
