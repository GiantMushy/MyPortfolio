#!/usr/bin/env pwsh
# Static Site Generator for MyPortfolio
# Run this script to generate static HTML files from your ASP.NET Core app

Write-Host "🚀 Starting MyPortfolio Static Site Generator..." -ForegroundColor Green

# Check if .NET is available
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Host "❌ .NET not found. Please install .NET 10.0 SDK" -ForegroundColor Red
    exit 1
}

# Clean and create output directory
if (Test-Path "static-site") {
    Remove-Item "static-site" -Recurse -Force
}
New-Item -ItemType Directory -Path "static-site" -Force | Out-Null

# Copy static assets
Write-Host "📁 Copying static assets..." -ForegroundColor Yellow
Copy-Item "wwwroot\*" "static-site\" -Recurse -Force

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
dotnet build --configuration Release

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Start the application
Write-Host "🌐 Starting application..." -ForegroundColor Yellow
$env:ASPNETCORE_URLS = "http://localhost:5000"
$env:ASPNETCORE_ENVIRONMENT = "Production"

$job = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    dotnet run --configuration Release --no-build
}

# Wait for application to start
Write-Host "⏳ Waiting for application to start..." -ForegroundColor Yellow
$ready = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/" -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Application is ready!" -ForegroundColor Green
            $ready = $true
            break
        }
    }
    catch {
        Write-Host "⏳ Attempt $i/30: Waiting for app..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $ready) {
    Write-Host "❌ Application failed to start" -ForegroundColor Red
    Stop-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -ErrorAction SilentlyContinue
    exit 1
}

# Generate static pages
Write-Host "📄 Generating static pages..." -ForegroundColor Yellow

try {
    # Generate home page
    $homeContent = Invoke-WebRequest -Uri "http://localhost:5000/" -ErrorAction Stop
    $homeContent.Content | Out-File -FilePath "static-site\index.html" -Encoding UTF8
    Write-Host "✅ Generated index.html" -ForegroundColor Green

    # Generate education page
    try {
        $eduContent = Invoke-WebRequest -Uri "http://localhost:5000/Education" -ErrorAction Stop
        $eduContent.Content | Out-File -FilePath "static-site\education.html" -Encoding UTF8
        Write-Host "✅ Generated education.html" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Could not generate education.html: $($_.Exception.Message)" -ForegroundColor Yellow
    }

    # Generate test page
    try {
        $testContent = Invoke-WebRequest -Uri "http://localhost:5000/Test" -ErrorAction Stop
        $testContent.Content | Out-File -FilePath "static-site\test.html" -Encoding UTF8
        Write-Host "✅ Generated test.html" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Could not generate test.html: $($_.Exception.Message)" -ForegroundColor Yellow
    }

    # Generate MyJourney page
    try {
        $journeyContent = Invoke-WebRequest -Uri "http://localhost:5000/Home/MyJourney" -ErrorAction Stop
        $journeyContent.Content | Out-File -FilePath "static-site\myjourney.html" -Encoding UTF8
        Write-Host "✅ Generated myjourney.html" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Could not generate myjourney.html: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Failed to generate pages: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    # Stop the application
    Write-Host "🛑 Stopping application..." -ForegroundColor Yellow
    Stop-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -ErrorAction SilentlyContinue
}

# Post-process HTML files to convert MVC routes to static HTML links
Write-Host "🔧 Post-processing HTML files..." -ForegroundColor Yellow
Get-ChildItem "static-site\*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    # Replace /Home/MyJourney with myjourney.html
    $content = $content -replace '="/Home/MyJourney"', '="myjourney.html"'
    $content = $content -replace "='/Home/MyJourney'", "='myjourney.html'"
    # Replace other common routes if needed
    $content = $content -replace '="/Education"', '="education.html"'
    $content = $content -replace "='/Education'", "='education.html'"
    $content | Out-File -FilePath $_.FullName -Encoding UTF8 -NoNewline
}
Write-Host "✅ Post-processing complete" -ForegroundColor Green

# Copy CNAME if it exists
if (Test-Path "CNAME") {
    Copy-Item "CNAME" "static-site\" -Force
    Write-Host "Copied CNAME" -ForegroundColor Green
}

Write-Host "Static site generation complete!" -ForegroundColor Green
Write-Host "Generated files:" -ForegroundColor Cyan
Get-ChildItem "static-site" -Recurse | ForEach-Object { Write-Host "   $($_.FullName)" -ForegroundColor White }
