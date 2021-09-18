export interface SearchResponse extends IBaseResponse {
  data: PrefabsWrapper
}

export interface PackResponse extends IBaseResponse {
  data: Array<IPack>
}

export interface IBaseResponse {
  success: boolean
  message?: string
}

export interface IPrefab {
  name: string
  type: string
  imagePath: string
  packStoreUrl: string
  keywords: Array<string>
}

export interface IPack {
  name: string
  identifier: string
  category: Array<string>
}

export interface Category {
  name: string
}

export type PrefabsWrapper = Record<string, { pack: IPack, prefabs: Array<IPrefab>, active: boolean }>
export type Categories = { active: Category | null, categories: Array<Category> }