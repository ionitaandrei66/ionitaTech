import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface PlanetLayout {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
}

const SCENE_CONFIG = Object.freeze({
  background: 0x02040a,
  cameraFov: 35,
  cameraDistance: 7.2,
  planetRadius: 2.15,
  planetSegments: 128,
  planetModelUrl: '/Untitled.glb',
  starCount: 3200,
  idleRotationSpeed: 0.0007,
  scrollRotationPerPixel: 0.0022,
  scrollEasing: 0.07,
  layoutEasing: 0.08,
  maxPixelRatio: 2,
  maxMobilePixelRatio: 1.5,
  mobileBreakpoint: 768,
});

@Component({
  selector: 'app-planet-scene',
  template: '<div #canvasHost class="canvas-host"></div>',
  styleUrl: './planet-scene.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class PlanetSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasHost', { static: true })
  private readonly canvasHostRef!: ElementRef<HTMLDivElement>;

  private readonly ngZone = inject(NgZone);
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  private readonly scene = new THREE.Scene();
  private readonly planetHolder = new THREE.Group();
  private readonly camera = new THREE.PerspectiveCamera(SCENE_CONFIG.cameraFov, 1, 0.1, 2000);
  private renderer?: THREE.WebGLRenderer;
  private stars?: THREE.Points;
  private planet?: THREE.Mesh;
  private resizeObserver?: ResizeObserver;
  private animationFrameId: number | null = null;

  private idleRotation = 0;
  private scrollRotation = 0;
  private targetScrollRotation = 0;
  private targetLayout: PlanetLayout = { x: 0, y: 0, scale: 1 };

  public ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initRenderer();
      this.addLights();
      this.createStars();
      this.loadPlanet();
      this.observeResize();
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
      this.renderFrame();
    });
  }

  public ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('scroll', this.onScroll);
    this.resizeObserver?.disconnect();
    this.disposeObject(this.scene);
    this.renderer?.dispose();
  }

  private initRenderer(): void {
    const host = this.canvasHostRef.nativeElement;

    this.scene.background = new THREE.Color(SCENE_CONFIG.background);
    this.camera.position.set(0, 0, SCENE_CONFIG.cameraDistance);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.planetHolder);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';

    host.appendChild(this.renderer.domElement);
    this.onResize();
    this.applyLayout(1);
  }

  private addLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.025);

    const sideLight = new THREE.DirectionalLight(0xffffff, 9);
    sideLight.position.set(10, 1.5, 5);

    const softBlueBackLight = new THREE.DirectionalLight(0x5f8cff, 0.22);
    softBlueBackLight.position.set(-6, 1, -4);

    this.scene.add(ambientLight, sideLight, softBlueBackLight);
  }

  private createStars(): void {
    const positions = new Float32Array(SCENE_CONFIG.starCount * 3);

    for (let i = 0; i < SCENE_CONFIG.starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = -Math.random() * 100 - 10;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.9,
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  private loadPlanet(): void {
    new GLTFLoader().load(SCENE_CONFIG.planetModelUrl, (gltf: GLTF) => {
      const texture = this.extractColorTexture(gltf);

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(SCENE_CONFIG.planetRadius, SCENE_CONFIG.planetSegments, SCENE_CONFIG.planetSegments),
        new THREE.MeshStandardMaterial({ map: texture ?? undefined, roughness: 1, metalness: 0 }),
      );

      this.disposeObject(gltf.scene);
      this.planetHolder.clear();
      this.planetHolder.add(sphere);
      this.planet = sphere;
    });
  }

  private extractColorTexture(gltf: GLTF): THREE.Texture | null {
    let texture: THREE.Texture | null = null;

    gltf.scene.traverse((object) => {
      if (texture || !(object instanceof THREE.Mesh)) {
        return;
      }

      const material = Array.isArray(object.material) ? object.material[0] : object.material;
      const map = (material as THREE.MeshStandardMaterial).map;

      if (map) {
        texture = map.clone();
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
      }
    });

    return texture;
  }

  private readonly onScroll = (): void => {
    this.targetScrollRotation = window.scrollY * SCENE_CONFIG.scrollRotationPerPixel;
  };

  private readonly renderFrame = (): void => {
    if (!this.reducedMotion) {
      this.idleRotation += SCENE_CONFIG.idleRotationSpeed;
    }

    const easing = this.reducedMotion ? 1 : SCENE_CONFIG.scrollEasing;
    this.scrollRotation += (this.targetScrollRotation - this.scrollRotation) * easing;

    if (this.planet) {
      this.planet.rotation.y = this.idleRotation + this.scrollRotation;
    }

    if (this.stars) {
      this.stars.rotation.z = this.scrollRotation * 0.015;
    }

    this.applyLayout(SCENE_CONFIG.layoutEasing);
    this.renderer?.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.renderFrame);
  };

  private observeResize(): void {
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.canvasHostRef.nativeElement);
  }

  private onResize(): void {
    const host = this.canvasHostRef.nativeElement;
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;

    if (!this.renderer || !width || !height) {
      return;
    }

    const maxPixelRatio =
      width < SCENE_CONFIG.mobileBreakpoint ? SCENE_CONFIG.maxMobilePixelRatio : SCENE_CONFIG.maxPixelRatio;

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.targetLayout = this.computeLayout(this.camera.aspect);
  }

  private computeLayout(aspect: number): PlanetLayout {
    const halfHeight = SCENE_CONFIG.cameraDistance * Math.tan(THREE.MathUtils.degToRad(SCENE_CONFIG.cameraFov / 2));
    const halfWidth = halfHeight * aspect;

    if (aspect >= 1.1) {
      return { x: -halfWidth * 0.5, y: 0, scale: 1 };
    }

    return {
      x: 0,
      y: halfHeight * 0.3,
      scale: THREE.MathUtils.clamp(halfWidth / 2.6, 0.55, 0.9),
    };
  }

  private applyLayout(easing: number): void {
    const { position, scale } = this.planetHolder;

    position.x += (this.targetLayout.x - position.x) * easing;
    position.y += (this.targetLayout.y - position.y) * easing;
    scale.setScalar(scale.x + (this.targetLayout.scale - scale.x) * easing);
  }

  private disposeObject(root: THREE.Object3D): void {
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh) && !(object instanceof THREE.Points)) {
        return;
      }

      object.geometry.dispose();

      const materials: THREE.Material[] = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => material.dispose());
    });
  }
}
