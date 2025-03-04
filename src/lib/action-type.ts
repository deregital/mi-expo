export interface ActionResponse<T> {
  success: boolean;
  errors?: string | string[];
  inputs?: T;
}
