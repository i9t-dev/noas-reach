<?php

declare(strict_types=1);

use CRM_NoasReach_ExtensionUtil as E;

/**
 * Collection of upgrade steps.
 */
final class CRM_NoasReach_Upgrader extends \CRM_Extension_Upgrader_Base
{

    public function install(): void
    {
        // $this->executeSqlFile('sql/my_install.sql');
        CRM_NoasReach_DatabaseSetup::install();
    }

    public function uninstall(): void
    {
        // $this->executeSqlFile('sql/my_uninstall.sql');
        CRM_NoasReach_DatabaseSetup::uninstall();
    }
}
