export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export type Database = {
	public: {
		Tables: {
			format_abbrevation: {
				Row: {
					abbrevation: string
					format: Database['public']['Enums']['format']
				}
				Insert: {
					abbrevation: string
					format: Database['public']['Enums']['format']
				}
				Update: {
					abbrevation?: string
					format?: Database['public']['Enums']['format']
				}
				Relationships: []
			}
			game: {
				Row: {
					created_at: string
					game_duration: number | null
					game_id: number
				}
				Insert: {
					created_at?: string
					game_duration?: number | null
					game_id: number
				}
				Update: {
					created_at?: string
					game_duration?: number | null
					game_id?: number
				}
				Relationships: []
			}
			game_matchup_relation: {
				Row: {
					game_id: number
					matchup_id: number
				}
				Insert: {
					game_id: number
					matchup_id: number
				}
				Update: {
					game_id?: number
					matchup_id?: number
				}
				Relationships: [
					{
						foreignKeyName: 'game_matchup_relation_game_id_fkey'
						columns: ['game_id']
						isOneToOne: false
						referencedRelation: 'game'
						referencedColumns: ['game_id']
					},
					{
						foreignKeyName: 'game_matchup_relation_matchup_id_fkey'
						columns: ['matchup_id']
						isOneToOne: false
						referencedRelation: 'matchup'
						referencedColumns: ['matchup_id']
					},
				]
			}
			game_player_stats: {
				Row: {
					assists: number | null
					champ_id: number | null
					champ_level: number | null
					champ_name: string | null
					created_at: string
					deaths: number | null
					double_kills: number | null
					enemy_jungle_minion_kills: number | null
					first_blood_kill: boolean | null
					game_id: number
					gold_earned: number | null
					item0: number | null
					item1: number | null
					item2: number | null
					item3: number | null
					item4: number | null
					item5: number | null
					item6: number | null
					kills: number | null
					participant_id: number | null
					penta_kills: number | null
					position: string | null
					puuid: string
					quadra_kills: number | null
					total_ally_jungle_minion_kills: number | null
					total_minion_kills: number | null
					triple_kills: number | null
					turret_kills: number | null
				}
				Insert: {
					assists?: number | null
					champ_id?: number | null
					champ_level?: number | null
					champ_name?: string | null
					created_at?: string
					deaths?: number | null
					double_kills?: number | null
					enemy_jungle_minion_kills?: number | null
					first_blood_kill?: boolean | null
					game_id: number
					gold_earned?: number | null
					item0?: number | null
					item1?: number | null
					item2?: number | null
					item3?: number | null
					item4?: number | null
					item5?: number | null
					item6?: number | null
					kills?: number | null
					participant_id?: number | null
					penta_kills?: number | null
					position?: string | null
					puuid: string
					quadra_kills?: number | null
					total_ally_jungle_minion_kills?: number | null
					total_minion_kills?: number | null
					triple_kills?: number | null
					turret_kills?: number | null
				}
				Update: {
					assists?: number | null
					champ_id?: number | null
					champ_level?: number | null
					champ_name?: string | null
					created_at?: string
					deaths?: number | null
					double_kills?: number | null
					enemy_jungle_minion_kills?: number | null
					first_blood_kill?: boolean | null
					game_id?: number
					gold_earned?: number | null
					item0?: number | null
					item1?: number | null
					item2?: number | null
					item3?: number | null
					item4?: number | null
					item5?: number | null
					item6?: number | null
					kills?: number | null
					participant_id?: number | null
					penta_kills?: number | null
					position?: string | null
					puuid?: string
					quadra_kills?: number | null
					total_ally_jungle_minion_kills?: number | null
					total_minion_kills?: number | null
					triple_kills?: number | null
					turret_kills?: number | null
				}
				Relationships: [
					{
						foreignKeyName: 'game_player_stats_game_id_fkey'
						columns: ['game_id']
						isOneToOne: false
						referencedRelation: 'game'
						referencedColumns: ['game_id']
					},
					{
						foreignKeyName: 'game_player_stats_puuid_fkey'
						columns: ['puuid']
						isOneToOne: false
						referencedRelation: 'player'
						referencedColumns: ['puuid']
					},
				]
			}
			game_team_stats: {
				Row: {
					baron_kills: number | null
					champion_kills: number | null
					created_at: string
					dragon_kills: number | null
					game_id: number
					inhibitor_kills: number | null
					rift_herald_kills: number | null
					side: Database['public']['Enums']['side']
					team_id: number | null
					tower_kills: number | null
					win: boolean | null
				}
				Insert: {
					baron_kills?: number | null
					champion_kills?: number | null
					created_at?: string
					dragon_kills?: number | null
					game_id: number
					inhibitor_kills?: number | null
					rift_herald_kills?: number | null
					side: Database['public']['Enums']['side']
					team_id?: number | null
					tower_kills?: number | null
					win?: boolean | null
				}
				Update: {
					baron_kills?: number | null
					champion_kills?: number | null
					created_at?: string
					dragon_kills?: number | null
					game_id?: number
					inhibitor_kills?: number | null
					rift_herald_kills?: number | null
					side?: Database['public']['Enums']['side']
					team_id?: number | null
					tower_kills?: number | null
					win?: boolean | null
				}
				Relationships: [
					{
						foreignKeyName: 'game_team_stats_game_id_fkey'
						columns: ['game_id']
						isOneToOne: false
						referencedRelation: 'game'
						referencedColumns: ['game_id']
					},
					{
						foreignKeyName: 'game_team_stats_team_id_fkey'
						columns: ['team_id']
						isOneToOne: false
						referencedRelation: 'team'
						referencedColumns: ['team_id']
					},
				]
			}
			matchup: {
				Row: {
					created_at: string
					format: Database['public']['Enums']['format'] | null
					matchup_id: number
					short_id: string
					team1_id: number
					team2_id: number
					tournament_id: number
				}
				Insert: {
					created_at?: string
					format?: Database['public']['Enums']['format'] | null
					matchup_id?: number
					short_id?: string
					team1_id: number
					team2_id: number
					tournament_id: number
				}
				Update: {
					created_at?: string
					format?: Database['public']['Enums']['format'] | null
					matchup_id?: number
					short_id?: string
					team1_id?: number
					team2_id?: number
					tournament_id?: number
				}
				Relationships: [
					{
						foreignKeyName: 'matchup_tournament_id_fkey'
						columns: ['tournament_id']
						isOneToOne: false
						referencedRelation: 'tournament'
						referencedColumns: ['tournament_id']
					},
					{
						foreignKeyName: 'matchup_tournament_id_team1_id_fkey'
						columns: ['tournament_id', 'team1_id']
						isOneToOne: false
						referencedRelation: 'team'
						referencedColumns: ['tournament_id', 'team_id']
					},
					{
						foreignKeyName: 'matchup_tournament_id_team2_id_fkey'
						columns: ['tournament_id', 'team2_id']
						isOneToOne: false
						referencedRelation: 'team'
						referencedColumns: ['tournament_id', 'team_id']
					},
				]
			}
			player: {
				Row: {
					created_at: string
					game_name: string | null
					profile_icon_id: number | null
					puuid: string
					tag_line: string | null
				}
				Insert: {
					created_at?: string
					game_name?: string | null
					profile_icon_id?: number | null
					puuid: string
					tag_line?: string | null
				}
				Update: {
					created_at?: string
					game_name?: string | null
					profile_icon_id?: number | null
					puuid?: string
					tag_line?: string | null
				}
				Relationships: []
			}
			team: {
				Row: {
					created_at: string
					name: string
					short_id: string
					team_id: number
					tournament_id: number
				}
				Insert: {
					created_at?: string
					name: string
					short_id?: string
					team_id?: number
					tournament_id: number
				}
				Update: {
					created_at?: string
					name?: string
					short_id?: string
					team_id?: number
					tournament_id?: number
				}
				Relationships: [
					{
						foreignKeyName: 'team_tournament_id_fkey'
						columns: ['tournament_id']
						isOneToOne: false
						referencedRelation: 'tournament'
						referencedColumns: ['tournament_id']
					},
				]
			}
			tournament: {
				Row: {
					created_at: string
					end_date: string | null
					image_path: string | null
					is_private: boolean | null
					name: string
					owner_id: string
					short_id: string
					start_date: string | null
					tournament_id: number
				}
				Insert: {
					created_at?: string
					end_date?: string | null
					image_path?: string | null
					is_private?: boolean | null
					name: string
					owner_id: string
					short_id?: string
					start_date?: string | null
					tournament_id?: number
				}
				Update: {
					created_at?: string
					end_date?: string | null
					image_path?: string | null
					is_private?: boolean | null
					name?: string
					owner_id?: string
					short_id?: string
					start_date?: string | null
					tournament_id?: number
				}
				Relationships: []
			}
			tournament_participant: {
				Row: {
					name: string
					puuid: string
					team_id: number | null
					tournament_id: number
				}
				Insert: {
					name: string
					puuid: string
					team_id?: number | null
					tournament_id: number
				}
				Update: {
					name?: string
					puuid?: string
					team_id?: number | null
					tournament_id?: number
				}
				Relationships: [
					{
						foreignKeyName: 'tournament_participant_puuid_fkey'
						columns: ['puuid']
						isOneToOne: false
						referencedRelation: 'player'
						referencedColumns: ['puuid']
					},
					{
						foreignKeyName: 'tournament_participant_tournament_id_fkey'
						columns: ['tournament_id']
						isOneToOne: false
						referencedRelation: 'tournament'
						referencedColumns: ['tournament_id']
					},
					{
						foreignKeyName: 'tournament_participant_tournament_id_team_id_fkey'
						columns: ['tournament_id', 'team_id']
						isOneToOne: false
						referencedRelation: 'team'
						referencedColumns: ['tournament_id', 'team_id']
					},
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			decode_id_salted: {
				Args: {
					p1: string
					salt: string
				}
				Returns: string
			}
			encode_id_salted: {
				Args: {
					p1: number
					salt: string
				}
				Returns: string
			}
		}
		Enums: {
			format: 'Best of 1' | 'Best of 2' | 'Best of 3' | 'Best of 5' | 'Other'
			side: 'BLUE' | 'RED'
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
	storage: {
		Tables: {
			buckets: {
				Row: {
					allowed_mime_types: string[] | null
					avif_autodetection: boolean | null
					created_at: string | null
					file_size_limit: number | null
					id: string
					name: string
					owner: string | null
					owner_id: string | null
					public: boolean | null
					updated_at: string | null
				}
				Insert: {
					allowed_mime_types?: string[] | null
					avif_autodetection?: boolean | null
					created_at?: string | null
					file_size_limit?: number | null
					id: string
					name: string
					owner?: string | null
					owner_id?: string | null
					public?: boolean | null
					updated_at?: string | null
				}
				Update: {
					allowed_mime_types?: string[] | null
					avif_autodetection?: boolean | null
					created_at?: string | null
					file_size_limit?: number | null
					id?: string
					name?: string
					owner?: string | null
					owner_id?: string | null
					public?: boolean | null
					updated_at?: string | null
				}
				Relationships: []
			}
			migrations: {
				Row: {
					executed_at: string | null
					hash: string
					id: number
					name: string
				}
				Insert: {
					executed_at?: string | null
					hash: string
					id: number
					name: string
				}
				Update: {
					executed_at?: string | null
					hash?: string
					id?: number
					name?: string
				}
				Relationships: []
			}
			objects: {
				Row: {
					bucket_id: string | null
					created_at: string | null
					id: string
					last_accessed_at: string | null
					metadata: Json | null
					name: string | null
					owner: string | null
					owner_id: string | null
					path_tokens: string[] | null
					updated_at: string | null
					user_metadata: Json | null
					version: string | null
				}
				Insert: {
					bucket_id?: string | null
					created_at?: string | null
					id?: string
					last_accessed_at?: string | null
					metadata?: Json | null
					name?: string | null
					owner?: string | null
					owner_id?: string | null
					path_tokens?: string[] | null
					updated_at?: string | null
					user_metadata?: Json | null
					version?: string | null
				}
				Update: {
					bucket_id?: string | null
					created_at?: string | null
					id?: string
					last_accessed_at?: string | null
					metadata?: Json | null
					name?: string | null
					owner?: string | null
					owner_id?: string | null
					path_tokens?: string[] | null
					updated_at?: string | null
					user_metadata?: Json | null
					version?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'objects_bucketId_fkey'
						columns: ['bucket_id']
						isOneToOne: false
						referencedRelation: 'buckets'
						referencedColumns: ['id']
					},
				]
			}
			s3_multipart_uploads: {
				Row: {
					bucket_id: string
					created_at: string
					id: string
					in_progress_size: number
					key: string
					owner_id: string | null
					upload_signature: string
					user_metadata: Json | null
					version: string
				}
				Insert: {
					bucket_id: string
					created_at?: string
					id: string
					in_progress_size?: number
					key: string
					owner_id?: string | null
					upload_signature: string
					user_metadata?: Json | null
					version: string
				}
				Update: {
					bucket_id?: string
					created_at?: string
					id?: string
					in_progress_size?: number
					key?: string
					owner_id?: string | null
					upload_signature?: string
					user_metadata?: Json | null
					version?: string
				}
				Relationships: [
					{
						foreignKeyName: 's3_multipart_uploads_bucket_id_fkey'
						columns: ['bucket_id']
						isOneToOne: false
						referencedRelation: 'buckets'
						referencedColumns: ['id']
					},
				]
			}
			s3_multipart_uploads_parts: {
				Row: {
					bucket_id: string
					created_at: string
					etag: string
					id: string
					key: string
					owner_id: string | null
					part_number: number
					size: number
					upload_id: string
					version: string
				}
				Insert: {
					bucket_id: string
					created_at?: string
					etag: string
					id?: string
					key: string
					owner_id?: string | null
					part_number: number
					size?: number
					upload_id: string
					version: string
				}
				Update: {
					bucket_id?: string
					created_at?: string
					etag?: string
					id?: string
					key?: string
					owner_id?: string | null
					part_number?: number
					size?: number
					upload_id?: string
					version?: string
				}
				Relationships: [
					{
						foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey'
						columns: ['bucket_id']
						isOneToOne: false
						referencedRelation: 'buckets'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey'
						columns: ['upload_id']
						isOneToOne: false
						referencedRelation: 's3_multipart_uploads'
						referencedColumns: ['id']
					},
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			can_insert_object: {
				Args: {
					bucketid: string
					name: string
					owner: string
					metadata: Json
				}
				Returns: undefined
			}
			extension: {
				Args: {
					name: string
				}
				Returns: string
			}
			filename: {
				Args: {
					name: string
				}
				Returns: string
			}
			foldername: {
				Args: {
					name: string
				}
				Returns: string[]
			}
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>
				Returns: {
					size: number
					bucket_id: string
				}[]
			}
			list_multipart_uploads_with_delimiter: {
				Args: {
					bucket_id: string
					prefix_param: string
					delimiter_param: string
					max_keys?: number
					next_key_token?: string
					next_upload_token?: string
				}
				Returns: {
					key: string
					id: string
					created_at: string
				}[]
			}
			list_objects_with_delimiter: {
				Args: {
					bucket_id: string
					prefix_param: string
					delimiter_param: string
					max_keys?: number
					start_after?: string
					next_token?: string
				}
				Returns: {
					name: string
					id: string
					metadata: Json
					updated_at: string
				}[]
			}
			operation: {
				Args: Record<PropertyKey, never>
				Returns: string
			}
			search: {
				Args: {
					prefix: string
					bucketname: string
					limits?: number
					levels?: number
					offsets?: number
					search?: string
					sortcolumn?: string
					sortorder?: string
				}
				Returns: {
					name: string
					id: string
					updated_at: string
					created_at: string
					last_accessed_at: string
					metadata: Json
				}[]
			}
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
	PublicTableNameOrOptions extends
	| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
	| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
		Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
		Row: infer R
	}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
		PublicSchema['Views'])
		? (PublicSchema['Tables'] &
			PublicSchema['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R
		}
			? R
			: never
		: never

export type TablesInsert<
	PublicTableNameOrOptions extends
	| keyof PublicSchema['Tables']
	| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
		Insert: infer I
	}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I
		}
			? I
			: never
		: never

export type TablesUpdate<
	PublicTableNameOrOptions extends
	| keyof PublicSchema['Tables']
	| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
		Update: infer U
	}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U
		}
			? U
			: never
		: never

export type Enums<
	PublicEnumNameOrOptions extends
	| keyof PublicSchema['Enums']
	| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
	| keyof PublicSchema['CompositeTypes']
	| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
		? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never
