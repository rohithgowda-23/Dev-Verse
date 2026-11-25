import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ShieldAlert, RotateCw, Eye } from 'lucide-react';
import GameResultBanner from '../../components/GameResultBanner';

export default function SuspiciousRoomGame({
  question,
  slotNumber,
  slotState,
  onOutcome,
}) {
  const { roomTitle, hotspots } = question.payload;
  const isSolved = Boolean(slotState?.solved);

  const mountRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [projectedLabels, setProjectedLabels] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const selectedHotspot = hotspots.find((h) => h.id === selectedId) || null;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.065);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 50);
    camera.position.set(2.9, 2.5, 4.5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);
    } catch {
      return undefined;
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.4;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.target.set(0, 1.05, -0.6);

    // Monochrome Studio Lighting
    const ambient = new THREE.AmbientLight(0xd4d4d4, 0.65);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0xffffff, 2.0, 14);
    keyLight.position.set(0, 3.2, 0.5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xa3a3a3, 1.3, 10);
    rimLight.position.set(-2.5, 2.4, 2.0);
    scene.add(rimLight);

    // Floor & Grid
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.85, metalness: 0.2 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const grid = new THREE.GridHelper(8, 16, 0x404040, 0x1f1f1f);
    grid.position.y = 0.01;
    scene.add(grid);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.9 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8, 3.5, 0.15), wallMat);
    backWall.position.set(0, 1.75, -3.2);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.5, 8), wallMat);
    leftWall.position.set(-3.2, 1.75, 0);
    scene.add(leftWall);

    // Desk
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.1, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x262626, roughness: 0.5, metalness: 0.3 })
    );
    deskTop.position.set(0, 0.8, -1.0);
    scene.add(deskTop);

    const legGeo = new THREE.BoxGeometry(0.1, 0.8, 1.2);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x404040 });
    const legL = new THREE.Mesh(legGeo, legMat);
    legL.position.set(-1.45, 0.4, -1.0);
    const legR = new THREE.Mesh(legGeo, legMat);
    legR.position.set(1.45, 0.4, -1.0);
    scene.add(legL, legR);

    // Computer Monitor
    const monitorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.72, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.5 })
    );
    monitorFrame.position.set(0, 1.38, -1.25);
    scene.add(monitorFrame);

    const monitorScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.04, 0.6),
      new THREE.MeshBasicMaterial({ color: 0xd4d4d4 })
    );
    monitorScreen.position.set(0, 1.38, -1.205);
    scene.add(monitorScreen);

    // Documents
    const docMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.02, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5 })
    );
    docMesh.position.set(1.05, 0.86, -0.9);
    docMesh.rotation.y = 0.18;
    scene.add(docMesh);

    // Desk Badge
    const badgeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.02, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xa3a3a3 })
    );
    badgeMesh.position.set(-1.1, 0.86, -0.8);
    scene.add(badgeMesh);

    // Storage NAS
    const nasMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.65, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x262626, metalness: 0.6, roughness: 0.3 })
    );
    nasMesh.position.set(2.2, 0.35, 0.5);
    scene.add(nasMesh);

    // Server Rack
    const rackMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 2.2, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5 })
    );
    rackMesh.position.set(2.4, 1.1, -2.3);
    scene.add(rackMesh);

    // Corner CCTV Camera (Monochrome)
    const cctvGroup = new THREE.Group();
    cctvGroup.position.set(-2.6, 2.55, -2.5);
    const camBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.2, 0.48),
      new THREE.MeshStandardMaterial({ color: 0x525252, metalness: 0.4 })
    );
    camBody.rotation.y = Math.PI / 4;
    camBody.rotation.x = 0.35;
    cctvGroup.add(camBody);

    const camTape = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.14, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9 })
    );
    camTape.position.set(0.16, -0.06, 0.16);
    camTape.rotation.y = Math.PI / 4;
    cctvGroup.add(camTape);

    const camLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    camLed.position.set(0.12, 0.08, 0.14);
    cctvGroup.add(camLed);
    scene.add(cctvGroup);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 380;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(handleResize);
      ro.observe(container);
    }

    let animId = null;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = window.requestAnimationFrame(animate);
      if (document.hidden) return;
      const t = clock.getElapsedTime();
      camLed.visible = Math.sin(t * 5) > 0;
      controls.update();
      renderer.render(scene, camera);

      const w = container.clientWidth || 720;
      const h = container.clientHeight || 380;
      if (w === 0 || h === 0) return;
      const projected = hotspots.map((hs) => {
        const vec = new THREE.Vector3(...hs.position);
        vec.project(camera);
        return {
          id: hs.id,
          label: hs.label,
          x: ((vec.x + 1) / 2) * w,
          y: ((-vec.y + 1) / 2) * h,
          visible: vec.z < 1,
        };
      });
      setProjectedLabels(projected);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
      if (animId) window.cancelAnimationFrame(animId);
      controls.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [hotspots]);

  const handleFlag = () => {
    if (isSolved || !selectedHotspot) return;
    if (selectedHotspot.isSuspicious) {
      setFeedback(null);
      onOutcome({ isCorrect: true });
    } else {
      setFeedback(true);
      onOutcome({ isCorrect: false });
    }
  };

  return (
    <div className="glass-card glass-card-glow" style={{ padding: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <span className="badge badge-cyan">QUESTION 0{slotNumber} // 3D INVESTIGATION ROOM</span>
        <span className="badge badge-cyan">
          <RotateCw size={13} /> Drag to Orbit • Scroll/Pinch to Zoom
        </span>
      </div>

      <p style={{ color: '#a3a3a3', marginBottom: '14px', fontSize: '0.94rem' }}>
        {roomTitle}: Rotate the 3D room and tap any hotspot tag to inspect the object for signs of tampering.
      </p>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '380px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          marginBottom: '18px',
          touchAction: 'none',
        }}
      >
        <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

        {projectedLabels.map((item) => {
          if (!item.visible) return null;
          const active = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedId(item.id);
                setFeedback(null);
              }}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: 'translate(-50%, -50%)',
                padding: '5px 10px',
                borderRadius: '999px',
                border: `1.5px solid ${active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'}`,
                background: active ? '#ffffff' : '#000000',
                color: active ? '#050505' : '#ffffff',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
              }}
            >
              <Eye size={12} /> {item.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          background: '#000000',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            {selectedHotspot ? selectedHotspot.label : 'Select a 3D hotspot above'}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#a3a3a3' }}>
            {selectedHotspot
              ? selectedHotspot.inspectionNote
              : 'Rotate the 3D room to check the desk, terminal, documents, storage NAS, and corner CCTV.'}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={isSolved || !selectedHotspot}
          onClick={handleFlag}
        >
          <ShieldAlert size={16} /> Flag Suspicious Object
        </button>
      </div>

      <GameResultBanner solved={isSolved} feedback={feedback} />
    </div>
  );
}
