import { AxiosResponse } from 'axios'
import http from './httpService'
import { groupBy, mapValues } from 'lodash'
import { SearchResponse, IPrefab, PrefabsWrapper } from '../models'

export const getPrefabs = async (query: string): Promise<AxiosResponse<SearchResponse>> => {
  return await http.get<SearchResponse>(`/prefab/search/${query}`)
}

export const groupPrefabs = (prefabs: Array<IPrefab>): PrefabsWrapper => {
  return mapValues(groupBy(prefabs, prefab => prefab.pack), (list) => {
    return {
      prefabs: list,
      active: false,
      page: 0
    }
  })
}
