// tslint:disable: variable-name
interface Space {
  id: number;
  client: string;
  linked_space_id: string;
  venue_id: number;
  name: string;
  description: string;
  floor_plan_file: string;
  floor_plan_width: string;
  floor_plan_height: string;
  floor_plan_file_3d: string;
  floor_number: string;
  space_offset_point: string;
  space_width: string;
  space_height: string;
  space_sqft: string;
}

export default Space;
