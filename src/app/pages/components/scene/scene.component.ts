import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-vending-viewer',
  standalone: true,
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css'],
})
export class SceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasHost', { static: true })
  private canvasHostRef!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private resizeObserver!: ResizeObserver;
  private animationFrameId: number | null = null;

  private planetHolder = new THREE.Group();
  private planetModel?: THREE.Mesh;

  private rotationBoost = 0;

  private isDragging = false;
  private lastPointerX = 0;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initThree();
    this.createStars();
    this.loadPlanet();
    this.startRenderLoop();
    this.observeResize();
    this.addPlanetScrollRotation();
    this.addMouseRotation();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('planet-scroll', this.onPlanetScroll);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);

    this.resizeObserver?.disconnect();
    this.controls?.dispose();

    this.scene?.traverse((object) => {
      const mesh = object as THREE.Mesh;

      if (!mesh.isMesh) {
        return;
      }

      mesh.geometry?.dispose();

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => material.dispose());
    });

    this.renderer?.dispose();
  }

  private initThree(): void {
    const host = this.canvasHostRef.nativeElement;
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x02040a);

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 2000);
    this.camera.position.set(0, 0, 7.2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';

    host.appendChild(this.renderer.domElement);

    this.planetHolder.position.set(-1.65, 0, 0);
    this.scene.add(this.planetHolder);

    this.camera.lookAt(this.planetHolder.position);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = false;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.025);
    this.scene.add(ambientLight);

    const sideLight = new THREE.DirectionalLight(0xffffff, 9);
    sideLight.position.set(10, 1.5, 5);
    this.scene.add(sideLight);

    const softBlueBackLight = new THREE.DirectionalLight(0x5f8cff, 0.22);
    softBlueBackLight.position.set(-6, 1, -4);
    this.scene.add(softBlueBackLight);
  }

  private createStars(): void {
    const geometry = new THREE.BufferGeometry();
    const count = 3200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = -Math.random() * 100 - 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.9,
    });

    this.scene.add(new THREE.Points(geometry, material));
  }

  private loadPlanet(): void {
    const loader = new GLTFLoader();

    loader.load('/Untitled.glb', (gltf: GLTF) => {
      let colorTexture: THREE.Texture | null = null;

      gltf.scene.traverse((object) => {
        const mesh = object as THREE.Mesh;

        if (!mesh.isMesh || !mesh.material || colorTexture) {
          return;
        }

        const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;

        if ((mat as THREE.MeshStandardMaterial).map) {
          colorTexture = (mat as THREE.MeshStandardMaterial).map!.clone();
          colorTexture.colorSpace = THREE.SRGBColorSpace;
          colorTexture.needsUpdate = true;
        }
      });

      const geometry = new THREE.SphereGeometry(2.15, 192, 192);

      const material = new THREE.MeshStandardMaterial({
        map: colorTexture ?? undefined,
        roughness: 1,
        metalness: 0,
      });

      const sphere = new THREE.Mesh(geometry, material);

      this.planetHolder.clear();
      this.planetHolder.add(sphere);

      this.planetModel = sphere;
    });
  }

  private startRenderLoop(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        if (this.planetModel) {
          this.planetModel.rotation.y += 0.0007 + this.rotationBoost;

          this.rotationBoost *= 0.91;

          if (Math.abs(this.rotationBoost) < 0.00001) {
            this.rotationBoost = 0;
          }
        }

        this.renderer.render(this.scene, this.camera);
        this.animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    });
  }

  private addPlanetScrollRotation(): void {
    window.addEventListener('planet-scroll', this.onPlanetScroll);
  }

  private onPlanetScroll = (event: Event): void => {
    const customEvent = event as CustomEvent<{ delta: number; force?: number }>;
    const delta = customEvent.detail?.delta ?? 0;

    const direction = delta > 0 ? 1 : -1;
    const strength = Math.min(Math.abs(delta) / 900, 1);

    this.rotationBoost += direction * (0.018 + strength * 0.022);
    this.rotationBoost = THREE.MathUtils.clamp(this.rotationBoost, -0.08, 0.08);
  };

  private addMouseRotation(): void {
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  private onPointerDown = (event: PointerEvent): void => {
    this.isDragging = true;
    this.lastPointerX = event.clientX;
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.isDragging || !this.planetModel) {
      return;
    }

    const deltaX = event.clientX - this.lastPointerX;
    this.lastPointerX = event.clientX;

    this.planetModel.rotation.y += deltaX * 0.006;
  };

  private onPointerUp = (): void => {
    this.isDragging = false;
  };

  private observeResize(): void {
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.canvasHostRef.nativeElement);
  }

  private onResize(): void {
    const host = this.canvasHostRef.nativeElement;
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;

    if (!width || !height) {
      return;
    }

    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
  }
}
