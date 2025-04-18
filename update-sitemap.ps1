# Script to update sitemap.xml with latest GitHub commit dates
# Requires Git to be installed and accessible in PATH

# Configuration
$repoUrl = "https://github.com/UnitedClub-Association/uca_frontend_static.git"
$sitemapPath = "sitemap.xml"
$baseUrl = "https://unitedclubassociation.netlify.app"
$currentDate = Get-Date -Format "yyyy-MM-dd"

# Create a temporary directory for the repository
$tempDir = [System.IO.Path]::GetTempPath() + [System.Guid]::NewGuid().ToString()
New-Item -ItemType Directory -Path $tempDir | Out-Null

try {
    # Clone the repository to get the latest commit dates
    Write-Host "Cloning repository to get latest commit dates..." -ForegroundColor Cyan
    git clone --no-checkout $repoUrl $tempDir
    
    if (-not (Test-Path $sitemapPath)) {
        throw "Sitemap file not found at: $sitemapPath"
    }
    
    # Load the sitemap XML
    Write-Host "Loading sitemap.xml..." -ForegroundColor Cyan
    [xml]$sitemap = Get-Content $sitemapPath
    
    # Track how many URLs were updated
    $updatedCount = 0
    $totalUrls = $sitemap.urlset.url.Count
    
    # Update each URL in the sitemap
    foreach ($url in $sitemap.urlset.url) {
        $relativePath = $url.loc -replace $baseUrl, ""
        
        # Handle the root URL
        if ($relativePath -eq "/") {
            $relativePath = "index.html"
        } else {
            $relativePath = $relativePath.TrimStart("/")
        }
        
        # Get the last commit date for this file
        Push-Location $tempDir
        $lastCommitDate = git log -1 --format="%ad" --date=format:"%Y-%m-%d" -- $relativePath 2>$null
        Pop-Location
        
        # Update the lastmod element if we got a valid date
        if ($lastCommitDate) {
            Write-Host "Updating $relativePath with date: $lastCommitDate" -ForegroundColor Green
            # Convert to string explicitly to avoid type issues
            $url.lastmod = [string]$lastCommitDate
            $updatedCount++
        } else {
            # If no commit date found, use current date
            Write-Host "No commit history found for $relativePath, using current date" -ForegroundColor Yellow
            # Convert to string explicitly to avoid type issues
            $url.lastmod = [string]$currentDate
            $updatedCount++
        }
    }
    
    # Save the updated sitemap
    Write-Host "Saving updated sitemap.xml..." -ForegroundColor Cyan
    $sitemap.Save((Resolve-Path $sitemapPath))
    
    Write-Host "Sitemap updated successfully! Updated $updatedCount of $totalUrls URLs." -ForegroundColor Green
    
    # Verify the sitemap is valid XML
    try {
        [xml]$testLoad = Get-Content $sitemapPath
        Write-Host "Sitemap validation: XML is valid." -ForegroundColor Green
    } catch {
        Write-Host "Warning: Saved sitemap may have XML issues: $_" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Error updating sitemap: $_" -ForegroundColor Red
} finally {
    # Clean up the temporary directory
    if (Test-Path $tempDir) {
        Remove-Item -Recurse -Force $tempDir
        Write-Host "Temporary directory cleaned up." -ForegroundColor DarkGray
    }
}

Write-Host "Process completed. Don't forget to commit and push the updated sitemap.xml file." -ForegroundColor Cyan