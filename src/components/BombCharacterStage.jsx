import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  tryAcquireAnimation,
  updateAnimationRect,
  releaseAnimation,
} from '../utils/animationCoordinator';

/**
 * 30-second repeating vertical Three.js 3D overlay spanning the ENTIRE question section:
 * 1. Large red 3D toy character walks vertically across the question area (alternating top->bottom / bottom->top)
 * 2. Toy throws a large red 3D cartoon bomb vertically over the question card
 * 3. Large red explosion (flash, shockwave, smoke, red particles) overlaps the question content
 * 4. Large white/silver metallic 3D "DEVVERSE" rises in an elevation-style reveal, then fades out
 * 5. Rendering pauses until the next 30-second cycle; pointer-events: none never blocks gameplay
 */
export default function BombCharacterStage() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    let renderer = null;
    let animId = null;
    let cycleTimer = null;
    let resizeObserver = null;

    try {
      const initW = container.clientWidth || 820;
      const initH = container.clientHeight || 620;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, initW / initH, 0.1, 50);
      camera.position.set(0, 0, 9.2);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(initW, initH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      // Studio lighting + dynamic red blast light
      const ambient = new THREE.AmbientLight(0xd4d4d4, 0.95);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
      keyLight.position.set(4, 6, 7);
      scene.add(keyLight);

      const blastLight = new THREE.PointLight(0xef4444, 0, 20);
      blastLight.position.set(0, 0, 2.2);
      scene.add(blastLight);

      // --- 1. Large Red 3D Toy / Anime-Style Character ---
      const charGroup = new THREE.Group();
      charGroup.scale.setScalar(1.65);
      scene.add(charGroup);

      const redToyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.28, metalness: 0.25 });
      const darkRedMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.35, metalness: 0.35 });
      const darkVisorMat = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.35, metalness: 0.5 });
      const silverMat = new THREE.MeshStandardMaterial({ color: 0xe5e5e5, roughness: 0.2, metalness: 0.78 });

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 22, 22), redToyMat);
      head.position.y = 0.65;
      charGroup.add(head);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.22, 0.24), darkVisorMat);
      visor.position.set(0, 0.66, 0.3);
      charGroup.add(visor);

      const eyeGeo = new THREE.SphereGeometry(0.055, 10, 10);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(-0.13, 0.67, 0.42);
      const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
      eyeR.position.set(0.13, 0.67, 0.42);
      charGroup.add(eyeL, eyeR);

      const antStem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.24, 8), silverMat);
      antStem.position.set(0, 1.12, 0);
      const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), redToyMat);
      antTip.position.set(0, 1.26, 0);
      charGroup.add(antStem, antTip);

      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 0.5, 16), darkRedMat);
      torso.position.y = 0.08;
      charGroup.add(torso);

      const armGeo = new THREE.CapsuleGeometry(0.08, 0.24, 6, 10);
      const leftArm = new THREE.Mesh(armGeo, redToyMat);
      leftArm.position.set(-0.32, 0.12, 0);
      const rightArm = new THREE.Mesh(armGeo, redToyMat);
      rightArm.position.set(0.32, 0.12, 0);
      charGroup.add(leftArm, rightArm);

      const legGeo = new THREE.CapsuleGeometry(0.085, 0.22, 6, 10);
      const leftLeg = new THREE.Mesh(legGeo, darkVisorMat);
      leftLeg.position.set(-0.13, -0.32, 0);
      const rightLeg = new THREE.Mesh(legGeo, darkVisorMat);
      rightLeg.position.set(0.13, -0.32, 0);
      charGroup.add(leftLeg, rightLeg);

      // --- 2. Large Red 3D Cartoon Bomb ---
      const bombGroup = new THREE.Group();
      const bombBodyMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.24, metalness: 0.35 });
      const bombBody = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 24), bombBodyMat);
      const bombCap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.18, 16), silverMat);
      bombCap.position.y = 0.48;
      const bombFuse = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.36, 8),
        new THREE.MeshBasicMaterial({ color: 0xfca5a5 })
      );
      bombFuse.position.set(0.08, 0.7, 0);
      bombFuse.rotation.z = -0.35;
      const bombSpark = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.14, 0),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      bombSpark.position.set(0.16, 0.88, 0);
      bombGroup.add(bombBody, bombCap, bombFuse, bombSpark);
      scene.add(bombGroup);

      // --- 3. Large Red Explosion (Overlapping Question Area) ---
      const explosionGroup = new THREE.Group();
      explosionGroup.position.set(0, 0, 1.1);
      scene.add(explosionGroup);

      const flashMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0 });
      const flashSphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 20), flashMat);
      explosionGroup.add(flashSphere);

      const shockMat = new THREE.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0, side: THREE.DoubleSide });
      const shockRing = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.85, 36), shockMat);
      explosionGroup.add(shockRing);

      const particles = [];
      for (let i = 0; i < 36; i += 1) {
        const isSmoke = i % 4 === 0;
        const pMat = new THREE.MeshStandardMaterial({
          color: isSmoke ? 0x404040 : i % 2 === 0 ? 0xef4444 : 0xdc2626,
          roughness: 0.6,
          transparent: true,
          opacity: 0,
        });
        const pGeo = isSmoke
          ? new THREE.SphereGeometry(0.32, 12, 12)
          : new THREE.OctahedronGeometry(0.15, 0);
        const mesh = new THREE.Mesh(pGeo, pMat);
        const angle = (i / 36) * Math.PI * 2;
        const speed = 2.6 + (i % 5) * 0.75;
        const vy = 0.65 + ((i * 7) % 5) * 0.55;
        const vz = ((i % 4) - 1.5) * 0.5;
        explosionGroup.add(mesh);
        particles.push({
          mesh,
          mat: pMat,
          vx: Math.cos(angle) * speed,
          vy,
          vz,
          isSmoke,
        });
      }

      // --- 4. Large White/Silver Metallic 3D "DEVVERSE" Elevation Reveal ---
      const textGroup = new THREE.Group();
      textGroup.position.set(0, 0, 1.3);
      scene.add(textGroup);

      const textCanvas = document.createElement('canvas');
      textCanvas.width = 1024;
      textCanvas.height = 256;
      const ctx = textCanvas.getContext('2d');
      ctx.clearRect(0, 0, 1024, 256);
      ctx.font = '800 148px "Plus Jakarta Sans", Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const grad = ctx.createLinearGradient(0, 35, 0, 220);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.6, '#f5f5f5');
      grad.addColorStop(1, '#a3a3a3');
      ctx.fillStyle = grad;
      ctx.fillText('DEVVERSE', 512, 128);

      const textTexture = new THREE.CanvasTexture(textCanvas);
      textTexture.needsUpdate = true;

      const textMaterials = [];
      // 8 extruded 3D depth layers for strong metallic depth & elevation shadow
      for (let layer = 7; layer >= 0; layer -= 1) {
        const isFront = layer === 0;
        const mat = new THREE.MeshBasicMaterial({
          map: textTexture,
          transparent: true,
          opacity: 0,
          color: isFront ? 0xffffff : layer < 4 ? 0xa3a3a3 : 0x404040,
        });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 1.7), mat);
        plane.position.z = -layer * 0.055;
        textGroup.add(plane);
        textMaterials.push({ mat, isFront });
      }

      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || initW;
        const h = container.clientHeight || initH;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
      }

      let sequenceStart = null;
      let running = false;
      let cycleCount = 0;
      const TOTAL_DURATION = 8.2;

      const resetEntities = () => {
        charGroup.visible = false;
        bombGroup.visible = false;
        explosionGroup.visible = false;
        textGroup.visible = false;
        blastLight.intensity = 0;
        flashMat.opacity = 0;
        shockMat.opacity = 0;
        particles.forEach((p) => {
          p.mat.opacity = 0;
          p.mesh.position.set(0, 0, 0);
        });
        textMaterials.forEach((tm) => {
          tm.mat.opacity = 0;
        });
      };

      const renderFrame = (nowMs) => {
        if (!running) return;
        if (document.hidden) {
          animId = window.requestAnimationFrame(renderFrame);
          return;
        }
        if (sequenceStart === null) sequenceStart = nowMs;
        const t = (nowMs - sequenceStart) / 1000;

        if (t >= TOTAL_DURATION) {
          running = false;
          releaseAnimation('bomb-stage');
          resetEntities();
          renderer.render(scene, camera);
          return;
        }

        // Continuously update reserved question-section bounding box during movement/scroll/resize
        if (container) {
          const r = container.getBoundingClientRect();
          updateAnimationRect('bomb-stage', {
            left: r.left,
            top: r.top,
            right: r.right,
            bottom: r.bottom,
          });
        }

        // Alternate direction: even cycles walk Top -> Bottom, odd cycles walk Bottom -> Top
        const topToBottom = cycleCount % 2 === 0;
        const startY = topToBottom ? 4.4 : -4.4;
        const endY = topToBottom ? -4.6 : 4.6;

        // 1. Large Red Toy walks vertically across the question area (0..4.8s)
        if (t <= 4.8) {
          charGroup.visible = true;
          const p = t / 4.8;
          charGroup.position.x = -2.1;
          charGroup.position.y = startY + (endY - startY) * p;
          charGroup.position.z = 0.8;
          charGroup.rotation.y = 0.42;
          leftLeg.rotation.x = Math.sin(t * 11) * 0.55;
          rightLeg.rotation.x = -Math.sin(t * 11) * 0.55;
          leftArm.rotation.x = -Math.sin(t * 11) * 0.4;
          if (t >= 1.4 && t <= 2.1) {
            rightArm.rotation.x = -((t - 1.4) / 0.7) * 2.1;
          } else {
            rightArm.rotation.x = Math.sin(t * 11) * 0.4;
          }
        } else {
          charGroup.visible = false;
        }

        // 2 & 3. Large Red Bomb held (0..1.85s), then thrown vertically over question content (1.85..3.25s)
        if (t < 1.85) {
          bombGroup.visible = true;
          bombGroup.position.set(charGroup.position.x + 0.75, charGroup.position.y + 0.35, 1.0);
          bombSpark.scale.setScalar(0.85 + Math.sin(t * 28) * 0.35);
        } else if (t >= 1.85 && t < 3.25) {
          bombGroup.visible = true;
          const bt = (t - 1.85) / 1.4;
          const throwStartY = topToBottom ? 1.15 : -1.15;
          bombGroup.position.x = -1.35 * (1 - bt);
          bombGroup.position.y = throwStartY * (1 - bt) + Math.sin(bt * Math.PI) * 1.35;
          bombGroup.position.z = 1.0 + Math.sin(bt * Math.PI) * 0.65;
          bombGroup.rotation.z -= 0.14;
          bombSpark.scale.setScalar(1.0 + Math.sin(t * 34) * 0.4);
        } else {
          bombGroup.visible = false;
        }

        // 4. Large Red Explosion overlapping the question area (3.25s .. 4.9s)
        if (t >= 3.25 && t < 4.9) {
          explosionGroup.visible = true;
          const et = (t - 3.25) / 1.65;
          blastLight.intensity = Math.max(0, (1 - et) * 7.0);

          flashSphere.scale.setScalar(1 + et * 5.2);
          flashMat.opacity = Math.max(0, 1 - et * 2.0);

          shockRing.scale.setScalar(1 + et * 7.2);
          shockMat.opacity = Math.max(0, 0.92 - et * 1.1);

          particles.forEach((p) => {
            p.mesh.position.x = p.vx * et * 1.6;
            p.mesh.position.y = p.vy * et * 1.25 - 0.9 * et * et;
            p.mesh.position.z = p.vz * et;
            p.mesh.rotation.x += 0.1;
            p.mesh.rotation.y += 0.12;
            const s = p.isSmoke ? 1 + et * 2.3 : Math.max(0.14, 1 - et * 0.6);
            p.mesh.scale.setScalar(s);
            p.mat.opacity = Math.max(0, 1 - et * 0.98);
          });
        } else {
          explosionGroup.visible = false;
          blastLight.intensity = 0;
        }

        // 5 & 6. Large White/Silver 3D "DEVVERSE" Elevation Reveal (3.85s .. 8.0s)
        if (t >= 3.85 && t <= 8.0) {
          textGroup.visible = true;
          const dt = t - 3.85;
          let alpha = 1;
          let scale = 1;
          let elevateZ = 1.3;
          let elevateY = 0;
          if (dt < 0.7) {
            const enter = dt / 0.7;
            alpha = enter;
            scale = 0.65 + enter * 0.35;
            elevateZ = 0.3 + enter * 1.1;
            elevateY = -0.5 + enter * 0.5;
          } else if (dt > 3.0) {
            const fade = (dt - 3.0) / 1.15;
            alpha = Math.max(0, 1 - fade);
            elevateZ = 1.4 + fade * 0.4;
          }
          textGroup.position.set(0, elevateY, elevateZ);
          textGroup.scale.setScalar(scale);
          textGroup.rotation.y = Math.sin(dt * 1.4) * 0.16;
          textGroup.rotation.x = Math.cos(dt * 1.2) * 0.06;
          textMaterials.forEach((tm) => {
            tm.mat.opacity = tm.isFront ? alpha : alpha * 0.65;
          });
        } else {
          textGroup.visible = false;
        }

        renderer.render(scene, camera);
        animId = window.requestAnimationFrame(renderFrame);
      };

      let retryTimer = null;

      const startCycle = () => {
        if (running || document.hidden) return;
        const r = container.getBoundingClientRect();
        const rect = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };

        if (!tryAcquireAnimation('bomb-stage', rect, TOTAL_DURATION * 1000)) {
          // Postpone cleanly without queuing duplicate timers
          if (!retryTimer) {
            retryTimer = window.setTimeout(() => {
              retryTimer = null;
              startCycle();
            }, 1200);
          }
          return;
        }

        cycleCount += 1;
        resetEntities();
        running = true;
        sequenceStart = null;
        animId = window.requestAnimationFrame(renderFrame);
      };

      startCycle();
      cycleTimer = window.setInterval(startCycle, 60000);

      return () => {
        releaseAnimation('bomb-stage');
        if (retryTimer) window.clearTimeout(retryTimer);
        if (cycleTimer) window.clearInterval(cycleTimer);
        if (resizeObserver) resizeObserver.disconnect();
        if (animId) window.cancelAnimationFrame(animId);
        textTexture.dispose();
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch {
      return undefined;
    }
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    />
  );
}
