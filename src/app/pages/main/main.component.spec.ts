import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PlanetSceneComponent } from '../components/scene/planet-scene.component';
import { MainComponent } from './main.component';

// WebGL is not available in headless test browsers, so the 3D scene is replaced by an empty stub
@Component({ selector: 'app-planet-scene', standalone: true, template: '' })
class PlanetSceneStubComponent {}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(MainComponent, {
        remove: { imports: [PlanetSceneComponent] },
        add: { imports: [PlanetSceneStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
