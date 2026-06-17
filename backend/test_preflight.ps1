try {
	$headers = @{
		'Origin' = 'http://costestimate.com:8081'
		'Access-Control-Request-Method' = 'POST'
		'Access-Control-Request-Headers' = 'content-type'
	}
	$r = Invoke-WebRequest -Uri 'http://costestimate.com:7283/api/auth/login' -Method OPTIONS -UseBasicParsing -Headers $headers -TimeoutSec 10
	Write-Output "Status: $($r.StatusCode)"
	Write-Output "Headers:" 
	foreach ($k in $r.Headers.Keys) {
		$v = $r.Headers[$k]
	Write-Output ($k + ': ' + $v)
	}
} catch {
	Write-Output "Exception: $($_.Exception.Message)"
	if ($_.Exception.Response -ne $null) {
		Write-Output "Response Headers:" 
		foreach ($k in $_.Exception.Response.Headers.Keys) {
			$v = $_.Exception.Response.Headers[$k]
			Write-Output ($k + ': ' + $v)
		}
	}
}
