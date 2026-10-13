# Map authoritative Markdown/text documents to progressive knowledge stubs.
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

function Get-BaFiles {
    param([string]$Root, [string[]]$Extensions = @(), [string[]]$Ignore = @(), [switch]$SkipHidden)
    if (-not [IO.Directory]::Exists($Root)) { return }
    $pending = New-Object 'System.Collections.Generic.Stack[string]'
    $pending.Push($Root)
    while ($pending.Count -gt 0) {
        $dir = $pending.Pop()
        foreach ($item in @(Get-ChildItem -LiteralPath $dir -Force | Sort-Object Name)) {
            if ($item.PSIsContainer) {
                if ($item.Name -in $Ignore -or ($SkipHidden -and $item.Name.StartsWith('.'))) { continue }
                if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { continue }
                $pending.Push($item.FullName)
            } elseif ($Extensions.Count -eq 0 -or $item.Extension.ToLowerInvariant() -in $Extensions) { $item }
        }
    }
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

try {
    $options = Read-BaArguments $args -Values @('root', 'source') -Switches @('dry-run', 'json')
    if ($options.help) { [Console]::WriteLine('map_knowledge_base.ps1 --source PATH [--root PATH] [--dry-run] [--json]'); exit 0 }
    if (-not $options.source) { throw '--source is required.' }
    $root = Get-BaRoot $options.root
    $source = Resolve-BaPath $options.source $root
    if (-not (Test-Path -LiteralPath $source)) { throw "Source path does not exist: $source" }
    if ([IO.File]::Exists($source)) {
        if ([IO.Path]::GetExtension($source).ToLowerInvariant() -notin @('.md', '.txt')) { throw 'Only Markdown and text sources are supported.' }
        $files = @(Get-Item -LiteralPath $source)
    } else { $files = @(Get-BaFiles $source -Extensions @('.md', '.txt') -Ignore @('node_modules', 'dist', 'build') -SkipHidden | Sort-Object FullName) }
    $wiki = Join-Path $root '.agent-artifacts/project-knowledge-base/wiki'
    $reserved = @{}; $items = New-Object 'System.Collections.Generic.List[object]'
    $timestamp = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
    foreach ($file in $files) {
        try {
            # Never recursively ingest generated stubs or replace hand-authored knowledge.
            $relative = Get-BaRelativePath $file.FullName $root
            $wikiRelative = Get-BaRelativePath $file.FullName $wiki
            if ($wikiRelative -notmatch '^\.\./' -and -not [IO.Path]::IsPathRooted($wikiRelative)) { continue }
            $info = Get-BaDocumentInfo $file.FullName
            # The mapper uses the first H1 as the source title, as the original utility did.
            $sourceHeading = [regex]::Match($info.body, '^#\s+(.+)$', 'Multiline')
            $title = if ($sourceHeading.Success) { $sourceHeading.Groups[1].Value.Trim() } else { $info.title }
            $slug = [regex]::Replace($title.ToLowerInvariant(), '[^\w\s-]', '').Trim()
            $slug = [regex]::Replace($slug, '[-\s]+', '-')
            if ($slug.Length -gt 50) { $slug = $slug.Substring(0, 50) }
            if (-not $slug) { $slug = 'untitled' }
            $candidate = $slug; $suffix = 1
            while ($true) {
                $target = Join-Path $wiki ($candidate + '.md')
                if ($reserved.ContainsKey($target)) { $sameSource = $reserved[$target] -ceq $relative }
                elseif ([IO.File]::Exists($target)) {
                    $existing = (ConvertFrom-BaFrontmatter (Read-BaText $target)).meta
                    $sameSource = $existing['source_type'] -eq 'external-mapped' -and $existing['source_path'] -ceq $relative
                } else { break }
                if ($sameSource) { break }
                $suffix++; $candidate = "$slug-$suffix"
            }
            $reserved[$target] = $relative
            $headings = @([regex]::Matches($info.body, '^#{1,4}\s+(.+)$', 'Multiline') | Select-Object -First 10 | ForEach-Object { '- ' + $_.Groups[1].Value.Trim() })
            if (-not $headings.Count) { $headings = @('- Document Body') }
            $paragraph = New-Object 'System.Collections.Generic.List[string]'
            foreach ($line in ($info.body -split "`n")) {
                $line = $line.Trim()
                if ($line.StartsWith('#')) { if ($paragraph.Count) { break }; continue }
                if ($line) { $paragraph.Add($line); if ($paragraph.Count -ge 3) { break } }
                elseif ($paragraph.Count) { break }
            }
            $summary = $paragraph -join ' '
            if (-not $summary) { $summary = 'No executive summary available in source document.' }
            if ($summary.Length -gt 400) { $summary = $summary.Substring(0, 397) + '...' }
            $quotedTitle = ConvertTo-Json -InputObject $title -Compress
            $quotedSource = ConvertTo-Json -InputObject $relative -Compress
            $sourceUri = ([Uri]$file.FullName).AbsoluteUri
            $stub = @"
---
id: KB-$candidate
title: $quotedTitle
source_type: external-mapped
source_path: $quotedSource
last_synced: "$timestamp"
status: active
tags:
  - imported-knowledge
  - external-reference
---

# $title

> [!NOTE]
> **Hybrid Progressive Knowledge Stub**: This article is mapped from existing project documentation.
> - **Source File**: [$relative]($sourceUri)
> - **Last Synced**: ``$timestamp``

## Executive Summary

$summary

## Key Topics & Structure

$($headings -join "`n")

## Retrieval Guidance

- To inspect the complete document content, open the authoritative source: ``$relative``.
- When referencing rules or context from this document, cite ``$relative`` in deliverable frontmatter.
"@ + "`n"
            if (-not $options['dry-run']) { [void](Write-BaText $target $stub) }
            $items.Add([ordered]@{ source = $relative; title = $title; stub_path = Get-BaRelativePath $target $root; status = if ($options['dry-run']) { 'dry-run' } else { 'created' } })
        } catch { $items.Add(@{ source = $file.FullName; status = "error: $($_.Exception.Message)" }) }
    }
    $index = Join-Path $wiki 'index.md'
    $indexContent = if ([IO.File]::Exists($index)) { Read-BaText $index } else { "# Wiki Knowledge Index`n" }
    $entries = @()
    foreach ($item in $items) {
        if ($item.status -notin @('created', 'dry-run')) { continue }
        $name = [IO.Path]::GetFileName($item.stub_path)
        if (-not $indexContent.Contains("]($name)")) {
            $entries += "- [$($item.title)]($name) - *Mapped from ``$($item.source)``*"
        }
    }
    if ($entries.Count -and -not $options['dry-run']) {
        if (-not $indexContent.Contains('## External Mapped Knowledge')) { $indexContent = $indexContent.TrimEnd() + "`n`n## External Mapped Knowledge`n" }
        [void](Write-BaText $index ($indexContent.TrimEnd() + "`n" + ($entries -join "`n") + "`n"))
    }
    if ($options.json) { Write-BaJson ([ordered]@{ mapped_count = $items.Count; items = @($items.ToArray()) }) }
    else {
        [Console]::WriteLine("Knowledge mapping: $source | Target: $wiki | Articles: $($items.Count)")
        foreach ($item in $items) { [Console]::WriteLine("[$($item.status)] $($item.source) -> $($item.stub_path)") }
    }
    if (@($items | Where-Object { $_.status -like 'error:*' }).Count) { exit 1 }
    exit 0
} catch { [Console]::Error.WriteLine($_.Exception.Message); exit 2 }
