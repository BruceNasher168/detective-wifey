# Render a local HTML wireframe using an installed Chromium/Edge browser.
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

function ConvertTo-BaNativeArgument {
    param([AllowEmptyString()][string]$Value)
    # CommandLineToArgvW quoting, including quotes and trailing backslashes.
    if ($Value -and $Value -notmatch '[\s"]') { return $Value }
    $escaped = [regex]::Replace($Value, '(\\*)"', '$1$1\"')
    $escaped = [regex]::Replace($escaped, '(\\+)$', '$1$1')
    return '"' + $escaped + '"'
}

function Invoke-BaProcess {
    param([string]$Executable, [string[]]$Arguments, [string]$WorkingDirectory = (Get-Location).Path,
          [int]$TimeoutSeconds = 30, [string]$InputText)
    $start = New-Object Diagnostics.ProcessStartInfo
    $start.FileName = $Executable
    $start.Arguments = (@($Arguments | ForEach-Object { ConvertTo-BaNativeArgument $_ }) -join ' ')
    $start.WorkingDirectory = $WorkingDirectory
    $start.UseShellExecute = $false
    $start.CreateNoWindow = $true
    $start.RedirectStandardOutput = $true
    $start.RedirectStandardError = $true
    $start.RedirectStandardInput = $true
    $start.StandardOutputEncoding = New-Object Text.UTF8Encoding($false)
    $start.StandardErrorEncoding = New-Object Text.UTF8Encoding($false)
    $process = New-Object Diagnostics.Process
    $process.StartInfo = $start
    try {
        [void]$process.Start()
        $stdout = $process.StandardOutput.ReadToEndAsync()
        $stderr = $process.StandardError.ReadToEndAsync()
        if ($null -ne $InputText) { $process.StandardInput.Write($InputText) }
        $process.StandardInput.Close()
        if (-not $process.WaitForExit($TimeoutSeconds * 1000)) {
            try { $process.Kill() } catch { }
            throw "Process timed out after ${TimeoutSeconds}s: $Executable"
        }
        return @{ exit_code = $process.ExitCode; stdout = $stdout.Result; stderr = $stderr.Result }
    } finally { $process.Dispose() }
}

function Find-WireframeBrowser {
    foreach ($name in @('msedge', 'chrome', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge')) {
        $command = Get-Command $name -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($command) { return $command.Source }
    }
    $locations = @()
    foreach ($base in @(${env:ProgramFiles(x86)}, $env:ProgramFiles, $env:LOCALAPPDATA)) {
        if ($base) {
            $locations += Join-Path $base 'Microsoft/Edge/Application/msedge.exe'
            $locations += Join-Path $base 'Google/Chrome/Application/chrome.exe'
        }
    }
    $locations += @('/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/microsoft-edge', '/snap/bin/chromium')
    foreach ($path in $locations) { if ([IO.File]::Exists($path)) { return $path } }
    throw 'No Chromium or Edge browser executable found. Install one or supply --browser PATH.'
}

$profile = $null; $temporaryOutput = $null
try {
    $options = Read-BaArguments $args -Values @('input', 'output', 'viewport', 'scale', 'timeout', 'browser')
    if ($options.help) { [Console]::WriteLine('render_screenshot.ps1 --input PATH [--output PATH] [--viewport desktop|desktop-large|tablet|mobile|WIDTHxHEIGHT] [--scale N] [--timeout SECONDS] [--browser PATH]'); exit 0 }
    if (-not $options.input) { throw '--input is required.' }
    $inputPath = Resolve-BaPath $options.input
    if (-not [IO.File]::Exists($inputPath)) { throw "Input HTML file does not exist: $inputPath" }
    $outputPath = if ($options.output) { Resolve-BaPath $options.output } else { [IO.Path]::ChangeExtension($inputPath, '.png') }
    if ($inputPath -eq $outputPath) { throw 'Screenshot output must differ from the input HTML file.' }
    $presets = @{ desktop = @(1280, 800); 'desktop-large' = @(1440, 900); tablet = @(768, 1024); mobile = @(375, 812) }
    $viewport = if ($options.viewport) { $options.viewport.Trim().ToLowerInvariant() } else { 'desktop' }
    if ($presets.ContainsKey($viewport)) { $width = $presets[$viewport][0]; $height = $presets[$viewport][1] }
    elseif ($viewport -match '^(\d+)x(\d+)$' -and [int]$Matches[1] -gt 0 -and [int]$Matches[2] -gt 0) { $width = [int]$Matches[1]; $height = [int]$Matches[2] }
    else { throw 'Invalid viewport. Use a preset or positive WIDTHxHEIGHT.' }
    $scale = 1.0
    if ($options.scale -and (-not [double]::TryParse($options.scale, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$scale) -or $scale -le 0 -or [double]::IsNaN($scale) -or [double]::IsInfinity($scale))) { throw '--scale must be a positive finite number.' }
    $timeout = 15
    if ($options.timeout -and (-not [int]::TryParse($options.timeout, [ref]$timeout) -or $timeout -lt 1)) { throw '--timeout must be a positive integer.' }
    $browser = if ($options.browser) { Resolve-BaPath $options.browser } else { Find-WireframeBrowser }
    if (-not [IO.File]::Exists($browser)) { throw "Browser executable does not exist: $browser" }
    [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($outputPath))
    $profile = Join-Path ([IO.Path]::GetTempPath()) ('wf_render_' + [Guid]::NewGuid().ToString('N'))
    [void][IO.Directory]::CreateDirectory($profile)
    $temporaryOutput = $outputPath + '.' + [Guid]::NewGuid().ToString('N') + '.png'
    $browserArguments = @('--headless=new', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars', "--user-data-dir=$profile", "--window-size=$width,$height", ('--force-device-scale-factor=' + $scale.ToString([Globalization.CultureInfo]::InvariantCulture)), "--screenshot=$temporaryOutput", ([Uri]$inputPath).AbsoluteUri)
    $result = Invoke-BaProcess $browser $browserArguments -TimeoutSeconds $timeout
    if ($result.exit_code -ne 0) { throw "Browser exited $($result.exit_code): $($result.stderr.Trim())" }
    if (-not [IO.File]::Exists($temporaryOutput)) { throw "Screenshot was not generated: $($result.stderr.Trim())" }
    $bytes = [IO.File]::ReadAllBytes($temporaryOutput)
    if ($bytes.Length -lt 24 -or [BitConverter]::ToString($bytes, 0, 8) -ne '89-50-4E-47-0D-0A-1A-0A') { throw 'Browser output is not a valid PNG screenshot.' }
    if ([IO.File]::Exists($outputPath)) {
        try { [IO.File]::Replace($temporaryOutput, $outputPath, [NullString]::Value, $true) }
        catch {
            [IO.File]::Copy($temporaryOutput, $outputPath, $true)
            [IO.File]::Delete($temporaryOutput)
        }
    }
    else { [IO.File]::Move($temporaryOutput, $outputPath) }
    [Console]::WriteLine("SUCCESS: Rendered screenshot (${width}x${height}, scale $scale): $outputPath")
    exit 0
} catch { [Console]::Error.WriteLine($_.Exception.Message); exit 1 }
finally {
    if ($temporaryOutput -and [IO.File]::Exists($temporaryOutput)) { [IO.File]::Delete($temporaryOutput) }
    if ($profile -and [IO.Directory]::Exists($profile)) {
        $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
        if ([IO.Path]::GetFullPath($profile).StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase) -and [IO.Path]::GetFileName($profile).StartsWith('wf_render_')) {
            try { [IO.Directory]::Delete($profile, $true) } catch { [Console]::Error.WriteLine("Could not remove browser profile: $profile") }
        }
    }
}
