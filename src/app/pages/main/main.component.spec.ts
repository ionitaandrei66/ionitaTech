import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PlanetSceneComponent } from '../components/scene/planet-scene.component';
import { MainComponent } from './main.component';

@Component({ selector: 'app-planet-scene', standalone: true, changeDetection: ChangeDetectionStrategy.Eager,
 template: '' })
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
