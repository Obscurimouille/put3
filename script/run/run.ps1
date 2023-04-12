﻿# Import the required assembly
Add-Type -AssemblyName System.Windows.Forms

$defaultIpAdress = "localhost"  # Host ip adress
$defaultAppPort = "4200"        # Angular webserver default port
$defaultApiPort = "3000"        # Express server port

$screenshotPath = Join-Path (Get-Location).Path 'desktop.jpg'   # Save at the same location as this script


# ---------------------------------------------------------------------------- #
#                                  USER INPUTS                                 #
# ---------------------------------------------------------------------------- #

# Prompt the user for an IP address
$ipAddress = Read-Host "Enter IP address (default is localhost)"
if ([string]::IsNullOrWhiteSpace($ipAddress)) {
    $ipAddress = $defaultIpAdress
}
# Prompt the user for the app port
$appPort = Read-Host "Enter port number (default is 4200)"
if ([string]::IsNullOrWhiteSpace($port)) {
    $appPort = $defaultAppPort
}
# Prompt the user for the server port
$apiPort = Read-Host "Enter port number (default is 3000)"
if ([string]::IsNullOrWhiteSpace($port)) {
    $apiPort = $defaultApiPort
}

# Construct the URLs
$appUrl = "http://${ipAddress}:${appPort}/fool"
$apiUrl = "http://${ipAddress}:${apiPort}/desktop/set"

# ---------------------------------------------------------------------------- #
#                              DESKTOP SCREENSHOT                              #
# ---------------------------------------------------------------------------- #

Write-Output "[*] Take a screenshot of user desktop"

# Back to desktop
(New-Object -ComObject Shell.Application).ToggleDesktop()
Start-Sleep -Seconds 1

# Create a bitmap of the user's desktop
$bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)

# Handle image save
try {
   $bitmap.Save($screenshotPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
   Write-Output " - Screenshot saved to: $screenshotPath"
} catch {
   Write-Host "[!] Error occurred while saving the screenshot: $_"
   Start-Sleep -Seconds 4
   exit
}

# Free resources
$graphics.Dispose()
$bitmap.Dispose()


# ---------------------------------------------------------------------------- #
#                              POST THE SCREENSHOT                             #
# ---------------------------------------------------------------------------- #

Write-Output "[*] Post the screenshot"

# Check if the screenshot image exists
if (-not (Test-Path $screenshotPath -PathType Leaf)) {
   Write-Output "[!] No screenshot image found at: $screenshotPath"
   Start-Sleep -Seconds 4
   exit
}

# Post the file to the specified route
$fileBytes = [System.IO.File]::ReadAllBytes($screenshotPath)
$base64 = [System.Convert]::ToBase64String($fileBytes)
$body = @{ image = $base64 } | ConvertTo-Json
$response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"

# Check if the post was successful
if ($response.message -eq "Image uploaded successfully") {
   Write-Output " - Screenshot successfully uploaded"
}
else {
   Write-Output "[!] Error uploading screenshot: $($response.message)"
   Start-Sleep -Seconds 4
   exit
}


# ---------------------------------------------------------------------------- #
#                          OPEN APP IN DEFAULT BROWSER                         #
# ---------------------------------------------------------------------------- #

Write-Output "[*] Open application in default browser"

# Open the URL in the default web browser
Start-Process $appUrl

# Wait for the page to load
Start-Sleep -Seconds 3

# Send the F11 key to enter full-screen mode
[System.Windows.Forms.SendKeys]::SendWait("{F11}")


# ---------------------------------------------------------------------------- #
#                             AUDIO VOLUME CONTROL                             #
# ---------------------------------------------------------------------------- #

Write-Output "[*] Turn the volume up"

# Function from https://stackoverflow.com/questions/21355891/change-audio-level-from-powershell
Add-Type -TypeDefinition @'
   using System.Runtime.InteropServices;
   [Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
   interface IAudioEndpointVolume
   {
       // f(), g(), ... are unused COM method slots. Define these if you care
       int f(); int g(); int h(); int i();
       int SetMasterVolumeLevelScalar(float fLevel, System.Guid pguidEventContext);
       int j();
       int GetMasterVolumeLevelScalar(out float pfLevel);
       int k(); int l(); int m(); int n();
       int SetMute([MarshalAs(UnmanagedType.Bool)] bool bMute, System.Guid pguidEventContext);
       int GetMute(out bool pbMute);
   }
   [Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
   interface IMMDevice
   {
       int Activate(ref System.Guid id, int clsCtx, int activationParams, out IAudioEndpointVolume aev);
   }
   [Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
   interface IMMDeviceEnumerator
   {
       int f(); // Unused
       int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice endpoint);
   }
   [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class MMDeviceEnumeratorComObject { }
   public class Audio
   {
       static IAudioEndpointVolume Vol()
       {
           var enumerator = new MMDeviceEnumeratorComObject() as IMMDeviceEnumerator;
           IMMDevice dev = null;
           Marshal.ThrowExceptionForHR(enumerator.GetDefaultAudioEndpoint(/*eRender*/ 0, /*eMultimedia*/ 1, out dev));
           IAudioEndpointVolume epv = null;
           var epvid = typeof(IAudioEndpointVolume).GUID;
           Marshal.ThrowExceptionForHR(dev.Activate(ref epvid, /*CLSCTX_ALL*/ 23, 0, out epv));
           return epv;
       }
       public static float Volume
       {
           get { float v = -1; Marshal.ThrowExceptionForHR(Vol().GetMasterVolumeLevelScalar(out v)); return v; }
           set { Marshal.ThrowExceptionForHR(Vol().SetMasterVolumeLevelScalar(value, System.Guid.Empty)); }
       }
       public static bool Mute
       {
           get { bool mute; Marshal.ThrowExceptionForHR(Vol().GetMute(out mute)); return mute; }
           set { Marshal.ThrowExceptionForHR(Vol().SetMute(value, System.Guid.Empty)); }
       }
}
'@

# Disable mute
[audio]::Mute = $false
# Sets volume to 100%
[audio]::Volume = 1.0

# ---------------------------------------------------------------------------- #

Write-Output "[*] OK! Leaving..."

# Wait before leaving the script
# (must be disabled in production)
# Start-Sleep -Seconds 60