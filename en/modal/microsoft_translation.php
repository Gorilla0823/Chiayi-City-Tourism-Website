<?php // 28.04.17 AZURE Text Translation API 2017 (V2) - Working Example PHP Code  - Cognitive Services with cURL http://www.aw6.de/azure/
// Get your key from: http://docs.microsofttranslator.com/text-translate.html
// Put your parameters here:
$azure_key = "5573c233c8584813af08b3f0535cbe35";  // !!! TODO: secret key here !!!
$inputStr = $_POST["inputStr"];
$toLanguage = $_POST["translated"];
$fromLanguage = $_POST["translate"];
// and leave the rest of the code as it is ;-)
// Get the AZURE token
function getToken($azure_key)
{
    $url = 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken';
    $ch = curl_init();
    $data_string = json_encode('{body}');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string),
            'Ocp-Apim-Subscription-Key: ' . $azure_key
        )
    );
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $strResponse = curl_exec($ch);
    curl_close($ch);
    return $strResponse;
}
// Request the translation
function curlRequest($url)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: text/xml"));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $curlResponse = curl_exec($ch);
    curl_close($ch);
    return $curlResponse;
}
// Get the translation
$accessToken = getToken($azure_key);
$params = "text=" . urlencode($inputStr) . "&appId=Bearer+" . $accessToken;
$translateUrl = "https://api.microsofttranslator.com/V2/Http.svc/Detect?$params";
$curlResponse = curlRequest($translateUrl);
//$DetectedStr = simplexml_load_string($curlResponse);
// Display the translated text on the web page:
//echo $DetectedStr;

$params1 = "text=" . urlencode($inputStr) . "&to=" . $toLanguage . "&from=" . $fromLanguage . "&appId=Bearer+" . $accessToken;
$translateUrl1 = "https://api.microsofttranslator.com/V2/Http.svc/Translate?$params1";
$curlResponse1 = curlRequest($translateUrl1);
$translatedStr = simplexml_load_string($curlResponse1);
echo $translatedStr;
?>

