# Synchronize requirement inventories, knowledge indexes, and newest-first logs.
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

function Get-BaRoot {
    param([string]$Root)
    if ($Root) {
        $resolved = Resolve-BaPath $Root
        if (-not [IO.Directory]::Exists($resolved)) { throw "Workspace root does not exist: $resolved" }
        return $resolved
    }
    $current = (Get-Location).Path
    while ($current) {
        foreach ($marker in @('.git', '.agent-artifacts', 'package.json')) {
            if (Test-Path -LiteralPath (Join-Path $current $marker)) { return $current }
        }
        $parent = [IO.Directory]::GetParent($current)
        if ($null -eq $parent) { break }
        $current = $parent.FullName
    }
    return (Get-Location).Path
}

function Get-BaRelativePath {
    param([string]$Path, [string]$Root)
    $base = (Resolve-BaPath $Root).TrimEnd([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
    $target = Resolve-BaPath $Path
    $relative = ([Uri]$base).MakeRelativeUri([Uri]$target)
    if ($relative.IsAbsoluteUri) { return $target.Replace('\', '/') }
    return [Uri]::UnescapeDataString($relative.ToString()).Replace('\', '/')
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

function Write-BaJson {
    param($Value)
    [Console]::WriteLine((ConvertTo-Json -InputObject $Value -Depth 100))
}

function ConvertFrom-BaFrontmatter {
    param([string]$Content)
    $meta = @{}
    $body = $Content
    $match = [regex]::Match($Content, '\A---\s*\n(.*?)\n---\s*(?:\n|\z)', 'Singleline')
    if ($match.Success) {
        $body = $Content.Substring($match.Length)
        $listKey = $null
        foreach ($line in ($match.Groups[1].Value -split "`n")) {
            if ($line -match '^\s*#' -or -not $line.Trim()) { continue }
            if ($listKey -and $line -match '^\s+-\s+(.*)$') {
                $meta[$listKey] += $Matches[1].Trim().Trim('"', "'")
                continue
            }
            if ($line -match '^([\w-]+):\s*(.*)$') {
                $key = $Matches[1]; $value = $Matches[2].Trim(); $listKey = $null
                if (-not $value) { $meta[$key] = @(); $listKey = $key }
                elseif ($value.StartsWith('[') -and $value.EndsWith(']')) {
                    $meta[$key] = @($value.Trim('[', ']') -split ',' | ForEach-Object { $_.Trim().Trim('"', "'") } | Where-Object { $_ })
                } elseif ($value.StartsWith('"') -and $value.EndsWith('"')) {
                    try { $meta[$key] = ConvertFrom-Json -InputObject $value }
                    catch { $meta[$key] = $value.Trim('"') }
                } else { $meta[$key] = $value.Trim("'") }
            }
        }
    }
    return @{ meta = $meta; body = $body }
}

function Get-BaDocumentInfo {
    param([string]$Path)
    $content = Read-BaText $Path
    $parsed = ConvertFrom-BaFrontmatter $content
    $title = $parsed.meta['title']
    if (-not $title) {
        $heading = [regex]::Match($parsed.body, '^#\s+(.+)$', 'Multiline')
        if ($heading.Success) { $title = $heading.Groups[1].Value.Trim().Trim('`', '"', "'") }
        else { $title = [IO.Path]::GetFileNameWithoutExtension($Path).Replace('-', ' ').Replace('_', ' ') }
    }
    return @{ title = [string]$title; description = [string]$parsed.meta['description']; meta = $parsed.meta; body = $parsed.body; content = $content }
}

function Set-SyncContent {
    param([string]$Path, [string]$Content)
    if (-not [IO.File]::Exists($Path) -or (Read-BaText $Path) -cne $Content) {
        if (-not $options['dry-run']) { [void](Write-BaText $Path $Content) }
        $changes.Add('Updated ' + (Get-BaRelativePath $Path $root))
    }
}

function Set-InventorySection {
    param([string]$Content, [string]$Heading, [string[]]$Entries)
    $pattern = '(?ms)(^##\s+' + [regex]::Escape($Heading) + '[ \t]*\n).*?(?=^##\s|\z)'
    $block = if ($Entries.Count) { $Entries -join "`n" } else { '* None recorded yet.' }
    # Evaluator replacement keeps backslashes and dollar signs in document titles literal.
    return [regex]::Replace($Content, $pattern, [Text.RegularExpressions.MatchEvaluator]{ param($m) $m.Groups[1].Value + "`n$block`n`n" })
}

try {
    $options = Read-BaArguments $args -Values @('root', 'target', 'log-entry') -Switches @('dry-run', 'json')
    if ($options.help) { [Console]::WriteLine('sync_indexes.ps1 [--root PATH] [--target PATH] [--dry-run] [--log-entry "Action|Path|Summary"] [--json]'); exit 0 }
    $root = Get-BaRoot $options.root
    $logParts = $null
    if ($options['log-entry']) {
        $logParts = $options['log-entry'].Split([char[]]'|', 3)
        if ($logParts.Count -ne 3 -or -not $logParts[0].Trim() -or -not $logParts[1].Trim() -or -not $logParts[2].Trim()) { throw '--log-entry must contain Action|ConceptPath|Summary.' }
    }
    if ($options.target) {
        $target = Resolve-BaPath $options.target $root
        $relativeTarget = Get-BaRelativePath $target $root
        if ($relativeTarget -match '^\.\./' -or [IO.Path]::IsPathRooted($relativeTarget)) { throw '--target must be inside --root.' }
    }
    $changes = New-Object 'System.Collections.Generic.List[string]'
    $output = Join-Path $root '.agent-artifacts/requirements/output'
    $kb = Join-Path $root '.agent-artifacts/project-knowledge-base'
    if ([IO.Directory]::Exists($output)) {
        $epics = @(Get-ChildItem -LiteralPath $output -Directory -Force | Where-Object { $_.Name -ne 'elicitation' -and -not $_.Name.StartsWith('.') } | Sort-Object Name)
        foreach ($epic in $epics) {
            $epicPath = Join-Path $epic.FullName 'epic.md'
            if (-not [IO.File]::Exists($epicPath)) { continue }
            $content = Read-BaText $epicPath
            foreach ($type in @(@('us-*.md', 'User Stories'), @('gui-*.md', 'GUI Specifications'), @('api-*.md', 'API Specifications'))) {
                $entries = @()
                foreach ($file in @(Get-ChildItem -LiteralPath $epic.FullName -Filter $type[0] -File | Sort-Object Name)) {
                    $info = Get-BaDocumentInfo $file.FullName
                    $entry = "* [$($info.title)]($($file.Name))"
                    if ($type[0] -eq 'us-*.md') {
                        if ($info.meta['external_key']) { $entry += ' `[' + $info.meta['external_key'] + ']`' }
                        $state = if ($info.meta['status']) { $info.meta['status'] } else { 'draft' }
                        $entry += " - *Status: $state*"
                    }
                    $entries += $entry
                }
                $content = Set-InventorySection $content $type[1] $entries
            }
            Set-SyncContent $epicPath $content
            foreach ($folder in @('wireframes', 'diagrams')) {
                $dir = Join-Path $epic.FullName $folder
                if (-not [IO.Directory]::Exists($dir)) { continue }
                $entries = @()
                foreach ($file in @(Get-ChildItem -LiteralPath $dir -File -Force | Where-Object { $_.Name -ne 'index.md' -and -not $_.Name.StartsWith('.') } | Sort-Object Name)) {
                    # Binary images are indexed by filename, never read as UTF-8 text.
                    $title = $file.BaseName
                    if ($file.Extension -in @('.md', '.txt', '.html', '.svg', '.drawio', '.bpmn')) { $title = (Get-BaDocumentInfo $file.FullName).title }
                    $entries += "* [$title]($($file.Name))"
                }
                if (-not $entries.Count) { $entries = @("* No $folder files created yet.") }
                $heading = [Globalization.CultureInfo]::InvariantCulture.TextInfo.ToTitleCase($folder)
                Set-SyncContent (Join-Path $dir 'index.md') ("# $heading - $($epic.Name)`n`n" + ($entries -join "`n") + "`n")
            }
        }
        $hierarchy = @()
        if ([IO.Directory]::Exists((Join-Path $output 'elicitation'))) { $hierarchy += '* [Elicitation](elicitation/) - Project-wide discovery notes & interview sessions.' }
        if ([IO.File]::Exists((Join-Path $output 'vision-scope.md'))) { $hierarchy += '* [Vision & Scope](vision-scope.md) - Overall product vision & boundary constraints.' }
        if ([IO.File]::Exists((Join-Path $output 'functional-decomposition.md'))) { $hierarchy += '* [Functional Decomposition](functional-decomposition.md) - Capability breakdown and story slices.' }
        foreach ($epic in $epics) {
            $path = Join-Path $epic.FullName 'epic.md'
            if ([IO.File]::Exists($path)) {
                $info = Get-BaDocumentInfo $path
                $description = if ($info.description) { $info.description } else { "Epic delivery package for $($info.title)." }
                $hierarchy += "* [$($info.title)]($($epic.Name)/epic.md) - $description"
            } else { $hierarchy += "* [$($epic.Name.Replace('-', ' '))]($($epic.Name)/)" }
        }
        $index = Join-Path $output 'index.md'
        $content = if ([IO.File]::Exists($index)) { Read-BaText $index } else { "# Requirements Output`n`nGenerated requirement hierarchy:`n" }
        $block = $hierarchy -join "`n"
        $pattern = '(?ms)(Generated requirement hierarchy:[ \t]*\n).*?(?=^Required hierarchy:|^##\s|\z)'
        if ($content -notmatch $pattern) { $content = $content.TrimEnd() + "`n`nGenerated requirement hierarchy:`n" }
        $content = [regex]::Replace($content, $pattern, [Text.RegularExpressions.MatchEvaluator]{ param($m) $m.Groups[1].Value + "`n$block`n`n" })
        Set-SyncContent $index $content
    }
    foreach ($name in @('solution-context', 'glossary', 'wiki')) {
        $base = Join-Path $kb $name
        if (-not [IO.Directory]::Exists($base)) { continue }
        $folders = @($base)
        $folders += @(Get-ChildItem -LiteralPath $base -Directory -Recurse | Where-Object { $_.Name -ne 'diagrams' -and -not $_.Name.StartsWith('.') } | Sort-Object FullName | ForEach-Object { $_.FullName })
        foreach ($folder in $folders) {
            $entries = @()
            foreach ($file in @(Get-ChildItem -LiteralPath $folder -Filter '*.md' -File | Where-Object { $_.Name -ne 'index.md' -and -not $_.Name.StartsWith('.') } | Sort-Object Name)) {
                $info = Get-BaDocumentInfo $file.FullName
                $entry = "* [$($info.title)]($($file.Name))"
                if ($info.description) { $entry += " - $($info.description)" }
                $entries += $entry
            }
            $index = Join-Path $folder 'index.md'
            $content = if ([IO.File]::Exists($index)) { Read-BaText $index } else { "# Knowledge Index`n`n## Pages`n" }
            if ($content -notmatch '(?m)^##\s+Pages[ \t]*$') { $content = $content.Replace('Add source-backed wiki pages here.', '').TrimEnd() + "`n`n## Pages`n" }
            $content = Set-InventorySection $content 'Pages' $entries
            Set-SyncContent $index $content
        }
    }
    if ($options['log-entry']) {
        $parts = $logParts
        $path = Join-Path $kb 'log.md'
        $content = if ([IO.File]::Exists($path)) { Read-BaText $path } else { "# Project Knowledge Base Update Log`n" }
        $date = (Get-Date).ToString('yyyy-MM-dd')
        $entry = '* **' + $parts[0].Trim() + '**: [' + $parts[1].Trim() + '] - ' + $parts[2].Trim()
        if ($content -match ('(?m)^## ' + $date + '\s*$')) {
            $pattern = '(?m)(^## ' + $date + '[ \t]*\n)'
            $regex = New-Object Text.RegularExpressions.Regex($pattern)
            $content = $regex.Replace($content, [Text.RegularExpressions.MatchEvaluator]{ param($m) $m.Value + "`n$entry`n" }, 1)
        } else {
            $regex = New-Object Text.RegularExpressions.Regex('(?m)(^#\s+Project Knowledge Base Update Log[ \t]*\n)')
            $content = $regex.Replace($content, [Text.RegularExpressions.MatchEvaluator]{ param($m) $m.Value + "`n## $date`n`n$entry`n" }, 1)
        }
        Set-SyncContent $path $content
    }
    if ($options.json) { Write-BaJson ([ordered]@{ workspace_root = $root; dry_run = [bool]$options['dry-run']; changes = @($changes.ToArray()) }) }
    else {
        [Console]::WriteLine("Index synchronization: $root | Dry run: $([bool]$options['dry-run'])")
        if ($changes.Count) { foreach ($change in $changes) { [Console]::WriteLine($change) } }
        else { [Console]::WriteLine('All indexes and inventories are already up to date. No changes needed.') }
    }
    exit 0
} catch { [Console]::Error.WriteLine($_.Exception.Message); exit 2 }
