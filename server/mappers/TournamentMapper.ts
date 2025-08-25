import type { Tournament } from '../entities';

export interface TournamentDTO { tournament_id: string }

export class TournamentMapper {
	toDTO(tournament: Tournament): TournamentDTO {
		return { tournament_id: tournament.shortId };
	}
}
