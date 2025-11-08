export interface LocationKey {
  description: string;
  name: string;
  id: string;
  playerInfo?: string;
  isPlayerVisible?: boolean;
  position?: { x: number; y: number };
  style?: {
    fillColor: string;
    fillOpacity: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    textAlign: "LEFT" | "CENTER" | "RIGHT";
    textAlignVertical: "BOTTOM" | "MIDDLE" | "TOP";
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    padding: number;
  };
  textSize?: {
    width: "AUTO" | number;
    height: "AUTO" | number;
  };
  visible?: boolean;
}

export interface FogKey {
  id: string;
  name: string;
  type: "SHAPE" | "PATH";
  commands?: any[];
  fillRule?: string;
  width?: number;
  height?: number;
  shapeType?: "RECTANGLE" | "CIRCLE" | "TRIANGLE" | "HEXAGON";
  style: {
    fillColor: string;
    fillOpacity: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    strokeDash: number[];
  };
  position?: { x: number; y: number };
  visible?: boolean;
}
