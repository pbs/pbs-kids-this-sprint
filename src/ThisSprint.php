<?php

namespace pbskids\thissprint;

use Craft;
use craft\base\Plugin;
use craft\events\PluginEvent;
use craft\events\RegisterUrlRulesEvent;
use craft\events\RegisterUserPermissionsEvent;
use craft\services\Plugins;
use craft\services\UserPermissions;
use craft\web\UrlManager;

use pbskids\thissprint\models\Settings;

use yii\base\Event;

class ThisSprint extends Plugin
{
    public static $plugin;

    public $schemaVersion = '1.0.0';
    public $hasCpSettings = true;
    public $hasCpSection = false;

    public function init()
    {
      parent::init();
      self::$plugin = $this;

      // Register our CP routes
      Event::on(
        UrlManager::class,
        UrlManager::EVENT_REGISTER_CP_URL_RULES,
        function (RegisterUrlRulesEvent $event) {
          $event->rules['thissprint/get/'] = 'thissprint/query/get';
          $event->rules['thissprint/'] = 'thissprint/view/index';
        }
      );

      // Setting for enabling permission to access the plugin.
      Event::on(UserPermissions::class, UserPermissions::EVENT_REGISTER_PERMISSIONS, function(RegisterUserPermissionsEvent $event) {
        $event->permissions[\Craft::t('thissprint', 'Plugins')] = [
          'accessPlugin-thissprint' => ['label' => \Craft::t('thissprint', 'Repo Stats')],
        ];
      });

      Event::on(
        Plugins::class,
        Plugins::EVENT_AFTER_INSTALL_PLUGIN,
        function (PluginEvent $event) {
          if ($event->plugin === $this) {
          }
        }
      );

      Craft::info(
        Craft::t(
          'thissprint',
          '{name} plugin loaded',
          ['name' => $this->name]
        ),
        __METHOD__
      );
    }

    protected function createSettingsModel()
    {
      return new Settings();
    }

    protected function settingsHtml(): string
    {
      return Craft::$app->view->renderTemplate(
        'thissprint/settings',
        [
          'settings' => $this->getSettings()
        ]
      );
    }
}
