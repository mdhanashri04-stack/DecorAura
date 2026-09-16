# DecorAura PowerShell Shutdown Script
$ErrorActionPreference = "SilentlyContinue"

Write-Host "===================================================" -ForegroundColor Yellow
Write-Host "             DecorAura Shutdown                    " -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Yellow
Write-Host ""

$ports = @(5173, 8000)
$stoppedCount = 0

foreach ($port in $ports) {
    # Find listening connections on target port
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($conns) {
        foreach ($conn in $conns) {
            $pidToKill = $conn.OwningProcess
            if ($pidToKill -and $pidToKill -ne 0) {
                try {
                    $proc = Get-Process -Id $pidToKill -ErrorAction SilentlyContinue
                    if ($proc) {
                        Write-Host "[STOP] Terminating process $($proc.ProcessName) (PID: $pidToKill) on port $port..." -ForegroundColor Yellow
                        Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
                        $stoppedCount++
                    }
                } catch {}
            }
        }
    }
}

# Additional check via netstat if Get-NetTCPConnection misses anything
foreach ($port in $ports) {
    $netstatLines = netstat -ano | Select-String ":$port\s+.*LISTENING\s+(\d+)"
    foreach ($line in $netstatLines) {
        if ($line.Matches[0].Groups[1].Value) {
            $pidToKill = [int]$line.Matches[0].Groups[1].Value
            if ($pidToKill -gt 0) {
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Write-Host ""
if ($stoppedCount -gt 0) {
    Write-Host "[SUCCESS] DecorAura services on ports 5173 & 8000 stopped." -ForegroundColor Green
} else {
    Write-Host "[INFO] No active DecorAura services were running on ports 5173 or 8000." -ForegroundColor Cyan
}

Write-Host "===================================================" -ForegroundColor Yellow
