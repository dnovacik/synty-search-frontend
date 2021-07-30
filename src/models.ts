export interface SearchResponse extends IBaseResponse {
  data: Array<IPrefab>
}

export interface IBaseResponse {
  success: boolean
  message?: string
}

export interface IPrefab {
  name: string
  pack: string
  type: string
  imagePath: string
  packStoreUrl: string
  keywords: Array<string>
}

export interface PrefabsWrapper {
  [key: string]: {
    prefabs: Array<IPrefab>
    active: boolean
    page: number
  }
}