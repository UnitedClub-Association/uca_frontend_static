# Set Codacy environment variables
$env:CODACY_API_TOKEN = "a8363e90972f49b584448a9997766411"
$env:CODACY_PROJECT_TOKEN = "a8363e90972f49b584448a9997766411"

# Create Codacy CLI directory if it doesn't exist
$codacyPath = "$env:USERPROFILE\.codacy"
New-Item -Path $codacyPath -ItemType Directory -Force | Out-Null

# Download latest Codacy CLI
$cliPath = "$codacyPath\codacy-cli.exe"
if (-not (Test-Path $cliPath)) {
    $url = "https://github.com/codacy/codacy-cli-v2/releases/latest/download/codacy-cli-v2_windows_amd64.exe"
    Invoke-WebRequest -Uri $url -OutFile $cliPath
}

# Run Codacy analysis
& $cliPath analyze `
    --provider gh `
    --organization UnitedClub-Association `
    --repository uca_frontend_static `
    --directory . `
    --verbose