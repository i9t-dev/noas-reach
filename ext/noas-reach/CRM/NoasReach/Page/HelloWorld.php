<?php

use CRM_NoasReach_ExtensionUtil as E;

class CRM_NoasReach_Page_HelloWorld extends CRM_Core_Page {
  public function run() {
    CRM_Utils_System::setTitle(E::ts('Hello World'));

    $this->assign('extensionUrl', E::url(''));

    parent::run();
  }
}

