# TournamentStats

Frontend for "TournamentStats", a website that allows League of Legends players to create Statpages for their tournaments. This repository includes the nuxt frontend as well as an included nitro server that queries the postgresql database.

## Visual Studio Code

This project uses some type-checking eslint rules. If you use eslint as a formatter (or fixAll on Save), I recommend deactivating some type relevant rules to increase the formatting speed. Without these settings, formatting can take up to 500ms.

```json
"eslint.codeActionsOnSave.rules": [
	"@stylistic/*",
	"@typescript-eslint/indent",
	"!@typescript-eslint/await-thenable",
	"!@typescript-eslint/no-misused-promises",
	"!@typescript-eslint/no-unsafe-assignment",
	"!@typescript-eslint/no-unsafe-return",
	"!@typescript-eslint/no-unsafe-member-access",
	"!@typescript-eslint/no-unsafe-call",
	"!@typescript-eslint/no-unsafe-return",
	""
]
```

## Installation

```bash
# clone project
git clone https://github.com/TournamentStats/tournamentstats-frontend.git
cd tournamentstats-frontend
# install dependencies
pnpm install

# regenerate types from database (optional)
cd ..
# setup supabase backend
git clone https://github.com/TournamentStats/tournamentstats-backend.git
cd tournamentstats-backend
# install supabase (see https://supabase.com/docs/guides/local-development/cli/getting-started)
pnpm install -D supabase
pnpx supabase start
# reset local database to newest migrations
pnpx supabase db reset
cd ../tournamentstats-frontend
pnpm gen-db-types

# run development server
pnpm dev

# run eslint
pnpm lint

# run typescript's typecheck
pnpx nuxt typecheck
```
