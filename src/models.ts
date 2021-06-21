export interface SearchResponse extends IBaseResponse {
  data: Array<Prefab>
}

export interface IBaseResponse {
  success: boolean
  message?: string
}

export interface Prefab extends IPrefab{
  isActive: boolean
}

export interface IPrefab {
  name: string
  pack: string
  type: string
  imagePath: string
  keywords: Array<string>
}