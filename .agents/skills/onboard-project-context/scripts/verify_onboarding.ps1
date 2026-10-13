# Audit onboarding readiness and optionally create the review checklist.
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

function Add-OnboardingCheck {
    param([string]$Category, [string]$Name, [string]$Status, [string]$Details)
    $checks.Add([ordered]@{ category = $Category; name = $Name; status = $Status; details = $Details })
}

try {
    $options = Read-BaArguments $args -Values @('root', 'output') -Switches @('json', 'checklist')
    if ($options.help) { [Console]::WriteLine('verify_onboarding.ps1 [--root PATH] [--json] [--checklist] [--output PATH]'); exit 0 }
    $root = Get-BaRoot $options.root
    $checks = New-Object 'System.Collections.Generic.List[object]'
    $summaryPath = Join-Path $root 'project-summary.md'; $summary = ''
    if (-not [IO.File]::Exists($summaryPath)) {
        Add-OnboardingCheck 'Pillar 1: Project Summary' 'project-summary.md existence' 'FAIL' 'project-summary.md is missing from repository root. Must be created before handoff.'
    } else {
        $summary = Read-BaText $summaryPath
        $sections = [ordered]@{
            'Domain / Overview' = '##\s+(?:Domain|Overview|System Overview|Project Overview)'
            'Architecture / Tech Stack' = '##\s+(?:Architecture|System Architecture|Technology Stack|Tech Stack)'
            'Actors / Roles' = '##\s+(?:Actors|User Roles|Personas|Key Users)'
            'Commercial Scope / SOW Baseline' = '##\s+(?:Commercial Scope|SOW|Scope Baseline|Contractual Boundary|Change Request)'
        }
        $missing = @($sections.Keys | Where-Object { $summary -notmatch $sections[$_] })
        if ($missing.Count) { Add-OnboardingCheck 'Pillar 1: Project Summary' 'Required summary sections' 'WARN' "project-summary.md is missing recommended sections: $($missing -join ', ')" }
        else { Add-OnboardingCheck 'Pillar 1: Project Summary' 'project-summary.md completeness' 'PASS' 'All core sections present (Domain, Architecture, Actors, Commercial Scope Baseline).' }
    }
    $kb = Join-Path $root '.agent-artifacts/project-knowledge-base'
    if (-not [IO.Directory]::Exists($kb)) {
        Add-OnboardingCheck 'Pillar 2: Knowledge Base' 'Knowledge Base directory existence' 'FAIL' '.agent-artifacts/project-knowledge-base/ does not exist.'
    } else {
        $wikiCount = @(Get-ChildItem -LiteralPath (Join-Path $kb 'wiki') -Filter '*.md' -File -ErrorAction SilentlyContinue | Where-Object Name -ne 'index.md').Count
        if ($wikiCount) { Add-OnboardingCheck 'Pillar 2: Knowledge Base' 'Wiki articles & progressive stubs' 'PASS' "$wikiCount wiki articles/stubs indexed." }
        else { Add-OnboardingCheck 'Pillar 2: Knowledge Base' 'Wiki articles & progressive stubs' 'WARN' 'No wiki articles or mapped stubs found in wiki/. Run map_knowledge_base.ps1 to index project docs.' }
        $glossaryCount = @(Get-ChildItem -LiteralPath (Join-Path $kb 'glossary') -Filter '*.md' -File -ErrorAction SilentlyContinue | Where-Object Name -ne 'index.md').Count
        Add-OnboardingCheck 'Pillar 2: Knowledge Base' 'Glossary terms' $(if ($glossaryCount) { 'PASS' } else { 'WARN' }) "$glossaryCount glossary terms registered."
    }
    $requirements = Join-Path $root '.agent-artifacts/requirements'
    if (-not [IO.Directory]::Exists($requirements)) {
        Add-OnboardingCheck 'Pillar 3: Requirements Workbench' 'Requirements workbench structure' 'FAIL' '.agent-artifacts/requirements/ does not exist.'
    } else {
        $hasInput = [IO.File]::Exists((Join-Path $requirements 'input/index.md'))
        $hasOutput = [IO.File]::Exists((Join-Path $requirements 'output/index.md'))
        if ($hasInput -and $hasOutput) { Add-OnboardingCheck 'Pillar 3: Requirements Workbench' 'Delivery workbench indexes' 'PASS' 'input/index.md and output/index.md are properly configured.' }
        else { Add-OnboardingCheck 'Pillar 3: Requirements Workbench' 'Delivery workbench indexes' 'WARN' "Missing indexes (input: $hasInput, output: $hasOutput). Run sync_indexes.ps1." }
    }
    $refPaths = @(
        (Join-Path $root '.agents/skills/sync-backlog/references')
    )
    $hasMapping = $false
    foreach ($rPath in $refPaths) {
        if ([IO.File]::Exists((Join-Path $rPath 'jira-field-mapping.md')) -or [IO.File]::Exists((Join-Path $rPath 'ado-field-mapping.md'))) {
            $hasMapping = $true
            break
        }
    }
    if ($hasMapping) {
        Add-OnboardingCheck 'Pillar 4: ALM & Backlog' 'Backlog field mappings file' 'PASS' 'Jira or ADO field mapping reference file is present in sync-backlog.'
    } else { Add-OnboardingCheck 'Pillar 4: ALM & Backlog' 'Backlog field mappings file' 'WARN' 'Neither jira-field-mapping.md nor ado-field-mapping.md found in sync-backlog/references/.' }

    $instrFiles = @(
        (Join-Path $root 'AGENTS.md')
    )
    $governanceChecked = $false
    foreach ($iFile in $instrFiles) {
        if ([IO.File]::Exists($iFile)) {
            $content = Read-BaText $iFile
            $hasBa = $content.Contains('business-analyst')
            $hasOnboard = $content.Contains('ba-onboarding')
            if ($hasBa -and $hasOnboard) {
                Add-OnboardingCheck 'Pillar 5: Agent Governance' 'Workspace instruction registration' 'PASS' "$([IO.Path]::GetFileName($iFile)): ba-onboarding and business-analyst are registered in responsibility boundaries."
                $governanceChecked = $true
                break
            }
        }
    }
    if (-not $governanceChecked) {
        Add-OnboardingCheck 'Pillar 5: Agent Governance' 'Workspace instruction registration' 'WARN' 'Missing boundary registrations for ba-onboarding and business-analyst in AGENTS.md.'
    }
    if ($summary -match '(?:Script Commit Policy|Repository Governance|Artifact Hosting|Source Code Commit)') {
        Add-OnboardingCheck 'Pillar 5: Repository Governance' 'Script commit policy documentation' 'PASS' 'Artifact hosting and script commit policy documented in project-summary.md.'
    } else { Add-OnboardingCheck 'Pillar 5: Repository Governance' 'Script commit policy documentation' 'WARN' 'Script commit policy not explicitly documented in project-summary.md. Confirm if scripts may be committed or if .gitignore is required.' }
    $pass = @($checks | Where-Object status -eq 'PASS').Count
    $warn = @($checks | Where-Object status -eq 'WARN').Count
    $fail = @($checks | Where-Object status -eq 'FAIL').Count
    $status = if ($fail -eq 0) { 'READY' } else { 'ACTION REQUIRED' }
    $timestamp = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
    $report = [ordered]@{ timestamp = $timestamp; workspace_root = $root; overall_status = $status; counts = @{ total = $checks.Count; pass = $pass; warn = $warn; fail = $fail }; checks = @($checks.ToArray()) }
    $lines = @('# Project Onboarding Review & Readiness Checklist', '', "> **Audit Date**: ``$timestamp``", "> **Overall Status**: **``$status``** ($pass Passed, $warn Warnings, $fail Critical)", '', '## 1. Automated Verification Audit', '', '| Checkpoint | Category | Status | Details |', '|---|---|:---:|---|')
    foreach ($check in $checks) { $lines += "| $($check.name) | $($check.category) | [$($check.status)] | $($check.details.Replace('|', '\|')) |" }
    $lines += @('', '## 2. Business Analyst Manual Sign-off Checklist', '',
        '- [ ] **Context Alignment**: project-summary.md accurately captures client terminology, key stakeholders, and domain boundaries.',
        '- [ ] **Commercial Scope**: Contractual baseline (MVP scope vs Change Request triggers) is verified against the signed SOW.',
        '- [ ] **Repository Governance & Script Commit Policy**: Confirm artifact hosting and permission to commit scripts/artifacts, or configure .gitignore.',
        '- [ ] **Knowledge Retrieval**: Test `powershell -NoProfile -File .agents/skills/research-project-knowledge/scripts/search_kb.ps1 -q "<query>"` and confirm relevant stubs.',
        '- [ ] **ALM Connection**: If using Jira/ADO, verify project key, issue types, and board transitions.',
        '- [ ] **Definition of Ready (DoR)**: Verify custom acceptance criteria rules or story point thresholds.', '', '## 3. Delivery Handoff Recommendation', '')
    if ($fail -eq 0) { $lines += '**PASSED**: Transition to `@business-analyst` to begin active elicitation and sprint delivery.' }
    else { $lines += '**BLOCKED / ACTION REQUIRED**: Resolve all `[FAIL]` checkpoints before handing off delivery tasks.' }
    $checklist = ($lines -join "`n") + "`n"
    if ($options.output) {
        $output = Resolve-BaPath $options.output $root
        [void](Write-BaText $output $checklist)
        if (-not $options.json -and -not $options.checklist) { [Console]::WriteLine("Checklist saved to: $output") }
    }
    if ($options.json) { Write-BaJson $report }
    elseif ($options.checklist) { [Console]::Write($checklist) }
    else {
        [Console]::WriteLine("ONBOARDING AUDIT: $root | $status | $pass Passed, $warn Warnings, $fail Failed")
        foreach ($check in $checks) { [Console]::WriteLine("[$($check.status)] $($check.category): $($check.name) - $($check.details)") }
    }
    if ($fail) { exit 1 }; exit 0
} catch { [Console]::Error.WriteLine($_.Exception.Message); exit 2 }
