# Project knowledge search engine & parallel runspace helpers.
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

$script:BaStopWords = @{}
foreach ($word in ('a about above after again against all am an and any are aren''t as at be because been before being below between both but by can cannot could couldn''t did didn''t do does doesn''t doing don''t down during each few for from further had hadn''t has hasn''t have haven''t having he her here hers herself him himself his how i if in into is isn''t it it''s its itself let''s me more most mustn''t my myself no nor not of off on once only or other ought our ours ourselves out over own same shan''t she should shouldn''t so some such than that the their theirs them themselves then there these they this those through to too under until up very was wasn''t we were weren''t what when where which while who whom why with won''t would wouldn''t you your yours yourself yourselves' -split ' ')) { $script:BaStopWords[$word] = $true }

$script:BaSynonyms = @{
    auth = @('authentication', 'login', 'jwt', 'session', 'permission', 'rbac', 'credential', 'security', 'token')
    authentication = @('auth', 'login', 'jwt', 'session', 'credential')
    authorization = @('permission', 'role', 'rbac', 'access', 'policy', 'scope')
    permission = @('authorization', 'role', 'rbac', 'access', 'policy')
    payment = @('billing', 'checkout', 'transaction', 'invoice', 'gateway', 'stripe', 'charge', 'refund')
    billing = @('payment', 'invoice', 'subscription', 'charge', 'transaction')
    checkout = @('payment', 'billing', 'cart', 'order', 'purchase')
    user = @('actor', 'persona', 'role', 'customer', 'member', 'account', 'stakeholder')
    story = @('requirement', 'acceptance', 'user story', 'epic', 'feature', 'criteria')
    epic = @('initiative', 'feature', 'capability', 'story', 'hierarchy')
    requirement = @('story', 'epic', 'specification', 'acceptance', 'criteria', 'pact')
    api = @('endpoint', 'rest', 'graphql', 'contract', 'payload', 'schema', 'controller')
    data = @('database', 'schema', 'entity', 'model', 'migration', 'table', 'sql', 'field')
    workflow = @('process', 'lifecycle', 'flowchart', 'sequence', 'state', 'transition')
    diagram = @('bpmn', 'mermaid', 'flowchart', 'sequence', 'model')
    gui = @('screen', 'wireframe', 'ui', 'view', 'layout', 'page', 'mockup')
}

function Get-BaTokens {
    param([string]$Text)
    foreach ($match in [regex]::Matches($Text.ToLowerInvariant(), '\b[a-zA-Z0-9_\-.]{2,}\b')) {
        if (-not $script:BaStopWords.ContainsKey($match.Value)) { $match.Value }
    }
}

function Get-BaTermCounts {
    param([string[]]$Tokens)
    $counts = @{}
    foreach ($token in $Tokens) { if (-not $counts.ContainsKey($token)) { $counts[$token] = 0 }; $counts[$token]++ }
    return $counts
}

function Get-BaWeightedQuery {
    param([string]$Query)
    $seen = @{}
    foreach ($token in @(Get-BaTokens $Query)) {
        if (-not $seen.ContainsKey($token)) { $seen[$token] = $true; @{ term = $token; weight = 1.0 } }
        foreach ($synonym in $script:BaSynonyms[$token]) {
            if (-not $seen.ContainsKey($synonym)) { $seen[$synonym] = $true; @{ term = $synonym; weight = 0.5 } }
        }
    }
}

function New-BaEntity {
    param([string]$Type, [string]$Name, [string]$Id, [string]$Status, [string]$Description,
          [object[]]$Tags, [string]$File, [int]$Line = 1)
    return @{ entity_type = $Type; name = $Name; id = $Id; status = $Status; description = $Description; tags = @($Tags); file = $File; line = $Line }
}

function Get-BaEntities {
    param([string]$Path, [string]$Root, $Info)
    $meta = $Info.meta; $relative = Get-BaRelativePath $Path $Root
    $stem = [IO.Path]::GetFileNameWithoutExtension($Path)
    $tags = @($meta['tags'] | Where-Object { $_ })
    $type = [string]$meta['type']; $title = $Info.title
    $description = [string]$meta['description']; $status = [string]$meta['status']
    if ($type.Contains('Requirement Epic') -or [IO.Path]::GetFileName($Path) -eq 'epic.md' -or $stem.StartsWith('epic-')) {
        $id = if ($meta['epic_id']) { $meta['epic_id'] } else { [IO.Path]::GetFileName([IO.Path]::GetDirectoryName($Path)) }
        New-BaEntity 'epic' $title $id $(if ($status) { $status } else { 'Active' }) $(if ($description) { $description } else { "Epic: $title" }) $tags $relative
    } elseif ($type.Contains('Requirement Story') -or $stem.StartsWith('us-')) {
        $id = if ($meta['story_id']) { $meta['story_id'] } elseif ($stem -match '^(us-\d+)') { $Matches[1].ToUpperInvariant() } else { $stem }
        $entity = New-BaEntity 'story' $title $id $(if ($status) { $status } else { 'Draft' }) $(if ($description) { $description } else { "User Story: $title" }) $tags $relative
        $entity.parent_epic = if ($meta['epic']) { $meta['epic'] } elseif ($meta['parent_epic']) { $meta['parent_epic'] } else { [IO.Path]::GetFileName([IO.Path]::GetDirectoryName($Path)) }
        $entity
    } elseif ($type -match 'Vision\s*&\s*Scope' -or $stem -eq 'vision-scope') {
        New-BaEntity 'vision-scope' $title 'vision-scope' $(if ($status) { $status } else { 'Documented' }) $(if ($description) { $description } else { "Vision & Scope: $title" }) $tags $relative
    } elseif ($type -match 'Functional\s*Decomposition' -or $stem -eq 'functional-decomposition') {
        New-BaEntity 'decomposition' $title 'functional-decomposition' $(if ($status) { $status } else { 'Documented' }) $(if ($description) { $description } else { "Functional Decomposition: $title" }) $tags $relative
        $lines = $Info.content -split "`n"
        for ($i = 0; $i -lt $lines.Count; $i++) {
            $line = $lines[$i]
            if ($line -match '^\|\s*`?(us-\d+)`?\s*\|\s*`?([^|]+?)`?\s*\|\s*([^|]+)\|\s*([^|]+)\|') {
                $storyId = $Matches[1].ToUpperInvariant()
                $storyName = $Matches[2].Trim().Replace('`', '')
                $storyDesc = ($Matches[3].Trim() + ' | ' + $Matches[4].Trim()).Replace('**', '').Replace('`', '')
                New-BaEntity 'story' $storyName $storyId 'Decomposed' $storyDesc @('decomposition', 'decomposed-slice') $relative ($i + 1)
            }
        }
    } elseif ($relative.Contains('elicitation') -or [string]$meta['artifact_type'] -eq 'elicitation_session') {
        $id = if ($meta['topic']) { $meta['topic'] } else { $stem }
        New-BaEntity 'elicitation' $title $id $(if ($status) { $status } else { 'signed-off' }) $(if ($description) { $description } else { "Elicitation Session: $title" }) $tags $relative
    } elseif ($stem.StartsWith('wireframe-') -or $relative.Contains('wireframes')) {
        New-BaEntity 'wireframe' $title $stem $(if ($status) { $status } else { 'Documented' }) $(if ($description) { $description } else { "Wireframe: $title" }) $tags $relative
    } elseif ($relative.Contains('glossary')) {
        $term = ''; $definition = @(); $termLine = 1
        $lines = $Info.content -split "`n"
        for ($i = 0; $i -lt $lines.Count; $i++) {
            $line = $lines[$i]
            if ($line.StartsWith('### ')) {
                if ($term) { New-BaEntity 'glossary' $term $term 'Confirmed' $(if ($definition.Count) { $definition -join ' ' } else { 'Glossary term definition' }) @('glossary') $relative $termLine }
                $term = $line.Substring(4).Trim(); $termLine = $i + 1; $definition = @()
            } elseif ($line -match '^[-*]\s+\*\*([^*]+)\*\*:\s*(.*)') {
                New-BaEntity 'glossary' $Matches[1].Trim() $Matches[1].Trim() 'Confirmed' $Matches[2].Trim() @('glossary') $relative ($i + 1)
            } elseif ($line.Contains('|')) {
                $cells = @($line.Trim('|') -split '\|' | ForEach-Object { $_.Trim() })
                if ($cells.Count -ge 2 -and $cells[0] -and $cells[0] -notin @('term', 'acronym', 'name') -and $cells[0] -notmatch '^[-: ]+$') { New-BaEntity 'glossary' $cells[0] $cells[0] 'Confirmed' $cells[1] @('glossary') $relative ($i + 1) }
            } elseif ($term -and $line.Trim() -and -not $line.StartsWith('#')) { $definition += $line.Trim() }
        }
        if ($term) { New-BaEntity 'glossary' $term $term 'Confirmed' $(if ($definition.Count) { $definition -join ' ' } else { 'Glossary term definition' }) @('glossary') $relative $termLine }
    } elseif ($relative.Contains('solution-context')) {
        New-BaEntity 'solution-context' $title $stem $(if ($status) { $status } else { 'Documented' }) $(if ($description) { $description } else { "Solution Context: $title" }) $tags $relative
        $lines = $Info.content -split "`n"
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i].StartsWith('## ') -and $lines[$i] -notmatch '^## (Page|Diagram)') {
                $name = $lines[$i].Substring(3).Trim()
                New-BaEntity 'solution-context' $name ($stem + '#' + $name.ToLowerInvariant().Replace(' ', '-')) 'Component' "Component under $title" $tags $relative ($i + 1)
            }
        }
    } elseif ($relative.Contains('/wiki') -and $stem -ne 'index') {
        New-BaEntity 'wiki' $title $stem $(if ($status) { $status } else { 'Documented' }) $(if ($description) { $description } else { "Wiki Topic: $title" }) $tags $relative
    }
}

function Get-BaExcerpts {
    param($Document, [regex]$Pattern)
    $lines = $Document.content -split "`n"; $heading = ''; $frontmatterEnd = 0; $coveredEnd = 0; $count = 0
    if ($lines.Count -and $lines[0].Trim() -eq '---') {
        for ($i = 1; $i -lt $lines.Count; $i++) { if ($lines[$i].Trim() -eq '---') { $frontmatterEnd = $i + 1; break } }
    }
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $lineNumber = $i + 1
        if ($lines[$i].StartsWith('#')) { $heading = $lines[$i].Trim() }
        if ($lineNumber -le $frontmatterEnd -or $lineNumber -le $coveredEnd -or -not $Pattern.IsMatch($lines[$i])) { continue }
        $start = [Math]::Max($frontmatterEnd + 1, $lineNumber - 2)
        $end = [Math]::Min($lines.Count, $lineNumber + 3); $coveredEnd = $end
        @{ file = $Document.file; line = $lineNumber; heading = if ($heading) { $heading } else { "Line $lineNumber" }; snippet = ($lines[($start - 1)..($end - 1)] -join "`n").Trim() }
        $count++; if ($count -ge 3) { break }
    }
}

function Invoke-BaQuery {
    param([string]$Query, $State)
    $wildcard = $Query.Contains('*') -or $Query.Contains('?')
    if ($wildcard) {
        $patternText = ''
        foreach ($character in $Query.ToCharArray()) {
            if ($character -eq '*') { $patternText += '[A-Za-z0-9_\-]*' }
            elseif ($character -eq '?') { $patternText += '[A-Za-z0-9_\-]' }
            else { $patternText += [regex]::Escape([string]$character) }
        }
    } else { $patternText = '\b' + [regex]::Escape($Query) + '\b' }
    $pattern = New-Object Text.RegularExpressions.Regex($patternText, [Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $weighted = @(Get-BaWeightedQuery $Query)
    $entities = @(); $seen = @{}
    foreach ($entity in $State.entities) {
        $text = "$($entity.name) $($entity.id) $($entity.description) $($entity.tags -join ' ')"
        $score = 0.0; $kind = 'EXACT'
        if ($pattern.IsMatch($text)) { $score = 1.0; if ($wildcard) { $kind = 'WILDCARD' } }
        elseif ($State.mode -in @('semantic', 'hybrid')) {
            $counts = Get-BaTermCounts @(Get-BaTokens $text); $overlap = 0.0
            foreach ($term in $weighted) { if ($counts.ContainsKey($term.term)) { $overlap += $term.weight * $counts[$term.term] } }
            if ($overlap -gt 0.8) { $score = [Math]::Min(0.9, 0.4 + $overlap * 0.15); $kind = 'SEMANTIC' }
        }
        if ($score -gt 0) {
            $key = "$($entity.entity_type):$($entity.id):$($entity.file)"
            if (-not $seen.ContainsKey($key)) { $seen[$key] = $true; $copy = $entity.Clone(); $copy.score = [Math]::Round($score, 3); $copy.match_type = $kind; $entities += $copy }
        }
    }
    $entities = @($entities | Sort-Object @{Expression = { $_.score }; Descending = $true}, @{Expression = { $_.file }}, @{Expression = { $_.line }})
    $excerpts = @(); $matchedFiles = 0
    if ($State.mode -in @('exact', 'wildcard', 'hybrid')) {
        foreach ($document in $State.documents) {
            $snippets = @(Get-BaExcerpts $document $pattern)
            if ($snippets.Count) {
                $matchedFiles++
                foreach ($snippet in $snippets) { $snippet.match_type = if ($wildcard) { 'WILDCARD' } else { 'EXACT' }; $excerpts += $snippet }
                if ($matchedFiles -ge $State.maximum) { break }
            }
        }
    }
    if ($State.mode -in @('semantic', 'hybrid') -and $excerpts.Count -lt $State.maximum) {
        $scored = @(); $corpusSize = $State.documents.Count
        foreach ($document in $State.documents) {
            $score = 0.0
            foreach ($term in $weighted) {
                if (-not $document.term_counts.ContainsKey($term.term)) { continue }
                $frequency = $document.term_counts[$term.term]; $df = $State.document_frequencies[$term.term]
                $idf = [Math]::Log((($corpusSize - $df + 0.5) / ($df + 0.5)) + 1.0)
                $average = if ($State.average_length) { $State.average_length } else { 1.0 }
                $denominator = $frequency + 1.5 * (0.25 + 0.75 * ($document.length / $average))
                $score += $term.weight * $idf * ($frequency * 2.5) / $denominator
            }
            if ($score -gt 0.5) { $scored += @{ document = $document; score = $score } }
        }
        $existing = @{}; foreach ($excerpt in $excerpts) { $existing[$excerpt.file] = $true }
        foreach ($match in @($scored | Sort-Object @{Expression = { $_.score }; Descending = $true}, @{Expression = { $_.document.file }} | Select-Object -First $State.maximum)) {
            if ($existing.ContainsKey($match.document.file)) { continue }
            $bodyLines = @($match.document.content -split "`n" | Where-Object { -not $_.StartsWith('#') -and $_.Trim() } | Select-Object -First 3)
            $snippet = if ($bodyLines.Count) { $bodyLines -join "`n" } else { $match.document.content.Substring(0, [Math]::Min(200, $match.document.content.Length)) }
            $excerpts += @{ file = $match.document.file; line = 1; heading = 'Semantic Match (BM25)'; snippet = $snippet.Trim(); score = [Math]::Round($match.score, 3); match_type = 'SEMANTIC' }
        }
    }
    return @{ query = $Query; is_wildcard = $wildcard; matched_entities = @($entities | Select-Object -First $State.maximum); content_matches = @($excerpts | Select-Object -First $State.maximum) }
}

function Invoke-BaSearchWorkers {
    param([object[]]$Items, [scriptblock]$Work, $State)
    if (-not $Items.Count) { return }
    $pool = [RunspaceFactory]::CreateRunspacePool(1, [Math]::Min(8, $Items.Count))
    $jobs = New-Object 'System.Collections.Generic.List[object]'
    $helperScript = Join-Path $PSScriptRoot 'search_engine.ps1'
    try {
        $pool.Open()
        foreach ($item in $Items) {
            $worker = [PowerShell]::Create(); $worker.RunspacePool = $pool
            [void]$worker.AddScript($Work.ToString()).AddArgument($helperScript).AddArgument($item).AddArgument($State)
            $jobs.Add(@{ worker = $worker; handle = $worker.BeginInvoke() })
        }
        # Collect in input order and wait for every worker before aggregation.
        foreach ($job in $jobs) {
            $output = $job.worker.EndInvoke($job.handle)
            if ($job.worker.HadErrors) { throw ($job.worker.Streams.Error | Out-String) }
            foreach ($value in $output) { $value }
        }
    } finally {
        foreach ($job in $jobs) { $job.worker.Dispose() }
        $pool.Dispose()
    }
}

