<?php

namespace pbskids\thissprint\controllers;

use Craft;
use craft\elements\Entry;

use pbskids\thissprint\ThisSprint;

class ViewController extends \craft\web\Controller
{
  protected $allowAnonymous = false;

  public function actionIndex()
  {
    $usernamesSetting = ThisSprint::getInstance()->settings->usernames;
    $usernames = [];

    foreach ($usernamesSetting as $user) {
      $usernames[] = $user[0];
    }

    return $this->renderTemplate(
      'thissprint/_index',
      [
        'account' => ThisSprint::getInstance()->settings->pivotalAccount,
        'resourcePath' => $this->getResourcePath(),
        'usernames' => implode(',', $usernames),
        'workspaceId' => ThisSprint::getInstance()->settings->workspaceId
      ]
    );
  }

  private function getResourcePath()
  {
    return Craft::$app->assetManager->getPublishedUrl('@pbskids/thissprint/resources', true);
  }

  private function render404(string $message)
  {
    return $this->renderTemplate(
      'thissprint/_404',
      [
        'message' => $message,
        'resourcePath' => $this->getResourcePath()
      ]
    );
  }
}
