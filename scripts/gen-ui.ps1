param (
    [Parameter(Mandatory = $true)]
    [string]$ComponentName,
    [Parameter(Mandatory = $true)]
    [string]$TargetDir,
    [Parameter(Mandatory = $false)]
    [string]$Tag = "div"
)

# --- .env.path 파일 자동 파싱 (변수명 치환용 딕셔너리) ---
$EnvFile = Join-Path $PSScriptRoot "..\.env.path"
$envMap = @{}
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^\s*#') { return }
        if ($_ -match '^\s*$') { return }
        $kv = $_ -split '=', 2
        if ($kv.Length -eq 2) {
            $key = $kv[0].Trim()
            $val = $kv[1].Trim()
            $envMap[$key] = $val
        }
    }
}

# 두 번째 인자가 env파일의 key면 실제 경로로 치환, 아니면 에러
if ($envMap.ContainsKey($TargetDir)) {
    $TargetDir = $envMap[$TargetDir]
} else {
    Write-Host "[ERROR] .env.path 파일에 등록된 경로 alias만 사용할 수 있습니다. ($TargetDir 없음)" -ForegroundColor Red
    exit 1
}

if (-not $TargetDir -or $TargetDir -eq "") {
    Write-Host "필수: 두 번째 인자로 경로를 명시하세요. (예: .\\scripts\\gen-ui.ps1 컴포넌트명 COMMON_UI)" -ForegroundColor Red
    exit 1
}

function To-PascalCase ($str) {
    return -join ($str -replace '[-_]' , ' ' -split ' ' | ForEach-Object {
        if ($_.Length -gt 0) { $_.Substring(0,1).ToUpper() + $(if ($_.Length -gt 1) { $_.Substring(1).ToLower() } else { "" }) } else { "" }
    })
}
function To-CamelCase ($str) {
    if ($str.Length -eq 0) { return "" }
    return $str.Substring(0,1).ToLower() + $(if ($str.Length -gt 1) { $str.Substring(1) } else { "" })
}

$Name = To-PascalCase $ComponentName
$StyleClass = "${Name}Style"
$StyleName = (To-CamelCase $StyleClass) + ".styles"
$StyleFile = "$StyleName.ts"

# 절대 경로로 변환 (루트 기준)
$RootDir = Resolve-Path "$PSScriptRoot/.."
if ($TargetDir -notmatch '^[A-Za-z]:') {
    $AbsTargetDir = Join-Path $RootDir $TargetDir
} else {
    $AbsTargetDir = $TargetDir
}
$Dir = Join-Path $AbsTargetDir $Name

if (Test-Path $Dir) {
    Write-Host "Already exists: $Dir"
    exit 1
}

New-Item -Path $Dir -ItemType Directory -Force | Out-Null

$tsx = @"
'use client';

import type { ReactNode } from 'react';
import * as S from './$StyleName';

interface Props {
  children: ReactNode;
}

export const $Name = ({
  children,
}: Props) => {
  return (
    <S.$StyleClass>
      {children}
    </S.$StyleClass>
  );
};
"@
Set-Content -Path (Join-Path $Dir "index.tsx") -Value $tsx -Encoding utf8

$style = @'
import styled from '@emotion/styled';

export const $StyleClass = styled.$Tag`
  /* add style */
  display: block;
`;
'@

$style = $style.Replace('$Tag', $Tag)
$style = $style.Replace('$StyleClass', $StyleClass)

Set-Content -Path (Join-Path $Dir $StyleFile) -Value $style -Encoding utf8

Write-Host " Created $Dir"
Write-Host "   - index.tsx"
Write-Host "   - $StyleFile"


# 컴포넌트 생성 명령어
# pnpm run cc -- {컴포넌트 이름} {경로} {태그}
# 예시 pnpm run cc -- large-button COMMON_UI button
# 경로는 .env.path에 설정된 값입니다
# 태그는 생략 가능하며, 생략하면 div로 생성됩니다. pnpm run cc -- large-button COMMON_UI
