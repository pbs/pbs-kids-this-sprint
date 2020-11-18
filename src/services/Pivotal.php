<?php

namespace pbskids\thissprint\services;

use Craft;
use craft\base\Component;

use pbskids\thissprint\ThisSprint;

class Pivotal extends Component
{
  public static function get(string $endpoint, $query)
  {
    $apiRoot = 'https://www.pivotaltracker.com/services/v5/';

    $pivotalToken = ThisSprint::getInstance()->settings->pivotalToken;

    if (empty($pivotalToken)) {
      throw new Exception('Pivotal Token is not defined in This Sprint\'s plugin settings');
    }

    $query = (is_array($query)) ? http_build_query($query) : $query;

    $curl = curl_init();
    curl_setopt_array($curl, array(
      CURLOPT_URL => $apiRoot . $endpoint . "?$query",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_HTTPHEADER => array(
        "Cache-Control: no-cache",
        "X-TrackerToken: $pivotalToken"
      ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    if ($err || empty($response)) {
      return null;
    }

    $data = json_decode($response, true);

    return $data;
  }
}
