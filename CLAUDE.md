# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

## Implementation Status

### Completed
- **PREL-2**: 12 legal document templates in `templates/` with `catalog.json` index
- **PREL-3**: Mutual NDA Creator — Next.js frontend prototype; AI chat flow for collecting parties, purpose, duration; generates filled NDA via LLM structured outputs
- **PREL-4**: V1 technical foundation — FastAPI backend (`backend/`), SQLite DB with users table (`database.py`), static frontend serving, Docker + docker-compose, platform start/stop scripts
- **PREL-5**: Freeform AI chat for Mutual NDA — replaced form panel with chat-driven field collection
- **PREL-6**: All 12 document types supported — `DocumentSelector` landing page, generic `DocumentCreator` component, `GET /api/fields/{document_type}` endpoint, per-document field configs in `backend/document_configs.py`; NDA retains full legal text preview, all others use a generic cover-page table

### Not yet implemented
- User authentication (sign up / sign in) — schema exists, no endpoints
- Document persistence

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.  
Consider statically building the frontend and serving it via FastAPI, if that will work.  
There should be scripts in scripts/ for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`
