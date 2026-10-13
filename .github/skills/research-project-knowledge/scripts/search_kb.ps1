# Exact, wildcard, and BM25 search with bounded parallel ingestion and queries.
. (Join-Path $PSScriptRoot 'search_engine.ps1')
try {
    $options = Read-BaArguments $args -Values @('root', 'tier', 'mode', 'entity', 'max-results', 'query') -Switches @('list-entities', 'parallel', 'json') -Aliases @{ q = 'query' } -AllowPositionals
    if ($options.help) { [Console]::WriteLine('search_kb.ps1 QUERY... [-q QUERY] [--root PATH] [--tier 1|2|all] [--mode hybrid|exact|wildcard|semantic] [--entity TYPE] [--list-entities] [--max-results N] [--parallel] [--json]'); exit 0 }
    $root = Get-BaRoot $options.root
    $tier = if ($options.tier) { $options.tier } else { 'all' }
    $mode = if ($options.mode) { $options.mode } else { 'hybrid' }
    $filter = if ($options.entity) { $options.entity } else { 'all' }
    if ($tier -notin @('1', '2', 'all')) { throw '--tier must be 1, 2, or all.' }
    if ($mode -notin @('hybrid', 'exact', 'wildcard', 'semantic')) { throw 'Unknown search mode.' }
    if ($filter -notin @('all', 'glossary', 'solution-context', 'epic', 'story', 'wiki')) { throw 'Unknown entity type.' }
    $maximum = 10
    if ($options['max-results'] -and (-not [int]::TryParse($options['max-results'], [ref]$maximum) -or $maximum -lt 1)) { throw '--max-results must be a positive integer.' }
    $queries = @($options.positional)
    if ($options.query) { $queries += $options.query }
    if (-not $options['list-entities'] -and (-not $queries.Count -or @($queries | Where-Object { -not $_.Trim() }).Count)) { throw 'Search query required unless --list-entities is used.' }
    $files = @()
    if ($tier -in @('1', 'all')) { $files += @(Get-BaFiles (Join-Path $root '.agent-artifacts/project-knowledge-base') -Extensions @('.md') | Sort-Object FullName) }
    if ($tier -in @('2', 'all')) { $files += @(Get-BaFiles (Join-Path $root '.agent-artifacts/requirements/output') -Extensions @('.md') | Sort-Object FullName) }
    $paths = @($files | Where-Object Name -ne 'log.md' | ForEach-Object { $_.FullName })
    $ingested = @(Invoke-BaSearchWorkers $paths {
        param($helper, $path, $rootPath)
        . $helper
        $info = Get-BaDocumentInfo $path
        $tokens = @(Get-BaTokens $info.content)
        @{ document = @{ file = Get-BaRelativePath $path $rootPath; content = $info.content; length = $tokens.Count; term_counts = Get-BaTermCounts $tokens }; entities = @(Get-BaEntities $path $rootPath $info) }
    } $root)
    $documents = @(); $entities = @(); $frequencies = @{}; $totalLength = 0
    foreach ($item in $ingested) {
        $document = $item.document; $documents += $document; $entities += @($item.entities); $totalLength += $document.length
        foreach ($term in $document.term_counts.Keys) { if (-not $frequencies.ContainsKey($term)) { $frequencies[$term] = 0 }; $frequencies[$term]++ }
    }
    if ($filter -ne 'all') { $entities = @($entities | Where-Object entity_type -eq $filter) }
    if ($options['list-entities']) {
        if ($options.json) { Write-BaJson ([ordered]@{ mode = 'list_entities'; tier = $tier; total = $entities.Count; entities = @($entities) }) }
        else { foreach ($entity in $entities) { [Console]::WriteLine("[$($entity.entity_type)] $($entity.id) | $($entity.name) | $($entity.status) | $($entity.file)#L$($entity.line)") } }
        exit 0
    }
    $state = @{ entities = $entities; documents = $documents; document_frequencies = $frequencies; average_length = if ($documents.Count) { $totalLength / [double]$documents.Count } else { 0.0 }; mode = $mode; maximum = $maximum }
    $results = @(Invoke-BaSearchWorkers $queries {
        param($helper, $query, $searchState)
        . $helper
        Invoke-BaQuery $query $searchState
    } $state)
    $found = @{}; $excerpts = @(); $seenExcerpts = @{}
    foreach ($result in $results) {
        foreach ($entity in $result.matched_entities) {
            $key = "$($entity.entity_type):$($entity.id):$($entity.file)"
            if (-not $found.ContainsKey($key) -or $entity.score -gt $found[$key].score) { $found[$key] = $entity }
        }
        foreach ($excerpt in $result.content_matches) {
            $key = "$($excerpt.file):$($excerpt.line)"
            if (-not $seenExcerpts.ContainsKey($key)) { $seenExcerpts[$key] = $true; $excerpts += $excerpt }
        }
    }
    $aggregated = @($found.Values | Sort-Object @{Expression = { $_.score }; Descending = $true}, @{Expression = { $_.file }}, @{Expression = { $_.line }})
    if ($options.json) {
        Write-BaJson ([ordered]@{
            search_summary = [ordered]@{ queries = @($queries); mode = $mode; tier = $tier; parallel_execution = $true; total_entities_matched = $aggregated.Count; total_excerpts_matched = $excerpts.Count }
            queries_detail = @($results)
            full_picture = [ordered]@{ entities = @($aggregated | Select-Object -First ($maximum * 2)); excerpts = @($excerpts | Select-Object -First ($maximum * 2)) }
        })
    } else {
        [Console]::WriteLine("KB SEARCH: $($queries -join ', ') | Mode: $mode | Tier: $tier | $($aggregated.Count) entities, $($excerpts.Count) excerpts")
        foreach ($entity in @($aggregated | Select-Object -First ($maximum * 2))) { [Console]::WriteLine("[$($entity.entity_type)|$($entity.match_type)] $($entity.id) | $($entity.name) | $($entity.status) | $($entity.description) | $($entity.file)#L$($entity.line)") }
        foreach ($excerpt in @($excerpts | Select-Object -First ($maximum * 2))) { [Console]::WriteLine("$($excerpt.file)#L$($excerpt.line) [$($excerpt.match_type)] $($excerpt.heading)`n$($excerpt.snippet)") }
    }
    exit 0
} catch { [Console]::Error.WriteLine($_.Exception.Message); exit 2 }
