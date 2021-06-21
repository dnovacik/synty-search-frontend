import { AxiosResponse } from 'axios'
import http from './httpService'
import { SearchResponse } from './models'

export const getPrefabs = async (query: string): Promise<AxiosResponse<SearchResponse>> => {
  return await http.get<SearchResponse>(`/prefab/search/${query}`)
}