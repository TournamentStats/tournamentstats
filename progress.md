# Server Endpoint Progress

- [x] [./server/api/me.get.ts](./server/api/me.get.ts)

## Player Related Endpoints

- [ ] [./server/api/players/[puuid]/renewal.post.ts](./server/api/players/[puuid]/renewal.post.ts)

## Tournament Related Endpoints

- [x] [./server/api/tournaments/images.post.ts](./server/api/tournaments/images.post.ts)
- [x] [./server/api/tournaments.get.ts](./server/api/tournaments.get.ts)
- [x] [./server/api/tournaments.post.ts](./server/api/tournaments.post.ts)

- [x] [./server/api/tournaments/[tournamentId].delete.ts](./server/api/tournaments/[tournamentId].delete.ts)
- [x] [./server/api/tournaments/[tournamentId].get.ts](./server/api/tournaments/[tournamentId].get.ts)
- [x] [./server/api/tournaments/[tournamentId].patch.ts](./server/api/tournaments/[tournamentId].patch.ts)

### Team Related Endpoints

- [x] [./server/api/tournaments/[tournamentId]/teams.get.ts](./server/api/tournaments/[tournamentId]/teams.get.ts)
- [x] [./server/api/tournaments/[tournamentId]/teams.post.ts](./server/api/tournaments/[tournamentId]/teams.post.ts)

- [x] [./server/api/tournaments/[tournamentId]/teams/[teamId].delete.ts](./server/api/tournaments/[tournamentId]/teams/[teamId].delete.ts)
- [x] [./server/api/tournaments/[tournamentId]/teams/[teamId].get.ts](./server/api/tournaments/[tournamentId]/teams/[teamId].get.ts)
- [x] [./server/api/tournaments/[tournamentId]/teams/[teamId].patch.ts](./server/api/tournaments/[tournamentId]/teams/[teamId].patch.ts)

#### Team Member Related Endpoints

- [x] [./server/api/tournaments/[tournamentId]/teams/[teamId]/players.get.ts](./server/api/tournaments/[tournamentId]/teams/[teamId]/players.get.ts)
- [x] [./server/api/tournaments/[tournamentId]/teams/[teamId]/players.patch.ts](./server/api/tournaments/[tournamentId]/teams/[teamId]/players.patch.ts)

### Matchup Related Endpoints

- [x] [./server/api/tournaments/[tournamentId]/matchups.get.ts](./server/api/tournaments/[tournamentId]/matchups.get.ts)
- [x] [./server/api/tournaments/[tournamentId]/matchups.post.ts](./server/api/tournaments/[tournamentId]/matchups.post.ts)

- [ ] [./server/api/tournaments/[tournamentId]/matchups/[matchupId].delete.ts](./server/api/tournaments/[tournamentId]/matchups/[matchupId].delete.ts)
- [x] [./server/api/tournaments/[tournamentId]/matchups/[matchupId].get.ts](./server/api/tournaments/[tournamentId]/matchups/[matchupId].get.ts)
- [ ] [./server/api/tournaments/[tournamentId]/matchups/[matchupId].patch.ts](./server/api/tournaments/[tournamentId]/matchups/[matchupId].patch.ts)

#### Game Related Endpoints

- [ ] [./server/api/tournaments/[tournamentId]/matchups/[matchupId]/games.get.ts](./server/api/tournaments/[tournamentId]/matchups/[matchupId]/games.get.ts)
- [ ] [./server/api/tournaments/[tournamentId]/matchups/[matchupId]/games.post.ts](./server/api/tournaments/[tournamentId]/matchups/[matchupId]/games.post.ts)

- [ ] [./server/api/tournaments/[tournamentId]/matchups/[matchupId]/games/[gameId].delete.ts](./server/api/tournaments/[tournamentId]/matchups/[matchupId]/games/[gameId].delete.ts)
- [ ] [./server/api/tournaments/[tournamentId]/matchups/[matchupId]/games/[gameId].get.ts](./server/api/tournaments/[tournamentId]/matchups/[matchupId]/games/[gameId].get.ts)
- [ ] [./server/api/tournaments/[tournamentId]/matchups/[matchupId]/games/[gameId].patch.ts](./server/api/tournaments/[tournamentId]/matchups/[matchupId]/games/[gameId].patch.ts)

## Participant Related Endpoints

- [x] [./server/api/tournaments/[tournamentId]/participants.get.ts](./server/api/tournaments/[tournamentId]/participants.get.ts)

## Stats Related Endpoints

- [ ] [./server/api/tournaments/[tournamentId]/teams/[teamId]/stats.get.ts](./server/api/tournaments/[tournamentId]/teams/[teamId]/stats.get.ts)
- [ ] [./server/api/tournaments/[tournamentId]/participants/[riotId]/stats.get.ts](./server/api/tournaments/[tournamentId]/participants/[riotId]/stats.get.ts)

## Documentation

- [ ] [./server/docs/me.get.docs.ts](./server/docs/me.get.docs.ts)
- [ ] players
  - [ ] [./server/docs/players/[puuid]/renewal.post.docs.ts](./server/docs/players/[puuid]/renewal.post.docs.ts)
- [ ] tournaments
  - [ ] [./server/docs/tournaments/[tournamentId]/matchups/[matchupId]/games/[gameId].get.docs.ts](./server/docs/tournaments/[tournamentId]/matchups/[matchupId]/games/[gameId].get.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/matchups/[matchupId]/games.get.docs.ts](./server/docs/tournaments/[tournamentId]/matchups/[matchupId]/games.get.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/matchups/[matchupId]/games.post.docs.ts](./server/docs/tournaments/[tournamentId]/matchups/[matchupId]/games.post.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/matchups/[matchupId].get.docs.ts](./server/docs/tournaments/[tournamentId]/matchups/[matchupId].get.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/matchups.get.docs.ts](./server/docs/tournaments/[tournamentId]/matchups.get.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/matchups.post.docs.ts](./server/docs/tournaments/[tournamentId]/matchups.post.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/participants/[riotId]/stats.get.docs.ts](./server/docs/tournaments/[tournamentId]/participants/[riotId]/stats.get.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/participants.get.docs.ts](./server/docs/tournaments/[tournamentId]/participants.get.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/teams/[teamId]/players.get.docs.ts](./server/docs/tournaments/[tournamentId]/teams/[teamId]/players.get.docs.ts)
  - [x] [./server/docs/tournaments/[tournamentId]/teams/[teamId]/players.patch.docs.ts](./server/docs/tournaments/[tournamentId]/teams/[teamId]/players.patch.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/teams/[teamId]/stats.get.docs.ts](./server/docs/tournaments/[tournamentId]/teams/[teamId]/stats.get.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/teams/[teamId].delete.docs.ts](./server/docs/tournaments/[tournamentId]/teams/[teamId].delete.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/teams/[teamId].get.docs.ts](./server/docs/tournaments/[tournamentId]/teams/[teamId].get.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/teams/[teamId].patch.docs.ts](./server/docs/tournaments/[tournamentId]/teams/[teamId].patch.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/teams.get.docs.ts](./server/docs/tournaments/[tournamentId]/teams.get.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId]/teams.post.docs.ts](./server/docs/tournaments/[tournamentId]/teams.post.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId].delete.docs.ts](./server/docs/tournaments/[tournamentId].delete.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId].get.docs.ts](./server/docs/tournaments/[tournamentId].get.docs.ts)
  - [ ] [./server/docs/tournaments/[tournamentId].patch.docs.ts](./server/docs/tournaments/[tournamentId].patch.docs.ts)
  - [ ] [./server/docs/tournaments/images.post.docs.ts](./server/docs/tournaments/images.post.docs.ts)
  - [ ] [./server/docs/tournaments.get.docs.ts](./server/docs/tournaments.get.docs.ts)
  - [ ] [./server/docs/tournaments.post.docs.ts](./server/docs/tournaments.post.docs.ts)
