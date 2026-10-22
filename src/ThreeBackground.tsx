import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  mode: string;
  activeProject: string;
};

declare global {
  interface Window {
    __TRIGGER_PARTICLE_PULSE__?: (
      intensity?: number
    ) => void;
  }
}

export default function ThreeBackground({
  mode,
  activeProject,
}: Props) {
  const mountRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch (err) {
      console.error(
        "WebGL initialization failed:",
        err
      );
      return;
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.5)
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera =
      new THREE.PerspectiveCamera(
        65,
        window.innerWidth /
          window.innerHeight,
        0.1,
        1000
      );

    camera.position.z = 18;

    const particleCount = 1200;

    const geometry =
      new THREE.BufferGeometry();

    const positions = new Float32Array(
      particleCount * 3
    );

    const scales = new Float32Array(
      particleCount
    );

    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      const i3 = i * 3;

      positions[i3] =
        (Math.random() - 0.5) * 45;

      positions[i3 + 1] =
        (Math.random() - 0.5) * 28;

      positions[i3 + 2] =
        (Math.random() - 0.5) * 22;

      scales[i] = Math.random();
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    geometry.setAttribute(
      "scale",
      new THREE.BufferAttribute(scales, 1)
    );

    const material =
      new THREE.PointsMaterial({
        color: 0x22d3ee,
        size: 0.07,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending:
          THREE.AdditiveBlending,
      });

    const particles = new THREE.Points(
      geometry,
      material
    );

    scene.add(particles);

    const mouse = {
      x: 0,
      y: 0,
    };

    const pulse = {
      value: 0,
    };

    window.__TRIGGER_PARTICLE_PULSE__ = (
      intensity = 1
    ) => {
      pulse.value = intensity;
    };

    const onMouseMove = (
      event: MouseEvent
    ) => {
      mouse.x =
        (event.clientX /
          window.innerWidth -
          0.5) *
        2;

      mouse.y =
        (event.clientY /
          window.innerHeight -
          0.5) *
        2;
    };

    window.addEventListener(
      "mousemove",
      onMouseMove
    );

    const clock = new THREE.Clock();

    let animationFrame = 0;

    const animate = () => {
      animationFrame =
        requestAnimationFrame(animate);

      const elapsed =
        clock.getElapsedTime();

      particles.rotation.y =
        elapsed * 0.025 +
        mouse.x * 0.12;

      particles.rotation.x =
        elapsed * 0.01 +
        mouse.y * 0.08;

      particles.position.x =
        mouse.x * 0.8;

      particles.position.y =
        -mouse.y * 0.6;

      const pulseScale =
        1 + pulse.value * 0.12;

      particles.scale.set(
        pulseScale,
        pulseScale,
        pulseScale
      );

      pulse.value *= 0.93;

      if (
        mode === "projects"
      ) {
        material.color.set(
          "#38bdf8"
        );
      } else if (
        mode === "contact"
      ) {
        material.color.set(
          "#a78bfa"
        );
      } else if (
        activeProject ===
        "creative-ui"
      ) {
        material.color.set(
          "#2dd4bf"
        );
      } else {
        material.color.set(
          "#22d3ee"
        );
      }

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener(
      "resize",
      onResize
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "mousemove",
        onMouseMove
      );

      window.removeEventListener(
        "resize",
        onResize
      );

      geometry.dispose();
      material.dispose();

      renderer.dispose();

      if (
        mount.contains(renderer.domElement)
      ) {
        mount.removeChild(
          renderer.domElement
        );
      }
    };
  }, [mode, activeProject]);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
