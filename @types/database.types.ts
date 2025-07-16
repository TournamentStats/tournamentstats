import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from './database-generated.types'

export type { CompositeTypes, Json, Enums, TablesInsert, Tables, TablesUpdate } from './database-generated.types'

export enum Format {
	bo1 = 'Best of 1',
	bo2 = 'Best of 2',
	bo3 = 'Best of 3',
	bo5 = 'Best of 5',
	other = 'Other',
}

export type Database = MergeDeep<
	DatabaseGenerated,
	{
		public: {
			Views: {
				available_tournaments: {
					Row: {
						created_at: string
						is_private: boolean
						name: string
						owner_id: string
						short_id: string
						tournament_id: number
					}
					Insert: {
						created_at?: string
						is_private: boolean
						name: string
						owner_id: string
						short_id?: string
						tournament_id?: number
					}
					Update: {
						created_at?: string
						is_private?: boolean
						name?: string
						owner_id?: string
						short_id?: string
						tournament_id?: number
					}
				}
			}
		}
	}
>
