# Audit requirement frontmatter, DoR, semantic predicates, and relative links.
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

function Test-BaMarkdownLinks {
    param([string]$Path, [string]$Content)
    foreach ($match in [regex]::Matches($Content, '\[([^\]]+)\]\(([^)]+)\)')) {
        $target = $match.Groups[2].Value.Trim()
        if ($target -match '^(?:[a-z][a-z0-9+.-]*:|#)') { continue }
        if ($target.StartsWith('<')) { $target = ($target -split '>')[0].Substring(1) }
        else { $target = $target -replace '\s+["''][^"'']*["'']\s*$', '' }
        $target = [Uri]::UnescapeDataString(($target -split '#', 2)[0])
        if (-not $target) { continue }
        $resolved = Resolve-BaPath $target ([IO.Path]::GetDirectoryName($Path))
        if (-not (Test-Path -LiteralPath $resolved)) { "Broken link '$($match.Value)' -> Target does not exist at $resolved" }
    }
}

function Test-SemanticCriteria {
    param([string]$Body, [string[]]$Blocks)
    $qualifiers = @('valid', 'complete', 'trustworthy', 'generic', 'inconclusive', 'available', 'successful', 'appropriate', 'fast', 'quick', 'cleanly', 'properly', 'reliable', 'confident', 'suitable')
    $definitionCues = '\b(?:means|defined as|only when|when|if|requires|must|according to|as specified in|per)\b'
    $observable = '(?:\b(?:empty|non-empty|null|whitespace|status|state|range|between|within|under|over|less than|greater than|at least|at most|matches?|contains?|capabilit(?:y|ies)|field|value|code)\b|[<>]=?|=)'
    $definitions = @([regex]::Matches($Body, '(?im)^#{2,6}\s+(?:definitions?|business rules?|glossary|.+\b(?:rules|definitions?)\b)\s*$'))
    foreach ($qualifier in $qualifiers) {
        $pattern = '\b' + $qualifier + '\b'
        if (($Blocks -join "`n") -notmatch $pattern) { continue }
        $defined = $false
        for ($i = 0; $i -lt $definitions.Count; $i++) {
            $start = $definitions[$i].Index + $definitions[$i].Length
            $end = if ($i + 1 -lt $definitions.Count) { $definitions[$i + 1].Index } else { $Body.Length }
            foreach ($line in ($Body.Substring($start, $end - $start) -split "`n")) {
                if ($line -match $pattern -and ($line -match $definitionCues -or $line -match '\[[^\]]+\]\([^)]+\)')) { $defined = $true }
            }
        }
        foreach ($line in ($Body -split "`n")) {
            if ($line -match $pattern -and $line -match '\[[^\]]+\]\([^)]+\)' -and ($line -match $definitionCues -or $line -match '\b(?:rule|rules|guideline|specification|source)\b')) { $defined = $true }
        }
        foreach ($line in (($Blocks -join "`n") -split "`n")) { if ($line -match $pattern -and $line -match $observable) { $defined = $true } }
        if (-not $defined) { "Semantic qualifier '$qualifier' is used in acceptance criteria without observable boundaries; define it locally or cite an authoritative source" }
    }
    $routing = '\b(?:fallback|fall back|falls back|precedence|classification|routing|selected path|recognition path|otherwise|secondary source|next provider|prefer|supersedes|inconclusive)\b'
    if (($Blocks -join "`n") -match $routing) {
        $lines = $Body -split "`n"; $populated = $false
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -notmatch 'Input state\s*\|\s*Observable condition\s*\|\s*Selected path\s*\|\s*Expected outcome') { continue }
            for ($j = $i + 1; $j -lt $lines.Count; $j++) {
                $line = $lines[$j].Trim()
                if (-not $line) { continue }
                if (-not $line.StartsWith('|')) { break }
                $cells = @($line.Trim('|') -split '\|' | ForEach-Object { $_.Trim() })
                if ($cells.Count -ge 4 -and @($cells | Where-Object { $_ -and $_ -notmatch '^[-: ]+$' }).Count) { $populated = $true; break }
            }
            if ($populated) { break }
        }
        if (-not $populated) { 'Fallback, precedence, classification, or routing behavior requires a populated decision table with columns: Input state | Observable condition | Selected path | Expected outcome' }
    }
}

function Test-RequirementDocument {
    param([string]$Path)
    $issues = New-Object 'System.Collections.Generic.List[string]'
    $warnings = New-Object 'System.Collections.Generic.List[string]'
    $passed = New-Object 'System.Collections.Generic.List[string]'
    $content = Read-BaText $Path
    $parsed = ConvertFrom-BaFrontmatter $content; $meta = $parsed.meta; $body = $parsed.body
    $status = ([string]$meta['status']).Trim().ToLowerInvariant()
    $name = [IO.Path]::GetFileName($Path)
    $type = if ($name -eq 'epic.md') { 'Epic' } elseif ($name.StartsWith('us-')) { 'User Story' } else { 'GUI Specification' }
    if ($type -eq 'User Story') {
        if (-not $status) { $issues.Add("Missing required frontmatter 'status:' (draft | refinement | signed-off)") }
        elseif ($status -notin @('draft', 'refinement', 'signed-off')) { $issues.Add("Invalid frontmatter status: $status") }
        else { $passed.Add("Frontmatter status: $status") }
        $epic = if ($meta['epic']) { $meta['epic'] } else { $meta['parent_epic'] }
        if (-not $epic -or $epic -eq '<Epic Name or TBD>') { $issues.Add("Missing or unassigned frontmatter 'epic:' (or 'parent_epic:') property") }
        else { $passed.Add("Assigned parent epic: $epic") }
        if ($body -notmatch '(?i)As an?\s+([^,\n]+),?\s+I\s+want\s+(to\s+)?([^\n.]+)') {
            if ($body -match 'As a `?<user role>') { $issues.Add('User story statement contains unpopulated template placeholders') }
            else { $issues.Add("Missing standard story statement ('As a <role>, I want <goal>')") }
        } else { $passed.Add('Standard story statement present') }
        if ($body -notmatch '(?i)##\s+Acceptance Criteria|###\s+(?:Business\s+)?Acceptance Criteria') {
            $issues.Add("Missing 'Acceptance Criteria' section")
        } else {
            $blocks = @([regex]::Matches($body, '(?is)```(?:gherkin)?\s*\n(.*?)\n```') | ForEach-Object { $_.Groups[1].Value })
            $acCount = [regex]::Matches($body, '(?m)^\s*(?:[-*]|\d+\.|\*\*AC\s*\d+\*\*:?|###\s*Scenario:)\s+\S+').Count
            if (-not $blocks.Count -and $acCount -eq 0) {
                $issues.Add('No Acceptance Criteria found (provide plain English criteria or AC statements)')
            } else {
                if ($blocks.Count -gt 0) {
                    $passed.Add("Acceptance criteria found ($($blocks.Count) Gherkin blocks / $acCount scenarios)")
                } else {
                    $passed.Add("Plain English acceptance criteria found ($acCount criteria)")
                }
            }
        }
        if ($body -match '###?\s*(?:Risk|RAID|Risk, Assumption)') { $passed.Add('Optional RAID log section present') }
        if ($body -match '###?\s*Open Questions') {
            if ($status -in @('refinement', 'signed-off') -or $options.dor) {
                if ($body -match '\|\s*Q\d+\s*\|\s*[^|]+\|\s*[^|]*blocking') { $issues.Add('DoR violation: Story has unresolved BLOCKING open questions') }
                elseif ($body -match '\|\s*Q\d+\s*\|\s*[^|]+\|\s*(?:Open|High)') { $warnings.Add('Story has open questions marked Open/High; resolve before signing off') }
            }
            $passed.Add('Open Questions section present')
        } else { $warnings.Add("Missing 'Open Questions' section") }
    } elseif ($type -eq 'Epic') {
        if ($meta['type'] -ne 'Requirement Epic' -and ([string]($meta['tags'] -join ' ')) -notmatch 'epic') { $warnings.Add("Frontmatter does not specify 'type: Requirement Epic'") }
        else { $passed.Add('Valid Epic frontmatter type') }
        if ($body -notmatch '##\s+User Stories') { $issues.Add("Missing required section '## User Stories'") }
        else { $passed.Add('Section ## User Stories present') }
    }
    $linkIssues = @(Test-BaMarkdownLinks $Path $content)
    if ($linkIssues.Count) { foreach ($issue in $linkIssues) { $issues.Add($issue) } }
    else { $passed.Add('All relative markdown links verified (zero broken paths)') }
    return [ordered]@{ file = $Path; type = $type; status = $status; dor_ready = ($issues.Count -eq 0); passed_checks = @($passed.ToArray()); issues = @($issues.ToArray()); warnings = @($warnings.ToArray()) }
}

try {
    $options = Read-BaArguments $args -Values @('root', 'file', 'epic') -Switches @('all', 'dor', 'semantic', 'terse', 'json', 'skip-ac', 'wireframe-first')
    if ($options.help) { [Console]::WriteLine('validate_requirements.ps1 [--root PATH] [--file PATH | --epic PATH | --all] [--dor] [--semantic] [--skip-ac] [--wireframe-first] [--terse | --json]'); exit 0 }
    if (@('file', 'epic', 'all' | Where-Object { $options[$_] }).Count -gt 1) { throw 'Choose only one of --file, --epic, or --all.' }
    $root = Get-BaRoot $options.root
    if ($options.file) {
        $path = Resolve-BaPath $options.file $root
        if (-not [IO.File]::Exists($path)) { throw "Input file does not exist: $path" }
        if ([IO.Path]::GetFileName($path) -notmatch '^(epic|us-.+|gui-.+)\.md$') { throw 'Input must be epic.md, us-*.md, or gui-*.md.' }
        $files = @($path)
    } elseif ($options.epic) {
        $path = Resolve-BaPath $options.epic $root
        if (-not [IO.Directory]::Exists($path)) { throw "Epic directory does not exist: $path" }
        $files = @(Get-ChildItem -LiteralPath $path -Filter '*.md' -File | Sort-Object Name | ForEach-Object { $_.FullName })
    } else {
        $path = Join-Path $root '.agent-artifacts/requirements/output'
        if (-not [IO.Directory]::Exists($path)) { throw "Requirements output directory does not exist: $path" }
        $files = @(Get-BaFiles $path -Extensions @('.md') | Sort-Object FullName | ForEach-Object { $_.FullName })
    }
    $results = New-Object 'System.Collections.Generic.List[object]'
    foreach ($file in $files) {
        if ([IO.Path]::GetFileName($file) -notmatch '^(epic|us-.+|gui-.+)\.md$') { continue }
        try { $results.Add((Test-RequirementDocument $file)) }
        catch { $results.Add(@{ file = $file; type = 'Unknown'; dor_ready = $false; issues = @("Read error: $($_.Exception.Message)"); warnings = @(); passed_checks = @() }) }
    }
    $failed = @($results | Where-Object { -not $_.dor_ready }).Count
    if ($options.json) { Write-BaJson @($results.ToArray()) }
    elseif ($options.terse) {
        foreach ($result in $results) {
            $relative = Get-BaRelativePath $result.file $root
            foreach ($issue in $result.issues) { [Console]::WriteLine("${relative}: error: $issue") }
            foreach ($warning in $result.warnings) { [Console]::WriteLine("${relative}: warning: $warning") }
        }
        [Console]::WriteLine("Files audited: $($results.Count) | Failed: $failed")
    } else {
        [Console]::WriteLine('SCRUM DEFINITION OF READY & DELIVERABLE AUDIT')
        foreach ($result in $results) {
            $verdict = if ($result.dor_ready) { 'PASS' } else { 'FAIL' }
            [Console]::WriteLine("[$verdict] $(Get-BaRelativePath $result.file $root) ($($result.type))")
            foreach ($passed in $result.passed_checks) { [Console]::WriteLine("  + $passed") }
            foreach ($warning in $result.warnings) { [Console]::WriteLine("  warning: $warning") }
            foreach ($issue in $result.issues) { [Console]::WriteLine("  error: $issue") }
        }
        [Console]::WriteLine("Files audited: $($results.Count) | Failed: $failed")
    }
    if ($failed) { exit 1 }; exit 0
} catch { [Console]::Error.WriteLine($_.Exception.Message); exit 2 }
