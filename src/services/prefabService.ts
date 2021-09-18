import { AxiosResponse } from 'axios'
import { union } from 'lodash'
import http from './httpService'
// import { groupBy, mapValues, map } from 'lodash'
import { SearchResponse, PrefabsWrapper, Categories, PackResponse } from '../models'

export const getPrefabs = async (query: string): Promise<AxiosResponse<SearchResponse>> => {
  return await http.get<SearchResponse>(`/prefab/search/${query}`)
}

export const getPacks = async (): Promise<AxiosResponse<PackResponse>> => {
  return await http.get<PackResponse>(`/prefab/packs`)
}

export const getCategories = (wrapper: PrefabsWrapper): Categories => {
  const arrays = Object.entries(wrapper).map(([key, value]) => {
    return value.pack.category
  })

  return {
    active: null,
    categories: union(...arrays).map(category => {
      return {
        name: category
      }
    })
  }
}

// export const groupPrefabs = (prefabs: Array<IPrefab>): PrefabsWrapper => {
//   const grouped = groupBy(prefabs, 'pack')

//   const wrapper: PrefabsWrapper = {}

//   map(grouped, (dict, group) => {
//     wrapper[group] = {
//       prefabs: dict,
//       active: false
//     }
//   })

//   return wrapper
// }
