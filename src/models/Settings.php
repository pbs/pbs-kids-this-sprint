<?php
namespace pbskids\thissprint\models;

use craft\base\Model;

class Settings extends Model
{
  public $pivotalToken = '';
  public $pivotalAccount = '';
  public $usernames = [];
  public $workspaceId = '';


  public function rules()
  {
    return [
      [['pivotalToken', 'pivotalAccount', 'usernames', 'workspaceId'], 'required'],
    ];
  }
}
