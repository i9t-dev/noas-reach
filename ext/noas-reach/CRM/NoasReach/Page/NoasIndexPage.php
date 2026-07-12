<?php
declare(strict_types = 1);

use CRM_NoasReach_ExtensionUtil as E;

class CRM_NoasReach_Page_NoasIndexPage extends CRM_Core_Page {

  public function run() {
    // Example: Set the page-title dynamically; alternatively, declare a static title in xml/Menu/*.xml
    CRM_Utils_System::setTitle(E::ts('NoasIndexPage'));

    // Example: Assign a variable for use in a template
    $this->assign('currentTime', date('Y-m-d H:i:s'));

    parent::run();
  }

}
