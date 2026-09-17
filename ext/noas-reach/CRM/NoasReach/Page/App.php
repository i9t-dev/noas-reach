<?php

use CRM_NoasReach_ExtensionUtil as E;
use Civi\Core\HookInterface;

class CRM_NoasReach_Page_App extends CRM_Core_Page
{
  public function run()
  {
    CRM_Utils_System::setTitle(E::ts('Noah\'s Reach'));

    $this->assign('extensionUrl', E::url(''));

    parent::run();
  }
}

class CRM_NoasReach_FullTextIndexHook implements HookInterface
{
  public function hook_civicrm_install()
  {
    // To do: Execute init script to create the full-text contents table
  }

  public function hook_civicrm_post(
    $op,
    $objectName,
    $objectId,
    &$objectRef = NULL,
    $params = NULL
  ) {
    // To do: Update full-text contents table according to the operation
    // To do: Insertion ⇒ Insert content
    // To do: Update ⇒ Update content
    // To do: Deletion ⇒ Delete content
  }
}
