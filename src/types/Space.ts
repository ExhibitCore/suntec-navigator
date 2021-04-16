// tslint:disable: variable-name
interface Space {
  id: number;
  client: number;
  linkedSpaceId: string;
  venueId: number;
  name: string;
  description: string;
  floorPlanFile: string;
  floorPlanWidth: number;
  floorPlanHeight: number;
  floorPlanFile3d: number[];
  floorNumber: string;
  spaceOffsetPoint: { x: number; y: number };
  spaceWidth: number;
  spaceHeight: number;
  spaceSqft: number;
}

export default Space;
