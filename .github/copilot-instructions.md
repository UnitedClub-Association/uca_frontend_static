---
# Codacy Rules
Configuration for AI behavior when interacting with Codacy
## When using any tool that has either one of the following arguments: provider, organization or repository
use gh for provider, UnitedClub-Association for organization and uca_frontend_static for repository, and avoid calling 'git remote -v' unless really necessary

## When after ANY successful edit_file or reapply tool call
IMMEDIATELY run codacy_cli_analyze tool with:
 - rootPath set to the workspace path
 - file set to the edited file path
 - If issues are found, propose fixes for them
---