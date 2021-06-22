import { AxiosResponse } from 'axios'
import http from './httpService'
import { SearchResponse } from './models'

export const getPrefabs = async (query: string): Promise<AxiosResponse<SearchResponse>> => {
  return await http.get<SearchResponse>(`/prefab/search/${query}`)
}

export const groupBy = <T>(array: Array<T>, property: (x: T) => string): { [key: string]: Array<T> } => {
  return array.reduce((memo: { [key: string]: Array<T> }, x: T) => {
    if (!memo[property(x)]) {
      memo[property(x)] = []
    }

    memo[property(x)].push(x)

    return memo;
  }, {})
}