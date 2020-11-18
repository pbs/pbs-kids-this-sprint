<?php

namespace pbskids\thissprint\controllers;

use Craft;
use craft\elements\Entry;

use pbskids\supercache\SuperCache;
use pbskids\thissprint\services\Pivotal;

class QueryController extends \craft\web\Controller
{
  protected $allowAnonymous = false;

  public function actionGet()
  {
    $params = $this->request->queryParams;
    $endpoint = $params['endpoint'];

    $cacheKey = "pbskids/thissprint::QueryController::actionGet::$endpoint";
    $query = [];

    foreach ($params as $key => $value) {
      if ($key !== 'p' && $key !== 'endpoint') {
        $query[$key] = $value;
        $cacheKey .= ":$key=$value";
      }
    }

    $cacheData = SuperCache::$plugin->cache->get(
      $cacheKey,
      function() use ($endpoint, $query) {
          return Pivotal::get($endpoint, $query);
      },
      30 * CACHE_ONE_MINUTE
    );

    return $this->asJson($cacheData);
  }
}
