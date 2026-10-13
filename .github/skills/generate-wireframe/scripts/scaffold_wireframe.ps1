# Generate the responsive HTML shell with the skill's accessible CSS tokens.
$ErrorActionPreference = 'Stop'
$script:BaUtf8 = New-Object System.Text.UTF8Encoding($false, $true)
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$OutputEncoding = [Console]::OutputEncoding

function Read-BaArguments {
    param([object[]]$Arguments, [string[]]$Values = @(), [string[]]$Switches = @(),
          [hashtable]$Aliases = @{}, [switch]$AllowPositionals)
    $result = @{ positional = @() }
    for ($i = 0; $i -lt $Arguments.Count; $i++) {
        $token = [string]$Arguments[$i]
        if ($token -eq '--') {
            if (-not $AllowPositionals) { throw 'Positional arguments are not supported.' }
            $result.positional += @($Arguments | Select-Object -Skip ($i + 1))
            break
        }
        if ($token.StartsWith('-')) {
            $parts = $token.TrimStart('-').Split([char[]]'=', 2)
            $key = $parts[0].ToLowerInvariant()
            if ($Aliases.ContainsKey($key)) { $key = $Aliases[$key] }
            if ($key -in @('h', 'help')) { $result.help = $true; continue }
            if ($key -in $Switches) {
                if ($parts.Count -gt 1) { throw "Option --$key does not accept a value." }
                $result[$key] = $true
            } elseif ($key -in $Values) {
                if ($parts.Count -gt 1) { $value = $parts[1] }
                else {
                    $i++
                    if ($i -ge $Arguments.Count -or ([string]$Arguments[$i]).StartsWith('--')) {
                        throw "Option --$key requires a value."
                    }
                    $value = [string]$Arguments[$i]
                }
                if ($result.ContainsKey($key)) { throw "Option --$key was supplied more than once." }
                $result[$key] = $value
            } else { throw "Unknown option: $token" }
        } elseif ($AllowPositionals) { $result.positional += $token }
        else { throw "Unexpected argument: $token" }
    }
    return $result
}

function Resolve-BaPath {
    param([string]$Path, [string]$Base = (Get-Location).Path)
    if ([IO.Path]::IsPathRooted($Path)) { return [IO.Path]::GetFullPath($Path) }
    return [IO.Path]::GetFullPath((Join-Path $Base $Path))
}

function Read-BaText {
    param([string]$Path)
    return [IO.File]::ReadAllText($Path, $script:BaUtf8).Replace("`r`n", "`n")
}

function Write-BaText {
    param([string]$Path, [string]$Content)
    $Path = Resolve-BaPath $Path
    if ([IO.File]::Exists($Path) -and (Read-BaText $Path) -ceq $Content) { return $false }
    [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($Path))
    $temporary = $Path + '.' + [Guid]::NewGuid().ToString('N') + '.tmp'
    try {
        [IO.File]::WriteAllText($temporary, $Content, $script:BaUtf8)
        if ([IO.File]::Exists($Path)) { [IO.File]::Replace($temporary, $Path, [NullString]::Value, $true) }
        else { [IO.File]::Move($temporary, $Path) }
    } finally {
        if ([IO.File]::Exists($temporary)) { [IO.File]::Delete($temporary) }
    }
    return $true
}

try {
    $options = Read-BaArguments $args -Values @('title', 'desc', 'output')
    if ($options.help) { [Console]::WriteLine('scaffold_wireframe.ps1 --title TITLE --output PATH [--desc DESCRIPTION]'); exit 0 }
    if (-not $options.title -or -not $options.output) { throw '--title and --output are required.' }
    $output = Resolve-BaPath $options.output
    $tokens = Join-Path $PSScriptRoot '../assets/wireframe-tokens.css'
    if (-not [IO.File]::Exists($tokens)) { throw "CSS tokens are missing: $tokens" }
    $css = Read-BaText $tokens
    $title = [Net.WebUtility]::HtmlEncode($options.title)
    $description = if ($options.desc) { [Net.WebUtility]::HtmlEncode($options.desc) } else { 'Mid-Fidelity Wireframe Specification' }
    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$title - Wireframe</title>
  <style>
$css
  </style>
</head>
<body>
  <header class="wf-navbar">
    <div class="wf-logo">AppLogo</div>
    <nav>
      <ul class="wf-nav-links">
        <li><a href="#" class="active">Overview</a></li>
        <li><a href="#">Details</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    </nav>
  </header>
  <main class="wf-container">
    <header class="wf-page-header">
      <h1 class="wf-page-title">$title</h1>
      <p class="wf-page-desc">$description</p>
    </header>
    <section class="wf-card">
      <h2 class="wf-card-header">Main Section</h2>
      <p>Placeholder content. Add form controls, tables, or cards here.</p>
    </section>
  </main>
</body>
</html>
"@ + "`n"
    [void](Write-BaText $output $html)
    [Console]::WriteLine("Scaffolded HTML wireframe at: $output")
    exit 0
} catch { [Console]::Error.WriteLine($_.Exception.Message); exit 2 }
