import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { OlMapComponent } from '../ol-map/ol-map.component';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import * as Proj from 'ol/proj';

export const DEFAULT_LAT = -34.603490361131385;
export const DEFAULT_LON = -58.382037891217465;
export const DEFAULT_ANCHOR = [0.5, 1];
export const DEFAULT_ICON = 'data:image/png;base64,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';

@Component({
  selector: 'ol-map-marker',
  templateUrl: './ol-map-marker.component.html',
  styleUrls: ['./ol-map-marker.component.css']
})
export class OlMapMarkerComponent implements OnInit, OnDestroy {
  @Input() lat: number = DEFAULT_LAT;
  @Input() lon: number = DEFAULT_LON;
  @Input() icon: string = DEFAULT_ICON;
  @Input() anchor: any[] = DEFAULT_ANCHOR;

  constructor(private olMap: OlMapComponent) { }

  ngOnInit(): void {
    const marker = new Feature({
      geometry: new Point(Proj.fromLonLat([this.lon, this.lat]))
    });

    const icon = new Style({
      image: new Icon({
        anchor: this.anchor,
        src: this.icon
      })
    });

    marker.setStyle(icon);

    const vectorSource = new VectorSource({
        features: [marker]
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource
    });

    if (this.olMap.map) {
      this.olMap.setMarker(vectorLayer);
    } else {
      setTimeout(() => {
        this.ngOnInit();
      }, 10);
    }
  }

  ngOnDestroy() {}

}
