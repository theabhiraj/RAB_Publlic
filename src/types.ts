export interface Room {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  icon?: string;
  opacity?: number;
}

export interface Element {
  id: string;
  type: 'door' | 'window' | 'stairs' | 'furniture';
  subType?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  icon: string;
  opacity?: number;
}

export interface Project {
  plotWidth: number;
  plotHeight: number;
  unit: 'feet' | 'meters';
  rooms: Room[];
  elements: Element[];
  hasBorder: boolean;
  borderThickness: number;
}
